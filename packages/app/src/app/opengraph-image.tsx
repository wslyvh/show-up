import { SITE_NAME } from '@/utils/site'
import { ImageResponse } from 'next/server'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = SITE_NAME
export const size = { width: 1200, height: 630 }

export const contentType = 'image/png'

export default async function Image() {
    return new ImageResponse(
        (
            <div style={{
                fontSize: 128,
                background: 'linear-gradient(to top, rgb(29, 78, 216), rgb(30, 64, 175), rgb(17, 24, 39))',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
            }}>
                😎👋  Sup
            </div>
        )
    )
}