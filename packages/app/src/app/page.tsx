import { Overview } from './components/Overview'
import { GetRecords } from '@/services/protocol'
import { CONFIG } from '@/utils/config'
import { Status } from '@/utils/types'
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'

export default async function Home() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['events', CONFIG.DEFAULT_CHAIN_ID],
    queryFn: () => GetRecords({ status: Status.Active }, CONFIG.DEFAULT_CHAIN_ID),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Overview />
    </HydrationBoundary>
  )
}
