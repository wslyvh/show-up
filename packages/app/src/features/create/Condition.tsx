'use client'

import { ConditionModule } from '@/utils/types'
import React, { ChangeEvent, useState } from 'react'

export function ConditionStep() {
    const [condition, setCondition] = useState<ConditionModule>({
        type: 'BasicEther',
        address: '',
        tokenAddress: '',
        endDate: '', // use event.endDate as default 
        depositFee: 0.02,
        maxParticipants: 0,
    })

    function onCurrencyChange(value: string) {
        console.log('Handle currency change')
        if (value === 'Ether') {
            setCondition((state) => {
                return {
                    ...state,
                    type: 'BasicEther',
                }
            })
        }
    }

    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        if (!e.target.id) return

        setCondition((state) => {
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
                        Deposit fee <span className='text-accent'>*</span>
                    </span>
                </label>

                <div className='flex gap-4'>
                    <select id='currency' className="select select-bordered select-sm w-32"
                        onChange={(e) => onCurrencyChange(e.target.value)}
                        required>
                        <option selected>Ether</option>
                        <option>DAI</option>
                        <option>USDC</option>
                    </select>
                    <input
                        id='depositFee'
                        type='text'
                        className='input input-sm input-bordered w-full'
                        value={condition.depositFee}
                        onChange={handleChange} />
                </div>
            </div>


            <div className='form-control w-full'>
                <label className='label' htmlFor='maxParticipants'>
                    <span className='label-text'>
                        Max. participants <span className='text-accent'>*</span>
                    </span>
                </label>
                <input
                    id='maxParticipants'
                    type='text'
                    className='input input-sm input-bordered w-full'
                    value={condition.maxParticipants}
                    onChange={handleChange} />
            </div>
        </form>
    )
}
