import { SITE_EMOJI, SITE_INFO, SITE_SHORT_NAME } from '@/utils/site'
import { ImageResponse } from 'next/server'

export function defaultOpenGraphImage() {
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
        <h1 style={{ fontSize: 128, color: 'white' }}>
          {SITE_EMOJI} {SITE_SHORT_NAME}
        </h1>
        <p style={{ fontSize: 28, color: 'rgb(206, 208, 212)' }}>{SITE_INFO}</p>
      </div>
    )
  )
}
