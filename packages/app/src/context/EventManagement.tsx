'use client'

import { PropsWithChildren, createContext, useContext, useState, } from 'react'
import { ConditionModule, ConditionModuleData, ConditionModuleType, EventMetadata } from '@/utils/types'
import { useAccount, useNetwork } from 'wagmi'
import { AddressZero } from '@/utils/network'
import dayjs from 'dayjs'
import { basicEtherAddress, basicTokenAddress, prepareWriteRegistry, writeRegistry } from '@/abis'
import { encodeAbiParameters, parseUnits } from 'viem/utils'
import { Store, Upload, Verify } from '@/services/storage'
import { Slugify } from '@/utils/format'
import { DEFAULT_APP_ID } from '@/utils/site'

interface EventManagementState {
    event: EventMetadata
    conditions: ConditionModuleData
    modules: ConditionModule[]
    image?: File
}

interface EventManagementContext extends EventManagementState {
    onChange: (state: EventManagementState) => void
    create: (event: EventManagementState) => Promise<void>
    validateMetadata: () => boolean
    validateConditions: () => boolean
}

const defaultState: EventManagementContext = {
    event: {} as EventMetadata,
    conditions: {} as ConditionModuleData,
    modules: [],
    onChange: () => { },
    create: async (state: EventManagementState) => { },
    validateMetadata: () => false,
    validateConditions: () => false,
}

export const useEventManagement = () => useContext(EventManagementContext)

const EventManagementContext = createContext(defaultState)

export function EventManagementProvider(props: PropsWithChildren) {
    const { address: account } = useAccount()
    const { chain } = useNetwork()
    const [state, setState] = useState<EventManagementContext>({
        ...defaultState,
        event: {
            appId: DEFAULT_APP_ID,
            title: '',
            description: '',
            start: dayjs().hour(10).minute(0).second(0).format('YYYY-MM-DDTHH:mm:ss'),
            end: dayjs().hour(13).minute(0).second(0).format('YYYY-MM-DDTHH:mm:ss'),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            location: '',
            website: '',
            imageUrl: '',
            links: [],
            tags: [],
        },
        conditions: {
            type: ConditionModuleType.BasicEther,
            address: basicEtherAddress[chain?.id],
            endDate: '', // use event.endDate as default 
            depositFee: parseUnits('0.02', 18),
            maxParticipants: 0,
            tokenAddress: AddressZero,
        },
        modules: [
            { type: ConditionModuleType.BasicEther, address: basicEtherAddress[chain?.id] },
            { type: ConditionModuleType.BasicToken, address: basicTokenAddress[chain?.id] }
        ],
        onChange,
        create,
        validateMetadata,
        validateConditions,
    })

    function onChange(state: EventManagementState) {
        setState((prevState) => {
            return {
                ...prevState,
                ...state,
            }
        })
    }

    async function create(state: EventManagementState) {
        console.log('TEST Create Event', state)

        // TODO: Validate event data
        if (!account || !chain) return
        // --

        // Upload media
        let imageUrl = ''
        if (state.image) {
            const cid = await Upload(state.image, true)
            imageUrl = `ipfs://${cid}`
        }

        // Upload Metadata
        let metadata = state.event
        if (imageUrl) {
            metadata = {
                ...state.event,
                imageUrl,
            }
        }

        const cid = await Store(Slugify(metadata.title), JSON.stringify(metadata), true)
        const contentUrl = `ipfs://${cid}`

        // Encode Condition module (owner, endDate, depositFee, maxParticipants, tokenAddress)
        const params = encodeAbiParameters(
            [{ type: 'address' }, { type: 'uint256' }, { type: 'uint256' }, { type: 'uint256' }, { type: 'address' }],
            [
                account,
                BigInt(dayjs(state.event.end).valueOf()),
                state.conditions.depositFee,
                BigInt(state.conditions.maxParticipants),
                state.conditions.tokenAddress ?? AddressZero
            ]
        )

        const preparedWrite = await prepareWriteRegistry({
            functionName: 'create',
            args: [contentUrl, getModuleAddress(state.conditions.type), params],
        })

        const tx = await writeRegistry(preparedWrite)
        console.log('Create Event Tx', tx.hash)

        // Send to Transaction / Notification Context to track transaction: results.hash
    }

    function validateMetadata() {
        return true
    }

    function validateConditions() {
        return true
    }

    function getModuleAddress(type: ConditionModuleType) {
        if (!chain) return ''

        return state.modules.find((m) => m.type === type)?.address
    }

    if (typeof window === 'undefined') {
        return <>{props.children}</>
    }

    return (
        <EventManagementContext.Provider value={state}>
            {props.children}
        </EventManagementContext.Provider>
    )
}
