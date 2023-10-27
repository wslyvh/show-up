import { DEFAULT_CHAIN_ID, DEFAULT_IPFS_GATEWAY, ETH_CHAINS, GetGraphBaseUri } from '@/utils/network'
import { ConditionModule, ConditionModuleData, EventMetadata, Participant, Record, Status } from '@/utils/types'
import dayjs from 'dayjs'

interface GetRecordsWhere {
  id?: string
  status?: Status
  createdBy?: string
  checkedIn?: boolean
  past?: boolean
}

interface GetConditionModulesWhere {
  enabled?: boolean
}

export async function GetRecord(id: string, chainId: number = DEFAULT_CHAIN_ID) {
  const result = await GetRecords({ id: id }, chainId)
  return result.length > 0 ? result[0] : undefined
}

export async function GetRecords(params?: GetRecordsWhere, chainId: number = DEFAULT_CHAIN_ID) {
  console.log('GetRecords', params, chainId)

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
                    ${params?.past == true
          ? `condition_: {endDate_lte: "${dayjs().unix()}"}`
          : `condition_: {endDate_gte: "${dayjs().unix()}"}`
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
  const results: Record[] = data.records.map((i: any) => toRecord(i, chainId))
  return results.filter((i) => !!i.metadata)
}

export async function GetParticipations(address: string, chainId: number = DEFAULT_CHAIN_ID) {
  console.log('GetParticipations', address, chainId)
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
  const results: Record[] = data.users.flatMap((user: any) => {
    return user.participations.flatMap((i: any) => {
      return toRecord(i.record, chainId)
    })
  })

  return results.filter((i) => !!i.metadata)
}

export async function GetConditionModules(params?: GetConditionModulesWhere, chainId: number = DEFAULT_CHAIN_ID) {
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


// Mapping Functions

function toRecord(data: any, chainId: number = DEFAULT_CHAIN_ID) {
  return {
    id: data.id,
    createdAt: dayjs(data.createdAt).valueOf(),
    createdBy: data.createdBy,
    updatedAt: data.updatedAt ? dayjs(data.updatedAt).valueOf() : undefined,
    status: data.status,
    message: data.message ?? '',
    conditionModule: data.conditionModule,
    condition: toConditions(data.condition, data.conditionModule, chainId),
    contentUri: data.contentUri,
    metadata: toMetadata(data.metadata),
    participants: data.participants?.map((p: any) => toParticipant(p, chainId)) ?? [],
  } as Record
}

function toMetadata(data: any, chainId: number = DEFAULT_CHAIN_ID) {
  if (!data) return undefined

  return {
    ...data,
    imageUrl: data?.imageUrl?.includes('ipfs://')
      ? `${DEFAULT_IPFS_GATEWAY}/${data.imageUrl.replace('ipfs://', '')}`
      : data?.imageUrl ?? '',
  } as EventMetadata
}

function toParticipant(data: any, chainId: number = DEFAULT_CHAIN_ID) {
  const chain = ETH_CHAINS.find((c) => c.id === chainId)
  return {
    id: data.id,
    createdAt: dayjs(data.createdAt).valueOf(),
    createdBy: data.createdBy,
    address: data.address,
    checkedIn: data.checkedIn,
    transactionHash: data.transactionHash,
    url: chain ? `${chain.blockExplorers.default.url}/tx/${data.transactionHash}` : '',
  } as Participant
}

function toConditionModule(data: any, chainId: number = DEFAULT_CHAIN_ID) {
  return {
    type: data.name,
    address: data.id,
    whitelisted: data.whitelisted,
  } as ConditionModule
}

function toConditions(data: any, address: string, chainId: number = DEFAULT_CHAIN_ID) {
  if (!data) return undefined

  return {
    type: data.name,
    address: address,
    name: data.name,
    endDate: data.endDate,
    depositFee: data.depositFee,
    maxParticipants: data.maxParticipants,
    tokenAddress: data.tokenAddress,
    tokenName: data.tokenName,
    tokenSymbol: data.tokenSymbol,
    tokenDecimals: data.tokenDecimals,
  } as ConditionModuleData
}
