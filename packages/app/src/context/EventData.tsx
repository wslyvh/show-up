'use client'

import { PropsWithChildren, createContext, useContext } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { EventMetadata, Record, Status } from '@/utils/types'
import dayjs from 'dayjs'
import { Alert } from '@/components/Alert'
import { useEvent } from '@/hooks/useEvent'

interface EventDataContext {
  record: Record
  event: EventMetadata
  sameDay: boolean
  hasEnded: boolean
  hasParticipants: boolean
  hasAttendees: boolean
  hasBalance: boolean
  isActive: boolean
  isCancelled: boolean
  isSettled: boolean
  isAdmin: boolean
  isParticipant: boolean
  canRegister: boolean
  canCancel: boolean
  canSettle: boolean
  refetch: () => void
}

const defaultState: EventDataContext = {
  record: {} as Record,
  event: {} as EventMetadata,
  sameDay: false,
  hasEnded: false,
  hasParticipants: false,
  hasAttendees: false,
  hasBalance: false,
  isActive: false,
  isCancelled: false,
  isSettled: false,
  isAdmin: false,
  isParticipant: false,
  canRegister: false,
  canCancel: false,
  canSettle: false,
  refetch: () => console.log('defaultState refetch()'),
}

interface Props extends PropsWithChildren {
  id: string
}

export const useEventData = () => useContext(EventDataContext)

const EventDataContext = createContext(defaultState)

export default function EventDataProvider(props: Props) {
  const { data: record, refetch } = useEvent(props)
  const { address } = useAccount()
  const balanceRequest: any = { address: address, watch: true }
  if (record?.conditionModuleData.tokenAddress) {
    balanceRequest.token = record.conditionModuleData.tokenAddress
  }
  const { data: balance } = useBalance(balanceRequest)

  if (!record) return null

  const event = record.metadata!
  const sameDay = dayjs(event.start).isSame(event.end, 'day')
  const hasEnded = dayjs().isAfter(dayjs(record.endDate))
  const hasAttendees = record.registrations.filter((i) => !!i.participated).length > 0
  const hasBalance = (balance && balance.value > BigInt(record.conditionModuleData.depositFee)) || false
  const isCancelled = record.status == Status.Cancelled
  const isActive = record.status == Status.Active
  const isSettled = record.status == Status.Settled
  const isAdmin = record.createdBy.toLowerCase() === address?.toLowerCase()
  const isParticipant = record.registrations.map((i) => i.id.toLowerCase()).includes(address?.toLowerCase())
  const canRegister = !isActive || hasEnded || isParticipant || !hasBalance
  const canCancel = isActive && isAdmin && !hasEnded && !hasAttendees
  const canSettle = hasEnded && isActive && hasAttendees && !isSettled

  return (
    <EventDataContext.Provider
      value={{
        record: record,
        event: record.metadata!, // metadata should be filtered on the graph client
        sameDay,
        hasEnded,
        hasParticipants: record.registrations.length > 0,
        hasAttendees,
        hasBalance,
        isActive,
        isCancelled,
        isSettled,
        isAdmin,
        isParticipant,
        canRegister,
        canCancel,
        canSettle,
        refetch,
      }}>
      <>
        {isCancelled && (
          <Alert type='error' message={record.message || 'This event has been cancelled'} className='my-4' />
        )}
        {hasEnded && isActive && (
          <Alert type='info' message={record.message || 'This event has ended and can be settled'} className='my-4' />
        )}
        {isSettled && (
          <Alert type='success' message={record.message || 'This event has been settled'} className='my-4' />
        )}
        {props.children}
      </>
    </EventDataContext.Provider>
  )
}
