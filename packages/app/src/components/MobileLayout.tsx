import React, { PropsWithChildren } from 'react'
import { Header } from './Header'
import { Navbar } from './Navbar'

const containerClass = 'container mx-auto max-w-4xl'

export function MobileLayout(props: PropsWithChildren) {
  return (
    <div className='flex flex-col h-screen min-h-screen'>
      <div className='bg-gradient-to-b from-base-300 to-base-100 p-4 sticky top-0'>
        <div className={containerClass}>
          <Header />
        </div>
      </div>

      <main className='flex-1 flex-grow overflow-auto p-4'>
        <div className={containerClass}>
          {props.children}
        </div>
      </main>

      <div className='p-4 h-16'>
        <div className={containerClass}>
          <Navbar />
        </div>
      </div>
    </div>
  )
}
