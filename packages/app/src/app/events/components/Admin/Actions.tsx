import { LinkComponent } from '@/components/LinkComponent'
import { Cancel } from './Cancel'
import { Settle } from './Settle'

interface Props {
  id: string
}

export function AdminActions(props: Props) {
  return (
    <div className='flex flex-col gap-2'>
      <Cancel id={props.id} />
      <LinkComponent href={`/events/${props.id}/admin`}>
        <button type='button' className='btn btn-accent btn-outline btn-sm w-full'>
          Check-in Attendees
        </button>
      </LinkComponent>
      <Settle id={props.id} />
    </div>
  )
}
