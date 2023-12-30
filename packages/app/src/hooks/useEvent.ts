import { GetEventById } from '@/services/showhub'
import { useQuery } from '@tanstack/react-query'

interface Props {
  id: string
}

export function useEvent(props: Props) {
  const { data, isError, isPending } = useQuery({
    queryKey: ['events', props.id],
    queryFn: () => GetEventById(props.id),
  })

  return {
    data,
    isPending,
    isError,
  }
}
