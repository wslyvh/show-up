'use client'

import { PropsWithChildren, createContext, useContext } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { ConditionModuleType, EventMetadata, Record, Status } from '@/utils/types'
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
}

interface Props extends PropsWithChildren {
  id: string
}

export const useEventData = () => useContext(EventDataContext)

const EventDataContext = createContext(defaultState)

export default function EventDataProvider(props: Props) {
  const { data: record } = useEvent(props)
  const { address } = useAccount()
  const balanceRequest: any = { address: address, watch: true }
  if (record?.condition.type == ConditionModuleType.BasicToken && record?.condition.tokenAddress) {
    balanceRequest.token = record.condition.tokenAddress
  }
  const { data: balance } = useBalance(balanceRequest)

  if (!record) return null

  const event = record.metadata!
  const sameDay = dayjs(event.start).isSame(event.end, 'day')
  const hasEnded = dayjs().isAfter(dayjs(record.condition.endDate))
  const hasAttendees = record.participants.filter((i) => !!i.checkedIn).length > 0
  const hasBalance = (balance && balance.value > record.condition.depositFee) || false
  const isCancelled = Status[record.status.valueOf()] == Status.Cancelled.toString()
  const isActive = Status[record.status.valueOf()] == Status.Active.toString()
  const isSettled = Status[record.status.valueOf()] == Status.Settled.toString()
  const isAdmin = record.createdBy.toLowerCase() === address?.toLowerCase()
  const isParticipant = record.participants.map((i) => i.address.toLowerCase()).includes(address?.toLowerCase())
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
        hasParticipants: record.participants.length > 0,
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
