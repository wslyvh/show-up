import { GetEventBySlug } from '@/services/showhub'
import EventDataProvider from '@/context/EventData'
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import { CheckinOverview } from '../../components/Admin/CheckinOverview'
import { Protected } from '@/components/Protected'

interface Params {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function EventsPage({ params }: Params) {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['events', params.slug],
    queryFn: () => GetEventBySlug(params.slug),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EventDataProvider id={params.slug}>
        <Protected>
          <CheckinOverview />
        </Protected>
      </EventDataProvider>
    </HydrationBoundary>
  )
}
