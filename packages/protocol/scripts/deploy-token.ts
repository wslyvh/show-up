import { ethers, network, run } from 'hardhat'
import { defaultTokenMint } from '../test/utils/types'

export async function main() {
    console.log('Deploying Show Up Protocol..')
    const [owner, attendee1, attendee2, attendee3, attendee4, attendee5] = await ethers.getSigners()

    console.log('NETWORK ID', network.config.chainId)

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

    if (network.config.chainId == 84532) {
        // no auto verification on Base Sepolia
        return
    }

    // no need to verify on localhost or hardhat
    if (network.config.chainId != 31337 && process.env.ETHERSCAN_API_KEY) {
        console.log(`Waiting for block confirmations..`)
        await token.deployTransaction.wait(10) // last contract deployed

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
