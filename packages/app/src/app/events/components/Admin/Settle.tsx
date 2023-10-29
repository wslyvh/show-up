'use client'

import { ActionDrawer } from '@/components/ActionDrawer'
import { useEventManagement } from '@/context/EventManagement'

interface Props {
    id: string
}

export function Settle(props: Props) {
    const eventManagement = useEventManagement()

    return (
        <ActionDrawer title="Settle Event">
            <div className='flex flex-col h-full'>
                <p>You can only settle events that have ended and have checked-in participants.</p>

                <div className='flex-1 flex-grow'></div>

                <div>
                    <button
                        type='button'
                        onClick={() => eventManagement.Settle(props.id)}
                        className='btn btn-accent btn-sm w-full'>
                        Settle
                    </button>
                </div>
            </div>
        </ActionDrawer>
    )
}
