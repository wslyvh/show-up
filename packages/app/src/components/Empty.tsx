import { InboxIcon } from '@heroicons/react/24/outline'
import React from 'react'

interface Props {
  text?: string
}

export function Empty(props: Props) {
  return (
    <div className='flex flex-col items-center'>
      <InboxIcon className='w-12 h-12 text-gray-500 my-4' />
      <p className='text-xs text-gray-400'>{props.text ?? 'No data..'}</p>
    </div>
  )
}
