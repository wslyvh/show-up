import { LinkComponent } from '@/components/LinkComponent'
import { Record } from '@/utils/types'
import { Cancel } from './Cancel'
import { Settle } from './Settle'
import { useEventData } from '@/context/EventData'

interface Props {
  record: Record
}

export function AdminActions({ record }: Props) {
  const eventData = useEventData()

  return (
    <div className='flex flex-col gap-2 my-8'>
      <Cancel />
      {eventData.isActive && (
        <LinkComponent href={`/events/${record.slug}/admin`}>
          <button type='button' className='btn btn-secondary btn-outline btn-sm w-full'>
            Check-in Attendees
          </button>
        </LinkComponent>
      )}
      {!eventData.isActive && (
        <button type='button' className='btn btn-secondary btn-outline btn-sm w-full' disabled={true}>
          Check-in Attendees
        </button>
      )}
      <Settle />
    </div>
  )
}
