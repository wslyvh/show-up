'use client'

import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/utils/site'
import { PropsWithChildren, useEffect, useState } from 'react'
import { ETH_CHAINS } from '@/utils/network'
import { ConnectKitProvider, getDefaultConfig } from 'connectkit'

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? ''
if (!walletConnectProjectId) {
  console.warn('You need to provide a NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID env variable')
}
const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY ?? ''
if (!alchemyApiKey) {
  console.warn('You need to provide a NEXT_PUBLIC_ALCHEMY_KEY env variable')
}
const infuraApiKey = process.env.NEXT_PUBLIC_INFURA_KEY ?? ''
if (!infuraApiKey) {
  console.warn('You need to provide a NEXT_PUBLIC_INFURA_KEY env variable')
}

const { chains, publicClient, webSocketPublicClient } = configureChains(ETH_CHAINS, [
  alchemyProvider({ apiKey: alchemyApiKey }),
  infuraProvider({ apiKey: infuraApiKey }),
  publicProvider(),
])

const wagmiConfig = createConfig(
  getDefaultConfig({
    autoConnect: true,
    alchemyId: alchemyApiKey,
    infuraId: infuraApiKey,
    walletConnectProjectId: walletConnectProjectId,
    appName: SITE_NAME,
    appDescription: SITE_DESCRIPTION,
    appUrl: SITE_URL,
    // appIcon: `${SITE_URL}/logo.png`, // your app's icon, no bigger than 1024x1024px (max. 1MB)

    chains: chains,
    publicClient,
    webSocketPublicClient,
  })
)

export function Web3Provider(props: PropsWithChildren) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])

  return (
    <>
      {ready && (
        <WagmiConfig config={wagmiConfig}>
          <ConnectKitProvider>{props.children}</ConnectKitProvider>
        </WagmiConfig>
      )}
    </>
  )
}
