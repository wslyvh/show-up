import { ConditionModule, ConditionModuleData, EventMetadata, Participant, Record, Status } from '@/utils/types'
import { GetGraphBaseUri } from '@/utils/network'
import { CONFIG } from '@/utils/config'
import { getEnsProfile } from './ens'
import { SITE_URL } from '@/utils/site'
import dayjs from 'dayjs'

export interface GetRecordsWhere {
  id?: string
  status?: Status
  createdBy?: string
  checkedIn?: boolean
  past?: boolean
  inclUnlisted?: boolean
}

export interface GetConditionModulesWhere {
  enabled?: boolean
}

export async function GetRecord(id: string, chainId: number = CONFIG.DEFAULT_CHAIN_ID) {
  const result = await GetRecords({ id: id, inclUnlisted: true }, chainId)
  return result.length > 0 ? result[0] : null
}

export async function GetRecords(params?: GetRecordsWhere, chainId: number = CONFIG.DEFAULT_CHAIN_ID) {
  console.log('GetRecords', params)
  const response = await fetch(GetGraphBaseUri(chainId), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `{
                records(first: ${params?.id ? '1' : '100'}, where: {
                    ${params?.id ? `id: "${params.id}"` : ''},
                    ${params?.status !== undefined ? `status: ${Status[params.status.valueOf()]}` : ''}, 
                    ${params?.createdBy ? `createdBy: "${params.createdBy}"` : ''}
                    ${params?.past == true ? `condition_: {endDate_lte: "${dayjs().unix()}"}` : ''}
                    ${params?.past == false ? `condition_: {endDate_gte: "${dayjs().unix()}"}` : ''}
                    ${
                      params?.inclUnlisted == true
                        ? `metadata_: {visibility_in: ["Public","Unlisted"]}`
                        : 'metadata_: {visibility: "Public"}'
                    }
                })
                {
                    id
                    createdAt
                    createdBy
                    updatedAt
                    status
                    message
                    conditionModule
                    condition {
                        name
                        endDate
                        depositFee
                        maxParticipants
                        tokenAddress
                        tokenAddress
                        tokenName
                        tokenSymbol
                        tokenDecimals
                    }
                    contentUri
                    metadata {
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
                    participants(first: 100, where: {
                        ${params?.checkedIn ? `checkedIn: ${params.checkedIn}` : ''}
                    }) {
                        id
                        createdAt
                        createdBy
                        address
                        checkedIn
                        transactionHash
                    }
                    blockNumber
                    transactionHash
                }
            }`,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to fetch records')
  }

  const { data } = await response.json()
  const results: Record[] = await Promise.all(data.records.map(async (i: any) => toRecord(i, chainId)))
  return results.filter((i) => !!i.metadata)
}

export async function GetParticipations(address: string, chainId: number = CONFIG.DEFAULT_CHAIN_ID) {
  const response = await fetch(GetGraphBaseUri(chainId), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `{
          users(where: { id: "${address}" }) {
              id
              participations {
                  id
                  transactionHash
                  record {
                      id
                      createdAt
                      createdBy
                      updatedAt
                      status
                      message
                      conditionModule
                      condition {
                        name
                        endDate
                        depositFee
                        maxParticipants
                        tokenAddress
                        tokenName
                        tokenSymbol
                        tokenDecimals
                      }
                      contentUri
                      metadata {
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
                      participants {
                        id
                        createdAt
                        createdBy
                        address
                        checkedIn
                        transactionHash
                      }
                  }
              }
          }
      }`,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to fetch records')
  }

  const { data } = await response.json()
  const results = await Promise.all(
    data.users.flatMap(async (user: any) => {
      return Promise.all(
        user.participations.flatMap(async (i: any) => {
          return toRecord(i.record, chainId)
        })
      )
    })
  )

  return results.flat().filter((i) => !!i.metadata) as Record[]
}

export async function GetConditionModules(
  params?: GetConditionModulesWhere,
  chainId: number = CONFIG.DEFAULT_CHAIN_ID
) {
  const response = await fetch(GetGraphBaseUri(chainId), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `{
                conditionModules(first: 10 where: {
                    ${params && params.enabled === true ? `whitelisted: ${params.enabled}` : 'whitelisted: false'}
                }) {
                    id
                    name
                    createdAt
                    createdBy
                    whitelisted
                }
            }`,
    }),
  })
  if (!response.ok) {
    throw new Error('Failed to fetch records')
  }

  const { data } = await response.json()
  const results: ConditionModule[] = data.conditionModules.map((i: any) => toConditionModule(i, chainId))
  return results as ConditionModule[]
}

export function ValidateMetadata(event: EventMetadata) {
  if (!event.title || !event.start || !event.end || !event.timezone || !event.location) {
    return false
  }

  return true
}

export function ValidateConditions(conditions: ConditionModuleData) {
  if (!conditions.type || conditions.depositFee < 0 || conditions.maxParticipants < 0) {
    return false
  }

  return true
}

// Mapping Functions

async function toRecord(data: any, chainId: number = CONFIG.DEFAULT_CHAIN_ID) {
  return {
    id: data.id,
    createdAt: dayjs.unix(data.createdAt).toISOString(),
    createdBy: data.createdBy,
    creatorProfile: await getEnsProfile(data.createdBy),
    updatedAt: data.updatedAt ? dayjs.unix(data.updatedAt).toISOString() : undefined,
    status: data.status,
    message: data.message ?? '',
    conditionModule: data.conditionModule,
    condition: toConditions(data.condition, data.conditionModule, chainId),
    contentUri: data.contentUri,
    metadata: toMetadata(data.id, data.metadata),
    participants: (await Promise.all(data.participants?.map(async (p: any) => toParticipant(p, chainId)))) ?? [],
  } as Record
}

function toMetadata(id: string, data: any, chainId: number = CONFIG.DEFAULT_CHAIN_ID) {
  if (!data) return undefined

  return {
    ...data,
    imageUrl: data?.imageUrl?.includes('ipfs://')
      ? `${CONFIG.DEFAULT_IPFS_GATEWAY}/${data.imageUrl.replace('ipfs://', '')}`
      : data?.imageUrl ?? `${SITE_URL}/events/${id}/opengraph-image`,
  } as EventMetadata
}

async function toParticipant(data: any, chainId: number = CONFIG.DEFAULT_CHAIN_ID) {
  return {
    id: data.id,
    createdAt: dayjs.unix(data.createdAt).toISOString(),
    createdBy: data.createdBy,
    address: data.address,
    checkedIn: data.checkedIn,
    transactionHash: data.transactionHash,
    url: `${CONFIG.DEFAULT_CHAIN.blockExplorers?.default.url}/tx/${data.transactionHash}`,
    profile: await getEnsProfile(data.address),
  } as Participant
}

function toConditionModule(data: any, chainId: number = CONFIG.DEFAULT_CHAIN_ID) {
  return {
    type: data.name,
    address: data.id,
    whitelisted: data.whitelisted,
  } as ConditionModule
}

function toConditions(data: any, address: string, chainId: number = CONFIG.DEFAULT_CHAIN_ID) {
  if (!data) return undefined

  return {
    type: data.name,
    address: address,
    name: data.name,
    endDate: dayjs.unix(data.endDate).toISOString(),
    depositFee: data.depositFee,
    maxParticipants: data.maxParticipants,
    tokenAddress: data.tokenAddress,
    tokenName: data.tokenName,
    tokenSymbol: data.tokenSymbol,
    tokenDecimals: data.tokenDecimals,
  } as ConditionModuleData
}
