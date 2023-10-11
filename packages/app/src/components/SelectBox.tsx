'use client'

import { useState } from 'react'
import { Combobox } from '@headlessui/react'

interface Props {
    id?: string
    options: string[]
    defaultValue?: string
    onChange: (value: string) => void
}

export function SelectBox(props: Props) {
    const [value, setValue] = useState(props.defaultValue)
    const [query, setQuery] = useState('')

    const filtered =
        query === ''
            ? props.options
            : props.options.filter((i: string) => {
                return i.toLowerCase().includes(query.toLowerCase())
            })

    function handleChange(value: string) {
        setValue(value)
        props.onChange(value)
    }


    return (
        <Combobox as='div' id={props.id} className='relative' value={value} onChange={handleChange}>
            <>
                <Combobox.Input
                    onChange={(event) => setQuery(event.target.value)}
                    className="input input-sm input-bordered w-full"
                />
                <Combobox.Options className="absolute top-12 bg-neutral border border-1 rounded-lg max-h-60 w-full overflow-auto">
                    {filtered.map((i) => {
                        let className = 'py-2 px-4  text-sm cursor-pointer hover:bg-base-100'
                        if (i === value) className += ' text-white font-bold'

                        return (
                            <Combobox.Option key={i} value={i} className={className}>
                                {i}
                            </Combobox.Option>
                        )
                    })}
                </Combobox.Options>
            </>
        </Combobox>
    )
}
