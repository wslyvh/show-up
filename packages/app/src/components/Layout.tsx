import React, { PropsWithChildren } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'

export function Layout(props: PropsWithChildren) {
  const containerClass = 'container mx-auto max-w-4xl'

  return (
    <div className='flex flex-col min-h-screen'>
      <div className='bg-gradient-to-b from-base-300 to-base-100 p-4'>
        <div className={containerClass}>
          <Header />
        </div>
      </div>

      <main className={`flex-grow px-4 ${containerClass}`}>{props.children}</main>

      <div className='sticky top-[100vh] bg-neutral text-neutral-content'>
        <div className={containerClass}>
          <Footer />
        </div>
      </div>
    </div>
  )
}
