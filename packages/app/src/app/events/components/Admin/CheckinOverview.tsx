'use client'

import { useState } from 'react'
import { useEventData } from '@/context/EventData'
import { useAccount } from 'wagmi'
import { showHubAddress, simulateShowHub, writeShowHub } from '@/abis'
import { revalidateAll } from '@/app/actions/cache'
import { ActionDrawer } from '@/components/ActionDrawer'
import { LoadingState, Registration } from '@/utils/types'
import makeBlockie from 'ethereum-blockies-base64'
import { useNotifications } from '@/context/Notification'
import { CONFIG } from '@/utils/config'
import { Alert } from '@/components/Alert'
import { useRouter } from 'next/navigation'
import dayjs from 'dayjs'
import { useQueryClient } from '@tanstack/react-query'
import { WAGMI_CONFIG } from '@/utils/network'
import { switchChain, waitForTransactionReceipt } from 'wagmi/actions'

export function CheckinOverview() {
  const router = useRouter()
  const eventData = useEventData()
  const record = eventData.record
  const event = eventData.event
  const notifications = useNotifications()
  const queryClient = useQueryClient()
  const chain = CONFIG.DEFAULT_CHAINS.find((i) => i.id === eventData.record.conditionModule.chainId)
  const { address, chainId } = useAccount()
  const [checkins, setCheckins] = useState<string[]>([])
  const [state, setState] = useState<LoadingState>({
    isLoading: false,
    type: '',
    message: '',
  })

  if (!eventData.isAdmin) return <>Not connected</>

  function onParticipantChange(registration: Registration) {
    if (registration.participated) return

    const newCheckins = [...checkins]
    if (newCheckins.includes(registration.id)) {
      newCheckins.splice(newCheckins.indexOf(registration.id), 1)
    } else {
      newCheckins.push(registration.id)
    }
    setCheckins(newCheckins)
  }

  function toggleAllParticipants() {
    const newCheckins = [...checkins]
    if (newCheckins.length == record.registrations.length) {
      newCheckins.length = 0
    } else {
      newCheckins.length = 0
      record.registrations.forEach((i) => {
        if (!i.participated) newCheckins.push(i.id)
      })
    }
    setCheckins(newCheckins)
  }

  async function Checkin() {
    if (!address || !chain) {
      setState({ ...state, isLoading: false, type: 'error', message: 'Not connected' })
      return
    }

    setState({ ...state, isLoading: true, type: 'info', message: `Check in attendees. Sign transaction` })

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
        functionName: 'checkin',
        args: [eventData.record.recordId, checkins, '0x'],
      })

      const hash = await writeShowHub(WAGMI_CONFIG, txConfig.request)

      setState({ ...state, isLoading: true, type: 'info', message: 'Transaction sent. Awaiting confirmation' })

      const data = await waitForTransactionReceipt(WAGMI_CONFIG, { hash: hash })

      if (data.status == 'success') {
        setState({ ...state, isLoading: false, type: 'success', message: 'Attendees checked in' })

        await notifications.Add({
          created: Date.now(),
          type: 'success',
          message: `Attendees checked-in`,
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

        router.push(`/events/${eventData.record.slug}`)

        return
      }

      setState({ ...state, isLoading: false, type: 'error', message: 'Unable to check in' })
    } catch (e) {
      console.error(e)
      setState({ ...state, isLoading: false, type: 'error', message: 'Unable to check in' })
    }
  }

  const actionButton = (
    <button type='button' className='btn btn-accent btn-outline btn-sm w-full'>
      Check-in Attendees
    </button>
  )

  return (
    <div>
      <h1 className='text-xl text-white font-bold'>Check-in</h1>
      <p className='my-4'>Confirm attendees for {event.title}.</p>

      <div className='overflow-x-auto'>
        <table className='table table table-sm table-auto'>
          <thead>
            <tr>
              <th>
                <input
                  type='checkbox'
                  className='checkbox'
                  onClick={toggleAllParticipants}
                  disabled={record.registrations.filter((i) => i.participated).length == record.registrations.length}
                />
              </th>
              <th>Name</th>
              <th className='min-w-[8rem]'>Registered</th>
            </tr>
          </thead>
          <tbody>
            {record.registrations.map((i) => {
              return (
                <tr key={i.id} className='hover' onClick={() => onParticipantChange(i)}>
                  <th>
                    <label>
                      <input
                        type='checkbox'
                        className='checkbox'
                        disabled={i.participated}
                        checked={i.participated || checkins.includes(i.id)}
                        readOnly
                      />
                    </label>
                  </th>
                  <td>
                    <div className='flex items-center gap-3'>
                      <div className='avatar'>
                        <div className='w-8 rounded-full'>
                          <img src={i.avatar ?? makeBlockie(i.id)} alt={i.id} />
                        </div>
                      </div>
                      <div>
                        <div className='font-bold'>{i.name}</div>
                        <div className='text-xs opacity-50'>{i.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className='text-xs'>{dayjs(i.createdAt).format('ddd MMM DD · HH:mm')}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className='mt-4'>
        <ActionDrawer title='Check-in attendees' actionComponent={actionButton}>
          <div className='flex flex-col h-full'>
            <div className='flex-1 flex-grow'>
              <p>
                Confirm addresses to check-in. You can continue to check in more addresses later, but not
                &apos;uncheck&apos; any address.
              </p>

              <div className='form-control w-full mt-4'>
                <label className='label' htmlFor='timezone'>
                  <span className='label-text'>
                    Attendees <span className='text-accent'>*</span>
                  </span>
                </label>

                <textarea
                  className='textarea textarea-bordered w-full'
                  placeholder='Select an address..'
                  value={checkins.join('\n')}
                  rows={5}
                  readOnly
                />
              </div>
            </div>

            <div className='flex flex-col justify-end gap-4 mt-4'>
              {state.message && <Alert type={state.type as any} message={state.message} />}

              <button
                type='button'
                disabled={state.isLoading || checkins.length == 0}
                onClick={Checkin}
                className='btn btn-accent btn-sm w-full'>
                {state.isLoading && (
                  <>
                    Loading
                    <span className='loading loading-spinner h-4 w-4' />
                  </>
                )}
                {!state.isLoading && <>Check-in Attendees</>}
              </button>
            </div>
          </div>
        </ActionDrawer>
      </div>
    </div>
  )
}
