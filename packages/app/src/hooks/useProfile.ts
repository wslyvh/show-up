import { useQuery } from '@tanstack/react-query'
import { GetUser } from '@/services/showhub'

export function useProfile(address: string) {
  const { data, isError, isPending } = useQuery({
    queryKey: ['user', address],
    queryFn: () => GetUser(address),
  })

  return {
    data,
    isPending,
    isError,
  }
}
