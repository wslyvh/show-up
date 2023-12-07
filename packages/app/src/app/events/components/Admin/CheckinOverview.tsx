'use client'

import { useState } from 'react'
import { useEventData } from '@/context/EventData'
import { useAccount } from 'wagmi'
import dayjs from 'dayjs'
import { Participant } from '@/utils/types'
import { ActionDrawer } from '@/components/ActionDrawer'
import { useEventManagement } from '@/context/EventManagement'

export function CheckinOverview() {
  const eventManagement = useEventManagement()
  const eventData = useEventData()
  const record = eventData.record
  const event = eventData.event
  const [checkins, setCheckins] = useState<string[]>([])

  if (!eventData.isAdmin) return <>Not connected</>

  function onParticipantChange(participant: Participant) {
    if (participant.checkedIn) return

    const newCheckins = [...checkins]
    if (newCheckins.includes(participant.address)) {
      newCheckins.splice(newCheckins.indexOf(participant.address), 1)
    } else {
      newCheckins.push(participant.address)
    }
    setCheckins(newCheckins)
  }

  const actionButton = (
    <button type='button' className='btn btn-accent btn-outline btn-sm w-full'>
      Check-in Attendees
    </button>
  )

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table table table-sm table-auto">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th className='min-w-[8rem]'>Registered</th>
            </tr>
          </thead>
          <tbody>
            {record.participants.map((participant) => {
              return (
                <tr key={participant.address} className="hover" onClick={() => onParticipantChange(participant)}>
                  <th>
                    <label>
                      <input type="checkbox" className="checkbox" disabled={participant.checkedIn} checked={participant.checkedIn || checkins.includes(participant.address)} readOnly />
                    </label>
                  </th>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-8 rounded-full">
                          <img src={participant.profile.avatar} alt={participant.address} />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{participant.profile.name}</div>
                        <div className="text-xs opacity-50">{participant.profile.address}</div>
                      </div>
                    </div>
                  </td>
                  <td className='text-xs'>{dayjs(participant.createdAt).format('ddd MMM DD · HH:mm')}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className='mt-4'>
        <ActionDrawer title="Check-in attendees" actionComponent={actionButton}>
          <div className='flex flex-col h-full'>
            <div className='flex-1 flex-grow'>
              <p>Confirm addresses to check-in. You can continue to check in more addresses later, but not 'uncheck' any address.</p>

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

            <div>
              <button
                type='button'
                disabled={eventManagement.loading || checkins.length == 0}
                onClick={() => eventManagement.Checkin(record.id, checkins)}
                className='btn btn-accent btn-sm w-full'>
                {eventManagement.loading && (
                  <>
                    Loading
                    <span className='loading loading-spinner h-4 w-4' />
                  </>
                )}
                {!eventManagement.loading && <>Check-in Attendees</>}
              </button>
            </div>
          </div>
        </ActionDrawer>
      </div>
    </div>
  )
}
