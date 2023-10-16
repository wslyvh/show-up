import { ethers, network } from 'hardhat'
import { defaultContentUri, defaultDepositFee, defaultMaxParticipants, defaultTokenMint } from '../test/utils/types'
import { time } from '@nomicfoundation/hardhat-network-helpers'

const CREATE_TEST_RECORDS = false

export async function main() {
    console.log('Deploying Show Up Protocol..')
    const [owner, attendee1, attendee2, attendee3, attendee4, attendee5] = await ethers.getSigners()

    console.log('NETWORK ID', network.config.chainId)
    const Registry = await ethers.getContractFactory('Registry')
    const registry = await Registry.deploy()

    const BasicEther = await ethers.getContractFactory('BasicEther')
    const basicEtherModule = await BasicEther.deploy()

    const BasicToken = await ethers.getContractFactory('BasicToken')
    const basicTokenModule = await BasicToken.deploy()

    await registry.whitelistConditionModule(basicEtherModule.address, true)
    await registry.whitelistConditionModule(basicTokenModule.address, true)

    console.log('Deployment addresses:')
    console.log('Registry:', registry.address)
    console.log('BasicEther:', basicEtherModule.address)
    console.log('BasicToken:', basicTokenModule.address)

    const Token = await ethers.getContractFactory('Token')
    const token = await Token.deploy()
    console.log('Token:', token.address)

    if (network.config.chainId === 31337) {
        await token.mint(attendee1.address, defaultTokenMint)
        await token.mint(attendee2.address, defaultTokenMint)
        await token.mint(attendee3.address, defaultTokenMint)
        await token.mint(attendee4.address, defaultTokenMint)
        await token.mint(attendee5.address, defaultTokenMint)
    }

    if (CREATE_TEST_RECORDS) {
        const tomorrow = (await ethers.provider.getBlock('latest')).timestamp + time.duration.days(1)
        const nextWeek = (await ethers.provider.getBlock('latest')).timestamp + time.duration.days(7)

        console.log('Create Events with basic condition modules..')

        const paramsEther = ethers.utils.defaultAbiCoder.encode(
            ["address", 'uint256', 'uint256', 'uint256', 'address'],
            [owner.address, nextWeek, defaultDepositFee, defaultMaxParticipants, ethers.constants.AddressZero])
        await registry.create(defaultContentUri, basicEtherModule.address, paramsEther, { gasLimit: 300000 })
        const paramsToken = ethers.utils.defaultAbiCoder.encode(
            ["address", 'uint256', 'uint256', 'uint256', 'address'],
            [owner.address, tomorrow, defaultDepositFee, defaultMaxParticipants, token.address])
        await registry.create(defaultContentUri, basicTokenModule.address, paramsToken, { gasLimit: 300000 })

        console.log('Register for Token event..')
        await token.approve(basicTokenModule.address, defaultDepositFee);
        await registry.register(1, owner.address, [], { gasLimit: 200000 })

        console.log('Create and cancel event..', nextWeek)
        const paramsEtherCancel = ethers.utils.defaultAbiCoder.encode(
            ["address", 'uint256', 'uint256', 'uint256', 'address'],
            [owner.address, nextWeek, defaultDepositFee, defaultMaxParticipants, ethers.constants.AddressZero])
        await registry.create(defaultContentUri, basicEtherModule.address, paramsEtherCancel, { gasLimit: 300000 })
        await registry.cancel(2, 'Cancelled by owner', [], { gasLimit: 100000 })
    }

    // TODO: Verify contracts
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
