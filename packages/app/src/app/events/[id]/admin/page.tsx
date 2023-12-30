import { GetEventById } from '@/services/showhub'
import EventDataProvider from '@/context/EventData'
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import { CheckinOverview } from '../../components/Admin/CheckinOverview'
import { Protected } from '@/components/Protected'

interface Params {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function EventsPage({ params }: Params) {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['events', params.id],
    queryFn: () => GetEventById(params.id),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EventDataProvider id={params.id}>
        <Protected>
          <CheckinOverview />
        </Protected>
      </EventDataProvider>
    </HydrationBoundary>
  )
}
