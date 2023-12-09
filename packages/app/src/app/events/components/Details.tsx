'use client'

import { DateCard } from '@/components/Date'
import { BanknotesIcon, CalendarDaysIcon, CheckBadgeIcon, MapPinIcon, UserIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { ConditionModuleType } from '@/utils/types'
import dayjs from 'dayjs'
import { formatEther, formatUnits } from 'viem/utils'
import { LinkComponent } from '@/components/LinkComponent'
import { AdminActions } from './Admin/Actions'
import { Register } from './Register'
import { useEventData } from '@/context/EventData'
import { GetTokenDecimals, GetTokenSymbol } from '@/utils/network'
import { CONFIG } from '@/utils/config'
import { useAccount } from 'wagmi'
import { usePathname } from 'next/navigation'
import { marked } from 'marked'

export function EventDetails() {
  const pathname = usePathname()
  const { address } = useAccount()
  const eventData = useEventData()
  const record = eventData.record
  const event = eventData.event

  function registerButtonText() {
    if (eventData.isCancelled) return 'Event is cancelled'
    if (!eventData.isActive || eventData.hasEnded) return 'Event has ended'
    if (eventData.isParticipant) return 'Already registered'
    if (!eventData.hasBalance) return `Insufficient ${record.condition.tokenSymbol ?? 'ETH'} balance`

    return 'Register'
  }

  return (
    <>
      <div className='flex flex-col bg-neutral rounded-lg'>
        <div className='w-full aspect-[2/1] max-h-xs'>
          <Image
            width={0}
            height='320'
            src={event.imageUrl}
            alt={event.title}
            placeholder='blur'
            blurDataURL='data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='
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
              <CheckBadgeIcon className='h-5 w-5 text-info shrink-0' />
              <LinkComponent
                className='underline truncate hover:text-white'
                href={`${CONFIG.DEFAULT_CHAIN.blockExplorers?.default.url}/address/${record.createdBy}`}>
                {record.creatorProfile.name}
              </LinkComponent>
            </p>

            <p className='flex flex-row items-center gap-2'>
              <CalendarDaysIcon className='h-5 w-5 text-info shrink-0' />
              {dayjs(event.start).format(eventData.sameDay ? 'ddd MMM DD · HH:mm' : 'MMM DD · HH:mm')}
              {' → '}
              {dayjs(event.end).format(eventData.sameDay ? 'HH:mm' : 'MMM DD · HH:mm')}
            </p>
            <p className='flex flex-row items-center gap-2'>
              <MapPinIcon className='h-5 w-5 text-info shrink-0' />
              {event.location.startsWith('https://') && (
                <LinkComponent href={event.location} className='underline truncate hover:text-white'>
                  {event.location}
                </LinkComponent>
              )}
              {!event.location.startsWith('https://') && event.location}
            </p>
            <p className='flex flex-row items-center gap-2'>
              <UserIcon className='h-5 w-5 text-info shrink-0' /> {record.participants.length} going
              <span> · </span>
              <span className='text-accent'>
                {record.condition?.maxParticipants > 0 ? (
                  <>{record.condition?.maxParticipants - record.participants.length} left</>
                ) : (
                  'unlimited'
                )}
              </span>
            </p>
            <p className='flex flex-row items-center gap-2'>
              <BanknotesIcon className='h-5 w-5 text-info shrink-0' />
              {record.condition.type == ConditionModuleType.BasicEther && (
                <>{formatEther(record.condition.depositFee)} ETH</>
              )}
              {record.condition.type == ConditionModuleType.BasicToken && (
                <>
                  {formatUnits(
                    record.condition.depositFee,
                    record.condition.tokenDecimals ?? GetTokenDecimals(record.condition.tokenAddress)
                  )}{' '}
                  {GetTokenSymbol(record.condition.tokenAddress)}
                </>
              )}
            </p>
          </div>

          <div className='mt-8'>
            {eventData.isAdmin && <AdminActions id={record.id} />}

            {!address && (
              <LinkComponent href={`/profile?redirect=${pathname}`}>
                <button type='button' className='btn btn-accent btn-outline btn-sm w-full'>
                  Connect to register
                </button>
              </LinkComponent>
            )}

            {address && !eventData.isAdmin && (
              <Register event={record} buttonText={registerButtonText()} disabled={eventData.canRegister} />
            )}

            {event.website && (
              <p className='mt-4'>
                <LinkComponent href={event.website}>
                  <button type='button' className='btn btn-accent btn-sm w-full'>
                    Website
                  </button>
                </LinkComponent>
              </p>
            )}
          </div>

          <h1 className='text-xl text-white font-bold mt-8'>{event.title}</h1>
          <div className='prose max-w-none mt-8' dangerouslySetInnerHTML={{ __html: marked.parse(event.description) as string }} />
        </div>
      </div>

      {record.participants.length > 0 && (
        <div>
          <h2 className='text-xl text-white font-bold mt-8'>Attendees</h2>

          <div className='flex flex-row flex-wrap gap-8 mt-8'>
            {record.participants.map((participant) => {
              return (
                <div key={participant.address} className='w-24 text-center grow'>
                  <div className='avatar shrink-0'>
                    <div
                      className={`w-20 rounded-full ${participant.checkedIn ? 'ring ring-success ring-offset-base-100 ring-offset-2' : ''
                        }`}>
                      <img src={participant.profile.avatar} alt={participant.address} />
                    </div>
                  </div>

                  <p className='text-xs mt-2'>{participant.profile.name}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}
