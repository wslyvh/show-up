'use client'

import { Tabs } from '@/app/components/Tabs'
import { Ticket } from './Ticket'
import { Empty } from '@/components/Empty'
import { useTickets } from '@/hooks/useTickets'
import { useAccount } from 'wagmi'
import { useRouter, useSearchParams } from 'next/navigation'
import dayjs from 'dayjs'

export function Overview() {
  const router = useRouter()
  const searchQuery = useSearchParams()
  const { address } = useAccount()
  const tickets = useTickets()
  const pastEvents = searchQuery.get('filter') === 'past'

  if (tickets.isError || tickets.data?.length === 0) return <Empty text={`No tickets found for ${address}`} />

  const onSelect = (option: string) => {
    if (option === 'Upcoming') router.push('?filter=upcoming')
    if (option === 'Past') router.push('?filter=past')
  }

  return (
    <>
      <div className='flex justify-end my-4'>
        <Tabs options={['Upcoming', 'Past']} onSelect={onSelect} selected={pastEvents ? 'Past' : 'Upcoming'} />
      </div>

      <div className='flex flex-col gap-4'>
        {tickets.data
          ?.filter((i) =>
            // TODO: Filter on server/client integration
            pastEvents ? dayjs(i.metadata?.end).isBefore(dayjs()) : dayjs(i.metadata?.end).isAfter(dayjs())
          )
          .map((ticket) => <Ticket key={ticket.id} record={ticket} />)}
      </div>
    </>
  )
}
