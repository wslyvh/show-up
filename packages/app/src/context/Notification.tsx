'use client'

import { waitForTransaction } from '@wagmi/core'
import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react'
import { fetchEnsName } from 'wagmi/actions'

interface Notification {
  created: number
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  from?: string
  cta?: { label: string; href: string }
  data?: any
}

interface NotificationContext {
  new: boolean
  notifications: Notification[]
  Add: (notification: Notification) => Promise<void>
  MarkAsRead: () => void
  Clear: () => void
}

const defaultState: NotificationContext = {
  new: false,
  notifications: [],
  Add: () => Promise.resolve(),
  MarkAsRead: () => {},
  Clear: () => {},
}

export const useNotifications = () => useContext(NotificationContext)

const NotificationContext = createContext(defaultState)
const localStorageKey = 'showup.notifications'

export function NotificationProvider(props: PropsWithChildren) {
  const [state, setState] = useState<NotificationContext>({
    ...defaultState,
    Add,
    MarkAsRead,
    Clear,
  })

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const notifications = localStorage.getItem(localStorageKey)
      if (notifications) {
        setState((state) => ({ ...state, notifications: JSON.parse(notifications) }))
      }
    }
  }, [])

  async function Add(notification: Notification) {
    await saveNotification(notification)

    if (notification.data?.hash) {
      console.log('Wait for transaction', notification.data.hash)
      try {
        await waitForTxNotification(notification.data.hash, notification)
      } catch (e) {
        // will re-try once, as its most likely a RPC issue
        try {
          await waitForTxNotification(notification.data.hash, notification)
        } catch (e) {
          //
        }
      }
    }
  }

  async function waitForTxNotification(hash: string, notification: Notification) {
    try {
      const data = await waitForTransaction({
        hash: notification.data.hash,
      })

      if (data.status === 'success') {
        return saveNotification({
          ...notification,
          type: 'success',
          message: 'Transaction completed',
        })
      }

      if (data.status === 'reverted') {
        return saveNotification({
          ...notification,
          type: 'error',
          message: 'Transaction failed',
        })
      }
    } catch (e) {
      console.log('Unable to wait for transaction')
    }
  }

  function MarkAsRead() {
    setState((state) => ({
      ...state,
      new: false,
    }))
  }

  function Clear() {
    console.log('Clear Notifications')

    state.notifications = []
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(localStorageKey)
    }
  }

  async function saveNotification(notification: Notification) {
    if (notification.from) {
      try {
        const name = await fetchEnsName({
          address: notification.from,
          chainId: 1,
        })

        if (name) notification.from = name
      } catch (e) {
        // Unable to fetch ENS name (unsupported chain)
      }
    }

    const notifications = [...state.notifications, notification]
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(localStorageKey, JSON.stringify(notifications))
    }

    setState((state) => ({
      ...state,
      new: true,
      notifications: notifications,
    }))
  }

  if (typeof window === 'undefined') {
    return <>{props.children}</>
  }

  return <NotificationContext.Provider value={state}>{props.children}</NotificationContext.Provider>
}
