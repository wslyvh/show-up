import dayjs from 'dayjs'
import { ConditionModuleData, ConditionModuleType, Record, Status } from './types'
import { parseUnits } from 'viem'

export const MOCKS_CONDITION_MODULES: ConditionModuleData[] = [
  {
    type: ConditionModuleType.BasicEther,
    address: '0xBasicEtherModuleAddress',
    endDate: dayjs().add(1, 'week').format(),
    depositFee: parseUnits('0.2', 18),
    maxParticipants: 0,
  },
  {
    type: ConditionModuleType.BasicEther,
    address: '0xBasicERC20TokenModuleAddress',
    tokenAddress: '0xTokenAddress',
    endDate: dayjs().add(1, 'week').format(),
    depositFee: parseUnits('20', 18),
    maxParticipants: 100,
  },
]

export const MOCKS_EVENTS: Record[] = [
  {
    id: '1',
    createdAt: dayjs().subtract(1, 'day').format(),
    createdBy: { address: 'wslyvh.eth' },
    conditions: MOCKS_CONDITION_MODULES[0],
    status: Status.Active,
    contentUri: 'ipfs://cid1',

    metadata: {
      appId: 'ShowUp',
      title: 'Devconnect',
      description:
        'Devconnect is a week-long gathering of independent Ethereum events to learn, share, and make progress together.',
      start: dayjs('11-13-2023').hour(10).minute(0).second(0).format(),
      end: dayjs('11-19-2023').hour(18).minute(0).second(0).format(),
      timezone: 'Europe/Istanbul',
      location: 'Devconnect, Istanbul',
      website: 'https://devconnect.org/',
      imageUrl: 'https://source.unsplash.com/random?event=1',
      links: [],
      tags: [],
    },
    attendees: [{ address: 'wslyvh.eth' }],
  },
  {
    id: '2',
    createdAt: dayjs().subtract(2, 'day').format(),
    createdBy: { address: 'wslyvh.eth' },
    conditions: MOCKS_CONDITION_MODULES[1],
    status: Status.Active,
    contentUri: 'ipfs://cid2',

    metadata: {
      title: 'Show Up Event',
      description: 'Earn $$ by showing up at events',
      start: dayjs().hour(10).minute(0).second(0).format(),
      end: dayjs().hour(18).minute(0).second(0).format(),
      timezone: 'Europe/Amsterdam',
      location: 'Online',
      website: 'https://showup.events/',
      imageUrl: 'https://source.unsplash.com/random?event=2',
      links: [],
      tags: [],
    },

    attendees: [],
  },
  {
    id: '3',
    createdAt: dayjs().subtract(3, 'day').format(),
    createdBy: { address: 'wslyvh.eth' },
    conditions: MOCKS_CONDITION_MODULES[1],
    status: Status.Cancelled,
    contentUri: 'ipfs://cid2',

    metadata: {
      title: 'Test Event',
      description: 'Lorem ipsum dolor sit amet..',
      start: dayjs().add(1, 'week').hour(10).minute(0).second(0).format(),
      end: dayjs().add(1, 'week').hour(18).minute(0).second(0).format(),
      location: 'Online',
      timezone: 'Europe/Amsterdam',
      website: 'https://showup.events/',
      imageUrl: 'https://source.unsplash.com/random?event=3',
      links: [],
      tags: [],
    },

    attendees: [],
  },
]
