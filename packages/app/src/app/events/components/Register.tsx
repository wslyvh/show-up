'use client'

import { ActionDrawer } from '@/components/ActionDrawer'
import { LinkComponent } from '@/components/LinkComponent'
import { useEventData } from '@/context/EventData'
import { useNotifications } from '@/context/Notification'
import { useAllowance } from '@/hooks/useAllowance'
import { CONFIG } from '@/utils/config'
import { TruncateMiddle } from '@/utils/format'
import { useQueryClient } from '@tanstack/react-query'
import { WHITELISTED_TOKENS } from '@/utils/network'
import { LoadingState, Record } from '@/utils/types'
import { formatUnits } from 'viem/utils'
import { useAccount, useNetwork } from 'wagmi'
import { useState } from 'react'
import { prepareWriteShowHub, writeShowHub } from '@/abis'
import { revalidateAll } from '@/app/actions/cache'
import { waitForTransaction, switchNetwork } from '@wagmi/core'
import { Alert } from '@/components/Alert'

interface Props {
  event: Record
  buttonText: string
  disabled?: boolean
}

export function Register(props: Props) {
  const { chain: currentChain } = useNetwork()
  const eventData = useEventData()
  const queryClient = useQueryClient()
  const notifications = useNotifications()
  const token = WHITELISTED_TOKENS.find((t) => t.address == props.event.conditionModuleData.tokenAddress)
  const chain = CONFIG.DEFAULT_CHAINS.find((i) => i.id === props.event.conditionModule.chainId)
  const { address: connectedAddress } = useAccount()
  const [address, setAddress] = useState(connectedAddress)
  const [state, setState] = useState<LoadingState>({
    isLoading: false,
    type: '',
    message: '',
  })
  const { allowance, refetch } = useAllowance(
    address,
    props.event.conditionModuleId,
    props.event.conditionModuleData.tokenAddress
  )
  const actionButton = (
    <button type='button' disabled={props.disabled} className='btn btn-accent btn-outline btn-sm w-full'>
      {props.buttonText}
    </button>
  )

  async function Approve() {
    if (!address || !chain) {
      setState({ ...state, isLoading: false, type: 'error', message: 'Not connected' })
      return
    }

    setState({ ...state, isLoading: true, type: 'info', message: `Registering ${address}` })

    // eventManagement.ApproveToken(
    //   props.event.conditionModuleId,
    //   props.event.conditionModuleData.tokenAddress!,
    //   BigInt(props.event.conditionModuleData.depositFee)
    // )
    // await refetch()
  }

  async function Register() {
    if (!address || !chain) {
      setState({ ...state, isLoading: false, type: 'error', message: 'Not connected' })
      return
    }

    setState({ ...state, isLoading: true, type: 'info', message: `Registering for event. Sign transaction` })

    try {
      if (props.event.conditionModuleData.tokenAddress) {
        // make sure token is approved before registration first
      }

      console.log('PREPARE REGISTER TX', props.event.conditionModule.name, props.event.conditionModuleData)
      const txConfig = await prepareWriteShowHub({
        chainId: chain.id as any,
        functionName: 'register',
        args: [props.event.recordId, address, '0x'],
        value: props.event.conditionModuleData.tokenAddress
          ? BigInt(0)
          : BigInt(props.event.conditionModuleData.depositFee),
      })
      console.log('PROPS', txConfig)

      const { hash } = await writeShowHub(txConfig)

      setState({ ...state, isLoading: true, type: 'info', message: 'Transaction sent. Awaiting confirmation' })

      await notifications.Add({
        created: Date.now(),
        type: 'info',
        message: `Registering for ${props.event.metadata.title}`,
        from: address,
        cta: {
          label: 'View transaction',
          href: `${chain?.blockExplorers?.default.url}/tx/${hash}`,
        },
        data: { hash },
      })

      const data = await waitForTransaction({
        chainId: chain.id,
        hash: hash,
      })

      if (data.status == 'success') {
        setState({ ...state, isLoading: false, type: 'success', message: 'Successfully registered' })

        await notifications.Add({
          created: Date.now(),
          type: 'success',
          message: `Succesfully registered`,
          from: address,
          cta: {
            label: 'View event',
            href: `/events/${props.event.id}`,
          },
          data: { hash },
        })

        await revalidateAll()
        queryClient.invalidateQueries({ queryKey: ['events'] })

        return
      }

      setState({ ...state, isLoading: false, type: 'error', message: 'Unable to register for event' })
    } catch (e) {
      console.error(e)
      setState({ ...state, isLoading: false, type: 'error', message: 'Unable to register for event' })
    }
  }

  return (
    <ActionDrawer title='Register' actionComponent={actionButton}>
      <div className='flex flex-col justify-between h-full'>
        <div className='flex flex-col'>
          <p>
            You&apos;re registering for <strong>{props.event.metadata?.title}</strong>.
          </p>

          <div className='w-full divide-y divide-gray-800 text-sm gap-4 mt-4'>
            <div className='flex items-center justify-between py-2'>
              <span>Network</span>
              <span>{CONFIG.DEFAULT_CHAINS.find((i) => i.id === chain?.id)?.name}</span>
            </div>
            <div className='flex items-center justify-between py-2'>
              <span>Organizer</span>
              <span>
                <LinkComponent
                  className='underline'
                  href={`${chain?.blockExplorers?.default.url}/address/${props.event.createdBy}`}>
                  {TruncateMiddle(props.event.createdBy)}
                </LinkComponent>
              </span>
            </div>
            <div className='flex items-center justify-between py-2'>
              <span>Available Spots</span>
              <span>
                {props.event.registrations.length}
                {' / '}
                {props.event.limit > 0 ? props.event.limit : 'unlimited'}
              </span>
            </div>
            <div className='flex items-center justify-between py-2'>
              <span>Deposit Fee</span>
              <span>
                {formatUnits(
                  BigInt(props.event.conditionModuleData.depositFee),
                  props.event.conditionModuleData.tokenDecimals ?? 18
                )}{' '}
                {props.event.conditionModuleData.tokenSymbol}
              </span>
            </div>
            {props.event.conditionModuleData.tokenAddress && (
              <div className='flex items-center justify-between py-2'>
                <span>Current Allowance</span>
                <span>{formatUnits(allowance ?? 0, props.event.conditionModuleData.tokenDecimals ?? 18)}</span>
              </div>
            )}
            <p className='pt-4'>* Your deposit will be returned if you check in or if the event is cancelled.</p>
          </div>
        </div>

        <div className='flex flex-col justify-end gap-4 mt-4'>
          {state.message && <Alert type={state.type as any} message={state.message} />}

          {eventData.isParticipant && (
            <button type='button' className='btn btn-accent btn-sm w-full' disabled>
              Already registered
            </button>
          )}

          {currentChain && currentChain?.id !== chain?.id && (
            <button
              className='btn btn-accent btn-sm w-full'
              disabled={state.isLoading || state.type == 'success'}
              onClick={() => switchNetwork({ chainId: props.event.conditionModule.chainId as any })}>
              Switch Network
            </button>
          )}

          {currentChain &&
            currentChain?.id == chain?.id &&
            allowance < BigInt(props.event.conditionModuleData.depositFee) &&
            (props.event.conditionModule.name == 'RecipientToken' ||
              props.event.conditionModule.name == 'SplitToken') &&
            !eventData.isParticipant && (
              <>
                <p>
                  You need to approve the contract first to spend{' '}
                  {formatUnits(
                    BigInt(props.event.conditionModuleData.depositFee),
                    props.event.conditionModuleData.tokenDecimals ?? 18
                  )}{' '}
                  {props.event.conditionModuleData.tokenSymbol}. You can register for the event after.
                </p>

                {/* <button
                  type='button'
                  disabled={eventManagement.loading}
                  onClick={approve}
                  className='btn btn-accent btn-sm w-full'>
                  {eventManagement.loading && (
                    <>
                      Loading
                      <span className='loading loading-spinner h-4 w-4' />
                    </>
                  )}
                  {!eventManagement.loading && <>Approve</>}
                </button> */}
              </>
            )}

          {currentChain &&
            currentChain?.id == chain?.id &&
            (allowance >= BigInt(props.event.conditionModuleData.depositFee) ||
              props.event.conditionModule.name == 'RecipientEther' ||
              props.event.conditionModule.name == 'SplitEther') &&
            !eventData.isParticipant && (
              <button
                type='button'
                disabled={eventData.isParticipant}
                onClick={Register}
                className='btn btn-accent btn-sm w-full'>
                <>Register</>
              </button>
            )}
        </div>
      </div>
    </ActionDrawer>
  )
}
