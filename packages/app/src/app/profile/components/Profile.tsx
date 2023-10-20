'use client'

import React from 'react'
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'
import { Login } from './Login'
import Image from 'next/image'
import makeBlockie from 'ethereum-blockies-base64'
import { TruncateMiddle } from '@/utils/format'

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
            <div className='flex gap-4'>
                <Image
                    width={90}
                    height={90}
                    src={imageUrl}
                    alt={displayName}
                    className='rounded-full object-cover'
                />
                <div className='flex flex-col gap-4'>
                    <span className='text-2xl'>{displayName}</span>
                    <button className='btn btn-xs btn-accent btn-outline' onClick={() => disconnect()}>Disconnect</button>
                </div>
            </div>
        </div>
    )
}
