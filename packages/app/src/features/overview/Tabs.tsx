'use client'

import { useState } from 'react'

interface Props {
    options: string[]
    onSelect?: (option: string) => void
}

export function Tabs(props: Props) {
    const [active, setActive] = useState(props.options[0])

    return (
        <div className="tabs tabs-boxed grid grid-flow-col my-4">
            {props.options.map((option) => (
                <a
                    key={option}
                    className={`tab ${option === active ? 'tab-active' : ''}`}
                    onClick={() => {
                        setActive(option)
                        if (props.onSelect) props.onSelect(option)
                    }}>
                    {option}
                </a>
            ))}
        </div>
    )
}
