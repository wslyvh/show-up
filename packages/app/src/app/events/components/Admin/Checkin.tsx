'use client'

import { ActionDrawer } from '@/components/ActionDrawer'
import { useEventManagement } from '@/context/EventManagement'
import { useState } from 'react'

interface Props {
    id: string
}

export function Checkin(props: Props) {
    const eventManagement = useEventManagement()
    const [attendees, setAttendees] = useState<string[]>([])

    function onAttendeeChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        if (!e.target.value) return

        setAttendees(e.target.value.split('\n'))
    }

    return (
        <ActionDrawer title="Check-in attendees">
            <div className='flex flex-col h-full'>
                <p>Provide a list of addresses to check-in. Addresses must be registered before being able to check in.</p>

                <div className='flex-1 flex-grow'>
                    <div className='form-control w-full mt-4'>
                        <label className='label' htmlFor='timezone'>
                            <span className='label-text'>
                                Attendees <span className='text-accent'>*</span>
                            </span>
                        </label>

                        <textarea
                            className='textarea textarea-bordered w-full'
                            placeholder='One address per line..'
                            onChange={onAttendeeChange}
                        />
                    </div>
                </div>

                <div>
                    <button
                        type='button'
                        onClick={() => eventManagement.Checkin(props.id, attendees)}
                        className='btn btn-accent btn-sm w-full'>
                        Check-in
                    </button>
                </div>
            </div>
        </ActionDrawer>
    )
}
