import { ethers, network, run } from 'hardhat'
import { defaultTokenMint } from '../test/utils/types'

export async function main() {
    console.log('Deploying Show Up Protocol..')
    const [owner, attendee1, attendee2, attendee3, attendee4, attendee5] = await ethers.getSigners()

    console.log('NETWORK ID', network.config.chainId)
    // Sepolia + Optimism
    const registry = await ethers.getContractAt('Registry', '0x7Cc8E0633021b9DF8D2F01d9287C3b8e29f4eDe2')
    const basicEtherModule = await ethers.getContractAt('BasicEther', '0x33FF944E8504B674835A5BEd88f10f11bEC92c2c')
    const basicTokenModule = await ethers.getContractAt('BasicToken', '0x33132fE88fe8316881474b551CA2DDD277A320a0')
    // No Token deployed..

    console.log('Deployment addresses:')
    console.log('Registry:', registry.address)
    console.log('BasicEther:', basicEtherModule.address)
    console.log('BasicToken:', basicTokenModule.address)

    // no need to verify on localhost or hardhat
    if (network.config.chainId != 31337 && process.env.ETHERSCAN_API_KEY) {
        console.log('Verifying Registry contract..')
        try {
            run('verify:verify', {
                address: registry.address,
                constructorArguments: [],
                contract: 'contracts/Registry.sol:Registry',
            })
        } catch (e) {
            console.log(e)
        }

        console.log('Verifying BasicEther contract..')
        try {
            run('verify:verify', {
                address: basicEtherModule.address,
                constructorArguments: [registry.address],
                contract: 'contracts/conditions/BasicEther.sol:BasicEther',
            })
        } catch (e) {
            console.log(e)
        }

        console.log('Verifying BasicToken contract..')
        try {
            run('verify:verify', {
                address: basicTokenModule.address,
                constructorArguments: [registry.address],
                contract: 'contracts/conditions/BasicToken.sol:BasicToken',
            })
        } catch (e) {
            console.log(e)
        }
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
