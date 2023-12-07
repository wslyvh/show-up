import { GetParticipations } from '@/services/protocol'
import { useAccount } from 'wagmi'
import { useQuery } from '@tanstack/react-query'
import { CONFIG } from '@/utils/config'

export function useTickets() {
  const { address } = useAccount()
  const { data, isError, isPending } = useQuery({
    queryKey: ['tickets', address, CONFIG.DEFAULT_CHAIN_ID],
    queryFn: () => GetParticipations(address, CONFIG.DEFAULT_CHAIN_ID),
  })

  return {
    data,
    isPending,
    isError,
  }
}
