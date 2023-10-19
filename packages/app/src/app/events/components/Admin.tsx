import { useEventManagement } from '@/context/EventManagement'
import { Record } from '@/utils/types'

interface Props {
    record: Record
}

export function AdminPanel(props: Props) {
    const eventManagement = useEventManagement()

    return (
        <div className='flex w-full justify-between'>
            <button type='button'
                onClick={() => eventManagement.Cancel(props.record.id)}
                className='btn btn-accent btn-outline btn-sm'>
                Cancel
            </button>
            <button type='button'
                onClick={() => eventManagement.Checkin(props.record.id, ['0x8289432ACD5EB0214B1C2526A5EDB480Aa06A9ab'])}
                className='btn btn-accent btn-outline btn-sm'>
                Checkin
            </button>
            <button type='button'
                onClick={() => eventManagement.Settle(props.record.id)}
                className='btn btn-accent btn-outline btn-sm'>
                Settle
            </button>
        </div>
    )
}