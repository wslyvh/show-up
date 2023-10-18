import { GetRecords } from '@/services/protocol'
import { Status } from '@/utils/types'
import { Overview } from './components/Overview'

export default async function Home() {
  const records = await GetRecords({
    status: Status.Active,
  })

  return <Overview events={records} />
}
