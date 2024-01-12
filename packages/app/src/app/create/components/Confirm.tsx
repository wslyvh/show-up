'use client'

import { ActionDrawer } from '@/components/ActionDrawer'
import { CreateEventData, EventMetadata, LoadingState } from '@/utils/types'
import { GetEventBySlug, ValidateConditions, ValidateMetadata } from '@/services/showhub'
import { LinkComponent } from '@/components/LinkComponent'
import { Slugify, TruncateMiddle } from '@/utils/format'
import { useAccount, useNetwork } from 'wagmi'
import { Alert } from '@/components/Alert'
import { decodeEventLog, encodeAbiParameters } from 'viem/utils'
import { useState } from 'react'
import { Store, Upload } from '@/services/storage'
import { useNotifications } from '@/context/Notification'
import { switchNetwork, waitForTransaction } from '@wagmi/core'
import { prepareWriteShowHub, showHubABI, writeShowHub } from '@/abis'
import { WHITELISTED_TOKENS } from '@/utils/network'
import { useCreateEvent } from './CreateEventContext'
import { useQueryClient } from '@tanstack/react-query'
import { revalidateAll } from '@/app/actions/cache'
import { useRouter } from 'next/navigation'
import { CONFIG } from '@/utils/config'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import tz from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(tz)

interface Props {
  event: EventMetadata
  conditions: CreateEventData
  image?: File
}

export function Confirm(props: Props) {
  const router = useRouter()
  const { chain: currentChain } = useNetwork()
  const { modules } = useCreateEvent()
  const queryClient = useQueryClient()
  const notifications = useNotifications()
  const token = WHITELISTED_TOKENS.find((t) => t.address == props.conditions.tokenAddress)
  const chain = CONFIG.DEFAULT_CHAINS.find((i) => i.id === props.conditions.chainId)
  const conditionModule = modules.find((i) => {
    if (props.conditions.recipient && !props.conditions.tokenAddress) {
      return i.chainId === props.conditions.chainId && i.name == 'RecipientEther'
    }
    if (props.conditions.recipient && props.conditions.tokenAddress) {
      return i.chainId === props.conditions.chainId && i.name == 'RecipientToken'
    }
    if (!props.conditions.recipient && !props.conditions.tokenAddress) {
      return i.chainId === props.conditions.chainId && i.name == 'SplitEther'
    }
    if (!props.conditions.recipient && props.conditions.tokenAddress) {
      return i.chainId === props.conditions.chainId && i.name == 'SplitToken'
    }
  })
  const { address } = useAccount()
  const [state, setState] = useState<LoadingState>({
    isLoading: false,
    type: '',
    message: '',
  })
  const isValid = ValidateMetadata(props.event) && ValidateConditions(props.conditions)
  const actionButton = (
    <button type='button' className='btn btn-accent btn-outline btn-sm w-full'>
      Create Event
    </button>
  )

  async function Create() {
    if (!address || !chain) {
      setState({ ...state, isLoading: false, type: 'error', message: 'Not connected' })
      return
    }
    if (!conditionModule) {
      setState({ ...state, isLoading: false, type: 'error', message: 'Invalid condition module' })
      return
    }
    if (!isValid) {
      setState({ ...state, isLoading: false, type: 'error', message: 'Invalid metadata or conditions' })
      return
    }

    setState({ ...state, isLoading: true, type: 'info', message: 'Uploading metadata to IFPS' })

    // Upload Cover image
    if (props.image) {
      const cid = await Upload(props.image)
      props.event.imageUrl = `ipfs://${cid}`
    }

    // Upload Metadata
    const metadataWithUnix = {
      ...props.event,
      startUnix: dayjs(props.event.start, props.event.timezone).unix(),
      endUnix: dayjs(props.event.end, props.event.timezone).unix(),
    }
    const cid = await Store(Slugify(props.event.title), metadataWithUnix)
    const contentUrl = `ipfs://${cid}`

    // Encode Params
    let params: any = '0x'
    const token = WHITELISTED_TOKENS.find((t) => t.address == props.conditions.tokenAddress)
    const depositFee = BigInt(props.conditions.depositFee ** (10 * (token?.decimals ?? 18)))
    if (conditionModule.name == 'RecipientEther') {
      console.log('Encode RecipientEther params')

      params = encodeAbiParameters([{ type: 'uint256' }, { type: 'address' }], [depositFee, props.conditions.recipient])
    }
    if (conditionModule.name == 'RecipientToken') {
      console.log('Encode RecipientToken params')

      params = encodeAbiParameters(
        [{ type: 'uint256' }, { type: 'address' }, { type: 'address' }],
        [depositFee, props.conditions.tokenAddress, props.conditions.recipient]
      )
    }
    if (conditionModule.name == 'SplitEther') {
      console.log('Encode SplitEther params')

      params = encodeAbiParameters([{ type: 'uint256' }], [depositFee])
    }
    if (conditionModule.name == 'SplitToken') {
      console.log('Encode SplitToken params')

      params = encodeAbiParameters(
        [{ type: 'uint256' }, { type: 'address' }],
        [depositFee, props.conditions.tokenAddress]
      )
    }

    setState({ ...state, isLoading: true, type: 'info', message: 'Metadata uploaded. Sign transaction' })

    try {
      const txConfig = await prepareWriteShowHub({
        chainId: conditionModule.chainId as any,
        functionName: 'create',
        args: [
          contentUrl,
          BigInt(dayjs(props.conditions.endDate, props.event.timezone).unix()),
          BigInt(props.conditions.limit),
          conditionModule.address,
          params,
        ],
      })

      const { hash } = await writeShowHub(txConfig)

      setState({ ...state, isLoading: true, type: 'info', message: 'Transaction sent. Awaiting confirmation' })
      await notifications.Add({
        created: Date.now(),
        type: 'info',
        message: `Transaction sent for ${props.event.title}`,
        from: address,
        cta: {
          label: 'View transaction',
          href: `${chain?.blockExplorers?.default.url}/tx/${hash}`,
        },
        data: { hash },
      })

      const data = await waitForTransaction({
        chainId: conditionModule.chainId,
        hash: hash,
      })

      if (data.status == 'success') {
        setState({ ...state, isLoading: false, type: 'success', message: 'Event Created. Indexing' })

        const created = data.logs.length > 0 ? data.logs[0] : null
        if (created) {
          const topics = decodeEventLog({
            abi: showHubABI,
            data: created.data,
            topics: created.topics,
          })

          const slug = `${Slugify(props.event.title)}_${(topics.args as any).id}`
          let event = await GetEventBySlug(slug)
          while (!event) {
            console.log('Event not found. Retry in 1 second')
            await new Promise((r) => setTimeout(r, 1000))

            event = await GetEventBySlug(slug)
          }

          await revalidateAll()
          queryClient.invalidateQueries({ queryKey: ['events'] })

          await notifications.Add({
            created: Date.now(),
            type: 'success',
            message: `${props.event.title} created`,
            from: address,
            cta: {
              label: 'View event',
              href: `/events/${slug}`,
            },
            data: { hash },
          })

          router.push(`/events/${slug}`)
        }

        return
      }

      setState({ ...state, isLoading: false, type: 'error', message: 'Unable to create event' })
    } catch (e) {
      console.error(e)
      setState({ ...state, isLoading: false, type: 'error', message: 'Unable to create event' })
    }
  }

  return (
    <ActionDrawer title='Confirm Event' actionComponent={actionButton}>
      <div className='flex flex-col justify-between h-full'>
        <div className='flex flex-col'>
          <p>Please check and confirm all details before creating your event.</p>

          <div className='w-full divide-y divide-gray-800 text-sm gap-4 mt-4'>
            <div className='flex items-center justify-between py-2'>
              <span>Network</span>
              <span>{CONFIG.DEFAULT_CHAINS.find((i) => i.id === props.conditions.chainId)?.name}</span>
            </div>
            <div className='flex items-center justify-between py-2'>
              <span>Owner</span>
              <span>
                <LinkComponent className='underline' href={`${chain?.blockExplorers?.default.url}/address/${address}`}>
                  {TruncateMiddle(address)}
                </LinkComponent>
              </span>
            </div>
            <div className='flex items-center justify-between py-2'>
              <span>End Date</span>
              <span>{dayjs(props.event.end).format('DD MMM, HH:mm')}</span>
            </div>
            <div className='flex items-center justify-between py-2'>
              <span>Max. Participants</span>
              <span>{props.conditions.limit === 0 ? 'No limit' : props.conditions.limit}</span>
            </div>
            <div className='flex items-center justify-between py-2'>
              <span>Deposit Fee</span>
              <span>
                {props.conditions.depositFee} {token?.symbol ?? 'ETH'}
              </span>
            </div>
            <div className='flex items-center justify-between py-2'>
              <span>Module</span>
              <span>{conditionModule?.name}</span>
            </div>
            {props.conditions.recipient && (
              <div className='flex items-center justify-between py-2'>
                <span>Recipient</span>
                <span>
                  <LinkComponent
                    className='underline'
                    href={`${chain?.blockExplorers?.default.url}/address/${props.conditions.recipient}`}>
                    {TruncateMiddle(address)}
                  </LinkComponent>
                </span>
              </div>
            )}
          </div>
        </div>

        <div className='flex flex-col justify-end gap-4 mt-4'>
          {state.message && <Alert type={state.type as any} message={state.message} />}

          {!state.message && (
            <>
              <p className='text-sm'>
                ** The protocol has been thoughtfully designed, built and has been reviewed by external developers.
                However, it has not been audited yet. Check our{' '}
                <LinkComponent className='underline' href='https://github.com/wslyvh/show-up'>
                  Github
                </LinkComponent>{' '}
                for more details.
              </p>
            </>
          )}

          {currentChain && currentChain?.id !== conditionModule?.chainId && (
            <button
              className='btn btn-accent btn-sm w-full'
              disabled={!isValid || state.isLoading || state.type == 'success'}
              onClick={() => switchNetwork({ chainId: conditionModule?.chainId as any })}>
              Switch Network
            </button>
          )}

          {currentChain && currentChain?.id == conditionModule?.chainId && (
            <button
              className='btn btn-accent btn-sm w-full'
              disabled={!isValid || state.isLoading || state.type == 'success'}
              onClick={() => Create()}>
              Create Event
            </button>
          )}
        </div>
      </div>
    </ActionDrawer>
  )
}
