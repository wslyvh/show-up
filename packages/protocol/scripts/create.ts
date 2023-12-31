import { ethers, network } from 'hardhat'
import { defaultContentUri, defaultMaxParticipants, defaultTokenFee, defaultTokenMint } from '../test/utils/types'
import { time } from '@nomicfoundation/hardhat-network-helpers'
import dayjs from 'dayjs'

export async function main() {
    console.log('Create Test data @ Show Up Protocol..')
    const [owner] = await ethers.getSigners()

    console.log('NETWORK ID', network.config.chainId)

    // Hardhat // localhost 
    // const registry = await ethers.getContractAt('Registry', '0x5FbDB2315678afecb367f032d93F642f64180aa3')
    // const basicEtherModule = await ethers.getContractAt('BasicEther', '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512')
    // const basicTokenModule = await ethers.getContractAt('BasicToken', '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0')
    // const token = await ethers.getContractAt('Token', '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707')

    // Sepolia 
    const registry = await ethers.getContractAt('Registry', '0x7Cc8E0633021b9DF8D2F01d9287C3b8e29f4eDe2')
    const basicEtherModule = await ethers.getContractAt('BasicEther', '0x33FF944E8504B674835A5BEd88f10f11bEC92c2c')
    const basicTokenModule = await ethers.getContractAt('BasicToken', '0x33132fE88fe8316881474b551CA2DDD277A320a0')

    const token = await ethers.getContractAt('Token', '0x7ef7024B76791BD1f31Ac482724c76f0e24a2dD0') // No new token deployed

    // Check contracts exist
    const RegistryExists = await ethers.provider.getCode(registry.address)
    console.log('Registry', registry.address, RegistryExists != '0x')
    const BasicEtherExists = await ethers.provider.getCode(basicEtherModule.address)
    console.log('BasicEther', basicEtherModule.address, BasicEtherExists != '0x')
    const BasicTokenExists = await ethers.provider.getCode(basicTokenModule.address)
    console.log('BasicToken', basicTokenModule.address, BasicTokenExists != '0x')
    const TokenExists = await ethers.provider.getCode(token.address)
    console.log('Token', token.address, TokenExists != '0x')

    // Check modules are whitelisted 
    const isEtherModuleWhitelisted = await registry.isConditionModuleWhitelisted(basicEtherModule.address)
    console.log('isEtherModuleWhitelisted', isEtherModuleWhitelisted)
    const isTokenModuleWhitelisted = await registry.isConditionModuleWhitelisted(basicTokenModule.address)
    console.log('isTokenModuleWhitelisted', isTokenModuleWhitelisted)

    // Check if owner has Ether balance
    const balanceEther = await owner.getBalance()
    console.log(owner.address, 'Ether Balance', balanceEther.toString())

    // Check if owner has enough tokens
    const balance = await token.balanceOf(owner.address)
    console.log(owner.address, 'Balance', balance.toString())

    // Create Test events
    console.log('Create Events with BasicEther modules..')

    // // Additional Event to settle
    // const settleEvent = 'ipfs://bafkreibljo45l7qzlv2kf26mcwykruq46pxijoi4nbecaklgaxrcl3tdk4'
    // const settleEnd = 1697899500
    // const settleParams = ethers.utils.defaultAbiCoder.encode(
    //     ["address", 'uint256', 'uint256', 'uint256', 'address'],
    //     [owner.address, settleEnd, ethers.utils.parseUnits('0.001', 18), defaultMaxParticipants, ethers.constants.AddressZero])
    // const settleTx = await registry.create(settleEvent, basicEtherModule.address, settleParams, { gasLimit: 350000 })
    // await settleTx.wait()

    const devconnectUri = 'ipfs://bafkreid43edjyimgerffps46bupswb5gbmkrejl3smzfrihkeidax476fy'
    const devconnectEnd = dayjs('2023-11-19T13:00').unix()
    const paramsEther1 = ethers.utils.defaultAbiCoder.encode(
        ["address", 'uint256', 'uint256', 'uint256', 'address'],
        [owner.address, devconnectEnd, ethers.utils.parseUnits('0.001', 18), defaultMaxParticipants, ethers.constants.AddressZero])
    const tx1 = await registry.create(devconnectUri, basicEtherModule.address, paramsEther1, { gasLimit: 350000 })
    await tx1.wait()

    const ethglobalUri = 'ipfs://bafkreifphwlae7wqkui33zretrheoao22e5xkx3jijwiy6udez4jbmhbpa'
    const ethglobalEnd = dayjs('2023-11-19T13:00').unix()
    const paramsEther2 = ethers.utils.defaultAbiCoder.encode(
        ["address", 'uint256', 'uint256', 'uint256', 'address'],
        [owner.address, ethglobalEnd, ethers.utils.parseUnits('0.001', 18), defaultMaxParticipants, ethers.constants.AddressZero])
    const tx2 = await registry.create(ethglobalUri, basicEtherModule.address, paramsEther2, { gasLimit: 350000 })
    await tx2.wait()

    const encodeUri = 'ipfs://bafkreif6ugkip3hyg6v22h2fj7h4ypziwgfonq4hleqe6tdsnfnzf7jbky'
    const encodeEnd = dayjs('2024-07-20T13:00').unix()
    const paramsEther3 = ethers.utils.defaultAbiCoder.encode(
        ["address", 'uint256', 'uint256', 'uint256', 'address'],
        [owner.address, encodeEnd, ethers.utils.parseUnits('0.001', 18), defaultMaxParticipants, ethers.constants.AddressZero])
    const tx3 = await registry.create(encodeUri, basicEtherModule.address, paramsEther3, { gasLimit: 350000 })
    await tx3.wait()

    const supUri = 'ipfs://bafkreibljo45l7qzlv2kf26mcwykruq46pxijoi4nbecaklgaxrcl3tdk4'
    const supEnd = dayjs().add(3, 'days').unix()
    const paramsEther4 = ethers.utils.defaultAbiCoder.encode(
        ["address", 'uint256', 'uint256', 'uint256', 'address'],
        [owner.address, supEnd, ethers.utils.parseUnits('0.001', 18), defaultMaxParticipants, ethers.constants.AddressZero])
    const tx4 = await registry.create(supUri, basicEtherModule.address, paramsEther4, { gasLimit: 350000 })
    await tx4.wait()

    // Create and Cancel
    console.log('Create and Cancel event..')
    const nextWeek = (await ethers.provider.getBlock('latest')).timestamp + time.duration.days(7)

    const cancelledEventUri = 'ipfs://bafkreiaf5svesha5s4nlvgsugfrb27rnv2k4k7wk2eqws4dw6wpfefkqsy'
    const paramsEtherCancel = ethers.utils.defaultAbiCoder.encode(
        ["address", 'uint256', 'uint256', 'uint256', 'address'],
        [owner.address, nextWeek, ethers.utils.parseUnits('0.001', 18), defaultMaxParticipants, ethers.constants.AddressZero])
    const createEventTx = await registry.create(cancelledEventUri, basicEtherModule.address, paramsEtherCancel, { gasLimit: 350000 })
    const createEventReceipt = await createEventTx.wait()

    const eventCreatedEvent = createEventReceipt.events?.find((event) => event.event === 'Created')
    if (eventCreatedEvent && eventCreatedEvent.args) {
        await registry.cancel(eventCreatedEvent.args[0], 'Cancelled by owner', [], { gasLimit: 150000 })
    }

    console.log('Create Event with BasicToken condition modules..')
    const paramsToken = ethers.utils.defaultAbiCoder.encode(
        ["address", 'uint256', 'uint256', 'uint256', 'address'],
        [owner.address, supEnd, defaultTokenFee, defaultMaxParticipants, token.address])
    const createTokenTx = await registry.create(supUri, basicTokenModule.address, paramsToken, { gasLimit: 400000 })

    const createTokenReceipt = await createTokenTx.wait()
    const createdTokenEvent = createTokenReceipt.events?.find((event) => event.event === 'Created')
    if (createdTokenEvent && createdTokenEvent.args) {
        console.log('Approve to spend Token..')
        const approvalTx = await token.approve(basicTokenModule.address, defaultTokenFee);
        await approvalTx.wait()

        console.log('Register for Event..')
        await registry.register(createdTokenEvent.args[0], owner.address, [], { gasLimit: 250000 })
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
