import dayjs from 'dayjs'
import { MapPinIcon, UserIcon } from '@heroicons/react/24/outline'
import { Record } from '@/utils/types'
import { LinkComponent } from '@/components/LinkComponent'

interface Props {
  event: Record
}

export function Card({ event }: Props) {
  return (
    <LinkComponent href={`/events/${event.id}`}>
      <div className='flex rounded-lg bg-neutral text-neutral-content p-4 hover:ring hover:ring-1'>
        <div className='w-full'>
          <p className='uppercase text-secondary text-sm'>
            {dayjs(event.metadata?.start).format('ddd MMM DD · HH:mm')}
          </p>
          <h2 className='text-xl font-bold mt-2'>{event.metadata?.title}</h2>
          <div className='flex flex-row items-center gap-1 text-sm mt-4'>
            <MapPinIcon className='h-5 w-5' /> {event.metadata?.location}
          </div>
          <div className='flex flex-row items-center gap-1 text-sm mt-2'>
            <UserIcon className='h-5 w-5' /> {event.participants.length} going
            {event.condition?.maxParticipants > 0 && (
              <>
                <span> · </span>
                <span className='text-accent'>{event.condition?.maxParticipants - event.participants.length} left</span>
              </>
            )}
          </div>
        </div>

        {event.metadata?.imageUrl && (
          <div>
            <div className='w-[160px] h-[80px]'>
              <img
                src={event.metadata?.imageUrl}
                alt={event.metadata?.title}
                className='rounded-lg w-full h-full object-cover'
              />
            </div>
          </div>
        )}
      </div>
    </LinkComponent>
  )
}
