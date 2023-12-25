import { ethers, network, run } from 'hardhat'
import { defaultTokenMint } from '../test/utils/types'

export async function main() {
    console.log('Deploying Show Up Protocol..')
    const [owner, attendee1, attendee2, attendee3, attendee4, attendee5] = await ethers.getSigners()

    console.log('NETWORK ID', network.config.chainId)
    let showhub, recipientEther, recipientToken, splitEther, splitToken, token

    // Sepolia
    if (network.config.chainId == 11155111) {
        showhub = await ethers.getContractAt('ShowHub', '0x6abEaB74bc741ce8daf2e4614DB7485C19c8acc4')
        recipientEther = await ethers.getContractAt('RecipientEther', '0x73eB044D5Da49384c65b744a0E6CFF3f6B735C03')
        recipientToken = await ethers.getContractAt('RecipientToken', '0x584269c84C40a142E6b9C5c9c7D31B9a24E9F6D0')
        splitEther = await ethers.getContractAt('SplitEther', '0x08b2Bb2BA7b3437aD2EC5CC2F5AbB5223c342260')
        splitToken = await ethers.getContractAt('SplitToken', '0xb1c9D6FFc183EeCf11722f28B3c42b45164e8Df1')
        token = await ethers.getContractAt('Token', '0x796b9850Be63Ffa903eD2854164c21189DbB4B89')
    }

    if (!showhub || !recipientEther || !recipientToken || !splitEther || !splitToken || !token) {
        console.log('Contracts not found')
        return
    }

    console.log('Deployment addresses:')
    console.log('showhub:', showhub.address)
    console.log('recipientEther:', recipientEther.address)
    console.log('recipientToken:', recipientToken.address)
    console.log('splitEther:', splitEther.address)
    console.log('splitToken:', splitToken.address)

    // no need to verify on localhost or hardhat
    if (network.config.chainId != 31337 && process.env.ETHERSCAN_API_KEY) {
        console.log('Verifying contracts..')

        try {
            run('verify:verify', {
                address: showhub.address,
                constructorArguments: [],
                contract: 'contracts/ShowHub.sol:ShowHub',
            })
        } catch (e) {
            console.log(e)
        }

        console.log('Verifying RecipientEther module..')
        try {
            run('verify:verify', {
                address: recipientEther.address,
                constructorArguments: [showhub.address],
                contract: 'contracts/conditions/RecipientEther.sol:RecipientEther',
            })
        } catch (e) {
            console.log(e)
        }

        console.log('Verifying RecipientToken module..')
        try {
            run('verify:verify', {
                address: recipientToken.address,
                constructorArguments: [showhub.address],
                contract: 'contracts/conditions/RecipientToken.sol:RecipientToken',
            })
        } catch (e) {
            console.log(e)
        }

        console.log('Verifying SplitEther module..')
        try {
            run('verify:verify', {
                address: splitEther.address,
                constructorArguments: [showhub.address],
                contract: 'contracts/conditions/SplitEther.sol:SplitEther',
            })
        } catch (e) {
            console.log(e)
        }

        console.log('Verifying SplitToken module..')
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
