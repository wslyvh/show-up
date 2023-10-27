'use client'

import { Ticket } from './Ticket'
import { Empty } from '@/components/Empty'
import { useTickets } from '@/hooks/useTickets'
import { Loading } from '@/components/Loading'
import { useAccount } from 'wagmi'

export function Overview() {
  const { address } = useAccount()
  const tickets = useTickets()

  if (tickets.isLoading) return <Loading text='' />

  if (!tickets.isLoading && (!tickets.data || tickets.data.length === 0)) return <Empty text={`No tickets found for ${address}`} />

  return (
    <>
      <div className='flex flex-col gap-4'>
        {tickets.data?.filter((i) => !!i.metadata)
          .map((ticket) => (
            <Ticket key={ticket.id} record={ticket} />
          ))}
      </div>
    </>
  )
}
