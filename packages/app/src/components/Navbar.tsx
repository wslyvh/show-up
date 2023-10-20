'use client'

import React from 'react'
import { BellIcon, HomeIcon, TicketIcon, UserIcon } from '@heroicons/react/24/outline'
import { LinkComponent } from './LinkComponent'
import { usePathname } from 'next/navigation'
import { useNotifications } from '@/context/Notification'

export function Navbar() {
  const notifications = useNotifications()
  const pathname = usePathname()
  const iconClassName = 'h-6 w-6'

  return (
    <footer className='btm-nav'>
      <LinkComponent href='/' className={pathname === '/' ? 'active bg-neutral' : ''}>
        <HomeIcon className={iconClassName} />
      </LinkComponent>
      <LinkComponent href='/tickets' className={pathname === '/tickets' ? 'active bg-neutral' : ''}>
        <TicketIcon className={iconClassName} />
      </LinkComponent>
      <LinkComponent href='/notifications' className={pathname === '/notifications' ? 'active bg-neutral' : ''}>
        <p className='relative'>
          <BellIcon className={iconClassName} />
          {notifications.new && (<span className="absolute -top-2 left-4 badge badge-accent badge-xs"></span>)}
        </p>
      </LinkComponent>
      <LinkComponent href='/profile' className={pathname === '/profile' ? 'active bg-neutral' : ''}>
        <UserIcon className={iconClassName} />
      </LinkComponent>
    </footer>
  )
}
