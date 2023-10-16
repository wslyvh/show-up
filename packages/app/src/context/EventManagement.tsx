'use client'

import { PropsWithChildren, createContext, useContext, useState } from 'react'
import { ConditionModule, ConditionModuleData, ConditionModuleType, EventMetadata } from '@/utils/types'
import { useAccount, useNetwork } from 'wagmi'
import { erc20ABI, prepareWriteContract, waitForTransaction } from '@wagmi/core'
import { AddressZero, DEFAULT_CHAIN_ID } from '@/utils/network'
import {
  basicEtherAddress,
  basicTokenAddress,
  prepareWriteRegistry,
  readBasicEther,
  readBasicToken,
  readRegistry,
  writeRegistry,
} from '@/abis'
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
      // TODO: Fetch modules onchain/indexer (or dynamic chainId)
      { type: ConditionModuleType.BasicEther, address: (basicEtherAddress as any)[chain?.id ?? DEFAULT_CHAIN_ID] },
      { type: ConditionModuleType.BasicToken, address: (basicTokenAddress as any)[chain?.id ?? DEFAULT_CHAIN_ID] },
    ],
    create,
    attend,
    validateMetadata,
    validateConditions,
  })

  async function create(event: EventMetadata, conditions: ConditionModuleData, image?: File) {
    console.log('Create Event on', chain?.id)
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
      const cid = await Upload(image)
      event.imageUrl = `ipfs://${cid}` // TODO: Does this override?
    }

    // Upload Metadata
    const cid = await Store(Slugify(event.title), JSON.stringify(event))
    const contentUrl = `ipfs://${cid}`

    // Encode Condition module (owner, endDate, depositFee, maxParticipants, tokenAddress)
    const params = encodeAbiParameters(
      [{ type: 'address' }, { type: 'uint256' }, { type: 'uint256' }, { type: 'uint256' }, { type: 'address' }],
      [
        account,
        BigInt(dayjs(event.end).valueOf()),
        BigInt(conditions.depositFee || 0),
        BigInt(conditions.maxParticipants || 0),
        conditions.tokenAddress ?? AddressZero
      ]
    )

    try {
      const preparedWrite = await prepareWriteRegistry({
        chainId: chain.id as any,
        functionName: 'create',
        args: [contentUrl, getModuleAddress(conditions.type), params],
      })

      const tx = await writeRegistry(preparedWrite)
      console.log('Create Event Tx', tx.hash)

      // Send to Transaction / Notification Context to track transaction: results.hash

      setState({ ...state, loading: false, message: '' })
    } catch (e) {
      console.log('Unable to create event')
      console.error(e)

      setState({ ...state, loading: false, message: 'Error creating event.' })
    }
  }

  async function attend(id: string) {
    console.log('Attend Event', id)

    // TODO: Should fetch record and condition modules from indexer
    const record = (await readRegistry({
      chainId: chain?.id as any,
      functionName: 'getRecord',
      args: [id],
    })) as any // TODO: Fix types
    const module = state.modules.find((m) => m.address === record.conditionModule)
    if (!module) {
      console.error('Condition Module not found')
      return
    }

    if (module.type === ConditionModuleType.BasicEther) {
      const conditionModule = (await readBasicEther({
        chainId: chain?.id as any,
        functionName: 'getConditions',
        args: [id],
      })) as ConditionModuleData

      const params = encodeAbiParameters([{ type: 'address' }], [account])

      const preparedWrite = await prepareWriteRegistry({
        chainId: chain?.id as any,
        functionName: 'register',
        args: [id, params],
        value: conditionModule.depositFee,
      })

      const tx = await writeRegistry(preparedWrite)
      console.log('Create Event Tx', tx.hash)

      return
    }

    if (module.type === ConditionModuleType.BasicToken) {
      const conditionModule = (await readBasicToken({
        chainId: chain?.id as any,
        functionName: 'getConditions',
        args: [id],
      })) as ConditionModuleData

      const params = encodeAbiParameters([{ type: 'address' }], [account])

      // Approve token first
      const approveConfig = await prepareWriteContract({
        chainId: chain?.id as any,
        address: conditionModule.tokenAddress,
        abi: erc20ABI,
        functionName: 'approve',
        args: [module.address, conditionModule.depositFee],
      })
      const approveTx = await writeRegistry(approveConfig)
      const data = await waitForTransaction({
        hash: approveTx.hash,
      })
      console.log('Approve Tx', approveTx.hash, data)

      const preparedWrite = await prepareWriteRegistry({
        chainId: chain?.id as any,
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
    const module = state.modules.find((m) => m.type === type)
    if (!module) {
      console.error('Condition Module not found', type)
    }

    return module?.address
  }

  if (typeof window === 'undefined') {
    return <>{props.children}</>
  }

  return <EventManagementContext.Provider value={state}>{props.children}</EventManagementContext.Provider>
}
