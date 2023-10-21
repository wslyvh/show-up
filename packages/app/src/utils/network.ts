import { hardhat, mainnet, sepolia, scroll, scrollSepolia } from 'viem/chains'

export const DEFAULT_CHAIN_ID = 11155111 // 11155111 Sepolia // Hardhat 31337

export const ETH_CHAINS = [sepolia, scrollSepolia, scroll]

export const AddressZero = '0x0000000000000000000000000000000000000000'

export function GetNetworkColor(chain?: string) {
  if (chain === 'homestead') return 'green'
  if (chain === 'arbitrum') return 'blue'
  if (chain === 'optimism') return 'red'
  if (chain === 'matic') return 'purple'

  return 'grey'
}

export const TOKENS = [
  { chainId: 1, symbol: 'USDC', address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' },
  { chainId: 1, symbol: 'DAI', address: '0x6b175474e89094c44da98b954eedeac495271d0f' },
  { chainId: 10, symbol: 'USDC', address: '0x0b2c639c533813f4aa9d7837caf62653d097ff85' },
  { chainId: 10, symbol: 'DAI', address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1' },
  { chainId: 11155111, symbol: 'DAI', address: '0x7ef7024B76791BD1f31Ac482724c76f0e24a2dD0' },
]
