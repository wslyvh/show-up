import React from 'react'

interface Props {
  text?: string
}

export function Loading(props: Props) {
  return (
    <div className='flex flex-col items-center'>
      <span className='loading loading-ring loading-lg w-12 h-12 text-gray-500 my-4'></span>
      <p className='text-xs text-gray-400'>{props.text ?? 'Loading..'}</p>
    </div>
  )
}
