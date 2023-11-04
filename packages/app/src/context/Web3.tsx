'use client'

import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/utils/site'
import { PropsWithChildren, useEffect, useState } from 'react'
import { ConnectKitProvider, getDefaultConfig } from 'connectkit'
import { CONFIG } from '@/utils/config'

const { chains, publicClient, webSocketPublicClient } = configureChains(CONFIG.DEFAULT_CHAINS, [
  alchemyProvider({ apiKey: CONFIG.NEXT_PUBLIC_ALCHEMY_KEY }),
  infuraProvider({ apiKey: CONFIG.NEXT_PUBLIC_INFURA_KEY }),
  publicProvider(),
])

const wagmiConfig = createConfig(
  getDefaultConfig({
    autoConnect: true,
    alchemyId: CONFIG.NEXT_PUBLIC_ALCHEMY_KEY,
    infuraId: CONFIG.NEXT_PUBLIC_INFURA_KEY,
    walletConnectProjectId: CONFIG.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    appName: SITE_NAME,
    appDescription: SITE_DESCRIPTION,
    appUrl: SITE_URL,
    appIcon: `${SITE_URL}/icons/sup-512x512.png`,

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
