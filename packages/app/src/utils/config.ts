import { sepolia, optimism, Chain } from 'viem/chains'

let defaultChainId = process.env.NODE_ENV === 'development' ? 11155111 : 10
if (process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID && !isNaN(parseInt(process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID ?? '', 10))) {
    defaultChainId = parseInt(process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID, 10)
}

let defaultAppId = defaultChainId === 11155111 ? 'showup-events-test' : 'showup-events'
if (process.env.NEXT_PUBLIC_DEFAULT_APP_ID) {
    defaultAppId = process.env.NEXT_PUBLIC_DEFAULT_APP_ID
}

const chains: Chain[] = defaultChainId === 11155111 ? [sepolia] : [optimism]

export const CONFIG = {
    NODE_ENV: process.env.NODE_ENV || 'development',

    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '',
    NEXT_PUBLIC_ALCHEMY_KEY: process.env.NEXT_PUBLIC_ALCHEMY_KEY ?? '',
    NEXT_PUBLIC_INFURA_KEY: process.env.NEXT_PUBLIC_INFURA_KEY ?? '',
    NEXT_PUBLIC_WEB3_STORAGE_API_KEY: process.env.NEXT_PUBLIC_WEB3_STORAGE_API_KEY ?? '',

    DEFAULT_IPFS_GATEWAY: process.env.NEXT_PUBLIC_DEFAULT_IPFS_GATEWAY ?? 'https://cloudflare-ipfs.com/ipfs',
    DEFAULT_CHAIN_ID: defaultChainId,
    DEFAULT_CHAIN: chains[0],
    DEFAULT_APP_ID: defaultAppId,
    DEFAULT_CHAINS: chains,
}

    ; (() => {
        console.log('Running in', CONFIG.NODE_ENV, 'mode')

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
