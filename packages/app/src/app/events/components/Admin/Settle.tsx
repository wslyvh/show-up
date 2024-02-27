import { showHubAddress, simulateShowHub, writeShowHub } from '@/abis'
import { ActionDrawer } from '@/components/ActionDrawer'
import { useEventData } from '@/context/EventData'
import { useNotifications } from '@/context/Notification'
import { CONFIG } from '@/utils/config'
import { LoadingState } from '@/utils/types'
import { useAccount } from 'wagmi'
import { useState } from 'react'
import { revalidateAll } from '@/app/actions/cache'
import { Alert } from '@/components/Alert'
import { WAGMI_CONFIG } from '@/utils/network'
import { switchChain, waitForTransactionReceipt } from 'wagmi/actions'
import { useQueryClient } from '@tanstack/react-query'

export function Settle() {
  const eventData = useEventData()
  const notifications = useNotifications()
  const queryClient = useQueryClient()
  const chain = CONFIG.DEFAULT_CHAINS.find((i) => i.id === eventData.record.conditionModule.chainId)
  const { address, chainId } = useAccount()
  const [state, setState] = useState<LoadingState>({
    isLoading: false,
    type: '',
    message: '',
  })
  const actionButton = (
    <button type='button' className='btn btn-secondary btn-outline btn-sm w-full' disabled={!eventData.canSettle}>
      Settle Event
    </button>
  )

  async function Settle() {
    if (!address || !chain) {
      setState({ ...state, isLoading: false, type: 'error', message: 'Not connected' })
      return
    }

    setState({ ...state, isLoading: true, type: 'info', message: `Settling event. Sign transaction` })

    if (chainId !== eventData.chain.id) {
      try {
        console.log(`Switching chains ${chainId} -> ${eventData.chain.id}`)
        await switchChain(WAGMI_CONFIG, { chainId: eventData.chain.id })
      } catch (e) {
        console.log('Unable to switch chains', e)
      }
    }

    try {
      const txConfig = await simulateShowHub(WAGMI_CONFIG, {
        chainId: eventData.record.conditionModule.chainId,
        address: showHubAddress,
        functionName: 'settle',
        args: [eventData.record.recordId, '0x'],
      })

      const hash = await writeShowHub(WAGMI_CONFIG, txConfig.request)

      setState({ ...state, isLoading: true, type: 'info', message: 'Transaction sent. Awaiting confirmation' })

      const data = await waitForTransactionReceipt(WAGMI_CONFIG, { hash: hash })

      if (data.status == 'success') {
        setState({ ...state, isLoading: false, type: 'success', message: 'Event settled' })

        await notifications.Add({
          created: Date.now(),
          type: 'success',
          message: `Event settled`,
          from: address,
          cta: {
            label: 'View transaction',
            href: `${chain?.blockExplorers?.default.url}/tx/${hash}`,
          },
          data: { hash },
        })

        await revalidateAll()
        queryClient.invalidateQueries({ queryKey: ['events'] })
        eventData.refetch()

        return
      }

      setState({ ...state, isLoading: false, type: 'error', message: 'Unable to settle event' })
    } catch (e) {
      setState({ ...state, isLoading: false, type: 'error', message: 'Unable to settle event' })
    }
  }

  return (
    <ActionDrawer title='Settle Event' actionComponent={actionButton}>
      <div className='flex flex-col h-full'>
        <div className='flex-1 flex-grow'>
          <p>
            Settling an event is final and no changes can be made after. Make sure you have checked in all attendees.
          </p>
        </div>

        <div className='flex flex-col justify-end gap-4 mt-4'>
          {state.message && <Alert type={state.type as any} message={state.message} />}

          <button
            type='button'
            disabled={state.isLoading || !eventData.canSettle}
            onClick={Settle}
            className='btn btn-accent btn-sm w-full'>
            {state.isLoading && (
              <>
                Loading
                <span className='loading loading-spinner h-4 w-4' />
              </>
            )}
            {!state.isLoading && <>Settle Event</>}
          </button>
        </div>
      </div>
    </ActionDrawer>
  )
}
