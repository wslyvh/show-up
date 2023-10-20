import { GetRecord } from '@/services/protocol'
import { EventDetails } from '../components/Event'

export const revalidate = 1

export default async function Page({ params }: { params: { id: string } }) {
  const record = await GetRecord(params.id)

  if (!record || !record.metadata) return null

  return (
    <>
      <EventDetails record={record} event={record.metadata} />
    </>
  )
}
