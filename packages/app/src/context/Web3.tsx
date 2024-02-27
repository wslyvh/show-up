'use client'

import { PropsWithChildren } from 'react'
import { State, WagmiProvider } from 'wagmi'
import { WAGMI_CONFIG } from '@/utils/network'
import DataProvider from './Data'
import { CONFIG } from '@/utils/config'
import { createWeb3Modal } from '@web3modal/wagmi/react'

interface Props extends PropsWithChildren {
  initialState?: State
}

createWeb3Modal({
  wagmiConfig: WAGMI_CONFIG,
  projectId: CONFIG.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  enableAnalytics: true,
})

export function Web3Provider(props: Props) {
  return (
    <>
      <WagmiProvider config={WAGMI_CONFIG} initialState={props.initialState}>
        <DataProvider>{props.children}</DataProvider>
      </WagmiProvider>
    </>
  )
}
