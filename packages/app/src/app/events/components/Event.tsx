'use client'

import { DateCard } from '@/components/Date'
import { CalendarDaysIcon, MapPinIcon, UserIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { EventMetadata, Record, Status } from '@/utils/types'
import dayjs from 'dayjs'
import { useEventManagement } from '@/context/EventManagement'
import { Alert } from '@/components/Alert'
import { useAccount } from 'wagmi'

interface Props {
  record: Record
  event: EventMetadata
}

export function EventDetails(props: Props) {
  const { address } = useAccount()
  const eventManagement = useEventManagement()
  const sameDay = dayjs(props.event.start).isSame(props.event.end, 'day')
  const isCancelled = Status[props.record.status.valueOf()] == Status.Cancelled.toString()
  const isActive = Status[props.record.status.valueOf()] == Status.Active.toString() && dayjs().isBefore(props.event.end)
  const isAdmin = props.record.createdBy.toLowerCase() === address?.toLowerCase()
  const isParticipant = props.record.participants.map(i => i.address.toLowerCase()).includes(address?.toLowerCase())
  console.log('Conditions', sameDay, isActive, isCancelled, isAdmin, isParticipant)

  return (
    <>
      {isCancelled && <Alert type='error' message={props.record.message || 'This event has been cancelled'} className='my-4' />}

      <div className='flex flex-col bg-neutral rounded-lg'>
        <div className='w-full h-[240px]'>
          <Image
            width={0}
            height='240'
            src={props.event.imageUrl}
            alt='Event Image'
            sizes='100vw'
            className='rounded-t-lg w-full h-full object-cover'
          />
        </div>

        <div className='relative'>
          <div className='absolute right-16 -top-8'>
            <DateCard date={props.event.start} />
          </div>
        </div>

        <div className='mt-2 p-8'>
          <h1 className='text-xl text-white font-bold'>{props.event.title}</h1>
          <div className='flex flex-col mt-4 gap-2'>
            <p className='flex flex-row items-center gap-2'>
              <CalendarDaysIcon className='h-5 w-5 text-info' /> {dayjs(props.event.start).format('ddd MMM DD · HH:mm')} -{' '}
              {dayjs(props.event.end).format(sameDay ? 'HH:mm' : 'ddd MMM DD · HH:mm')}
            </p>
            <p className='flex flex-row items-center gap-2'>
              <MapPinIcon className='h-5 w-5 text-info' /> {props.event.location}
            </p>
            <p className='flex flex-row items-center gap-2'>
              <UserIcon className='h-5 w-5  text-info' /> {props.record.participants.length} going
              {props.record.condition?.maxParticipants > 0 && (
                <>
                  <span> · </span>
                  <span className='text-accent'>{props.record.condition?.maxParticipants - props.record.participants.length} left</span>
                </>
              )}
            </p>
          </div>

          <div className='relative'>
            <div className='absolute right-8 -top-8'>
              <button type='button'
                disabled={!isActive}
                onClick={() => eventManagement.Register(props.record.id, props.record.condition)}
                className='btn btn-accent btn-outline btn-sm'>
                &nbsp;Attend&nbsp;
              </button>
            </div>
          </div>

          <p className='mt-8'>{props.event.description}</p>
        </div>
      </div>
    </>
  )
}
