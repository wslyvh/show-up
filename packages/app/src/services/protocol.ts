import { ConditionModule, ConditionModuleData, ConditionModuleType, EventMetadata, Participant, Record, Status } from "@/utils/types"
import dayjs from "dayjs"

const baseUri = 'https://api.studio.thegraph.com/query/43964/show-up-sepolia/version/latest'
const ipfsGateway = 'https://cloudflare-ipfs.com/ipfs'

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

export async function GetRecord(id: string) {
    const result = await GetRecords({ id: id })
    return result.length > 0 ? result[0] : undefined
}

export async function GetRecords(params?: GetRecordsWhere) {
    const response = await fetch(baseUri, {
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
                    ${params?.past == true ?
                    `condition_: {endDate_lte: "${dayjs().unix()}"}` :
                    `condition_: {endDate_gte: "${dayjs().unix()}"}`}
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
    const results: Record[] = data.records.map((i: any) => {
        return toRecord(i)
    })

    return results
}

export async function GetParticipations(address: string) {
    const response = await fetch(baseUri, {
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
            return toRecord(i.record)
        })
    })

    return results
}

export async function GetConditionModules(params?: GetConditionModulesWhere) {
    const response = await fetch(baseUri, {
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
    const results = data.conditionModules.map((i: any) => {
        return {
            type: i.name,
            address: i.id,
            whitelisted: i.whitelisted,
        } as ConditionModule
    })

    return results as ConditionModule[]
}

function toRecord(data: any) {
    return {
        id: data.id,
        createdAt: dayjs(data.createdAt).valueOf(),
        createdBy: data.createdBy,
        updatedAt: data.updatedAt ? dayjs(data.updatedAt).valueOf() : undefined,
        status: data.status,
        message: data.message ?? '',
        conditionModule: data.conditionModule,
        condition: toConditions(data.condition, data.conditionModule),
        contentUri: data.contentUri,
        metadata: toMetadata(data.metadata),
        participants: data.participants?.map((p: any) => toParticipant(p)) ?? [],
    } as Record
}

function toMetadata(data: any) {
    if (!data) return undefined

    return {
        ...data,
        imageUrl: data?.imageUrl?.includes('ipfs://') ?
            `${ipfsGateway}/${data.imageUrl.replace('ipfs://', '')}` :
            data?.imageUrl ?? '',
    } as EventMetadata
}

function toParticipant(data: any) {
    return {
        id: data.id,
        createdAt: dayjs(data.createdAt).valueOf(),
        createdBy: data.createdBy,
        address: data.address,
        checkedIn: data.checkedIn,
    } as Participant
}

function toConditions(data: any, address: string) {
    if (!data) return undefined

    return {
        type: data.name,
        address: address,
        name: data.name,
        endDate: data.endDate,
        depositFee: data.depositFee,
        maxParticipants: data.maxParticipants,
        tokenAddress: data.tokenAddress,
    } as ConditionModuleData
}