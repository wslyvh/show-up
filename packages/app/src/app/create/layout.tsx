import { PropsWithChildren } from 'react'
import { EventManagementProvider } from '@/context/EventManagement'

export default function EventManagementLayout(props: PropsWithChildren) {
  return <EventManagementProvider>{props.children}</EventManagementProvider>
}
