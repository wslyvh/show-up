import { EventDetails } from '@/features/details/Event'
import { MOCKS_EVENTS } from '@/utils/mocks'

// TODO: handle data fetching from indexer

export default function Page() {
  const record = MOCKS_EVENTS[0]
  const event = record.metadata
  if (!event) return null

  return (
    <>
      <EventDetails event={event} conditions={record.conditions} />
    </>
  )
}
