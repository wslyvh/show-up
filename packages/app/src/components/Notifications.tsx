'use client'

import React, { useEffect } from 'react'
import { useNotifications } from '@/context/Notification'
import {
  ArrowUpRightIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline'
import { LinkComponent } from './LinkComponent'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { TruncateMiddle } from '@/utils/format'
import { Empty } from './Empty'
dayjs.extend(relativeTime)

export function Notifications() {
  const { notifications, MarkAsRead } = useNotifications()

  useEffect(() => {
    MarkAsRead()
  }, [])

  if (notifications.length === 0) return <Empty text='No notifications' />

  return (
    <div className='flex flex-col gap-2'>
      {notifications
        .sort((a, b) => b.created - a.created)
        .map((i, index) => {
          const id = `${index}_${i.type}_notification`
          const iconClassName = `stroke-${i.type} shrink-0 h-6 w-6 text-${i.type}-400`

          return (
            <div key={id} className='flex flex-row bg-neutral rounded-lg p-4 gap-4 items-center'>
              <div>
                {i.type === 'success' && <CheckCircleIcon className={iconClassName} />}
                {i.type === 'info' && <InformationCircleIcon className={iconClassName} />}
                {i.type === 'warning' && <ExclamationTriangleIcon className={iconClassName} />}
                {i.type === 'error' && <ExclamationCircleIcon className={iconClassName} />}
              </div>
              <div className='flex flex-col flex-grow text-left gap-2'>
                <span>{i.message}</span>
                <span className='text-xs'>
                  {dayjs().to(dayjs(i.created))}
                  {i.from && (
                    <>
                      <span> · </span>
                      <span className='text-accent'>{i.from.endsWith('.eth') ? i.from : TruncateMiddle(i.from)}</span>
                    </>
                  )}
                </span>
              </div>
              {i.cta && (
                <LinkComponent href={i.cta.href} className='self-start'>
                  <ArrowUpRightIcon className='h-4 w-4' />
                </LinkComponent>
              )}
            </div>
          )
        })}
    </div>
  )
}
