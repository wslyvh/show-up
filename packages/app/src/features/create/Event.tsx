'use client'

import { SelectBox } from '@/components/SelectBox'
import { useEventManagement } from '@/context/EventManagement'
import React, { ChangeEvent } from 'react'

export function EventStep() {
    const eventManagement = useEventManagement()

    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        if (!e.target.id) return

        setMetadata(e.target.id, e.target.value)
    }

    function setMetadata(key: string, value: string) {
        eventManagement.onChange({
            ...eventManagement,
            event: {
                ...eventManagement.event,
                [key]: value,
            }
        })
    }

    return (
        <form>
            <div className='form-control w-full'>
                <label className='label' htmlFor='title'>
                    <span className='label-text'>
                        Title <span className='text-accent'>*</span>
                    </span>
                </label>
                <input
                    id='title'
                    type='text'
                    className='input input-sm input-bordered w-full'
                    value={eventManagement.event.title}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className='form-control w-full'>
                <label className='label' htmlFor='description'>
                    <span className='label-text'>Description</span>
                </label>
                <textarea
                    id='description'
                    className='textarea textarea-sm textarea-bordered h-24 w-full'
                    value={eventManagement.event.description}
                    onChange={handleChange}
                />
            </div>

            <div className='flex flex-row justify-between form-control w-full gap-4'>
                <div className='flex-grow'>
                    <label className='label' htmlFor='start'>
                        <span className='label-text'>
                            Start <span className='text-accent'>*</span>
                        </span>
                    </label>
                    <input
                        id='start'
                        type='datetime-local'
                        className='input input-sm input-bordered w-full'
                        value={eventManagement.event.start}
                        onChange={handleChange}
                    />
                </div>
                <div className='flex-grow'>
                    <label className='label' htmlFor='end'>
                        <span className='label-text'>
                            End <span className='text-accent'>*</span>
                        </span>
                    </label>
                    <input
                        id='end'
                        type='datetime-local'
                        className='input input-sm input-bordered w-full'
                        value={eventManagement.event.end}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className='form-control w-full'>
                <label className='label' htmlFor='timezone'>
                    <span className='label-text'>
                        Timezone <span className='text-accent'>*</span>
                    </span>
                </label>
                <SelectBox id='timezone'
                    options={Intl.supportedValuesOf('timeZone')}
                    defaultValue={eventManagement.event.timezone}
                    onChange={(value) => setMetadata('timezone', value)} />
            </div>

            <div className='form-control w-full'>
                <label className='label' htmlFor='location'>
                    <span className='label-text'>
                        Location <span className='text-accent'>*</span>
                    </span>
                </label>
                <input
                    id='location'
                    type='text'
                    className='input input-sm input-bordered w-full'
                    value={eventManagement.event.location}
                    onChange={handleChange} />
            </div>

            <div className='form-control w-full'>
                <label className='label' htmlFor='website'>
                    <span className='label-text'>
                        Website <span className='text-accent'>*</span>
                    </span>
                </label>
                <input
                    id='website'
                    type='text'
                    className='input input-sm input-bordered w-full'
                    value={eventManagement.event.website}
                    onChange={handleChange} />
            </div>
        </form>
    )
}
