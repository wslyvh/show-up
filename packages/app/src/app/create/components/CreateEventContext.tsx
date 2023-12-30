'use client'

import { PropsWithChildren, createContext, useContext } from 'react'
import { ConditionModule } from '@/utils/types'

interface Props extends PropsWithChildren {
  modules: ConditionModule[]
}

export const useCreateEvent = () => useContext(CreateEventContext)

const CreateEventContext = createContext<Props>({
  modules: [],
})

export default function CreateEventProvider(props: Props) {
  return (
    <CreateEventContext.Provider
      value={{
        modules: props.modules,
      }}>
      {props.children}
    </CreateEventContext.Provider>
  )
}
