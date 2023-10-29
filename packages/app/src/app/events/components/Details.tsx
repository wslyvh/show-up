'use client'

import { DateCard } from '@/components/Date'
import { BanknotesIcon, CalendarDaysIcon, MapPinIcon, UserIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { ConditionModuleType } from '@/utils/types'
import dayjs from 'dayjs'
import { formatEther, formatUnits } from 'viem'
import makeBlockie from 'ethereum-blockies-base64'
import { LinkComponent } from '@/components/LinkComponent'
import { AdminActions } from './Admin/Actions'
import { Register } from './Register'
import { useEventData } from '@/context/EventData'

export function EventDetails() {
  const eventData = useEventData()
  const record = eventData.record
  const event = eventData.event

  function registerButtonText() {
    if (eventData.isCancelled) return 'Event is cancelled'
    if (!eventData.isActive || eventData.hasEnded) return 'Event has ended'
    if (eventData.isParticipant) return 'Already registered'
    if (!eventData.hasBalance) return `Insufficient ${record.condition.tokenSymbol ?? 'ETH'} balance`

    return 'Attend Event'
  }

  return (
    <>
      <div className='flex flex-col bg-neutral rounded-lg'>
        <div className='w-full h-[240px]'>
          <Image
            width={0}
            height='240'
            src={event.imageUrl}
            alt='Event Image'
            sizes='100vw'
            className='rounded-t-lg w-full h-full object-cover'
          />
        </div>

        <div className='relative'>
          <div className='absolute right-8 -top-8'>
            <DateCard date={event.start} />
          </div>
        </div>

        <div className='px-4 py-8 mt-4'>
          <div className='flex flex-col mt-4 gap-2'>
            <p className='flex flex-row items-center gap-2'>
              <CalendarDaysIcon className='h-5 w-5 text-info shrink-0' />
              {dayjs(event.start).format(eventData.sameDay ? 'ddd MMM DD · HH:mm' : 'MMM DD · HH:mm')}
              {' → '}
              {dayjs(event.end).format(eventData.sameDay ? 'HH:mm' : 'MMM DD · HH:mm')}
            </p>
            <p className='flex flex-row items-center gap-2'>
              <MapPinIcon className='h-5 w-5 text-info shrink-0' />
              {event.location.startsWith('https://') && (
                <LinkComponent href={event.location} className='underline truncate hover:text-white'>{event.location}</LinkComponent>
              )}
              {!event.location.startsWith('https://') && event.location}
            </p>
            <p className='flex flex-row items-center gap-2'>
              <UserIcon className='h-5 w-5 text-info shrink-0' /> {record.participants.length} going
              {record.condition?.maxParticipants > 0 && (
                <>
                  <span> · </span>
                  <span className='text-accent'>
                    {record.condition?.maxParticipants - record.participants.length} left
                  </span>
                </>
              )}
            </p>
            <p className='flex flex-row items-center gap-2'>
              <BanknotesIcon className='h-5 w-5 text-info shrink-0' />
              {record.condition.type == ConditionModuleType.BasicEther && (
                <>{formatEther(record.condition.depositFee)} ETH</>
              )}
              {record.condition.type == ConditionModuleType.BasicToken && (
                <>
                  {formatUnits(record.condition.depositFee, record.condition.tokenDecimals ?? 18)}{' '}
                  {record.condition.tokenSymbol}
                </>
              )}
            </p>
          </div>

          <div className='mt-8'>
            {eventData.isAdmin && <AdminActions id={record.id} />}

            {!eventData.isAdmin && <Register event={record}
              buttonText={registerButtonText()}
              disabled={eventData.canRegister} />}
          </div>

          <h1 className='text-xl text-white font-bold mt-8'>{event.title}</h1>
          <p className='mt-8'>{event.description}</p>
        </div>
      </div>

      {record.participants.length > 0 && (
        <div>
          <h2 className='text-xl text-white font-bold mt-8'>Attendees</h2>

          <div className='flex flex-wrap justify-center gap-8 mt-8'>
            {record.participants.map((participant) => {
              return (
                <>
                  <div className="avatar">
                    <div className={`w-20 rounded-full ${participant.checkedIn ? 'ring ring-success ring-offset-base-100 ring-offset-2' : ''}`}>
                      <img src={makeBlockie(participant.address)} />
                    </div>
                  </div>
                </>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}
