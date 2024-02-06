'use client'

import { DateCard } from '@/components/Date'
import {
  ArrowDownTrayIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  CheckBadgeIcon,
  MapPinIcon,
  PencilSquareIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { formatEther, formatUnits } from 'viem/utils'
import { LinkComponent } from '@/components/LinkComponent'
import { AdminActions } from './Admin/Actions'
import { Register } from './Register'
import { Fund } from './Fund'
import { useEventData } from '@/context/EventData'
import { CONFIG } from '@/utils/config'
import { useAccount } from 'wagmi'
import { usePathname } from 'next/navigation'
import { marked } from 'marked'
import Image from 'next/image'
import dayjs from 'dayjs'
import makeBlockie from 'ethereum-blockies-base64'
import { GenerateGoogleCalendarLink, GenerateIcsFileLink } from '@/utils/dates'
import { Slugify } from '@/utils/format'

export function EventDetails() {
  const pathname = usePathname()
  const { address } = useAccount()
  const eventData = useEventData()
  const record = eventData.record
  const event = eventData.event

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
                href={`/${record.owner.name.endsWith('.eth') ? record.owner.name : record.createdBy}`}>
                {record.owner.name}
              </LinkComponent>
            </p>

            <p className='flex flex-row items-center gap-2'>
              <CalendarDaysIcon className='h-5 w-5 text-info shrink-0' />
              <div className='dropdown'>
                <div tabIndex={0} role='button' className='underline'>
                  {dayjs(event.start).format(eventData.sameDay ? 'ddd MMM DD · HH:mm' : 'MMM DD · HH:mm')}
                  {' → '}
                  {dayjs(event.end).format(eventData.sameDay ? 'HH:mm' : 'MMM DD · HH:mm')}
                </div>
                <ul tabIndex={0} className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'>
                  <li>
                    <a href={GenerateGoogleCalendarLink(record)} target='_blank'>
                      Google Calendar
                    </a>
                  </li>
                  <li>
                    <a href={GenerateIcsFileLink(record)} download={`${Slugify(event.title)}.ics`}>
                      Download .ICS
                    </a>
                  </li>
                </ul>
              </div>
            </p>
            {event.end !== record.endDate && (
              <p className='flex flex-row items-center gap-2'>
                <PencilSquareIcon className='h-5 w-5 text-info shrink-0' />
                Registration → {dayjs(record.endDate).format('MMM DD · HH:mm')}
              </p>
            )}
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
              <UserIcon className='h-5 w-5 text-info shrink-0' /> {record.registrations.length} going
              <span> · </span>
              <span className='text-accent'>
                {record.limit > 0 ? <>{record.limit - record.registrations.length} left</> : 'unlimited'}
              </span>
            </p>
            <p className='flex flex-row items-center gap-2'>
              <ArrowDownTrayIcon className='h-5 w-5 text-info shrink-0' />
              {!record.conditionModuleData.tokenAddress && (
                <>{formatEther(BigInt(record.conditionModuleData.depositFee))} ETH</>
              )}
              {record.conditionModuleData.tokenAddress && (
                <>
                  {formatUnits(
                    BigInt(record.conditionModuleData.depositFee),
                    record.conditionModuleData.tokenDecimals ?? 18
                  )}{' '}
                  {record.conditionModuleData.tokenSymbol}
                </>
              )}{' '}
              deposit fee
            </p>
            {record.totalFunded > 0 && (
              <p className='flex flex-row items-center gap-2'>
                <BanknotesIcon className='h-5 w-5 text-info shrink-0' />
                {!record.conditionModuleData.tokenAddress && <>{formatEther(BigInt(record.totalFunded))} ETH</>}
                {record.conditionModuleData.tokenAddress && (
                  <>
                    {formatUnits(BigInt(record.totalFunded), record.conditionModuleData.tokenDecimals ?? 18)}{' '}
                    {record.conditionModuleData.tokenSymbol}
                  </>
                )}{' '}
                <span
                  className='badge badge-sm badge-accent shrink-0 tooltip tooltip-info'
                  data-tip='Funds are split over attendees'>
                  funded
                </span>
              </p>
            )}
          </div>

          <div className='mt-8'>
            {eventData.isAdmin && <AdminActions record={record} />}

            {!address && (
              <LinkComponent href={`/profile?redirect=${pathname}`}>
                <button type='button' className='btn btn-accent btn-outline btn-sm w-full'>
                  Connect to register
                </button>
              </LinkComponent>
            )}

            {address && <Register />}

            {address && (
              <div className='my-2'>
                <Fund />
              </div>
            )}
          </div>

          <div className='mt-2'>
            {event.website && (
              <div>
                <LinkComponent href={event.website}>
                  <button type='button' className='btn btn-accent btn-sm w-full'>
                    Website
                  </button>
                </LinkComponent>
              </div>
            )}
          </div>

          <h1 className='text-xl text-white font-bold mt-8'>{event.title}</h1>
          <div
            className='prose max-w-none mt-8'
            dangerouslySetInnerHTML={{
              __html: marked.parse(event.description ?? '', {
                breaks: true,
                gfm: true,
              }) as string,
            }}
          />
        </div>
      </div>

      {record.registrations.length > 0 && (
        <div>
          <h2 className='text-xl text-white font-bold mt-8'>Attendees</h2>

          <div className='flex flex-row flex-wrap gap-8 mt-8'>
            {record.registrations.map((i) => {
              return (
                <div key={i.id} className='w-24 text-center grow'>
                  <div className='avatar shrink-0'>
                    <div
                      className={`w-20 rounded-full ${
                        i.participated ? 'ring ring-success ring-offset-base-100 ring-offset-2' : ''
                      }`}>
                      <img src={i.avatar ?? makeBlockie(i.id)} alt={i.id} />
                    </div>
                  </div>

                  <p className='text-xs mt-2'>{i.name}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}
