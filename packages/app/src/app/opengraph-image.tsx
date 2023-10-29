import { SITE_EMOJI, SITE_INFO, SITE_NAME, SITE_SHORT_NAME } from '@/utils/site'
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
      <div
        style={{
          background: 'linear-gradient(to bottom, rgb(0, 0, 0), rgb(15, 23, 41), rgb(15, 23, 41))',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>

        <h1 style={{ fontSize: 128, color: 'white' }}>{SITE_EMOJI} {SITE_SHORT_NAME}</h1>
        <p style={{ fontSize: 28, color: 'rgb(206, 208, 212)' }}>{SITE_INFO}</p>
      </div>
    )
  )
}
