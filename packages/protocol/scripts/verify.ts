import { ethers, network, run } from 'hardhat'
import deployments from '../deployments.json'

export async function main() {
    console.log('Verifying Show Up Protocol..')

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

    if (!showhub || !recipientEther || !recipientToken || !splitEther || !splitToken) {
        console.log('Contracts not found')
        return
    }

    console.log('Deployment addresses:')
    console.log('showhub:', showhub)
    console.log('recipientEther:', recipientEther)
    console.log('recipientToken:', recipientToken)
    console.log('splitEther:', splitEther)
    console.log('splitToken:', splitToken)

    // no need to verify on localhost or hardhat
    if (network.config.chainId != 31337 && process.env.ETHERSCAN_API_KEY) {
        console.log('Verifying contracts..')

        try {
            run('verify:verify', {
                address: showhub,
                constructorArguments: [],
                contract: 'contracts/ShowHub.sol:ShowHub',
            })
        } catch (e) {
            console.log(e)
        }

        console.log('Verifying RecipientEther module..')
        try {
            run('verify:verify', {
                address: recipientEther,
                constructorArguments: [showhub],
                contract: 'contracts/conditions/RecipientEther.sol:RecipientEther',
            })
        } catch (e) {
            console.log(e)
        }

        console.log('Verifying RecipientToken module..')
        try {
            run('verify:verify', {
                address: recipientToken,
                constructorArguments: [showhub],
                contract: 'contracts/conditions/RecipientToken.sol:RecipientToken',
            })
        } catch (e) {
            console.log(e)
        }

        console.log('Verifying SplitEther module..')
        try {
            run('verify:verify', {
                address: splitEther,
                constructorArguments: [showhub],
                contract: 'contracts/conditions/SplitEther.sol:SplitEther',
            })
        } catch (e) {
            console.log(e)
        }

        console.log('Verifying SplitToken module..')
        try {
            run('verify:verify', {
                address: splitToken,
                constructorArguments: [showhub],
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
