import { Protected } from '@/components/Protected'
import { Overview } from './components/Overview'
import { GetParticipations } from '@/services/protocol'
import { DEFAULT_CHAIN_ID } from '@/utils/network'
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'

export default async function TicketsPage() {
  const queryClient = new QueryClient()

  const defaultAddress = '0x' // Pre-fetch default empty address
  await queryClient.prefetchQuery({
    queryKey: ['tickets', defaultAddress, DEFAULT_CHAIN_ID],
    queryFn: () => GetParticipations(defaultAddress, DEFAULT_CHAIN_ID),
  })

  return (
    <Protected>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Overview />
      </HydrationBoundary>
    </Protected>
  )
}
