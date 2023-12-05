import dayjs from 'dayjs'
import Link from 'next/link'
import { Post } from '@/utils/types'

interface Props {
    post: Post
}

export function Card({ post }: Props) {
    return (
        <Link href={`/${post.slug}`}>
            <div className='flex rounded-lg bg-neutral text-neutral-content p-4 hover:ring hover:ring-1'>
                <div className='w-full'>
                    <p className='uppercase text-secondary text-sm'>{dayjs(post.date).format('ddd MMM DD')}</p>
                    <h2 className='text-xl font-bold mt-2'>{post.title}</h2>
                    <p className='flex flex-row items-center gap-1 text-sm mt-4'>{post.description}</p>
                </div>
            </div>
        </Link>
    )
}
