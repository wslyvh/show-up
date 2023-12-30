import { sepolia, baseSepolia, optimism, base, Chain } from 'viem/chains'

const networkEnv = process.env.NEXT_PUBLIC_NETWORK_ENV ?? 'test'
const chains: Chain[] = networkEnv === 'main' ? [optimism, base] : [sepolia, baseSepolia]
const appId = process.env.NEXT_PUBLIC_DEFAULT_APP_ID ?? networkEnv === 'main' ? 'showup' : 'showup-test'

export const CONFIG = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  NETWORK_ENV: networkEnv,

  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '',
  NEXT_PUBLIC_ALCHEMY_KEY: process.env.NEXT_PUBLIC_ALCHEMY_KEY ?? '',
  NEXT_PUBLIC_ALCHEMY_MAIN: process.env.NEXT_PUBLIC_ALCHEMY_MAIN ?? '',
  NEXT_PUBLIC_INFURA_KEY: process.env.NEXT_PUBLIC_INFURA_KEY ?? '',
  NEXT_PUBLIC_WEB3_STORAGE_API_KEY: process.env.NEXT_PUBLIC_WEB3_STORAGE_API_KEY ?? '',

  DEFAULT_IPFS_GATEWAY: process.env.NEXT_PUBLIC_DEFAULT_IPFS_GATEWAY ?? 'https://cloudflare-ipfs.com/ipfs',
  DEFAULT_APP_ID: appId,
  DEFAULT_CHAINS: chains,
}
;(() => {
  if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
    console.error('You need to provide a NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID env variable')
  }
  if (!process.env.NEXT_PUBLIC_ALCHEMY_KEY) {
    console.error('You need to provide a NEXT_PUBLIC_ALCHEMY_KEY env variable')
  }
  if (!process.env.NEXT_PUBLIC_INFURA_KEY) {
    console.error('You need to provide a NEXT_PUBLIC_INFURA_KEY env variable')
  }
  if (!process.env.NEXT_PUBLIC_WEB3_STORAGE_API_KEY) {
    console.error('NEXT_PUBLIC_WEB3_STORAGE_API_KEY is not defined')
  }
})()
