import { GetAllEvents, GetEventBySlug } from '@/services/showhub'
import { EventDetails } from '../components/Details'
import EventDataProvider from '@/context/EventData'
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import { SITE_NAME, SITE_URL } from '@/utils/site'
import { CONFIG } from '@/utils/config'

interface Params {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateStaticParams() {
  if (CONFIG.NETWORK_ENV !== 'main') return []

  const events = await GetAllEvents()

  return events.map((i) => ({
    slug: i.slug,
  }))
}

export async function generateMetadata({ params }: Params) {
  const event = await GetEventBySlug(params.slug)
  if (!event?.metadata) return {}

  const baseUri = new URL(`${SITE_URL}/events/${params.slug}`)
  return {
    title: event.metadata.title,
    description: event.metadata.description,
    metadataBase: new URL(baseUri),
    openGraph: {
      title: `${SITE_NAME} @ ${event.metadata.title}`,
      description: event.metadata.description,
      images: event.metadata.imageUrl ?? `${baseUri}/opengraph-image`,
    },
    twitter: {
      title: `${SITE_NAME} @ ${event.metadata.title}`,
      description: event.metadata.description,
      images: event.metadata.imageUrl ?? `${baseUri}/opengraph-image`,
    },
  }
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
        <EventDetails />
      </EventDataProvider>
    </HydrationBoundary>
  )
}
