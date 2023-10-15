'use client'

import { PropsWithChildren, createContext, useContext, useState, } from 'react'
import { ConditionModule, ConditionModuleData, ConditionModuleType, EventMetadata } from '@/utils/types'
import { useAccount, useNetwork } from 'wagmi'
import { erc20ABI, prepareWriteContract, waitForTransaction } from '@wagmi/core'
import { AddressZero } from '@/utils/network'
import { basicEtherAddress, basicTokenAddress, prepareWriteRegistry, readBasicEther, readBasicToken, readRegistry, writeRegistry } from '@/abis'
import { encodeAbiParameters } from 'viem/utils'
import { Store, Upload } from '@/services/storage'
import { Slugify } from '@/utils/format'
import { DEFAULT_APP_ID } from '@/utils/site'
import dayjs from 'dayjs'

interface EventManagementContext {
    appId: string
    loading: boolean
    message: string
    modules: ConditionModule[]
    create: (event: EventMetadata, conditions: ConditionModuleData, image?: File) => Promise<void>
    attend: (id: string) => Promise<void>
    validateMetadata: (event: EventMetadata) => boolean
    validateConditions: (conditions: ConditionModuleData) => boolean
}

const defaultState: EventManagementContext = {
    appId: DEFAULT_APP_ID,
    loading: false,
    message: '',
    modules: [],
    create: () => Promise.resolve(),
    attend: () => Promise.resolve(),
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
        modules: [
            { type: ConditionModuleType.BasicEther, address: basicEtherAddress[chain?.id] },
            { type: ConditionModuleType.BasicToken, address: basicTokenAddress[chain?.id] }
        ],
        create,
        attend,
        validateMetadata,
        validateConditions,
    })

    async function create(event: EventMetadata, conditions: ConditionModuleData, image?: File) {
        if (!account || !chain) {
            setState({ ...state, loading: false, message: 'Not connected.' })
            return
        }
        if (!validateMetadata(event)) {
            setState({ ...state, loading: false, message: 'Invalid metadata. Please check required fields.' })
            return
        }
        if (!validateConditions(conditions)) {
            setState({ ...state, loading: false, message: 'Invalid conditions. Please check required fields.' })
            return
        }

        // Create Event
        setState({ ...state, loading: true, message: '' })

        // Upload Cover image
        if (image) {
            const cid = await Upload(image, true)
            event.imageUrl = `ipfs://${cid}` // TODO: Does this override?
        }

        // Upload Metadata
        const cid = await Store(Slugify(event.title), JSON.stringify(event), true)
        const contentUrl = `ipfs://${cid}`

        // Encode Condition module (owner, endDate, depositFee, maxParticipants, tokenAddress)
        const params = encodeAbiParameters(
            [{ type: 'address' }, { type: 'uint256' }, { type: 'uint256' }, { type: 'uint256' }, { type: 'address' }],
            [
                account,
                BigInt(dayjs(event.end).add(1, 'day').valueOf()),
                conditions.depositFee || 0,
                BigInt(conditions.maxParticipants || 0),
                conditions.tokenAddress ?? AddressZero
            ]
        )

        const preparedWrite = await prepareWriteRegistry({
            functionName: 'create',
            args: [contentUrl, getModuleAddress(conditions.type), params],
        })

        const tx = await writeRegistry(preparedWrite)
        console.log('Create Event Tx', tx.hash)

        // Send to Transaction / Notification Context to track transaction: results.hash

        setState({ ...state, loading: false, message: '' })
    }

    async function attend(id: string) {
        console.log('Attend Event', id)

        // TODO: Should fetch record and condition modules from indexer
        const record = await readRegistry({
            functionName: 'getRecord',
            args: [id],
        }) as any // TODO: Fix types
        const module = state.modules.find((m) => m.address === record.conditionModule)
        if (!module) {
            console.error('Condition Module not found')
            return
        }

        if (module.type === ConditionModuleType.BasicEther) {
            const conditionModule = await readBasicEther({
                functionName: 'getConditions',
                args: [id],
            }) as ConditionModuleData

            const params = encodeAbiParameters(
                [{ type: 'address' }], [account]
            )

            const preparedWrite = await prepareWriteRegistry({
                functionName: 'register',
                args: [id, params],
                value: conditionModule.depositFee,
            })

            const tx = await writeRegistry(preparedWrite)
            console.log('Create Event Tx', tx.hash)

            return
        }

        if (module.type === ConditionModuleType.BasicToken) {
            const conditionModule = await readBasicToken({
                functionName: 'getConditions',
                args: [id],
            }) as ConditionModuleData

            const params = encodeAbiParameters(
                [{ type: 'address' }], [account]
            )

            // Approve token first 
            const approveConfig = await prepareWriteContract({
                address: conditionModule.tokenAddress,
                abi: erc20ABI,
                functionName: 'approve',
                args: [module.address, conditionModule.depositFee],
            })
            const approveTx = await writeRegistry(approveConfig)
            const data = await waitForTransaction({
                hash: approveTx.hash
            })
            console.log('Approve Tx', approveTx.hash, data)

            const preparedWrite = await prepareWriteRegistry({
                functionName: 'register',
                args: [id, params],
            })

            const tx = await writeRegistry(preparedWrite)
            console.log('Create Event Tx', tx.hash)

            return
        }
    }

    function validateMetadata(event: EventMetadata) {
        console.log('validateMetadata', event)
        if (!event.title || !event.start || !event.end || !event.timezone || !event.location) {
            return false
        }

        return true
    }

    function validateConditions(conditions: ConditionModuleData) {
        console.log('validateConditions', conditions)
        if (!conditions.type || !conditions.depositFee || conditions.maxParticipants < 0) {
            return false
        }

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
