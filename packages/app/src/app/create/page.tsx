import { CreateForm } from '@/app/create/components/Create'
import { Protected } from '@/components/Protected'
import { GetConditionModules } from '@/services/showhub'
import CreateEventProvider from './components/CreateEventContext'

export default async function Home() {
  const modules = await GetConditionModules()

  return (
    <>
      <CreateEventProvider modules={modules}>
        <Protected>
          <CreateForm />
        </Protected>
      </CreateEventProvider>
    </>
  )
}
