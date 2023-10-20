import { ConnectKitButton } from 'connectkit'
import React from 'react'

export function Connect() {
  return (
    <ConnectKitButton.Custom>
      {({ show }) => {
        return (
          <button onClick={show} className='btn btn-sm btn-primary'>
            Connect
          </button>
        )
      }}
    </ConnectKitButton.Custom>
  )
}
