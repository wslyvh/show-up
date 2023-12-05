import { BLOG_NAME, SITE_EMOJI, SITE_NAME } from 'app/src/utils/site'
import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = SITE_NAME
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
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

      <h1 style={{ fontSize: 90, color: 'white' }}>{SITE_EMOJI}</h1>
      <span style={{ fontSize: 42, color: 'rgb(206, 208, 212)' }}>{SITE_NAME}</span>
      <span style={{ fontSize: 52, color: 'rgb(206, 208, 212)' }}>B L O G</span>
    </div>
  )
}
