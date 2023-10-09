import { EventMetadata } from '@/utils/types'
import { Card } from './Card'
import { Tabs } from './Tabs'

interface Props {
    events: EventMetadata[]
}

export function Overview(props: Props) {
    return (
        <>
            <Tabs options={['Upcoming', 'Past']} />

            <div className="flex flex-col gap-2">
                {props.events.map((event) => (
                    <Card key={event.id} event={event} />
                ))}
            </div>
        </>
    )
}
