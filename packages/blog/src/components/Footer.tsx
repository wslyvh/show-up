import React from 'react'
import { SITE_INFO, SOCIAL_GITHUB, SOCIAL_TWITTER } from 'app/src/utils/site'
import { FaGithub, FaTwitter } from 'react-icons/fa6'
import { LinkComponent } from 'app/src/components/LinkComponent'

export function Footer() {
    return (
        <footer className='footer flex justify-between items-center p-4'>
            <p>{SITE_INFO}</p>
            <div className='flex gap-4'>
                <LinkComponent href={`https://github.com/${SOCIAL_GITHUB}`}>
                    <FaGithub />
                </LinkComponent>
                <LinkComponent href={`https://twitter.com/${SOCIAL_TWITTER}`}>
                    <FaTwitter />
                </LinkComponent>
            </div>
        </footer>
    )
}
