import { GetRecord } from '@/services/protocol'
import { EventDetails } from '../components/Details'
import EventDataProvider from '@/context/EventData'
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import { CONFIG } from '@/utils/config'
import { SITE_NAME, SITE_URL } from '@/utils/site'

interface Params {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Params) {
  const event = await GetRecord(params.id, CONFIG.DEFAULT_CHAIN_ID)
  if (!event?.metadata) return {}

  const baseUri = new URL(`${SITE_URL}/events/${params.id}`)
  return {
    title: event.metadata.title,
    description: event.metadata.description,
    metadataBase: new URL(baseUri),
    openGraph: {
      title: `${SITE_NAME} @ ${event.metadata.title}`,
      description: event.metadata.description,
      images: `${baseUri}/opengraph-image`,
    },
    twitter: {
      title: `${SITE_NAME} @ ${event.metadata.title}`,
      description: event.metadata.description,
      images: `${baseUri}/opengraph-image`,
    },
  }
}

export default async function EventsPage({ params }: Params) {
  const queryClient = new QueryClient()

  console.log('Prefetching event data', params.id)
  await queryClient.prefetchQuery({
    queryKey: ['events', params.id, CONFIG.DEFAULT_CHAIN_ID],
    queryFn: () => GetRecord(params.id, CONFIG.DEFAULT_CHAIN_ID),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EventDataProvider id={params.id}>
        <EventDetails />
      </EventDataProvider>
    </HydrationBoundary>
  )
}
