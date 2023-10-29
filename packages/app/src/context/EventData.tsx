'use client'

import { PropsWithChildren, createContext, useContext } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { ConditionModuleType, EventMetadata, Record, Status } from '@/utils/types'
import dayjs from 'dayjs'
import { Alert } from '@/components/Alert'

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
    canRegister: false
}

interface Props extends PropsWithChildren {
    record: Record
}

export const useEventData = () => useContext(EventDataContext)

const EventDataContext = createContext(defaultState)

export default function EventDataProvider(props: Props) {
    const event = props.record.metadata!
    const { address } = useAccount()

    const balanceRequest: any = { address: address, watch: true }
    if (props.record.condition.type == ConditionModuleType.BasicToken && props.record.condition.tokenAddress) {
        balanceRequest.token = props.record.condition.tokenAddress
    }
    const { data: balance } = useBalance(balanceRequest)

    const sameDay = dayjs(event.start).isSame(event.end, 'day')
    const hasEnded = dayjs().isAfter(dayjs(props.record.condition.endDate))
    const hasAttendees = props.record.participants.filter((i) => !!i.checkedIn).length > 0
    const hasBalance = balance && balance.value > props.record.condition.depositFee || false
    const isCancelled = Status[props.record.status.valueOf()] == Status.Cancelled.toString()
    const isActive = Status[props.record.status.valueOf()] == Status.Active.toString()
    const isSettled = Status[props.record.status.valueOf()] == Status.Settled.toString()
    const isAdmin = props.record.createdBy.toLowerCase() === address?.toLowerCase()
    const isParticipant = props.record.participants.map((i) => i.address.toLowerCase()).includes(address?.toLowerCase())
    const canRegister = !isActive || hasEnded || isParticipant || !hasBalance

    return <EventDataContext.Provider value={{
        record: props.record,
        event: props.record.metadata!, // metadata should be filtered on the graph client
        sameDay,
        hasEnded,
        hasParticipants: props.record.participants.length > 0,
        hasAttendees,
        hasBalance,
        isActive,
        isCancelled,
        isSettled,
        isAdmin,
        isParticipant,
        canRegister
    }}>
        <>
            {isCancelled && (
                <Alert type='error' message={props.record.message || 'This event has been cancelled'} className='my-4' />
            )}
            {props.children}
        </>
    </EventDataContext.Provider>
}