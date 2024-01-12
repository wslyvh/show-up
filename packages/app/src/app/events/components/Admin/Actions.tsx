import { LinkComponent } from '@/components/LinkComponent'
import { Record } from '@/utils/types'
import { Cancel } from './Cancel'
import { Settle } from './Settle'

interface Props {
  record: Record
}

export function AdminActions({ record }: Props) {
  return (
    <div className='flex flex-col gap-2'>
      <Cancel />
      <LinkComponent href={`/events/${record.slug}/admin`}>
        <button type='button' className='btn btn-accent btn-outline btn-sm w-full'>
          Check-in Attendees
        </button>
      </LinkComponent>
      <Settle />
    </div>
  )
}
