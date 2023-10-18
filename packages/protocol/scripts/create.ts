import { ethers, network } from 'hardhat'
import { defaultContentUri, defaultMaxParticipants, defaultTokenMint } from '../test/utils/types'
import { time } from '@nomicfoundation/hardhat-network-helpers'

export async function main() {
    console.log('Create Test data @ Show Up Protocol..')
    const [owner] = await ethers.getSigners()

    console.log('NETWORK ID', network.config.chainId)
    const registry = await ethers.getContractAt('Registry', '0xfD4712Ed09b1d98354dC0153fd3eF7e374F71443')
    const basicEtherModule = await ethers.getContractAt('BasicEther', '0xC798B6C3A99a87fE4beFb24d4599b1caA6D6DAff')
    const basicTokenModule = await ethers.getContractAt('BasicToken', '0x317f09eCeBB6Db0d143cD7EF164F0FA1B6fC38b3')
    const token = await ethers.getContractAt('Token', '0x3C67cE8eA670B4f180d581eC4cef79750D2d482f')

    const nextWeek = (await ethers.provider.getBlock('latest')).timestamp + time.duration.days(7)

    console.log('Create Event with BasicEther condition modules..')
    const paramsEther = ethers.utils.defaultAbiCoder.encode(
        ["address", 'uint256', 'uint256', 'uint256', 'address'],
        [owner.address, nextWeek, ethers.utils.parseUnits('0.001', 18), defaultMaxParticipants, ethers.constants.AddressZero])
    await registry.create(defaultContentUri, basicEtherModule.address, paramsEther, { gasLimit: 300000 })

    console.log('Create Event with BasicToken condition modules..')
    const paramsToken = ethers.utils.defaultAbiCoder.encode(
        ["address", 'uint256', 'uint256', 'uint256', 'address'],
        [owner.address, nextWeek, ethers.utils.parseUnits('10', 18), defaultMaxParticipants, token.address])
    await registry.create(defaultContentUri, basicTokenModule.address, paramsToken, { gasLimit: 300000 })

    console.log('Register for Token event..')
    await token.approve(basicTokenModule.address, ethers.utils.parseUnits('10', 18));
    await registry.register(1, owner.address, [], { gasLimit: 200000 })

    console.log('Create and Cancel event..')
    const paramsEtherCancel = ethers.utils.defaultAbiCoder.encode(
        ["address", 'uint256', 'uint256', 'uint256', 'address'],
        [owner.address, nextWeek, ethers.utils.parseUnits('0.001', 18), defaultMaxParticipants, ethers.constants.AddressZero])
    await registry.create(defaultContentUri, basicEtherModule.address, paramsEtherCancel, { gasLimit: 300000 })
    await registry.cancel(2, 'Cancelled by owner', [], { gasLimit: 100000 })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
