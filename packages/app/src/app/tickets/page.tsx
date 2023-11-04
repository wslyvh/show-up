import { Protected } from '@/components/Protected'
import { Overview } from './components/Overview'
import { GetParticipations } from '@/services/protocol'
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import { CONFIG } from '@/utils/config'

export default async function TicketsPage() {
  const queryClient = new QueryClient()

  const defaultAddress = '0x' // Pre-fetch default empty address
  await queryClient.prefetchQuery({
    queryKey: ['tickets', defaultAddress, CONFIG.DEFAULT_CHAIN_ID],
    queryFn: () => GetParticipations(defaultAddress, CONFIG.DEFAULT_CHAIN_ID),
  })

  return (
    <Protected>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Overview />
      </HydrationBoundary>
    </Protected>
  )
}
