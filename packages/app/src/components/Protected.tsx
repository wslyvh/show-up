'use client'

import React, { PropsWithChildren, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'

export function Protected(props: PropsWithChildren) {
  const router = useRouter()
  const { isConnected } = useAccount()

  useEffect(() => {
    if (!isConnected) {
      router.push('/profile')
    }
  }, [isConnected])

  return <>{props.children}</>
}
