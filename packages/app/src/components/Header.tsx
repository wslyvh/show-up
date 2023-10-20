import React from 'react'
import { LinkComponent } from './LinkComponent'
import { SITE_EMOJI } from '@/utils/site'

export function Header() {
  return (
    <header className='navbar flex justify-between'>
      <LinkComponent href='/'>
        <h1 className='text-lg font-bold'>{SITE_EMOJI}</h1>
      </LinkComponent>
    </header>
  )
}
