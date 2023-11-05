import { ActionDrawer } from '@/components/ActionDrawer'
import { useEventData } from '@/context/EventData'
import { useEventManagement } from '@/context/EventManagement'
import { useState } from 'react'

interface Props {
    id: string
}

export function Cancel(props: Props) {
    const eventManagement = useEventManagement()
    const eventData = useEventData()
    const [reason, setReason] = useState('')
    const actionButton = (
        <button type='button' className='btn btn-accent btn-outline btn-sm w-full'>
            Cancel Event
        </button>
    )

    return (
        <ActionDrawer title="Cancel Event" actionComponent={actionButton}>
            <div className='flex flex-col h-full'>
                <div className='flex-1 flex-grow'>
                    <p>Cancelling an event is final and no changes can be made after. It removes it from the calendar and refunds any existing deposits.</p>

                    <div className='form-control w-full mt-4'>
                        <label className='label' htmlFor='title'>
                            <span className='label-text'>
                                Reason
                            </span>
                        </label>
                        <input
                            id='title'
                            type='text'
                            required
                            className='input input-sm input-bordered w-full'
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>
                </div>

                <div className='flex flex-col justify-end gap-4 mt-4'>
                    <button
                        type='button'
                        disabled={eventManagement.loading || !eventData.canCancel}
                        onClick={() => eventManagement.Cancel(props.id, reason)}
                        className='btn btn-accent btn-sm w-full'>
                        {eventManagement.loading && (
                            <>
                                Loading
                                <span className='loading loading-spinner h-4 w-4' />
                            </>
                        )}
                        {!eventManagement.loading && <>Cancel Event</>}
                    </button>
                </div>
            </div>
        </ActionDrawer>
    )
}
