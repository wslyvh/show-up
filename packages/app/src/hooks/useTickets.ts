import { useAccount } from 'wagmi'
import { useQuery } from '@tanstack/react-query'
import { GetEventsByRegistration } from '@/services/showhub'

export function useTickets() {
  const { address } = useAccount()
  const { data, isError, isPending } = useQuery({
    queryKey: ['tickets', address],
    queryFn: () => GetEventsByRegistration(address),
    enabled: !!address,
  })

  return {
    data,
    isPending,
    isError,
  }
}
