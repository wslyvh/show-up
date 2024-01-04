import { ethers, network, run } from 'hardhat'
import deployments from '../deployments.json'
import fs from 'fs'

export async function main() {
    console.log('NETWORK ID', network.config.chainId)
    if (!network.config.chainId) {
        throw new Error('INVALID_NETWORK_ID')
    }

    console.log('Deploying Show Up Protocol..')
    const ShowHub = await ethers.getContractFactory('ShowHub')
    const showhub = await ShowHub.deploy()
    console.log('- ShowHub deployed to:', showhub.address)


    console.log('Deploying Condition modules..')
    const RecipientEther = await ethers.getContractFactory('RecipientEther')
    const recipientEther = await RecipientEther.deploy(showhub.address)

    const RecipientToken = await ethers.getContractFactory('RecipientToken')
    const recipientToken = await RecipientToken.deploy(showhub.address)

    const SplitEther = await ethers.getContractFactory('SplitEther')
    const splitEther = await SplitEther.deploy(showhub.address)

    const SplitToken = await ethers.getContractFactory('SplitToken')
    const splitToken = await SplitToken.deploy(showhub.address)

    console.log('Whitelist Condition modules..')
    await showhub.whitelistConditionModule(recipientEther.address, true)
    await showhub.whitelistConditionModule(recipientToken.address, true)
    await showhub.whitelistConditionModule(splitEther.address, true)
    await showhub.whitelistConditionModule(splitToken.address, true)

    console.log('Deployment addresses:')
    console.log('- ShowHub:', showhub.address)
    console.log('- RecipientEther:', recipientEther.address)
    console.log('- RecipientToken:', recipientToken.address)
    console.log('- SplitEther:', splitEther.address)
    console.log('- SplitToken:', splitToken.address)

    console.log(`Write addresses to file..`)
    const data = {
        ...deployments,
        [network.config.chainId]: {
            ...(deployments as any)[network.config.chainId],
            ShowHub: showhub.address,
            RecipientEther: recipientEther.address,
            RecipientToken: recipientToken.address,
            SplitEther: splitEther.address,
            SplitToken: splitToken.address,
        }
    }
    fs.writeFileSync('./deployments.json', JSON.stringify(data, null, 2))

    if (network.config.chainId == 84532) {
        // no auto verification on Base Sepolia
        return
    }

    // no need to verify on localhost or hardhat
    if (network.config.chainId != 31337 && process.env.ETHERSCAN_API_KEY) {
        console.log(`Waiting for block confirmations..`)

        await showhub.deployTransaction.wait(10)
        console.log('Verifying Registry contract..')
        try {
            run('verify:verify', {
                address: showhub.address,
                constructorArguments: [],
                contract: 'contracts/ShowHub.sol:ShowHub',
            })
        } catch (e) {
            console.log(e)
        }

        await recipientEther.deployTransaction.wait(10)
        console.log('Verifying recipientEther module..')
        try {
            run('verify:verify', {
                address: recipientEther.address,
                constructorArguments: [showhub.address],
                contract: 'contracts/conditions/RecipientEther.sol:RecipientEther',
            })
        } catch (e) {
            console.log(e)
        }

        await recipientToken.deployTransaction.wait(10)
        console.log('Verifying recipientToken module..')
        try {
            run('verify:verify', {
                address: recipientToken.address,
                constructorArguments: [showhub.address],
                contract: 'contracts/conditions/RecipientToken.sol:RecipientToken',
            })
        } catch (e) {
            console.log(e)
        }

        await splitEther.deployTransaction.wait(10)
        console.log('Verifying splitEther module..')
        try {
            run('verify:verify', {
                address: splitEther.address,
                constructorArguments: [showhub.address],
                contract: 'contracts/conditions/SplitEther.sol:SplitEther',
            })
        } catch (e) {
            console.log(e)
        }

        await splitToken.deployTransaction.wait(10)
        console.log('Verifying splitToken module..')
        try {
            run('verify:verify', {
                address: splitToken.address,
                constructorArguments: [showhub.address],
                contract: 'contracts/conditions/SplitToken.sol:SplitToken',
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
