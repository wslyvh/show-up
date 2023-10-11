import { Overview } from '@/features/overview/Overview'
import { ConditionModule, Record, Status } from '@/utils/types'
import dayjs from 'dayjs'

export const DUMMY_CONDITIONS: ConditionModule[] = [
  {
    type: 'BasicEther',
    address: '0xBasicEtherModuleAddress',
    endDate: dayjs().add(1, 'week').format(),
    depositFee: 0.02,
    maxParticipants: 0
  },
  {
    type: 'BasicERC20',
    address: '0xBasicERC20TokenModuleAddress',
    tokenAddress: '0xTokenAddress',
    endDate: dayjs().add(1, 'week').format(),
    depositFee: 25,
    maxParticipants: 100
  }
]

export const DUMMY_EVENTS_DATA: Record[] = [
  {
    id: '1',
    createdAt: dayjs().subtract(1, 'day').format(),
    createdBy: { address: 'wslyvh.eth', },
    conditions: DUMMY_CONDITIONS[0],
    status: Status.Active,
    contentUri: 'ipfs://cid1',

    metadata: {
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
    },
    attendees: [
      { address: 'wslyvh.eth', }
    ],
  },
  {
    id: '2',
    createdAt: dayjs().subtract(2, 'day').format(),
    createdBy: { address: 'wslyvh.eth', },
    conditions: DUMMY_CONDITIONS[1],
    status: Status.Active,
    contentUri: 'ipfs://cid2',

    metadata: {
      title: 'Show Up Event',
      description: 'Earn $$ by showing up at events',
      start: dayjs().hour(10).minute(0).second(0).format(),
      end: dayjs().hour(18).minute(0).second(0).format(),
      location: 'Online',
      website: "https://showup.events/",
      imageUrl: 'https://source.unsplash.com/random?event=2',
      links: [],
      tags: [],
    },

    attendees: [],
  },
  {
    id: '3',
    createdAt: dayjs().subtract(3, 'day').format(),
    createdBy: { address: 'wslyvh.eth', },
    conditions: DUMMY_CONDITIONS[1],
    status: Status.Cancelled,
    contentUri: 'ipfs://cid2',

    metadata: {
      title: 'Test Event',
      description: 'Lorem ipsum dolor sit amet..',
      start: dayjs().add(1, 'week').hour(10).minute(0).second(0).format(),
      end: dayjs().add(1, 'week').hour(18).minute(0).second(0).format(),
      location: 'Online',
      website: "https://showup.events/",
      imageUrl: 'https://source.unsplash.com/random?event=3',
      links: [],
      tags: [],
    },

    attendees: [],
  }
]

export default function Home() {
  return <Overview events={DUMMY_EVENTS_DATA} />
}
