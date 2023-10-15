'use client'

import React, { useState } from 'react'
import { EventStep } from './Event'
import { ConditionStep } from './Condition'
import { ReviewStep } from './Review'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { useEventManagement } from '@/context/EventManagement'

const steps = ['Event', 'Conditions', 'Review']

export function CreateForm() {
    const eventManagement = useEventManagement()
    const [message, setMessage] = useState()
    const [activeStep, setActiveStep] = useState(0)

    async function submit() {
        await eventManagement.create({ ...eventManagement })
    }

    return (
        <div>
            <ul className="steps w-full">
                {steps.map((step, i) => (
                    <li key={i} className={`step text-sm ${activeStep >= i ? 'step-primary' : ''}`}>
                        <span className='text-xs mt-2'>{step}</span>
                    </li>
                ))}
            </ul>

            {message && (
                <div className='alert alert-error text-sm py-2 px-4 mt-8'>
                    <InformationCircleIcon className='h-6 w-6 text-error-400' />
                    <span>{message}</span>
                </div>
            )}

            <div className='my-4'>
                {activeStep === 0 && <EventStep />}
                {activeStep === 1 && <ConditionStep />}
                {activeStep === 2 && <ReviewStep />}
            </div>

            <div className='flex justify-between'>
                <button className='btn btn-outline btn-sm'
                    disabled={activeStep === 0}
                    onClick={() => setActiveStep(activeStep - 1)}>Previous</button>

                <button className='btn btn-outline btn-sm'
                    disabled={activeStep === steps.length - 1}
                    onClick={() => setActiveStep(activeStep + 1)}>Next</button>
            </div>

            <div className='flex justify-end mt-4'>
                <button className='btn btn-sm btn-primary' onClick={submit}>Create Event</button>
            </div>
        </div>
    )
}
