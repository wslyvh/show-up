import { GetRecord } from '@/services/protocol'
import { EventDetails } from '../components/Details'
import EventDataProvider from '@/context/EventData'
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import { DEFAULT_CHAIN_ID } from '@/utils/network'

export default async function EventsPage({ params }: { params: { id: string } }) {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['events', params.id, DEFAULT_CHAIN_ID],
    queryFn: () => GetRecord(params.id, DEFAULT_CHAIN_ID),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EventDataProvider id={params.id}>
        <EventDetails />
      </EventDataProvider>
    </HydrationBoundary>
  )
}
