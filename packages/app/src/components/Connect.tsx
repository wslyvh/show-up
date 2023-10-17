'use client'

import { ETH_CHAINS } from '@/utils/network'
import React from 'react'
import { useNetwork } from 'wagmi'

export function Connect() {
  const { chain } = useNetwork()
  const allowedChain = !!ETH_CHAINS.find((c) => c.id === chain?.id)

  return (
    <div className='flex gap-2 items-center'>
      {!allowedChain && (
        <div className="badge badge-error gap-2">
          X network
        </div>
      )}
      <w3m-button label='Connect' balance='hide' size='sm' />
    </div>
  )
}
