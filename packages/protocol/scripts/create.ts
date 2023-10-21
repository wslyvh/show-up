import { ethers, network } from 'hardhat'
import { defaultContentUri, defaultMaxParticipants, defaultTokenFee, defaultTokenMint } from '../test/utils/types'
import { time } from '@nomicfoundation/hardhat-network-helpers'
import dayjs from 'dayjs'

export async function main() {
    console.log('Create Test data @ Show Up Protocol..')
    const [owner] = await ethers.getSigners()

    console.log('NETWORK ID', network.config.chainId)
    // Sepolia 
    // const registry = await ethers.getContractAt('Registry', '0x0959f7dD732631B7600fcCe67312920d4F5ECB9c')
    // const basicEtherModule = await ethers.getContractAt('BasicEther', '0x0b6b25a06A2EE6c560BB33EbDbECA831f2D67836')
    // const basicTokenModule = await ethers.getContractAt('BasicToken', '0x11FB53694e42972925940836a1E3EC71cA584936')
    // const token = await ethers.getContractAt('Token', '0x7ef7024B76791BD1f31Ac482724c76f0e24a2dD0')

    // Scroll Sepolia 
    const registry = await ethers.getContractAt('Registry', '0xa21BD128d7c507bf2F6b78181A9A99e86a23E593')
    const basicEtherModule = await ethers.getContractAt('BasicEther', '0xf32E8f56626F87A0bf5e93154CA3a51D45123dc0')
    const basicTokenModule = await ethers.getContractAt('BasicToken', '0xB944AFeF3821062B4B813D5aCaE833Eca223db09')
    const token = await ethers.getContractAt('Token', '0xA95579514dB88a1F7a561E46bEdBDA1C676E76A4')

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
    const supEnd = dayjs('2023-10-28T13:00').unix()
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
