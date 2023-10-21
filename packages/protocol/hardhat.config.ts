import { HardhatUserConfig } from 'hardhat/config'
import { join } from 'path'
import dotenv from 'dotenv'
import '@nomicfoundation/hardhat-toolbox'

dotenv.config() // project root
dotenv.config({ path: join(process.cwd(), '../../.env') }) // workspace root

const deployerKey = process.env.DEPLOYER_KEY
if (!deployerKey) {
  console.warn('DEPLOYER_KEY not found in .env file. Running with default config')
}
const etherscanApiKey = process.env.ETHERSCAN_API_KEY ?? ''
if (!etherscanApiKey) {
  console.warn('ETHERSCAN_API_KEY not found in .env file. Will skip Etherscan verification')
}
const infuraApiKey = process.env.INFURA_API_KEY ?? ''
if (!infuraApiKey) {
  console.warn('INFURA_API_KEY not found in .env file.')
}

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  solidity: {
    version: '0.8.21',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    },
  },
  etherscan: {
    apiKey: {
      mainnet: etherscanApiKey,
      sepolia: etherscanApiKey,
      scrollSepolia: 'D62920783A4311EE9D6600155D570C742E',
    },
    customChains: [{
      network: 'scrollSepolia',
      chainId: 534351,
      urls: {
        // apiURL: 'https://api-sepolia.scrollscan.com/api',
        // browserURL: 'https://sepolia.scrollscan.dev/'
        apiURL: 'https://sepolia-blockscout.scroll.io/api',
        browserURL: 'https://sepolia-blockscout.scroll.io/'
      }
    }],
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      chainId: 31337,
      url: 'http://127.0.0.1:8545',
    },
    sepolia: {
      chainId: 11155111,
      url: infuraApiKey ? `https://sepolia.infura.io/v3/${infuraApiKey}` : 'https://rpc.sepolia.org/', // https://rpc-sepolia.rockx.com/ || https://rpc.sepolia.org/
      accounts: [deployerKey as string],
    },
    scrollSepolia: {
      chainId: 534351,
      url: 'https://scroll-sepolia.blockpi.network/v1/rpc/public', // 'https://sepolia-rpc.scroll.io/',
      accounts: [deployerKey as string],
      gasPrice: 15000000,
    },
  },
}

export default config
