import React, { ReactNode } from 'react'
import Link from 'next/link'

interface Props {
  href: string
  children: ReactNode
  download?: boolean | string
  ariaLabel?: string
  isExternal?: boolean
  className?: string
}

export function LinkComponent(props: Props) {
  if (!props.href) return <>{props.children}</>
  const className = props.className ?? ''
  const isExternal = props.href.match(/^([a-z0-9]*:|.{0})\/\/.*$/) || props.isExternal

  if (isExternal) {
    return (
      <Link
        className={className}
        href={props.href}
        download={props.download}
        target='_blank'
        rel='noopener noreferrer'
        aria-label={props.ariaLabel}>
        {props.children}
      </Link>
    )
  }

  return (
    <Link className={className} href={props.href} download={props.download} aria-label={props.ariaLabel}>
      {props.children}
    </Link>
  )
}
