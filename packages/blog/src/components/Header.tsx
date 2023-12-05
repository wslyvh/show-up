import React from 'react'
import { LinkComponent } from 'app/src/components/LinkComponent'
import { SITE_EMOJI, SITE_URL } from 'app/src/utils/site'

export function Header() {
    return (
        <header className='navbar flex justify-between'>
            <LinkComponent href='/'>
                <h1 className='text-lg font-bold'>
                    {SITE_EMOJI}
                    <span className='ml-2'>Blog</span>
                </h1>
            </LinkComponent>

            <LinkComponent href={SITE_URL}>
                <button className='btn btn-accent btn-outline btn-xs'>Go to Events →</button>
            </LinkComponent>
        </header>
    )
}
