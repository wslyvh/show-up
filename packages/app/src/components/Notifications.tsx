import React from 'react'
import { useNotifications } from '@/context/Notification'

export function Notifications() {
  const { notifications } = useNotifications()

  return (
    <div className=''>
      <h2>Notifications</h2>
      {notifications.map((i, index) => {
        return <p key={`${index}_${i.type}_notification`}>{i.message}</p>
      })}
    </div>
  )
}
