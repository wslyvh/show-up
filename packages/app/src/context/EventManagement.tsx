'use client'

import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react'
import { ConditionModule, ConditionModuleData, ConditionModuleType, EventMetadata } from '@/utils/types'
import { erc20ABI, prepareWriteContract, waitForTransaction } from '@wagmi/core'
import { AddressZero } from '@/utils/network'
import { prepareWriteRegistry, writeRegistry } from '@/abis'
import { encodeAbiParameters } from 'viem/utils'
import { Store, Upload } from '@/services/storage'
import { Slugify } from '@/utils/format'
import { GetConditionModules, ValidateConditions, ValidateMetadata } from '@/services/protocol'
import { useNotifications } from './Notification'
import { useQueryClient } from '@tanstack/react-query'
import { CONFIG } from '@/utils/config'
import { useAccount } from 'wagmi'
import { revalidateAll } from '@/app/actions/cache'
import dayjs from 'dayjs'

interface EventManagementContext {
  appId: string
  loading: boolean
  message: string
  modules: ConditionModule[]
  Create: (event: EventMetadata, conditions: ConditionModuleData, image?: File) => Promise<void>
  Cancel: (id: string, reason?: string) => Promise<void>
  ApproveToken: (spender: string, tokenAddress: string, fee: bigint) => Promise<void>
  Register: (id: string, module: ConditionModuleData, participant?: string) => Promise<void>
  Checkin: (id: string, attendees: string[]) => Promise<void>
  Settle: (id: string) => Promise<void>
}

const defaultState: EventManagementContext = {
  appId: CONFIG.DEFAULT_APP_ID,
  loading: false,
  message: '',
  modules: [],
  Create: () => Promise.resolve(),
  Cancel: () => Promise.resolve(),
  ApproveToken: () => Promise.resolve(),
  Register: () => Promise.resolve(),
  Checkin: () => Promise.resolve(),
  Settle: () => Promise.resolve(),
}

export const useEventManagement = () => useContext(EventManagementContext)

const EventManagementContext = createContext(defaultState)

export function EventManagementProvider(props: PropsWithChildren) {
  const { address: account } = useAccount()
  const notifications = useNotifications()
  const queryClient = useQueryClient()
  const [state, setState] = useState<EventManagementContext>({
    ...defaultState,
    modules: [],
    Create,
    Cancel,
    ApproveToken,
    Register,
    Checkin,
    Settle,
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
    console.log('Create Event', event.title, conditions.type)

    if (!account) {
      setState({ ...state, loading: false, message: 'Not connected.' })
      return
    }
    if (!ValidateMetadata(event)) {
      setState({ ...state, loading: false, message: 'Invalid metadata. Please check required fields.' })
      return
    }
    if (!ValidateConditions(conditions)) {
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
        chainId: CONFIG.DEFAULT_CHAIN_ID as any,
        functionName: 'create',
        args: [contentUrl, conditions.address, params],
      })

      const createTx = await writeRegistry(createConfig)
      await sendTransactionNotification(createTx.hash, 'Creating event')

      setState({ ...state, loading: false, message: 'Event Created' })
    } catch (e) {
      console.error(e)
      setState({ ...state, loading: false, message: 'Unable to create event' })
    }
  }

  async function Cancel(id: string, reason: string = '') {
    console.log('Cancel Event', id)
    if (!account) {
      setState({ ...state, loading: false, message: 'Not connected.' })
      return
    }

    setState({ ...state, loading: true, message: '' })

    try {
      const cancelConfig = await prepareWriteRegistry({
        chainId: CONFIG.DEFAULT_CHAIN_ID as any,
        functionName: 'cancel',
        args: [id, reason, '0x'],
      })

      const cancelTx = await writeRegistry(cancelConfig)
      await sendTransactionNotification(cancelTx.hash, 'Cancelling event')
    } catch (e) {
      console.error(e)
      setState({ ...state, loading: false, message: 'Unable to cancel event' })
      return
    }

    setState({ ...state, loading: false, message: '' })
    revalidateCache()
  }

  async function ApproveToken(spender: string, tokenAddress: string, fee: bigint) {
    console.log('Approve Token', spender, tokenAddress, fee)
    if (!account) {
      setState({ ...state, loading: false, message: 'Not connected.' })
      return
    }

    setState({ ...state, loading: true, message: '' })

    const approveConfig = await prepareWriteContract({
      chainId: CONFIG.DEFAULT_CHAIN_ID as any,
      address: tokenAddress,
      abi: erc20ABI,
      functionName: 'approve',
      args: [spender, fee],
    })

    const approveTx = await writeRegistry(approveConfig)
    await sendTransactionNotification(approveTx.hash, 'Approving ERC20 token')

    await waitForTransaction({ hash: approveTx.hash })
    setState({ ...state, loading: false, message: '' })
  }

  async function Register(id: string, module: ConditionModuleData, participant = account) {
    console.log(`Register ${participant} for Event ${id}`)
    if (!participant) {
      setState({ ...state, loading: false, message: 'Not connected.' })
      return
    }

    setState({ ...state, loading: true, message: '' })

    try {
      if (module.type === ConditionModuleType.BasicEther) {
        const registerConfig = await prepareWriteRegistry({
          chainId: CONFIG.DEFAULT_CHAIN_ID as any,
          functionName: 'register',
          args: [id, participant, '0x'],
          value: module.depositFee,
        })

        const registerTx = await writeRegistry(registerConfig)
        await sendTransactionNotification(registerTx.hash, 'Registering for event')
      }

      if (module.type === ConditionModuleType.BasicToken) {
        // TODO: Check if user has set (enough) allowance already
        // const allowance = readContract(
        //   {
        //     chainId: CONFIG.DEFAULT_CHAIN_ID,
        //     address: tokenAddress,
        //     abi: erc20ABI,
        //     functionName: "allowance",
        //     args: [owner, spender],
        //   })

        // // Approve token
        // const approveConfig = await prepareWriteContract({
        //   chainId: CONFIG.DEFAULT_CHAIN_ID as any,
        //   address: module.tokenAddress,
        //   abi: erc20ABI,
        //   functionName: 'approve',
        //   args: [module.address, module.depositFee],
        // })

        // const approveTx = await writeRegistry(approveConfig)
        // await sendTransactionNotification(approveTx.hash, 'Approving ERC20 token')

        // await waitForTransaction({ hash: approveTx.hash })

        const registerConfig = await prepareWriteRegistry({
          chainId: CONFIG.DEFAULT_CHAIN_ID as any,
          functionName: 'register',
          args: [id, participant, '0x'],
          value: BigInt(0),
        })

        const registerTx = await writeRegistry(registerConfig)
        await sendTransactionNotification(registerTx.hash, 'Registering for event')
      }
    } catch (e) {
      console.error(e)
      setState({ ...state, loading: false, message: 'Unable to register for event' })
    }

    setState({ ...state, loading: false, message: '' })
    revalidateCache()
  }

  async function Checkin(id: string, attendees: string[]) {
    console.log('Checkin for Event', id, attendees)

    if (!account) {
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
        chainId: CONFIG.DEFAULT_CHAIN_ID as any,
        functionName: 'checkin',
        args: [id, attendees, '0x'],
      })

      const checkinTx = await writeRegistry(checkinConfig)
      await sendTransactionNotification(checkinTx.hash, `Checking in ${attendees.length} attendees`)
    } catch (e) {
      console.error(e)
      setState({ ...state, loading: false, message: 'Error checking in to event' })
      return
    }

    setState({ ...state, loading: false, message: '' })
    revalidateCache()
  }

  async function Settle(id: string) {
    console.log('Settle Event', id)

    if (!account) {
      setState({ ...state, loading: false, message: 'Not connected.' })
      return
    }

    setState({ ...state, loading: true, message: '' })

    try {
      const settleConfig = await prepareWriteRegistry({
        chainId: CONFIG.DEFAULT_CHAIN_ID as any,
        functionName: 'settle',
        args: [id, '0x'],
      })

      const settleTx = await writeRegistry(settleConfig)
      await sendTransactionNotification(settleTx.hash, 'Settling event')
    } catch (e) {
      console.error(e)
      setState({ ...state, loading: false, message: 'Error checking in to event' })
      return
    }

    setState({ ...state, loading: false, message: '' })
    revalidateCache()
  }

  async function sendTransactionNotification(hash: string, message: string = 'Transaction sent') {
    await notifications.Add({
      created: Date.now(),
      type: 'info',
      message: message,
      from: account,
      cta: {
        label: 'View transaction',
        href: `${CONFIG.DEFAULT_CHAIN.blockExplorers?.default.url}/tx/${hash}`,
      },
      data: { hash },
    })
  }

  async function revalidateCache() {
    await revalidateAll()
    queryClient.invalidateQueries({ queryKey: ['events'] })
  }

  if (typeof window === 'undefined') {
    return <>{props.children}</>
  }

  return <EventManagementContext.Provider value={state}>{props.children}</EventManagementContext.Provider>
}
