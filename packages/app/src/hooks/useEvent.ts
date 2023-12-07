import { GetRecord } from '@/services/protocol'
import { CONFIG } from '@/utils/config'
import { useQuery } from '@tanstack/react-query'

interface Props {
  id: string
}

export function useEvent(props: Props) {
  const { data, isError, isPending } = useQuery({
    queryKey: ['events', props.id, CONFIG.DEFAULT_CHAIN_ID],
    queryFn: () => GetRecord(props.id, CONFIG.DEFAULT_CHAIN_ID),
  })

  return {
    data,
    isPending,
    isError,
  }
}
