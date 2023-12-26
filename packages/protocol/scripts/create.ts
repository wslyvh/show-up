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
        showhub = await ethers.getContractAt('ShowHub', '0x6abEaB74bc741ce8daf2e4614DB7485C19c8acc4')
        recipientEther = await ethers.getContractAt('RecipientEther', '0x73eB044D5Da49384c65b744a0E6CFF3f6B735C03')
        recipientToken = await ethers.getContractAt('RecipientToken', '0x584269c84C40a142E6b9C5c9c7D31B9a24E9F6D0')
        splitEther = await ethers.getContractAt('SplitEther', '0x08b2Bb2BA7b3437aD2EC5CC2F5AbB5223c342260')
        splitToken = await ethers.getContractAt('SplitToken', '0xb1c9D6FFc183EeCf11722f28B3c42b45164e8Df1')
        token = await ethers.getContractAt('Token', '0x796b9850Be63Ffa903eD2854164c21189DbB4B89')
    }

    // Base Sepolia
    if (network.config.chainId == 84532) {
        showhub = await ethers.getContractAt('ShowHub', '0x70cD0FB06F21aA528b311189A998d03C47CbC056')
        recipientEther = await ethers.getContractAt('RecipientEther', '0x0164c5C19e890D5D63c85B6D9585Aa38E1a2B015')
        recipientToken = await ethers.getContractAt('RecipientToken', '0x495A11d9Dd1D348C0AeD41c1B289A34d52637E91')
        splitEther = await ethers.getContractAt('SplitEther', '0xF8481548A8C38B8c1B178Be802E6399397361617')
        splitToken = await ethers.getContractAt('SplitToken', '0x66d1306A2DFc1f2446174BDE3d2eE203476da4eB')
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
    const splitEtherParams = ethers.utils.defaultAbiCoder.encode(['uint256'], [defaultDepositFee])
    await showhub.create(defaultContentUri, tomorrow, defaultMaxParticipants, splitEther.address, splitEtherParams, { gasLimit: 350000 })

    // Split Token
    console.log('- SplitToken')
    const splitTokenParams = ethers.utils.defaultAbiCoder.encode(['uint256', 'address'], [defaultTokenFee, token.address])
    await showhub.create(defaultContentUri, tomorrow, 0, splitToken.address, splitTokenParams, { gasLimit: 350000 })

    // Recipient Ether
    console.log('- RecipientEther')
    const recipientEtherParams = ethers.utils.defaultAbiCoder.encode(['uint256', 'address'], [defaultDepositFee, owner.address])
    await showhub.create(defaultContentUri, tomorrow, 0, recipientEther.address, recipientEtherParams, { gasLimit: 350000 })

    // Recipient Token
    console.log('- RecipientToken')
    const recipientTokenParams = ethers.utils.defaultAbiCoder.encode(['uint256', 'address', 'address'], [defaultTokenFee, owner.address, token.address])
    await showhub.create(defaultContentUri, tomorrow, defaultMaxParticipants, recipientToken.address, recipientTokenParams, { gasLimit: 350000 })

    // Other test events / scenarios
    console.log('Create other events..')
    console.log('- Event with attendees')
    const registerParams = ethers.utils.defaultAbiCoder.encode(['uint256'], [0])
    const registerTx = await showhub.create(defaultContentUri, nextWeek, 0, splitEther.address, registerParams, { gasLimit: 350000 })

    console.log('Waiting for tx..')
    const registerReceipt = await registerTx.wait()
    const registerReceiptLogs = registerReceipt.events?.find((event) => event.event === 'Created')
    const registerEventId = registerReceiptLogs?.args?.id
    if (registerEventId) {
        console.log('Register #1')
        await showhub.register(registerEventId, owner.address, [], { value: 0, gasLimit: 200000 })
        console.log('Register #2')
        await showhub.register(registerEventId, '0x8289432ACD5EB0214B1C2526A5EDB480Aa06A9ab', [], { value: 0, gasLimit: 200000 })
        console.log('Checkin')
        await showhub.checkin(registerEventId, ['0x8289432ACD5EB0214B1C2526A5EDB480Aa06A9ab'], [], { gasLimit: 200000 })
    }

    console.log('- Cancellable Event')
    const cancelEventUri = 'ipfs://bafkreiaf5svesha5s4nlvgsugfrb27rnv2k4k7wk2eqws4dw6wpfefkqsy'
    const cancelParams = ethers.utils.defaultAbiCoder.encode(['uint256'], [0])
    const cancelTx = await showhub.create(cancelEventUri, nextWeek, 0, splitEther.address, cancelParams, { gasLimit: 350000 })
    console.log('Waiting for tx..')
    const cancelReceipt = await cancelTx.wait()
    const cancelReceiptLogs = cancelReceipt.events?.find((event) => event.event === 'Created')
    const cancelEventId = cancelReceiptLogs?.args?.id
    if (cancelEventId) {
        console.log('Cancel..')
        await showhub.cancel(cancelEventId, "Cancel Test event", [], { gasLimit: 90000 })
    }

    console.log('All done!')
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
