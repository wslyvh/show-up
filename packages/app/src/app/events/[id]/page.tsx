import { DateCard } from "@/components/Date";
import { CalendarDaysIcon, MapPinIcon, UserIcon } from "@heroicons/react/24/outline";
import Image from 'next/image'
import dayjs from "dayjs";
import { DUMMY_EVENTS_DATA } from "@/app/page";

export default function Page() {
    const record = DUMMY_EVENTS_DATA[0]
    const event = record.metadata
    if (!event) return null

    const sameDay = dayjs(event.start).isSame(event.end, 'day')

    return <>
        <div className='flex flex-col bg-neutral rounded-lg'>
            <div className='w-full h-[240px]'>
                <Image
                    width={0}
                    height='240'
                    src={event.imageUrl}
                    alt='Event Image'
                    sizes='100vw'
                    className='rounded-t-lg w-full h-full object-cover'
                />
            </div>

            <div className='relative'>
                <div className='absolute right-16 -top-8'>
                    <DateCard date={event.start} />
                </div>
            </div>

            <div className='mt-2 p-8'>
                <h1 className='text-xl text-white font-bold'>{event.title}</h1>
                <div className='flex flex-col mt-4 gap-2'>
                    <p className='flex flex-row items-center gap-2'>
                        <CalendarDaysIcon className='h-5 w-5 text-info' /> {dayjs(event.start).format('ddd MMM DD · HH:mm')} -{' '}
                        {dayjs(event.end).format(sameDay ? 'HH:mm' : 'ddd MMM DD · HH:mm')}
                    </p>
                    <p className='flex flex-row items-center gap-2'>
                        <MapPinIcon className='h-5 w-5 text-info' /> {event.location}
                    </p>
                    <p className='flex flex-row items-center gap-2'>
                        <UserIcon className='h-5 w-5  text-info' /> {record.attendees.length} going
                    </p>
                </div>

                <div className='relative'>
                    <div className='absolute right-8 -top-8'>
                        <button
                            type='button'
                            className='btn btn-accent btn-outline btn-sm'>&nbsp;Attend&nbsp;</button>
                    </div>
                </div>

                <p className='mt-8'>{event.description}</p>
            </div>
        </div>
    </>
}