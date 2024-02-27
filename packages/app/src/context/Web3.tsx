'use client'

import { PropsWithChildren, useEffect, useState } from 'react'
import { WagmiProvider } from 'wagmi'
import { RAINBOW_CONFIG } from '@/utils/network'
import DataProvider from './Data'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'

export function Web3Provider(props: PropsWithChildren) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])
  return (
    <>
      {ready && (
        <WagmiProvider config={RAINBOW_CONFIG}>
          <DataProvider>
            <RainbowKitProvider>{props.children}</RainbowKitProvider>
          </DataProvider>
        </WagmiProvider>
      )}
    </>
  )
}
