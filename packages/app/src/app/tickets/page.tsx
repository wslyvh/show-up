import { Protected } from '@/components/Protected'
import { Overview } from './components/Overview'
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import { GetEventsByRegistration } from '@/services/showhub'

export default async function TicketsPage() {
  const queryClient = new QueryClient()

  const defaultAddress = '0x' // Pre-fetch default empty address
  await queryClient.prefetchQuery({
    queryKey: ['tickets', defaultAddress],
    queryFn: () => GetEventsByRegistration(defaultAddress),
  })

  return (
    <Protected>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Overview />
      </HydrationBoundary>
    </Protected>
  )
}
