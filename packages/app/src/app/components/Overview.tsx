'use client'

import { Loading } from '@/components/Loading'
import { Card } from './Card'
import { useEvents } from '@/hooks/useEvents'
import { Empty } from '@/components/Empty'

export function Overview() {
  const events = useEvents()

  if (events.isLoading) return <Loading text='' />

  if (!events.isLoading && (!events.data || events.data.length === 0)) return <Empty text={`No events found`} />

  return (
    <>
      {/* <Tabs options={['Upcoming', 'Past']} /> */}

      <div className='flex flex-col gap-2'>
        {events.data?.filter((i) => !!i.metadata)
          .map((event) => (
            <Card key={event.id} event={event} />
          ))}
      </div>
    </>
  )
}
