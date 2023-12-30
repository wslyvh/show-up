import { CONFIG } from '@/utils/config'
import React from 'react'
import { LinkComponent } from './LinkComponent'
import { SITE_URL } from '@/utils/site'

export function TestnetAlert() {
  if (CONFIG.NETWORK_ENV === 'test') {
    return (
      <div className='alert shadow-lg'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          className='stroke-info shrink-0 w-6 h-6'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'></path>
        </svg>
        <div>
          <h3 className='font-bold'>Show Up Testnet</h3>
          <div className='text-xs'>Please note that you&apos;re connected to a test network on Sepolia.</div>
        </div>
        <LinkComponent href={SITE_URL} className='btn btn-sm'>
          Go to Main
        </LinkComponent>
      </div>
    )
  }
}
