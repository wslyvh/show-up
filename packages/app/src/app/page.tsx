import { Overview } from '@/features/overview/Overview'
import { MOCKS_EVENTS } from '@/utils/mocks'

export default function Home() {
  return <Overview events={MOCKS_EVENTS} />
}
