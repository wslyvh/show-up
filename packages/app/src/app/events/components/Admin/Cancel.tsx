import { ActionDrawer } from '@/components/ActionDrawer'
import { useEventData } from '@/context/EventData'
import { LoadingState } from '@/utils/types'
import { useState } from 'react'
import { useAccount, useNetwork } from 'wagmi'
import { waitForTransaction, switchNetwork } from '@wagmi/core'
import { prepareWriteShowHub, writeShowHub } from '@/abis'
import { useQueryClient } from '@tanstack/react-query'
import { useNotifications } from '@/context/Notification'
import { CONFIG } from '@/utils/config'
import { revalidateAll } from '@/app/actions/cache'
import { Alert } from '@/components/Alert'

export function Cancel() {
  const { chain: currentChain } = useNetwork()
  const eventData = useEventData()
  const notifications = useNotifications()
  const queryClient = useQueryClient()
  const chain = CONFIG.DEFAULT_CHAINS.find((i) => i.id === eventData.record.conditionModule.chainId)
  const { address } = useAccount()
  const [reason, setReason] = useState('')
  const [state, setState] = useState<LoadingState>({
    isLoading: false,
    type: '',
    message: '',
  })
  const actionButton = (
    <button type='button' className='btn btn-secondary btn-outline btn-sm w-full' disabled={!eventData.canCancel}>
      Cancel Event
    </button>
  )

  async function Cancel() {
    if (!address || !chain) {
      setState({ ...state, isLoading: false, type: 'error', message: 'Not connected' })
      return
    }

    setState({ ...state, isLoading: true, type: 'info', message: `Cancelling event. Sign transaction` })

    try {
      const txConfig = await prepareWriteShowHub({
        chainId: chain.id as any,
        functionName: 'cancel',
        args: [eventData.record.recordId, reason, '0x'],
      })

      const { hash } = await writeShowHub(txConfig)

      setState({ ...state, isLoading: true, type: 'info', message: 'Transaction sent. Awaiting confirmation' })

      await notifications.Add({
        created: Date.now(),
        type: 'info',
        message: `Cancelling ${eventData.event.title}`,
        from: address,
        cta: {
          label: 'View transaction',
          href: `${chain?.blockExplorers?.default.url}/tx/${hash}`,
        },
        data: { hash },
      })

      const data = await waitForTransaction({
        chainId: chain.id,
        confirmations: chain.id === 11155111 ? 2 : 5,
        hash: hash,
      })

      if (data.status == 'success') {
        setState({ ...state, isLoading: false, type: 'success', message: 'Event cancelled' })

        await notifications.Add({
          created: Date.now(),
          type: 'success',
          message: `Event cancelled`,
          from: address,
          data: { hash },
        })

        await revalidateAll()
        queryClient.invalidateQueries({ queryKey: ['events'] })
        eventData.refetch()

        return
      }

      setState({ ...state, isLoading: false, type: 'error', message: 'Unable to cancel event' })
    } catch (e) {
      setState({ ...state, isLoading: false, type: 'error', message: 'Unable to cancel event' })
    }
  }

  return (
    <ActionDrawer title='Cancel Event' actionComponent={actionButton}>
      <div className='flex flex-col h-full'>
        <div className='flex-1 flex-grow'>
          <p>
            Cancelling an event is final and no changes can be made after. It removes it from the calendar and refunds
            any existing deposits.
          </p>

          <div className='form-control w-full mt-4'>
            <label className='label' htmlFor='title'>
              <span className='label-text'>Reason</span>
            </label>
            <input
              id='title'
              type='text'
              required
              className='input input-sm input-bordered w-full'
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>

        <div className='flex flex-col justify-end gap-4 mt-4'>
          {state.message && <Alert type={state.type as any} message={state.message} />}

          {currentChain && currentChain?.id !== chain?.id && (
            <button
              className='btn btn-accent btn-sm w-full'
              disabled={state.isLoading || state.type == 'success'}
              onClick={() => switchNetwork({ chainId: eventData.record.conditionModule.chainId as any })}>
              Switch Network
            </button>
          )}

          {currentChain && currentChain?.id === chain?.id && (
            <button
              type='button'
              disabled={state.isLoading || !eventData.canCancel}
              onClick={Cancel}
              className='btn btn-accent btn-sm w-full'>
              {state.isLoading && (
                <>
                  Loading
                  <span className='loading loading-spinner h-4 w-4' />
                </>
              )}
              {!state.isLoading && <>Cancel Event</>}
            </button>
          )}
        </div>
      </div>
    </ActionDrawer>
  )
}
