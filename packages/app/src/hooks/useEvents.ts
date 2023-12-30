import { useQuery } from '@tanstack/react-query'
import { Status } from '@/utils/types'
import { GetEventsByOwner, GetPastEvents, GetUpcomingEvents } from '@/services/showhub'

export function useEvents(past: boolean = false) {
  const params = past ? { past: true } : { status: Status.Active, past: false }
  const { data, isError, isPending } = useQuery({
    queryKey: ['events', past ? 'past' : 'upcoming'],
    queryFn: () => (past ? GetPastEvents() : GetUpcomingEvents()),
  })

  return {
    data,
    isPending,
    isError,
  }
}

export function useMyEvents(address: string) {
  const { data, isError, isPending } = useQuery({
    queryKey: ['events', address],
    queryFn: () => GetEventsByOwner(address),
  })

  return {
    data,
    isPending,
    isError,
  }
}
