import { GetEventsByOwner, GetUser } from '@/services/showhub'
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import { Profile } from './components/Profile'
import { SITE_NAME, SITE_URL } from '@/utils/site'

interface Params {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Params) {
  const owner = await GetUser(params.id)
  if (!owner) return {}

  const baseUri = new URL(`${SITE_URL}/${params.id}`)
  const title = `${owner.name} @ ${SITE_NAME}`
  const description = `Check out all the events of ${owner.name} on Show Up.`

  return {
    title: title,
    description: description,
    metadataBase: new URL(baseUri),
    openGraph: {
      title: title,
      description: description,
      images: owner.avatar ?? `${baseUri}/opengraph-image`,
    },
    twitter: {
      title: title,
      description: description,
      images: owner.avatar ?? `${baseUri}/opengraph-image`,
      card: 'summary',
    },
  }
}

export default async function OrganizerPage({ params }: Params) {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['events', 'owner', params.id],
    queryFn: () => GetEventsByOwner(params.id),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Profile id={params.id} />
    </HydrationBoundary>
  )
}
