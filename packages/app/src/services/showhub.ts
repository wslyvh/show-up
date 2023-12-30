import { ConditionModule, CreateEventData, EventMetadata, Record } from '@/utils/types'
import { CONFIG } from '@/utils/config'
import { SITE_URL } from '@/utils/site'
import dayjs from 'dayjs'

export const envioBaseUri = 'https://indexer.bigdevenergy.link/d913251/v1/graphql' // 'http://localhost:8080/v1/graphql' // 'https://indexer.bigdevenergy.link/0db47e0/v1/graphql'

const eventFields = `
  id
  chainId
  createdAt
  createdBy
  endDate
  limit
  owner
  ownerObject {
    id
    name
    avatar
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

export async function GetAllEvents() {
  const response = await fetch(envioBaseUri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `{
        Record(limit: 100, order_by: {metadataObject: {end: desc}}) {
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
        Record(limit: 100, order_by: {metadataObject: {end: desc}}, where: {metadataObject: {end: {_gte: ${dayjs().unix()}}}}) {
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
        Record(limit: 100, order_by: {metadataObject: {end: desc}}, where: {metadataObject: {end: {_lte: ${dayjs().unix()}}}}) {
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
        Record(limit: 100, order_by: {metadataObject: {end: desc}}, where: {owner: {_eq: "${owner}"}}) {
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
        Record(limit: 100, order_by: {metadataObject: {end: desc}}, where: {registrations: {user: {_eq: "${address}"}}}) {    
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
      imageUrl: data.metadataObject?.imageUrl?.includes('ipfs://')
        ? `${CONFIG.DEFAULT_IPFS_GATEWAY}/${data.metadataObject.imageUrl.replace('ipfs://', '')}`
        : data.metadataObject?.imageUrl ?? `${SITE_URL}/events/${data.id}/opengraph-image`,
    },

    registrations: data.registrations.map((i: any) => ({
      id: i.userObject.id,
      name: i.userObject.name,
      avatar: i.userObject.avatar,
      participated: i.participated,
      transactionHash: i.transactionHash,
    })),
  } as Record
}
