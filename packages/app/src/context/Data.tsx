'use client'

import { PropsWithChildren, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DEFAULT_STALE_TIME } from '@/utils/site'

export default function DataProvider(props: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, needs a value above 0 to avoid refetching immediately on the client
            staleTime: DEFAULT_STALE_TIME,
          },
        },
      })
  )

  return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
}
