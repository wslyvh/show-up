'use client'

import { ActionDrawer } from '@/components/ActionDrawer'
import { useEventManagement } from '@/context/EventManagement'
import { useState } from 'react'

interface Props {
    id: string
}

export function Cancel(props: Props) {
    const eventManagement = useEventManagement()
    const [reason, setReason] = useState('')

    return (
        <ActionDrawer title="Cancel Event">
            <div className='flex flex-col h-full'>
                <p>Cancelling an event completely removes it and refunds any existing deposits. This is an irreversible.</p>

                <div className='flex-1 flex-grow'>
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

                <div>
                    <button
                        type='button'
                        onClick={() => eventManagement.Cancel(props.id, reason)}
                        className='btn btn-accent btn-sm w-full'>
                        Cancel
                    </button>
                </div>
            </div>
        </ActionDrawer>
    )
}
