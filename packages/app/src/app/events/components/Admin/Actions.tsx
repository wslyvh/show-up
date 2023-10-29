import { Cancel } from './Cancel'
import { Checkin } from './Checkin'
import { Settle } from './Settle'

interface Props {
  id: string
}

export function AdminActions(props: Props) {
  return (
    <div className='flex flex-col gap-2'>
      <Cancel id={props.id} />
      <Checkin id={props.id} />
      <Settle id={props.id} />
    </div>
  )
}
