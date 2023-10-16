import { ConditionModule, ConditionModuleData, ConditionModuleType, Record, Status } from "@/utils/types"
import dayjs from "dayjs"

const TEST_MODE = true
const baseUri = 'https://api.studio.thegraph.com/query/43964/show-up-sepolia/version/latest'

interface GetRecordsWhere {
    id?: string
    status?: Status
    createdBy?: string
    checkedIn?: boolean
}

interface GetConditionModulesWhere {
    enabled?: boolean
}

export async function GetRecord(params?: GetRecordsWhere) {
    const result = await GetRecords(params)
    return result[0] ?? undefined
}

export async function GetRecords(params?: GetRecordsWhere) {
    if (TEST_MODE) return MOCKS_EVENTS;

    const response = await fetch(baseUri, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `{
                records(first: 100, where: {
                    ${params?.id ? `recordId: "${params.id}"` : ''},
                    ${params?.status ? `status: "${Status[params.status]}"` : ''}, 
                    ${params?.createdBy ? `createdBy: "${params.createdBy}"` : ''}
                })
                {
                    id
                    recordId
                    createdAt
                    createdBy
                    updatedAt
                    status
                    message
                    conditionModule
                    contentUri
                    ipfsHash
                    metadata {
                        appId
                        title
                        description
                        start
                        end
                        timezone
                        location
                        website                      
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
        // console.log('Record', i)

        return {
            id: i.recordId,
            createdAt: dayjs(i.createdAt).valueOf(),
            createdBy: i.createdBy,
            updatedAt: i.updatedAt ? dayjs(i.updatedAt).valueOf() : undefined,
            status: i.status,
            message: i.message ?? '',
            conditionModule: i.conditionModule,
            contentUri: i.contentUri,
            ipfsHash: i.ipfsHash,
            metadata: i.metadata,
            participants: i.participants.map((p: any) => {
                return {
                    id: p.id,
                    createdAt: dayjs(p.createdAt).valueOf(),
                    createdBy: p.createdBy,
                    address: p.address,
                    checkedIn: p.checkedIn,
                }
            }),
        } as Record
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
        // console.log('ConditionModule', i)

        return {
            type: ConditionModuleType.BasicEther, // TODO: Need to be able to fetch correct types
            address: i.id,
        } as ConditionModule
    })

    return results as ConditionModule[]
}


export const MOCKS_EVENTS: Record[] = [
    {
        id: '1',
        createdAt: dayjs().subtract(1, 'day').format(),
        createdBy: 'wslyvh.eth',
        conditionModule: '0xBasicEtherModule',
        status: Status.Active,
        contentUri: 'ipfs://0xC1d1',
        ipfsHash: '0xC1d1',
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
        participants: [
            {
                id: 'wslyvh.eth',
                createdAt: dayjs().valueOf(),
                createdBy: 'wslyvh.eth',
                address: '0x8289432ACD5EB0214B1C2526A5EDB480Aa06A9ab',
                checkedIn: false,
            }],
    },
    {
        id: '2',
        createdAt: dayjs().subtract(2, 'day').format(),
        createdBy: 'wslyvh.eth',
        conditionModule: '0xBasicEtherModule',
        status: Status.Active,
        contentUri: 'ipfs://0xC1d2',
        ipfsHash: '0xC1d2',
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
        participants: [],
    },
    {
        id: '3',
        createdAt: dayjs().subtract(3, 'day').format(),
        createdBy: 'wslyvh.eth',
        conditionModule: '0xBasicTokenModule',
        status: Status.Cancelled,
        message: 'Event cancelled by organizer',
        contentUri: 'ipfs://0xC1dd3',
        ipfsHash: '0xC1dd3',
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
        participants: [],
    },
]