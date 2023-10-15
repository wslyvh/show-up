import React from 'react'
import { LinkComponent } from './LinkComponent'
import { SITE_EMOJI } from '@/utils/site'
import { Connect } from './Connect'
import Link from 'next/link'
import { PlusIcon } from '@heroicons/react/24/outline'

export function Header() {
  return (
    <header className='navbar flex justify-between p-4 pt-0'>
      <LinkComponent href='/'>
        <h1 className='text-lg font-bold'>{SITE_EMOJI}</h1>
      </LinkComponent>

      <div className='flex gap-4'>
        <Connect />

        <Link href='/create'>
          <button className='btn glass btn-square btn-sm'>
            <PlusIcon className='h-4 w-4' />
          </button>
        </Link>
      </div>
    </header>
  )
}
