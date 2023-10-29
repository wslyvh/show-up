'use client'

import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from 'react'
import { ConditionModule, ConditionModuleData, ConditionModuleType, EventMetadata } from '@/utils/types'
import { useAccount, useNetwork } from 'wagmi'
import { erc20ABI, prepareWriteContract, waitForTransaction } from '@wagmi/core'
import { AddressZero } from '@/utils/network'
import { prepareWriteRegistry, writeRegistry } from '@/abis'
import { encodeAbiParameters } from 'viem/utils'
import { Store, Upload } from '@/services/storage'
import { Slugify } from '@/utils/format'
import { DEFAULT_APP_ID } from '@/utils/site'
import { GetConditionModules } from '@/services/protocol'
import { useNotifications } from './Notification'
import dayjs from 'dayjs'

interface EventManagementContext {
  appId: string
  loading: boolean
  message: string
  modules: ConditionModule[]
  Create: (event: EventMetadata, conditions: ConditionModuleData, image?: File) => Promise<void>
  Cancel: (id: string, reason?: string) => Promise<void>
  Register: (id: string, module: ConditionModuleData, participant?: string) => Promise<void>
  Checkin: (id: string, attendees: string[]) => Promise<void>
  Settle: (id: string) => Promise<void>
  validateMetadata: (event: EventMetadata) => boolean
  validateConditions: (conditions: ConditionModuleData) => boolean
}

const defaultState: EventManagementContext = {
  appId: DEFAULT_APP_ID,
  loading: false,
  message: '',
  modules: [],
  Create: () => Promise.resolve(),
  Cancel: () => Promise.resolve(),
  Register: () => Promise.resolve(),
  Checkin: () => Promise.resolve(),
  Settle: () => Promise.resolve(),
  validateMetadata: () => false,
  validateConditions: () => false,
}

export const useEventManagement = () => useContext(EventManagementContext)

const EventManagementContext = createContext(defaultState)

export function EventManagementProvider(props: PropsWithChildren) {
  const { address: account } = useAccount()
  const { chain } = useNetwork()
  const notifications = useNotifications()
  const [state, setState] = useState<EventManagementContext>({
    ...defaultState,
    modules: [],
    Create,
    Cancel,
    Register,
    Checkin,
    Settle,
    validateMetadata,
    validateConditions,
  })

  useEffect(() => {
    async function getModules() {
      const modules = await GetConditionModules({
        enabled: true,
      })

      setState({ ...state, modules })
    }

    getModules()
  }, [])

  async function Create(event: EventMetadata, conditions: ConditionModuleData, image?: File) {
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

    setState({ ...state, loading: true, message: '' })

    // Upload Cover image
    if (image) {
      const cid = await Upload(image, true)
      event.imageUrl = `ipfs://${cid}`
    }

    // Upload Metadata
    const cid = await Store(Slugify(event.title), JSON.stringify(event), true)
    const contentUrl = `ipfs://${cid}`

    // Encode Condition module (owner, endDate, depositFee, maxParticipants, tokenAddress)
    const params = encodeAbiParameters(
      [{ type: 'address' }, { type: 'uint256' }, { type: 'uint256' }, { type: 'uint256' }, { type: 'address' }],
      [
        account,
        BigInt(dayjs(event.end).unix()),
        BigInt(conditions.depositFee || 0),
        BigInt(conditions.maxParticipants || 0),
        conditions.tokenAddress ?? AddressZero,
      ]
    )

    try {
      const createConfig = await prepareWriteRegistry({
        chainId: chain.id as any,
        functionName: 'create',
        args: [contentUrl, conditions.address, params],
      })

      const createTx = await writeRegistry(createConfig)
      await sendTransactionNotification(createTx.hash, 'Creating event. It can take up to 10 mins for an event to be indexed.')

      setState({ ...state, loading: false, message: '' })
    } catch (e) {
      console.error(e)
      setState({ ...state, loading: false, message: 'Unable to create event' })
    }
  }

  async function Cancel(id: string, reason: string = '') {
    console.log('Cancel Event', id)
    if (!account || !chain) {
      setState({ ...state, loading: false, message: 'Not connected.' })
      return
    }

    setState({ ...state, loading: true, message: '' })

    try {
      const cancelConfig = await prepareWriteRegistry({
        chainId: chain.id as any,
        functionName: 'cancel',
        args: [id, reason, '0x'],
      })

      const cancelTx = await writeRegistry(cancelConfig)
      await sendTransactionNotification(cancelTx.hash, 'Cancelling event')

      setState({ ...state, loading: false, message: '' })
    } catch (e) {
      console.error(e)
      setState({ ...state, loading: false, message: 'Unable to cancel event' })
    }
  }

  async function Register(id: string, module: ConditionModuleData, participant = account) {
    console.log(`Register ${participant} for Event ${id} at ${chain?.id}`)
    if (!participant || !chain) {
      setState({ ...state, loading: false, message: 'Not connected.' })
      return
    }

    setState({ ...state, loading: true, message: '' })

    try {
      if (module.type === ConditionModuleType.BasicEther) {
        const registerConfig = await prepareWriteRegistry({
          chainId: chain?.id as any,
          functionName: 'register',
          args: [id, participant, '0x'],
          value: module.depositFee,
        })

        const registerTx = await writeRegistry(registerConfig)
        await sendTransactionNotification(registerTx.hash, 'Registering for event')

        setState({ ...state, loading: false, message: '' })
        return
      }

      if (module.type === ConditionModuleType.BasicToken) {
        // TODO: Check if user has set (enough) allowance already
        // Approve token
        const approveConfig = await prepareWriteContract({
          chainId: chain?.id as any,
          address: module.tokenAddress,
          abi: erc20ABI,
          functionName: 'approve',
          args: [module.address, module.depositFee],
        })

        const approveTx = await writeRegistry(approveConfig)
        await sendTransactionNotification(approveTx.hash, 'Approving ERC20 token')

        await waitForTransaction({ hash: approveTx.hash })

        const registerConfig = await prepareWriteRegistry({
          chainId: chain?.id as any,
          functionName: 'register',
          args: [id, participant, '0x'],
          value: BigInt(0),
        })

        const registerTx = await writeRegistry(registerConfig)
        await sendTransactionNotification(registerTx.hash, 'Registering for event')

        setState({ ...state, loading: false, message: '' })
        return
      }
    } catch (e) {
      console.error(e)
      setState({ ...state, loading: false, message: 'Unable to register for event' })
    }
  }

  async function Checkin(id: string, attendees: string[]) {
    console.log('Checkin for Event', id, attendees)

    if (!account || !chain) {
      setState({ ...state, loading: false, message: 'Not connected.' })
      return
    }

    if (attendees.length === 0) {
      setState({ ...state, loading: false, message: 'No attendees to check in' })
      return
    }

    setState({ ...state, loading: true, message: '' })

    try {
      const checkinConfig = await prepareWriteRegistry({
        chainId: chain.id as any,
        functionName: 'checkin',
        args: [id, attendees, '0x'],
      })

      const checkinTx = await writeRegistry(checkinConfig)
      await sendTransactionNotification(checkinTx.hash, `Checking in ${attendees.length} attendees`)

      setState({ ...state, loading: false, message: '' })
    } catch (e) {
      console.error(e)
      setState({ ...state, loading: false, message: 'Error checking in to event' })
    }
  }

  async function Settle(id: string) {
    console.log('Settle Event', id)

    if (!account || !chain) {
      setState({ ...state, loading: false, message: 'Not connected.' })
      return
    }

    setState({ ...state, loading: true, message: '' })

    try {
      const settleConfig = await prepareWriteRegistry({
        chainId: chain.id as any,
        functionName: 'settle',
        args: [id, '0x'],
      })

      const settleTx = await writeRegistry(settleConfig)
      await sendTransactionNotification(settleTx.hash, 'Settling event')

      setState({ ...state, loading: false, message: '' })
    } catch (e) {
      console.error(e)
      setState({ ...state, loading: false, message: 'Error checking in to event' })
    }
  }

  async function sendTransactionNotification(hash: string, message: string = 'Transaction sent') {
    await notifications.Add({
      created: Date.now(),
      type: 'info',
      message: message,
      from: account,
      cta: {
        label: 'View transaction',
        href: `${chain?.blockExplorers?.default.url}/tx/${hash}`,
      },
      data: { hash },
    })
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

  if (typeof window === 'undefined') {
    return <>{props.children}</>
  }

  return <EventManagementContext.Provider value={state}>{props.children}</EventManagementContext.Provider>
}
