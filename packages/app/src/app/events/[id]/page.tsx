import { DUMMY_EVENTS_DATA } from "@/app/page";
import { EventDetails } from "@/features/details/Event";

// TODO: handle data fetching from indexer

export default function Page() {
    const record = DUMMY_EVENTS_DATA[0]
    const event = record.metadata
    if (!event) return null

    return <>
        <EventDetails event={event} conditions={record.conditions} />
    </>
}