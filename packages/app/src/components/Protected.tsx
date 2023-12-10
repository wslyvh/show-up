'use client'

import React, { PropsWithChildren, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'

export function Protected(props: PropsWithChildren) {
  const router = useRouter()
  const pathname = usePathname()
  const { isConnected } = useAccount()

  useEffect(() => {
    if (!isConnected) {
      router.push(`/profile?redirect=${pathname}`)
    }
  }, [router, pathname, isConnected])

  return <>{props.children}</>
}
