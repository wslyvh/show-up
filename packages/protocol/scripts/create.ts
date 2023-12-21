import { ethers, network } from 'hardhat'
import { defaultContentUri, defaultDepositFee, defaultMaxParticipants, defaultTokenFee } from '../test/utils/types'
import { time } from '@nomicfoundation/hardhat-network-helpers'
import dayjs from 'dayjs'

export async function main() {
    console.log('Create Test data @ Show Up Protocol..')
    const [owner] = await ethers.getSigners()

    console.log('NETWORK ID', network.config.chainId)
    let showhub, recipientEther, recipientToken, splitEther, splitToken, token

    // Sepolia
    if (network.config.chainId == 11155111) {
        showhub = await ethers.getContractAt('ShowHub', '0x3FffFB76667170D7a8ed8dFFD1e040E90995D155')
        recipientEther = await ethers.getContractAt('RecipientEther', '0x632E135b16Dc81C0b1daCd20A4055AaDb15b95Ac')
        recipientToken = await ethers.getContractAt('RecipientToken', '0x8cE088579268ED24c04e200C0f293e0727881F81')
        splitEther = await ethers.getContractAt('SplitEther', '0x1bCFfd336F5EA59f9c45BB6E6De13B0cDD17A3e6')
        splitToken = await ethers.getContractAt('SplitToken', '0x8A2d90Fe822f45e0A1B5f846Ed56397F5A27F063')
        token = await ethers.getContractAt('Token', '0x796b9850Be63Ffa903eD2854164c21189DbB4B89')
    }

    // Base Sepolia
    if (network.config.chainId == 84532) {
        showhub = await ethers.getContractAt('ShowHub', '0xB944AFeF3821062B4B813D5aCaE833Eca223db09')
        recipientEther = await ethers.getContractAt('RecipientEther', '0x416CC531d3409786825155168003a5d574c4aD75')
        recipientToken = await ethers.getContractAt('RecipientToken', '0xFbF05397d867379efAF3e8b1da54651bfb35B01D')
        splitEther = await ethers.getContractAt('SplitEther', '0xA95579514dB88a1F7a561E46bEdBDA1C676E76A4')
        splitToken = await ethers.getContractAt('SplitToken', '0x59A0498Ff92851b360e152d735E6Df8C192be815')
        token = await ethers.getContractAt('Token', '0x555B9c3B79EF437776F7E0833c234c802D741771')
    }


    if (!showhub || !recipientEther || !recipientToken || !splitEther || !splitToken || !token) {
        console.log('Contracts not found')
        return
    }

    // Check contracts exist
    const showHubExists = await ethers.provider.getCode(showhub.address)
    const recipientEtherExists = await ethers.provider.getCode(recipientEther.address)
    const recipientTokenExists = await ethers.provider.getCode(recipientToken.address)
    const splitEtherExists = await ethers.provider.getCode(splitEther.address)
    const splitTokenExists = await ethers.provider.getCode(splitToken.address)
    if (showHubExists == '0x') {
        console.log('ShowHub contract not found')
        return
    }
    if (recipientEtherExists == '0x') {
        console.log('RecipientEther contract not found')
        return
    }
    if (recipientTokenExists == '0x') {
        console.log('RecipientToken contract not found')
        return
    }
    if (splitEtherExists == '0x') {
        console.log('SplitEther contract not found')
        return
    }
    if (splitTokenExists == '0x') {
        console.log('SplitToken contract not found')
        return
    }

    // Check modules are whitelisted 
    const isRecipientEtherWhitelisted = await showhub.isConditionModuleWhitelisted(recipientEther.address)
    const isRecipientTokenWhitelisted = await showhub.isConditionModuleWhitelisted(recipientToken.address)
    const isSplitEtherWhitelisted = await showhub.isConditionModuleWhitelisted(splitEther.address)
    const isSplitTokenWhitelisted = await showhub.isConditionModuleWhitelisted(splitToken.address)
    if (!isRecipientEtherWhitelisted) {
        console.log('RecipientEther not whitelisted')
        return
    }
    if (!isRecipientTokenWhitelisted) {
        console.log('RecipientToken not whitelisted')
        return
    }
    if (!isSplitEtherWhitelisted) {
        console.log('SplitEther not whitelisted')
        return
    }
    if (!isSplitTokenWhitelisted) {
        console.log('SplitToken not whitelisted')
        return
    }

    // Check if owner has Ether balance
    const balanceEther = await owner.getBalance()
    console.log(owner.address, 'Ether Balance', balanceEther.toString())

    // Check if owner has enough tokens
    const balance = await token.balanceOf(owner.address)
    console.log(owner.address, 'Balance', balance.toString())

    // Create Test events
    console.log('Create Test Events..')
    const tomorrow = (await ethers.provider.getBlock('latest')).timestamp + time.duration.days(1)
    const nextWeek = (await ethers.provider.getBlock('latest')).timestamp + time.duration.days(7)

    // Split Ether
    console.log('- SplitEther')
    const splitEtherParams = ethers.utils.defaultAbiCoder.encode(
        ["address", 'uint256'],
        [owner.address, defaultDepositFee])
    await showhub.create(defaultContentUri, tomorrow, defaultMaxParticipants, splitEther.address, splitEtherParams, { gasLimit: 350000 })

    // Split Token
    console.log('- SplitToken')
    const splitTokenParams = ethers.utils.defaultAbiCoder.encode(
        ["address", 'uint256', 'address'],
        [owner.address, defaultTokenFee, token.address])
    await showhub.create(defaultContentUri, tomorrow, defaultMaxParticipants, splitEther.address, splitTokenParams, { gasLimit: 350000 })

    // Recipient Ether
    console.log('- RecipientEther')
    const recipientEtherParams = ethers.utils.defaultAbiCoder.encode(
        ["address", 'uint256', 'address'],
        [owner.address, defaultDepositFee, owner.address])
    await showhub.create(defaultContentUri, tomorrow, defaultMaxParticipants, recipientEther.address, recipientEtherParams, { gasLimit: 350000 })

    // Recipient Token
    console.log('- RecipientToken')
    const recipientTokenParams = ethers.utils.defaultAbiCoder.encode(
        ["address", 'uint256', 'address', 'address'],
        [owner.address, defaultTokenFee, owner.address, token.address])
    await showhub.create(defaultContentUri, tomorrow, defaultMaxParticipants, recipientToken.address, recipientTokenParams, { gasLimit: 350000 })

    // Other test events / scenarios
    console.log('Create other events..')
    console.log('- Cancellable Event')
    const cancelledEventUri = 'ipfs://bafkreiaf5svesha5s4nlvgsugfrb27rnv2k4k7wk2eqws4dw6wpfefkqsy'
    const cancelParams = ethers.utils.defaultAbiCoder.encode(
        ["address", 'uint256'],
        [owner.address, defaultDepositFee])
    await showhub.create(cancelledEventUri, nextWeek, 0, splitEther.address, cancelParams, { gasLimit: 350000 })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
