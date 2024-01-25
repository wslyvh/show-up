import dayjs from 'dayjs'
import { Record } from './types'
import { SITE_DOMAIN, SITE_URL } from './site'

export function GenerateGoogleCalendarLink(record: Record) {
  const calendarLink = new URL(`https://www.google.com/calendar/render?action=TEMPLATE`)

  calendarLink.searchParams.append('text', `${record.metadata.title}`)
  calendarLink.searchParams.append('dates', `${dateFormat(record.metadata.start)}/${dateFormat(record.metadata.end)}`)
  calendarLink.searchParams.append('location', `${record.metadata.location}`)
  calendarLink.searchParams.append('details', generateDescription(record))

  return calendarLink.href
}

export function GenerateIcsFileLink(record: Record) {
  const ics = [`BEGIN:VCALENDAR`, `VERSION:2.0`, `PRODID:${SITE_DOMAIN}`]
  ics.push(
    `BEGIN:VEVENT`,
    `UID:${record.slug}`,
    `DTSTAMP:${dateFormat()}`,
    `DTSTART:${dateFormat(record.metadata.start)}`,
    `DTEND:${dateFormat(record.metadata.end)}`,
    `SUMMARY:${record.metadata.title}`,
    `DESCRIPTION:${generateDescription(record)}`,
    `LOCATION:${record.metadata.location}`,
    `END:VEVENT`
  )
  ics.push(`END:VCALENDAR`)

  const file = new Blob([ics.filter((row: string) => !!row).join('\n')], { type: 'text/calendar' })
  return URL.createObjectURL(file)
}

function dateFormat(date?: string | number) {
  return (!date ? dayjs() : dayjs(date)).toISOString().replace(/-|:|\.\d\d\d/g, '')
}

function generateDescription(record: Record) {
  let description = `EVENT INFORMATION IN YOUR CALENDAR MIGHT BE OUT OF DATE. MAKE SURE TO VISIT THE WEBSITE FOR THE LATEST INFORMATION.\n`
  description += '====================\n\n'

  description += `RSVP: ${getShowUpEventLink(record)}\n`
  if (record.metadata.website) {
    description += `Website: ${record.metadata.website}\n`
  }

  description += `\n\n`
  description += record.metadata.description

  return description
}

function getShowUpEventLink(record: Record) {
  return `${SITE_URL}/events/${record.slug}`
}
