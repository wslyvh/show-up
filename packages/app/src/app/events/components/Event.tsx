'use client'

import { DateCard } from '@/components/Date'
import { BanknotesIcon, CalendarDaysIcon, MapPinIcon, UserIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { ConditionModuleType, EventMetadata, Record, Status } from '@/utils/types'
import dayjs from 'dayjs'
import { useEventManagement } from '@/context/EventManagement'
import { Alert } from '@/components/Alert'
import { useAccount } from 'wagmi'
import { formatEther, formatUnits } from 'viem'
import { useState } from 'react'

interface Props {
  record: Record
  event: EventMetadata
}

export function EventDetails(props: Props) {
  const { address } = useAccount()
  const eventManagement = useEventManagement()
  const [reason, setReason] = useState('')
  const [attendees, setAttendees] = useState<string[]>([])
  const sameDay = dayjs(props.event.start).isSame(props.event.end, 'day')
  const hasEnded = dayjs().isAfter(dayjs((props.record.metadata?.end ?? '').valueOf()))
  const hasAttendees = props.record.participants.filter((i) => !!i.checkedIn).length > 0
  const isCancelled = Status[props.record.status.valueOf()] == Status.Cancelled.toString()
  const isActive = Status[props.record.status.valueOf()] == Status.Active.toString()
  const isSettled = Status[props.record.status.valueOf()] == Status.Settled.toString()
  const isAdmin = props.record.createdBy.toLowerCase() === address?.toLowerCase()
  const isParticipant = props.record.participants.map((i) => i.address.toLowerCase()).includes(address?.toLowerCase())

  function onAttendeeChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (!e.target.value) return

    setAttendees(e.target.value.split('\n'))
  }

  return (
    <>
      {isCancelled && (
        <Alert type='error' message={props.record.message || 'This event has been cancelled'} className='my-4' />
      )}

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
          <div className='absolute right-8 -top-8'>
            <DateCard date={props.event.start} />
          </div>
        </div>

        <div className=' p-8'>
          <div className='flex flex-col mt-4 gap-2'>
            <p className='flex flex-row items-center gap-2'>
              <CalendarDaysIcon className='h-5 w-5 text-info' /> {dayjs(props.event.start).format('ddd MMM DD · HH:mm')}{' '}
              - {dayjs(props.event.end).format(sameDay ? 'HH:mm' : 'ddd MMM DD · HH:mm')}
            </p>
            <p className='flex flex-row items-center gap-2'>
              <MapPinIcon className='h-5 w-5 text-info' /> {props.event.location}
            </p>
            <p className='flex flex-row items-center gap-2'>
              <UserIcon className='h-5 w-5  text-info' /> {props.record.participants.length} going
              {props.record.condition?.maxParticipants > 0 && (
                <>
                  <span> · </span>
                  <span className='text-accent'>
                    {props.record.condition?.maxParticipants - props.record.participants.length} left
                  </span>
                </>
              )}
            </p>
            <p className='flex flex-row items-center gap-2'>
              <BanknotesIcon className='h-5 w-5 text-info' />
              {props.record.condition.type == ConditionModuleType.BasicEther && (
                <>{formatEther(props.record.condition.depositFee)} ETH</>
              )}
              {props.record.condition.type == ConditionModuleType.BasicToken && (
                <>
                  {formatUnits(props.record.condition.depositFee, props.record.condition.tokenDecimals ?? 18)}{' '}
                  {props.record.condition.tokenSymbol}
                </>
              )}
            </p>
          </div>

          <button
            type='button'
            disabled={!isActive || hasEnded}
            onClick={() => eventManagement.Register(props.record.id, props.record.condition)}
            className='btn btn-accent btn-outline btn-sm w-full mt-8'>
            Attend
          </button>

          <h1 className='text-xl text-white font-bold mt-8'>{props.event.title}</h1>

          <p className='mt-8'>{props.event.description}</p>
        </div>
      </div>

      {isAdmin && (
        <div>
          <h2 className='text-xl text-white font-bold mt-8'>Admin</h2>

          {eventManagement.message && <Alert type='info' message={eventManagement.message} className='my-4' />}

          <div className='form-control w-full'>
            <label className='label' htmlFor='timezone'>
              <span className='label-text'>
                Attendees <span className='text-accent'>*</span>
              </span>
            </label>

            <textarea
              className='textarea textarea-bordered w-full'
              placeholder='Enter one address per line..'
              onChange={onAttendeeChange}
            />
          </div>

          <button
            type='button'
            disabled={!isActive || !hasEnded || isCancelled || isSettled}
            onClick={() => eventManagement.Checkin(props.record.id, attendees)}
            className='btn btn-accent btn-outline btn-sm w-full mt-4'>
            Check-in
          </button>

          <button
            type='button'
            disabled={!isActive || !hasEnded || !hasAttendees || isCancelled || isSettled}
            onClick={() => eventManagement.Settle(props.record.id)}
            className='btn btn-accent btn-outline btn-sm w-full mt-4'>
            Settle
          </button>

          <button
            type='button'
            disabled={hasEnded || isCancelled}
            onClick={() => eventManagement.Cancel(props.record.id, reason)}
            className='btn btn-accent btn-outline btn-sm w-full mt-4'>
            Cancel
          </button>
        </div>
      )}
    </>
  )
}
