import { EventDetails } from '@/features/details/Event'
import { GetRecord } from '@/services/protocol'
import { Status } from '@/utils/types'

export default async function Page({ params }: { params: { id: string } }) {
  const record = await GetRecord({
    id: params.id,
    status: Status.Active
  })

  if (!record || !record.metadata) return null

  return (
    <>
      <EventDetails record={record} event={record.metadata} />
    </>
  )
}
