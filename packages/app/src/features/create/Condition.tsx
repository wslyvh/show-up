'use client'

import { useEventManagement } from '@/context/EventManagement'
import { TOKENS } from '@/utils/network'
import { ConditionModuleType } from '@/utils/types'
import React, { ChangeEvent } from 'react'
import { formatUnits } from 'viem/utils'
import { useNetwork } from 'wagmi'

export function ConditionStep() {
    const { chain } = useNetwork();
    const floatRegExp = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$')
    const eventManagement = useEventManagement()

    function onCurrencyChange(value: string) {
        if (value === 'Ether') {
            setConditions('type', ConditionModuleType.BasicEther)
            setConditions('tokenAddress', '')
            return
        }

        setConditions('type', ConditionModuleType.BasicToken)
        setConditions('tokenAddress', value)
    }

    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        if (!e.target.id) return

        if (e.target.id === 'depositFee' && floatRegExp.test(e.target.value)) {
            setConditions(e.target.id, BigInt(e.target.value * 10 ** 18))
            return
        }

        setConditions(e.target.id, e.target.value)
    }

    function setConditions(key: string, value: string | bigint) {
        eventManagement.onChange({
            ...eventManagement,
            conditions: {
                ...eventManagement.conditions,
                [key]: value,
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
                        value={eventManagement.conditions.tokenAddress ? eventManagement.conditions.tokenAddress : ''}
                        required>
                        <option value=''>Ether</option>
                        {TOKENS.filter(i => i.chainId === chain?.id).map((token) => (
                            <option value={token.address}>{token.symbol}</option>
                        ))}
                    </select>
                    <input
                        id='depositFee'
                        type='number'
                        min="0.00"
                        step="0.01"
                        max="1000.00"
                        className='input input-sm input-bordered w-full'
                        value={formatUnits(eventManagement.conditions.depositFee as bigint, 18)}
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
                    value={eventManagement.conditions.maxParticipants}
                    onChange={handleChange} />
            </div>
        </form>
    )
}
