import { GetEventBySlug } from '@/services/showhub'
import { useQuery } from '@tanstack/react-query'

interface Props {
  id: string
}

export function useEvent(props: Props) {
  const { data, isError, isPending, refetch } = useQuery({
    queryKey: ['events', props.id],
    queryFn: () => GetEventBySlug(props.id),
  })

  return {
    data,
    isPending,
    isError,
    refetch,
  }
}
