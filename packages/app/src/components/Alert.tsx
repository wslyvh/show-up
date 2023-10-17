import React from 'react'
import { CheckCircleIcon, ExclamationCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

interface Props {
  type: 'success' | 'info' | 'warning' | 'error'
  message: string
  className?: string
}

export function Alert(props: Props) {
  let className = `alert alert-${props.type}`
  if (props.className) className += ` ${props.className}`
  const iconClassName = `stroke-${props.type} shrink-0 h-6 w-6 text-${props.type}-400`

  return (
    <div className={className}>
      {props.type === 'success' && <CheckCircleIcon className={iconClassName} />}
      {props.type === 'info' && <InformationCircleIcon className={iconClassName} />}
      {props.type === 'warning' && <ExclamationTriangleIcon className={iconClassName} />}
      {props.type === 'error' && <ExclamationCircleIcon className={iconClassName} />}
      <span>{props.message}</span>
    </div>
  )
}
