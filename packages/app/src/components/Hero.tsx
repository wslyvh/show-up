import { SITE_EMOJI, SITE_SHORT_NAME } from '@/utils/site'
import React from 'react'
import { LinkComponent } from './LinkComponent'

export function Hero() {
  return (
    <div
      className='hero bg-cover bg-center bg-bottom rounded-2xl'
      style={{
        backgroundImage: 'url(images/stage.jpg)',
      }}>
      <div className='hero-overlay bg-base-300 bg-opacity-80 rounded-2xl'></div>
      <div className='hero-content text-center text-neutral-content p-16'>
        <div className='max-w-md'>
          <div className='flex flex-col'>
            <h1 className='mb-5 text-5xl font-bold'>
              {SITE_SHORT_NAME} {SITE_EMOJI}
            </h1>
            <h2 className='text-2xl text-accent mb-2'>Onchain Events & RSVP</h2>
            <p className='mb-5'>Increase event participation. Reward attendees.</p>
          </div>
          <div className='flex justify-center gap-4'>
            <LinkComponent href='/create'>
              <button className='btn btn-sm btn-primary'>Create event</button>
            </LinkComponent>
            <LinkComponent href='https://blog.showup.events/introducing-show-up-protocol'>
              <button className='btn btn-sm btn-link'>Learn more</button>
            </LinkComponent>
          </div>
        </div>
      </div>
    </div>
  )

  //   return (
  //     <div className='hero'>
  //       <div className='hero-content text-center'>
  //         <div className='max-w-md'>
  //           <h1 className='text-5xl font-bold'>Hello there</h1>
  //           <p className='py-6'>
  //             Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In
  //             deleniti eaque aut repudiandae et a id nisi.
  //           </p>
  //           <button className='btn btn-primary'>Get Started</button>
  //         </div>
  //       </div>
  //     </div>
  //   )
}
