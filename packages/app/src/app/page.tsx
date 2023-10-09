import { Overview } from '@/features/overview/Overview'
import { EventMetadata } from '@/utils/types'
import dayjs from 'dayjs'

export const DUMMY_EVENTS_DATA: EventMetadata[] = [
  {
    id: '1',
    createdAt: dayjs().subtract(1, 'day').format(),
    createdBy: { address: 'wslyvh.eth', },

    appId: 'ShowUp',
    title: 'Devconnect',
    description: 'Devconnect is a week-long gathering of independent Ethereum events to learn, share, and make progress together.',
    start: dayjs('11-13-2023').hour(10).minute(0).second(0).format(),
    end: dayjs('11-19-2023').hour(18).minute(0).second(0).format(),
    location: 'Devconnect, Istanbul',
    website: "https://devconnect.org/",
    imageUrl: 'https://source.unsplash.com/random?event=1',
    links: [],
    tags: [],

    attendees: [
      { address: 'wslyvh.eth', }
    ],
  },
  {
    id: '2',
    createdAt: dayjs().subtract(2, 'day').format(),
    createdBy: { address: 'wslyvh.eth', },

    title: 'Show Up Event',
    description: 'Earn $$ by showing up at events',
    start: dayjs().hour(10).minute(0).second(0).format(),
    end: dayjs().hour(18).minute(0).second(0).format(),
    location: 'Online',
    website: "https://showup.events/",
    imageUrl: 'https://source.unsplash.com/random?event=2',
    links: [],
    tags: [],

    attendees: [],
  },
  {
    id: '3',
    createdAt: dayjs().subtract(3, 'day').format(),
    createdBy: { address: 'wslyvh.eth', },

    title: 'Test Event',
    description: 'Lorem ipsum dolor sit amet..',
    start: dayjs().add(1, 'week').hour(10).minute(0).second(0).format(),
    end: dayjs().add(1, 'week').hour(18).minute(0).second(0).format(),
    location: 'Online',
    website: "https://showup.events/",
    imageUrl: 'https://source.unsplash.com/random?event=3',
    links: [],
    tags: [],

    attendees: [],
  }
]

export default function Home() {
  return <Overview events={DUMMY_EVENTS_DATA} />
}
