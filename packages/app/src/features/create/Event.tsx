'use client'

import { SelectBox } from '@/components/SelectBox'
import { DEFAULT_APP_ID } from '@/utils/showup'
import { EventMetadata } from '@/utils/types'
import dayjs from 'dayjs'
import React, { ChangeEvent, useState } from 'react'

export function EventStep() {
    const [metadata, setMetadata] = useState<EventMetadata>({
        appId: DEFAULT_APP_ID,
        title: '',
        description: '',
        start: dayjs().hour(10).minute(0).second(0).format('YYYY-MM-DDTHH:mm:ss'),
        end: dayjs().hour(13).minute(0).second(0).format('YYYY-MM-DDTHH:mm:ss'),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        location: '',
        website: '',
        imageUrl: '',
        links: [],
        tags: [],
    })

    async function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        if (!e.target.id) return

        setMetadata((state) => {
            return {
                ...state,
                [e.target.id]: e.target.value,
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
                    value={metadata.title}
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
                    value={metadata.description}
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
                        id='startsAt'
                        type='datetime-local'
                        className='input input-sm input-bordered w-full'
                        value={metadata.start}
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
                        value={metadata.end}
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
                    defaultValue={metadata.timezone}
                    onChange={(value) => {
                        setMetadata((state) => {
                            return {
                                ...state,
                                timezone: value,
                            }
                        })
                    }} />
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
                    value={metadata.location}
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
                    value={metadata.website}
                    onChange={handleChange} />
            </div>
        </form>
    )
}
