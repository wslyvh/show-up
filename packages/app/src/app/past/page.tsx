import { Overview } from '../components/Overview'
import { GetPastEvents } from '@/services/showhub'
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'

export default async function Home() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['events', 'past'],
    queryFn: GetPastEvents,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Overview />
    </HydrationBoundary>
  )
}
