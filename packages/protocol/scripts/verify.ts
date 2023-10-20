import { ethers, network, run } from 'hardhat'
import { defaultTokenMint } from '../test/utils/types'

export async function main() {
    console.log('Deploying Show Up Protocol..')
    const [owner, attendee1, attendee2, attendee3, attendee4, attendee5] = await ethers.getSigners()

    console.log('NETWORK ID', network.config.chainId)
    const registry = await ethers.getContractAt('Registry', '0x0959f7dD732631B7600fcCe67312920d4F5ECB9c')
    const basicEtherModule = await ethers.getContractAt('BasicEther', '0x0b6b25a06A2EE6c560BB33EbDbECA831f2D67836')
    const basicTokenModule = await ethers.getContractAt('BasicToken', '0x11FB53694e42972925940836a1E3EC71cA584936')
    const token = await ethers.getContractAt('Token', '0x7ef7024B76791BD1f31Ac482724c76f0e24a2dD0')

    console.log('Deployment addresses:')
    console.log('Registry:', registry.address)
    console.log('BasicEther:', basicEtherModule.address)
    console.log('BasicToken:', basicTokenModule.address)
    console.log('Token:', token.address)

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
                constructorArguments: [],
                contract: 'contracts/conditions/BasicEther.sol:BasicEther',
            })
        } catch (e) {
            console.log(e)
        }

        console.log('Verifying BasicToken contract..')
        try {
            run('verify:verify', {
                address: basicTokenModule.address,
                constructorArguments: [],
                contract: 'contracts/conditions/BasicToken.sol:BasicToken',
            })
        } catch (e) {
            console.log(e)
        }

        console.log('Verifying Token contract..')
        try {
            run('verify:verify', {
                address: token.address,
                constructorArguments: [],
                contract: 'contracts/mocks/Token.sol:Token',
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
