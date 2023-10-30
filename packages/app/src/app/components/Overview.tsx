'use client'

import { Card } from './Card'
import { useEvents } from '@/hooks/useEvents'
import { Empty } from '@/components/Empty'

export function Overview() {
  const events = useEvents()

  if (events.isError || !events.data) return <Empty text={`No events found`} />

  return (
    <>
      {/* <Tabs options={['Upcoming', 'Past']} /> */}

      <div className='flex flex-col gap-2'>
        {events.data.map((event) => (
          <Card key={event.id} event={event} />
        ))}
      </div>
    </>
  )
}
