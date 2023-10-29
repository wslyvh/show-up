import { GetRecord } from '@/services/protocol'
import { EventDetails } from '../components/Details'
import EventDataProvider from '@/context/EventData'

export const revalidate = 1

export default async function Page({ params }: { params: { id: string } }) {
  const record = await GetRecord(params.id)

  if (!record || !record.metadata) return null

  return (
    <EventDataProvider record={record}>
      <EventDetails />
    </EventDataProvider>
  )
}
