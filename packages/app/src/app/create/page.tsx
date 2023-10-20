import { CreateForm } from '@/app/create/components/Create'
import { Protected } from '@/components/Protected'

export default function Home() {
  return (
    <>
      <Protected>
        <CreateForm />
      </Protected>
    </>
  )
}
