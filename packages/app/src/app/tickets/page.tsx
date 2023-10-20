import { Protected } from '@/components/Protected'
import { Overview } from './components/Overview'

export const revalidate = 1

export default function TicketsPage() {
  return (
    <>
      <Protected>
        <Overview />
      </Protected>
    </>
  )
}
