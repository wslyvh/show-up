import { ethers, network } from 'hardhat'
import { defaultContentUri, defaultDepositFee, defaultMaxParticipants, defaultTokenFee } from '../test/utils/types'
import { time } from '@nomicfoundation/hardhat-network-helpers'
import deployments from '../deployments.json'

export async function main() {
    console.log('Create Test data @ Show Up Protocol..')
    const [owner] = await ethers.getSigners()

    console.log('NETWORK ID', network.config.chainId)
    if (!network.config.chainId) {
        console.error('Invalid Network ID')
        return
    }

    const contracts = (deployments as any)[network.config.chainId]
    const showhub = contracts.ShowHub
    const recipientEther = contracts.RecipientEther
    const recipientToken = contracts.RecipientToken
    const splitEther = contracts.SplitEther
    const splitToken = contracts.SplitToken
    const token = contracts.Token

    if (!showhub || !recipientEther || !recipientToken || !splitEther || !splitToken) {
        console.error('Contracts not found')
        return
    }

    // Check contracts exist
    const showHubExists = await ethers.provider.getCode(showhub)
    const recipientEtherExists = await ethers.provider.getCode(recipientEther)
    const recipientTokenExists = await ethers.provider.getCode(recipientToken)
    const splitEtherExists = await ethers.provider.getCode(splitEther)
    const splitTokenExists = await ethers.provider.getCode(splitToken)

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
    const isRecipientEtherWhitelisted = await showhub.isConditionModuleWhitelisted(recipientEther)
    const isRecipientTokenWhitelisted = await showhub.isConditionModuleWhitelisted(recipientToken)
    const isSplitEtherWhitelisted = await showhub.isConditionModuleWhitelisted(splitEther)
    const isSplitTokenWhitelisted = await showhub.isConditionModuleWhitelisted(splitToken)
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
    await showhub.create(defaultContentUri, tomorrow, defaultMaxParticipants, splitEther, splitEtherParams, { gasLimit: 350000 })

    // Split Token
    console.log('- SplitToken')
    const splitTokenParams = ethers.utils.defaultAbiCoder.encode(['uint256', 'address'], [defaultTokenFee, token])
    await showhub.create(defaultContentUri, tomorrow, 0, splitToken, splitTokenParams, { gasLimit: 350000 })

    // Recipient Ether
    console.log('- RecipientEther')
    const recipientEtherParams = ethers.utils.defaultAbiCoder.encode(['uint256', 'address'], [defaultDepositFee, owner])
    await showhub.create(defaultContentUri, tomorrow, 0, recipientEther, recipientEtherParams, { gasLimit: 350000 })

    // Recipient Token
    console.log('- RecipientToken')
    const recipientTokenParams = ethers.utils.defaultAbiCoder.encode(['uint256', 'address', 'address'], [defaultTokenFee, token, owner.address])
    await showhub.create(defaultContentUri, tomorrow, defaultMaxParticipants, recipientToken, recipientTokenParams, { gasLimit: 350000 })

    // Other test events / scenarios
    console.log('Create other events..')
    console.log('- Event with attendees')
    const registerParams = ethers.utils.defaultAbiCoder.encode(['uint256'], [0])
    const registerTx = await showhub.create(defaultContentUri, nextWeek, 0, splitEther, registerParams, { gasLimit: 350000 })

    console.log('Waiting for tx..')
    const registerReceipt = await registerTx.wait()
    const registerReceiptLogs = registerReceipt.events?.find((event: any) => event.event === 'Created')
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
    const cancelTx = await showhub.create(cancelEventUri, nextWeek, 0, splitEther, cancelParams, { gasLimit: 350000 })
    console.log('Waiting for tx..')
    const cancelReceipt = await cancelTx.wait()
    const cancelReceiptLogs = cancelReceipt.events?.find((event: any) => event.event === 'Created')
    const cancelEventId = cancelReceiptLogs?.args?.id
    if (cancelEventId) {
        console.log('Cancel Event..')
        await showhub.cancel(cancelEventId, "Cancel Test event", [], { gasLimit: 90000 })
    }

    console.log('- Unlisted Event')
    const unlistedParams = ethers.utils.defaultAbiCoder.encode(['uint256'], [defaultDepositFee])
    const unlistedContentUri = 'ipfs://bafkreigoeobozhvn77676j3kuey3iidfzjbvkoewmnifyweshc2fjckwx4'
    await showhub.create(unlistedContentUri, nextWeek, defaultMaxParticipants, splitEther, unlistedParams, { gasLimit: 350000 })

    console.log('- Fund Event')
    const fundEventParams = ethers.utils.defaultAbiCoder.encode(['uint256'], [0])
    const fundEventTx = await showhub.create(defaultContentUri, nextWeek, defaultMaxParticipants, splitEther, fundEventParams, { gasLimit: 350000 })
    console.log('Waiting for tx..')
    const fundEventReceipt = await fundEventTx.wait()
    const fundEventReceiptLogs = fundEventReceipt.events?.find((event: any) => event.event === 'Created')
    const fundEventId = fundEventReceiptLogs?.args?.id
    if (fundEventId) {
        console.log('Fund Event..')
        await showhub.fund(fundEventId, [], { value: defaultDepositFee, gasLimit: 90000 })
    }

    console.log('All done!')
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
