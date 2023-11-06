import { defaultOpenGraphImage } from '@/components/OpenGraph'
import { GetRecord } from '@/services/protocol'
import { SITE_EMOJI, SITE_NAME } from '@/utils/site'
import { CalendarDaysIcon } from '@heroicons/react/24/outline'
import dayjs from 'dayjs'
import { ImageResponse } from 'next/server'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = SITE_NAME
export const size = { width: 1200, height: 630 }

export const contentType = 'image/png'

export default async function Image({ params }: { params: { id: string } }) {
  const record = await GetRecord(params.id)
  if (!record || !record.metadata) return defaultOpenGraphImage()

  const sameDay = dayjs(record.metadata.start).isSame(record.metadata.end, 'day')
  const title = record.metadata.title
  let fontSize = 96
  if (title.length > 50) fontSize = 72
  if (title.length > 100) fontSize = 60
  if (title.length > 150) fontSize = 48

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

        <h1 style={{ fontSize: fontSize, color: 'white', textAlign: 'center', padding: '0 48px' }}>{title}</h1>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          color: 'rgb(206, 208, 212)',
          gap: '12px',
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            style={{ height: '24px', width: '24px' }}>
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
          </svg>
          <p style={{ fontSize: 24, }}>
            {dayjs(record.metadata.start).format('ddd MMM DD · HH:mm')}
            {' → '}
            {dayjs(record.metadata.end).format(sameDay ? 'HH:mm' : 'ddd MMM DD · HH:mm')}
          </p>
        </div>

        <p style={{ position: 'absolute', top: '24px', left: '48px', fontSize: 24, color: 'rgb(206, 208, 212)' }}>{SITE_EMOJI}</p>
      </div>
    )
  )
}
