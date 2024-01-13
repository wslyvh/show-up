import { GetUpcomingEvents } from '@/services/showhub'
import { Overview } from './components/Overview'
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'

export default async function Home() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['events', 'upcoming'],
    queryFn: GetUpcomingEvents,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Overview />
    </HydrationBoundary>
  )
}
