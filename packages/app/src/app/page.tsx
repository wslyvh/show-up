import { DEFAULT_CHAIN_ID } from '@/utils/network'
import { Overview } from './components/Overview'
import { GetRecords } from '@/services/protocol'
import { Status } from '@/utils/types'
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'

export default async function Home() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['events', DEFAULT_CHAIN_ID],
    queryFn: () => GetRecords({ status: Status.Active }, DEFAULT_CHAIN_ID),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Overview />
    </HydrationBoundary>
  )
}
