import { MapPinIcon, UserIcon } from '@heroicons/react/24/outline'
import { LinkComponent } from '@/components/LinkComponent'
import { Record } from '@/utils/types'
import Image from 'next/image'
import dayjs from 'dayjs'

interface Props {
  event: Record
}

export function Card({ event }: Props) {
  return (
    <LinkComponent href={`/events/${event.slug}`}>
      <div className='flex rounded-lg bg-neutral text-neutral-content p-4 hover:ring hover:ring-1 flex-col-reverse sm:flex-row'>
        <div className='w-full'>
          <p className='uppercase text-secondary text-sm'>
            {dayjs(event.metadata?.start).format('ddd MMM DD · HH:mm')}
          </p>
          <h2 className='text-xl font-bold mt-2'>{event.metadata?.title}</h2>
          <div className='flex flex-row items-center gap-1 text-sm mt-4 truncate'>
            <MapPinIcon className='h-5 w-5' /> {event.metadata?.location}
          </div>
          <div className='flex flex-row items-center gap-1 text-sm mt-2'>
            <UserIcon className='h-5 w-5' /> {event.registrations.length} going
            {event.limit > 0 && (
              <>
                <span> · </span>
                <span className='text-accent'>{event.limit - event.registrations.length} left</span>
              </>
            )}
          </div>
        </div>

        {event.metadata?.imageUrl && (
          <div>
            <div className='w-full h-[120px] mb-4 sm:w-[160px] sm:h-[80px] sm:mb-0'>
              <Image
                width={0}
                height='120'
                src={event.metadata?.imageUrl}
                alt={event.metadata?.title}
                placeholder='blur'
                blurDataURL='data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='
                sizes='100vw'
                className='rounded-lg w-full h-full object-cover'
              />
            </div>
          </div>
        )}
      </div>
    </LinkComponent>
  )
}
