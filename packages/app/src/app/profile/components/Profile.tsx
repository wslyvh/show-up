'use client'

import React from 'react'
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'
import { Login } from './Login'
import Image from 'next/image'
import makeBlockie from 'ethereum-blockies-base64'
import { TruncateMiddle } from '@/utils/format'
import { LinkComponent } from '@/components/LinkComponent'
import { CalendarIcon, PlusIcon } from '@heroicons/react/24/outline'

export function Profile() {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { isConnected } = useAccount()
  const { data: name } = useEnsName({ address, chainId: 1 })
  const { data: avatar } = useEnsAvatar({ name, chainId: 1 })

  if (!isConnected) {
    return <Login />
  }

  const displayName = name ?? TruncateMiddle(address, 6)
  const imageUrl = avatar ?? makeBlockie(address ?? '')

  return (
    <div className='flex flex-col'>
      <div className='flex gap-8'>
        <Image width={90} height={90} src={imageUrl} alt={displayName} className='rounded-full object-cover' />
        <div className='flex flex-col gap-4'>
          <span className='text-2xl'>{displayName}</span>
          <button className='btn btn-xs btn-accent btn-outline' onClick={() => disconnect()}>
            Disconnect
          </button>
        </div>
      </div>

      <div className='divider' />

      <div className='w-full divide-y divide-gray-800 gap-4'>
        <LinkComponent href='/create' className='flex items-center justify-between p-2'>
          <>
            <span>Create Event</span>
            <PlusIcon className='w-6 h-6' />
          </>
        </LinkComponent>
        <LinkComponent href='/' className='flex items-center justify-between p-2'>
          <>
            <span>My Events</span>
            <CalendarIcon className='w-6 h-6' />
          </>
        </LinkComponent>
      </div>
    </div>
  )
}
