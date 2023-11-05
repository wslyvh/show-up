import { ActionDrawer } from '@/components/ActionDrawer'
import { useEventData } from '@/context/EventData'
import { useEventManagement } from '@/context/EventManagement'

interface Props {
    id: string
}

export function Settle(props: Props) {
    const eventManagement = useEventManagement()
    const eventData = useEventData()
    const actionButton = (
        <button type='button' className='btn btn-accent btn-outline btn-sm w-full'>
            Settle Event
        </button>
    )

    return (
        <ActionDrawer title="Settle Event" actionComponent={actionButton}>
            <div className='flex flex-col h-full'>
                <div className='flex-1 flex-grow'>
                    <p>Settling an event is final and no changes can be made after. Make sure you have checked in all attendees.</p>
                </div>

                <div className='flex flex-col justify-end gap-4 mt-4'>
                    <button
                        type='button'
                        disabled={eventManagement.loading || !eventData.canSettle}
                        onClick={() => eventManagement.Settle(props.id)}
                        className='btn btn-accent btn-sm w-full'>
                        {eventManagement.loading && (
                            <>
                                Loading
                                <span className='loading loading-spinner h-4 w-4' />
                            </>
                        )}
                        {!eventManagement.loading && <>Settle Event</>}
                    </button>
                </div>
            </div>
        </ActionDrawer>
    )
}
