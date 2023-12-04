import { Overview } from '../components/Overview'
import { GetRecords } from '@/services/protocol'
import { CONFIG } from '@/utils/config'
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'

export default async function Home() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['events', CONFIG.DEFAULT_CHAIN_ID, 'past'],
    queryFn: () => GetRecords({ past: true }, CONFIG.DEFAULT_CHAIN_ID),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Overview />
    </HydrationBoundary>
  )
}
