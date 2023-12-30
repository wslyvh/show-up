'use client'

import { Card } from './Card'
import { useEvents } from '@/hooks/useEvents'
import { Empty } from '@/components/Empty'
import { Tabs } from './Tabs'
import { usePathname, useRouter } from 'next/navigation'

export function Overview() {
  const router = useRouter()
  const pathname = usePathname()
  const pastEvents = pathname === '/past'
  let { data, isError } = useEvents(pastEvents)

  if (!data || isError) return <Empty text={`No events found`} />

  const onSelect = (option: string) => {
    if (option === 'Upcoming') router.push('/')
    if (option === 'Past') router.push('/past')
  }

  return (
    <>
      <div className='flex justify-end my-4'>
        <Tabs options={['Upcoming', 'Past']} onSelect={onSelect} selected={pastEvents ? 'Past' : 'Upcoming'} />
      </div>

      <div className='flex flex-col gap-2'>
        {data.map((event) => (
          <Card key={event.id} event={event} />
        ))}
      </div>
    </>
  )
}
