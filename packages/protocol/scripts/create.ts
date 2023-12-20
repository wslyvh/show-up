import { ethers, network } from 'hardhat'
import { defaultContentUri, defaultDepositFee, defaultMaxParticipants, defaultTokenFee } from '../test/utils/types'
import { time } from '@nomicfoundation/hardhat-network-helpers'
import dayjs from 'dayjs'

export async function main() {
    console.log('Create Test data @ Show Up Protocol..')
    const [owner] = await ethers.getSigners()

    console.log('NETWORK ID', network.config.chainId)
    let showhub, recipientEther, recipientToken, splitEther, splitToken, token

    // Base
    if (network.config.chainId == 84532) {
        showhub = await ethers.getContractAt('ShowHub', '0x27346891DD55cd3dba663F6e2861793c83C84348')
        recipientEther = await ethers.getContractAt('RecipientEther', '0xcc5A0D6268d70811eDad77799f2168aFe6382E89')
        recipientToken = await ethers.getContractAt('RecipientToken', '0x6Ea20b54257A31473a17Bf00fe031d3a5638b5aF')
        splitEther = await ethers.getContractAt('SplitEther', '0x797fa8d0bbAC596A2EC8Ec3ce75a24bbF65c2bCD')
        splitToken = await ethers.getContractAt('SplitToken', '0x358f0163e1e1F2670Cc7f3F5195B0F4fCf702aEa')
        token = await ethers.getContractAt('Token', '0x555B9c3B79EF437776F7E0833c234c802D741771')
    }

    // Sepolia
    if (network.config.chainId == 421611) {
        showhub = await ethers.getContractAt('ShowHub', '0x34F79a7C17DEe934A0ac94aEB3ad4d84F4a27032')
        recipientEther = await ethers.getContractAt('RecipientEther', '0xbEEaE3290dFa335C447C3D44Ef2De891c22968e5')
        recipientToken = await ethers.getContractAt('RecipientToken', '0xA5b9086e0F243C239c44B9db9E0484C4A5cF97Cf')
        splitEther = await ethers.getContractAt('SplitEther', '0xe70791D7E4623fDe99726D7cc2fd352a9487b396')
        splitToken = await ethers.getContractAt('SplitToken', '0x667D9d7B6Fc5784384BeC882f3F8775597C35134')
        token = await ethers.getContractAt('Token', '0x796b9850Be63Ffa903eD2854164c21189DbB4B89')
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
    await showhub.create(defaultContentUri, tomorrow, defaultMaxParticipants, splitEther.address, splitEtherParams)

    // Split Token
    console.log('- SplitToken')
    const splitTokenParams = ethers.utils.defaultAbiCoder.encode(
        ["address", 'uint256', 'address'],
        [owner.address, defaultTokenFee, token.address])
    await showhub.create(defaultContentUri, tomorrow, defaultMaxParticipants, splitEther.address, splitTokenParams)

    // Recipient Ether
    console.log('- RecipientEther')
    const recipientEtherParams = ethers.utils.defaultAbiCoder.encode(
        ["address", 'uint256', 'address'],
        [owner.address, defaultDepositFee, owner.address])
    await showhub.create(defaultContentUri, tomorrow, defaultMaxParticipants, recipientEther.address, recipientEtherParams)

    // Recipient Token
    console.log('- RecipientToken')
    const recipientTokenParams = ethers.utils.defaultAbiCoder.encode(
        ["address", 'uint256', 'address', 'address'],
        [owner.address, defaultTokenFee, owner.address, token.address])
    await showhub.create(defaultContentUri, tomorrow, defaultMaxParticipants, recipientToken.address, recipientTokenParams)

    // Other test events / scenarios
    console.log('Create other events..')
    console.log('- Cancellable Event')
    const cancelledEventUri = 'ipfs://bafkreiaf5svesha5s4nlvgsugfrb27rnv2k4k7wk2eqws4dw6wpfefkqsy'
    const cancelParams = ethers.utils.defaultAbiCoder.encode(
        ["address", 'uint256'],
        [owner.address, defaultDepositFee])
    await showhub.create(cancelledEventUri, nextWeek, 0, splitEther.address, cancelParams)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
