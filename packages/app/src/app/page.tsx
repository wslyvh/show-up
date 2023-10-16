import { Overview } from '@/features/overview/Overview'
import { GetRecords } from '@/services/protocol'
import { Status } from '@/utils/types'

export default async function Home() {
  const records = await GetRecords({
    status: Status.Active
  })

  return <Overview events={records} />
}
