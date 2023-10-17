import { GetParticipations } from "@/services/protocol"
import { Ticket } from "./components/Ticket"

export default async function Tickets() {
  const tickets = await GetParticipations('0x0defe95102fee830aec32a3e0927b9367ac67043')

  return (
    <>
      <h2 className='text-xl font-bold mb-4'>My Tickets</h2>

      {tickets.map((ticket) => <Ticket key={ticket.id} record={ticket} />)}
    </>
  )
}
