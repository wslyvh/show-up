import { ethers, network, run } from 'hardhat'
export async function main() {
    console.log('Deploying Show Up Protocol..')

    console.log('NETWORK ID', network.config.chainId)
    const Registry = await ethers.getContractFactory('Registry')
    const registry = await Registry.deploy()

    const BasicEther = await ethers.getContractFactory('BasicEther')
    const basicEtherModule = await BasicEther.deploy(registry.address)

    const BasicToken = await ethers.getContractFactory('BasicToken')
    const basicTokenModule = await BasicToken.deploy(registry.address)

    await registry.whitelistConditionModule(basicEtherModule.address, true)
    await registry.whitelistConditionModule(basicTokenModule.address, true)

    console.log('Deployment addresses:')
    console.log('Registry:', registry.address)
    console.log('BasicEther:', basicEtherModule.address)
    console.log('BasicToken:', basicTokenModule.address)

    // no need to verify on localhost or hardhat
    if (network.config.chainId != 31337 && process.env.ETHERSCAN_API_KEY) {
        console.log(`Waiting for block confirmations..`)
        await basicTokenModule.deployTransaction.wait(10) // last contract deployed

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
