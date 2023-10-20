import { Connect } from '@/components/Connect'
import React from 'react'

export function Login() {
  return (
    <div className='flex flex-col'>
      <div className='form-control w-full'>
        <label className='label'>
          <span className='label-text'>Sign-in with Ethereum</span>
        </label>

        <Connect />
      </div>

      <div className='divider mt-8'>OR</div>

      <div className='flex flex-col gap-4'>
        <div className='form-control w-full'>
          <label className='label'>
            <span className='label-text'>Sign-in with Email</span>
          </label>
          <input type='text' placeholder='Your email' className='input input-bordered w-full' />
        </div>

        <div className='form-control w-full'>
          <button className='btn btn-sm btn-primary'>Sign in</button>
        </div>
      </div>
    </div>
  )
}
