import { ethers, network, run } from 'hardhat'
import { defaultTokenMint } from '../test/utils/types'

export async function main() {
    console.log('Deploying Show Up Protocol..')
    const [owner, attendee1, attendee2, attendee3, attendee4, attendee5] = await ethers.getSigners()

    console.log('NETWORK ID', network.config.chainId)
    // Scroll Sepolia
    const registry = await ethers.getContractAt('Registry', '0xa21BD128d7c507bf2F6b78181A9A99e86a23E593')
    const basicEtherModule = await ethers.getContractAt('BasicEther', '0xf32E8f56626F87A0bf5e93154CA3a51D45123dc0')
    const basicTokenModule = await ethers.getContractAt('BasicToken', '0xB944AFeF3821062B4B813D5aCaE833Eca223db09')
    const token = await ethers.getContractAt('Token', '0xA95579514dB88a1F7a561E46bEdBDA1C676E76A4')

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
