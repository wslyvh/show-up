import { ActionDrawer } from '@/components/ActionDrawer'
import { useEventManagement } from '@/context/EventManagement'
import { useState } from 'react'

interface Props {
  id: string
}

export function Checkin(props: Props) {
  const eventManagement = useEventManagement()
  const [attendees, setAttendees] = useState<string[]>([])
  const actionButton = (
    <button type='button' className='btn btn-accent btn-outline btn-sm w-full'>
      Check-in Attendees
    </button>
  )

  function onAttendeeChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (!e.target.value) return

    setAttendees(e.target.value.split('\n'))
  }

  return (
    <ActionDrawer title='Check-in attendees' actionComponent={actionButton}>
      <div className='flex flex-col h-full'>
        <div className='flex-1 flex-grow'>
          <p>
            Provide a list of addresses to check-in. Addresses must have registered before being able to check them in.
            You can continue to check in address after this.
          </p>

          <div className='form-control w-full mt-4'>
            <label className='label' htmlFor='timezone'>
              <span className='label-text'>
                Attendees <span className='text-accent'>*</span>
              </span>
            </label>

            <textarea
              className='textarea textarea-bordered w-full'
              placeholder='One address per line..'
              onChange={onAttendeeChange}
            />
          </div>
        </div>

        <div>
          <button
            type='button'
            disabled={eventManagement.loading}
            onClick={() => eventManagement.Checkin(props.id, attendees)}
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
  )
}
