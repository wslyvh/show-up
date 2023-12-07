import { GetRecords } from '@/services/protocol'
import { useQuery } from '@tanstack/react-query'
import { Status } from '@/utils/types'
import { CONFIG } from '@/utils/config'

export function useEvents(past: boolean = false) {
  const params = past ? { past: true } : { status: Status.Active, past: false }
  const { data, isError, isPending } = useQuery({
    queryKey: ['events', CONFIG.DEFAULT_CHAIN_ID, past ? 'past' : 'upcoming'],
    queryFn: () => GetRecords(params, CONFIG.DEFAULT_CHAIN_ID),
  })

  return {
    data,
    isPending,
    isError,
  }
}

export function useMyEvents(address: string) {
  const { data, isError, isPending } = useQuery({
    queryKey: ['events', CONFIG.DEFAULT_CHAIN_ID, address],
    queryFn: () => GetRecords({ createdBy: address }, CONFIG.DEFAULT_CHAIN_ID),
  })

  return {
    data,
    isPending,
    isError,
  }
}
