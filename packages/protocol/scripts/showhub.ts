import { ethers, network, run } from 'hardhat'
export async function main() {
    console.log('NETWORK ID', network.config.chainId)

    console.log('Deploying Show Up Protocol..')
    const ShowHub = await ethers.getContractFactory('ShowHub')
    const showhub = await ShowHub.deploy()
    console.log('- ShowHub deployed to:', showhub.address)


    console.log('Deploying Condition modules..')
    const RecipientEther = await ethers.getContractFactory('RecipientEther')
    const recipientEtherModule = await RecipientEther.deploy(showhub.address)
    console.log('- RecipientEther Module deployed to:', recipientEtherModule.address)

    const RecipientToken = await ethers.getContractFactory('RecipientToken')
    const recipientTokenModule = await RecipientToken.deploy(showhub.address)
    console.log('- RecipientToken Module deployed to:', recipientTokenModule.address)

    const SplitEther = await ethers.getContractFactory('SplitEther')
    const splitEtherModule = await SplitEther.deploy(showhub.address)
    console.log('- SplitEther Module deployed to:', splitEtherModule.address)

    const SplitToken = await ethers.getContractFactory('SplitToken')
    const splitTokenModule = await SplitToken.deploy(showhub.address)
    console.log('- SplitToken Module deployed to:', splitTokenModule.address)


    console.log('Whitelist Condition modules..')
    await showhub.whitelistConditionModule(recipientEtherModule.address, true)
    await showhub.whitelistConditionModule(recipientTokenModule.address, true)
    await showhub.whitelistConditionModule(splitEtherModule.address, true)
    await showhub.whitelistConditionModule(splitTokenModule.address, true)

    console.log('Deployment addresses:')
    console.log('- ShowHub:', showhub.address)
    console.log('- RecipientEther:', recipientEtherModule.address)
    console.log('- RecipientToken:', recipientTokenModule.address)
    console.log('- SplitEther:', splitEtherModule.address)
    console.log('- SplitToken:', splitTokenModule.address)

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

        await recipientEtherModule.deployTransaction.wait(10)
        console.log('Verifying RecipientEther module..')
        try {
            run('verify:verify', {
                address: recipientEtherModule.address,
                constructorArguments: [showhub.address],
                contract: 'contracts/conditions/RecipientEther.sol:RecipientEther',
            })
        } catch (e) {
            console.log(e)
        }

        await recipientTokenModule.deployTransaction.wait(10)
        console.log('Verifying RecipientToken module..')
        try {
            run('verify:verify', {
                address: recipientTokenModule.address,
                constructorArguments: [showhub.address],
                contract: 'contracts/conditions/RecipientToken.sol:RecipientToken',
            })
        } catch (e) {
            console.log(e)
        }

        await splitEtherModule.deployTransaction.wait(10)
        console.log('Verifying SplitEther module..')
        try {
            run('verify:verify', {
                address: splitEtherModule.address,
                constructorArguments: [showhub.address],
                contract: 'contracts/conditions/SplitEther.sol:SplitEther',
            })
        } catch (e) {
            console.log(e)
        }

        await splitTokenModule.deployTransaction.wait(10)
        console.log('Verifying SplitToken module..')
        try {
            run('verify:verify', {
                address: splitTokenModule.address,
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
