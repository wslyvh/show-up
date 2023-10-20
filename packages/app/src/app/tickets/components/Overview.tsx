'use client'

import { GetParticipations } from '@/services/protocol'
import { useState, useEffect } from 'react'
import { Record } from '@/utils/types'
import { useAccount } from 'wagmi'
import { Ticket } from './Ticket'

export function Overview() {
  const { address } = useAccount()
  const [tickets, setTickets] = useState<Record[]>([])

  useEffect(() => {
    async function fetchData() {
      if (!address) return
      const tickets = await GetParticipations(address)
      setTickets(tickets)
    }

    fetchData()
  }, [address])

  return (
    <>
      <div className='flex flex-col gap-4'>
        {tickets
          .filter((i) => !!i.metadata)
          .map((ticket) => (
            <Ticket key={ticket.id} record={ticket} />
          ))}
      </div>
    </>
  )
}
