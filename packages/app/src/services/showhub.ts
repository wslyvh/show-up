import { ConditionModule, CreateEventData, EventMetadata, Record, UserProfile } from '@/utils/types'
import { CONFIG } from '@/utils/config'
import { SITE_URL } from '@/utils/site'
import dayjs from 'dayjs'

export const envioBaseUri = 'https://indexer.bigdevenergy.link/d95e0c6/v1/graphql' // 'http://localhost:8080/v1/graphql'

const eventFields = `
  id
  chainId
  recordId
  slug
  createdAt
  createdBy
  endDate
  limit
  owner
  ownerObject {
    id
    name
    avatar
    description
    website
    email
    twitter
    github
    discord
    telegram
  }
  status
  message

  conditionModuleObject {
    id
    chainId
    name
    whitelisted
  }
  conditionModuleDataObject {
    depositFee
    recipient
    tokenAddress
    tokenName
    tokenSymbol
    tokenDecimals
  }

  totalRegistrations
  totalAttendees
  totalFunded

  contentUri
  metadataObject {
    id
    appId
    title
    description
    start
    end
    timezone
    location
    website
    imageUrl
    visibility
  }

  registrations(limit: 100) {
    id
    user
    participated
    transactionHash
    userObject {
      id
      name
      avatar
    }
  }
`

export async function GetConditionModules() {
  const response = await fetch(envioBaseUri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `{
        ConditionModule(limit: 100) {
          id
          address
          chainId
          name
          whitelisted
        }
      }`,
    }),
  })

  if (!response.ok) {
    console.error('Failed to fetch record', response)
    throw new Error('Failed to fetch records')
  }

  const { data } = await response.json()
  return data.ConditionModule.map((i: any) => ({
    id: i.id,
    address: i.address,
    chainId: i.chainId,
    name: i.name,
    whitelisted: i.whitelisted,
  })) as ConditionModule[]
}

export async function GetEventById(id: string) {
  const response = await fetch(envioBaseUri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `{
        Record_by_pk(id: "${id}") {
          ${eventFields}
        }
      }`,
    }),
  })

  if (!response.ok) {
    console.error('Failed to fetch record', response)
    throw new Error('Failed to fetch records')
  }

  const { data } = await response.json()
  return mapEventRecord(data.Record_by_pk)
}

export async function GetEventBySlug(slug: string) {
  const response = await fetch(envioBaseUri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `{
        Record(
          limit: 1
          where: {slug: {_eq: "${slug}"}}
        ) {
          ${eventFields}
        }
      }`,
    }),
  })

  if (!response.ok) {
    console.error('Failed to fetch record', response)
    throw new Error('Failed to fetch records')
  }

  const { data } = await response.json()
  return data.Record.length > 0 ? (data.Record.map((i: any) => mapEventRecord(i))[0] as Record) : null
}

export async function GetAllEvents() {
  const response = await fetch(envioBaseUri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `{
        Record(
          limit: 100
          order_by: {metadataObject: {end: desc}}
          where: {metadataObject: {appId: {_eq: "${CONFIG.DEFAULT_APP_ID}"}}}
        ) {
          ${eventFields}
        }
      }`,
    }),
  })

  if (!response.ok) {
    console.error('Failed to fetch record', response)
    throw new Error('Failed to fetch records')
  }

  const { data } = await response.json()
  return data.Record.map((i: any) => mapEventRecord(i)) as Record[]
}

export async function GetUpcomingEvents() {
  const response = await fetch(envioBaseUri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `{
        Record(
          limit: 100
          order_by: {metadataObject: {end: desc}}
          where: {status: {_eq: 0}, metadataObject: {appId: {_eq: "${
            CONFIG.DEFAULT_APP_ID
          }"}, end: {_gte: ${dayjs().unix()}}}}
        ) {
          ${eventFields}
        }
      }`,
    }),
  })

  if (!response.ok) {
    console.error('Failed to fetch record', response)
    throw new Error('Failed to fetch records')
  }

  const { data } = await response.json()
  return data.Record.map((i: any) => mapEventRecord(i)) as Record[]
}

export async function GetPastEvents() {
  const response = await fetch(envioBaseUri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `{
        Record(
          limit: 100
          order_by: {metadataObject: {end: desc}}
          where: {status: {_eq: 0}, metadataObject: {appId: {_eq: "${
            CONFIG.DEFAULT_APP_ID
          }"}, end: {_lte: ${dayjs().unix()}}}}
        ) {
          ${eventFields}
        }
      }`,
    }),
  })

  if (!response.ok) {
    console.error('Failed to fetch record', response)
    throw new Error('Failed to fetch records')
  }

  const { data } = await response.json()
  return data.Record.map((i: any) => mapEventRecord(i)) as Record[]
}

export async function GetEventsByOwner(owner: string) {
  const response = await fetch(envioBaseUri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `{
        Record(
          limit: 100
          order_by: {metadataObject: {end: desc}}
          where: {owner: {_eq: "${owner}"}, metadataObject: {appId: {_eq: "${CONFIG.DEFAULT_APP_ID}"}}}
        ) {
          ${eventFields}
        }
      }`,
    }),
  })

  if (!response.ok) {
    console.error('Failed to fetch record', response)
    throw new Error('Failed to fetch records')
  }

  const { data } = await response.json()
  return data.Record.map((i: any) => mapEventRecord(i)) as Record[]
}

export async function GetEventsByRegistration(address: string) {
  const response = await fetch(envioBaseUri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `{
        Record(
          limit: 100
          order_by: {metadataObject: {end: desc}}
          where: {metadataObject: {appId: {_eq: "${CONFIG.DEFAULT_APP_ID}"}, registrations: {user: {_eq: "${address}"}}}
        ) {    
          ${eventFields}
        }
      }`,
    }),
  })

  if (!response.ok) {
    console.error('Failed to fetch record', response)
    throw new Error('Failed to fetch records')
  }

  const { data } = await response.json()
  return data.Record.map((i: any) => mapEventRecord(i)) as Record[]
}

export async function IsParticipant(eventId: string, address: string) {
  const response = await fetch(envioBaseUri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `{
        Record(
          limit: 1
          where: {
            slug: { _eq: "${eventId}" }
            registrations: { user: { _eq: "${address}" }
          }}
        ) {
          slug
        }
      }`,
    }),
  })

  if (!response.ok) {
    console.error('Failed to fetch record', response)
    return false
  }

  const { data } = await response.json()
  return data.Record.length > 0
}

export async function GetUser(address: string) {
  const response = await fetch(envioBaseUri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `{
        User(where: {id: {_eq: "${address}"}}) {
          id
          name
          avatar
          description
          website
          email
          twitter
          github
          discord
          telegram
        }
      }`,
    }),
  })

  if (!response.ok) {
    console.error('Failed to fetch user', response)
    return false
  }

  const { data } = await response.json()
  return data.User[0] as UserProfile
}

export async function GetUsers() {
  const response = await fetch(envioBaseUri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `{
        User {
          id
          name
          avatar
          description
          website
          email
          twitter
          github
          discord
          telegram
        }
      }`,
    }),
  })

  if (!response.ok) {
    console.error('Failed to fetch user', response)
    return false
  }

  const { data } = await response.json()
  return data.User as UserProfile[]
}

export function ValidateMetadata(event: EventMetadata) {
  if (!event.title || !event.start || !event.end || !event.timezone || !event.location) {
    return false
  }

  return true
}

export function ValidateConditions(conditions: CreateEventData) {
  if (!conditions) {
    return false
  }

  return true
}

function mapEventRecord(data: any) {
  if (!data) return null

  return {
    id: data.id,
    chainId: data.chainId,
    recordId: data.recordId,
    slug: data.slug,
    createdAt: dayjs.unix(data.createdAt).toISOString(),
    createdBy: data.createdBy,
    endDate: dayjs.unix(data.endDate).toISOString(),
    limit: Number(data.limit),
    status: data.status,
    message: data.message ?? '',

    ownerId: data.owner,
    owner: data.ownerObject,

    conditionModuleId: data.conditionModuleObject.id,
    conditionModule: data.conditionModuleObject,
    conditionModuleData: data.conditionModuleDataObject,
    contentUri: data.contentUri,
    metadata: {
      ...data.metadataObject,
      start: dayjs.unix(data.metadataObject.start).toISOString(),
      end: dayjs.unix(data.metadataObject.end).toISOString(),
      imageUrl: data.metadataObject?.imageUrl?.includes('ipfs://')
        ? `${CONFIG.DEFAULT_IPFS_GATEWAY}/${data.metadataObject.imageUrl.replace('ipfs://', '')}`
        : data.metadataObject?.imageUrl ?? `${SITE_URL}/events/${data.id}/opengraph-image`,
    },

    totalRegistrations: data.totalRegistrations,
    totalAttendees: data.totalAttendees,
    totalFunded: data.totalFunded,

    registrations: data.registrations.map((i: any) => ({
      id: i.userObject.id,
      name: i.userObject.name,
      avatar: i.userObject.avatar,
      participated: i.participated,
      transactionHash: i.transactionHash,
    })),
  } as Record
}
