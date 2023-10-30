'use client'

import { Ticket } from './Ticket'
import { Empty } from '@/components/Empty'
import { useTickets } from '@/hooks/useTickets'
import { useAccount } from 'wagmi'

export function Overview() {
  const { address } = useAccount()
  const tickets = useTickets()

  if (tickets.isError || tickets.data?.length === 0) return <Empty text={`No tickets found for ${address}`} />

  return (
    <>
      <div className='flex flex-col gap-4'>
        {tickets.data?.map((ticket) => (
          <Ticket key={ticket.id} record={ticket} />
        ))}
      </div>
    </>
  )
}
