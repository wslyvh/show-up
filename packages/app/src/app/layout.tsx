import type { Metadata } from 'next'
import { PropsWithChildren } from 'react'
import { SITE_DESCRIPTION, SITE_DOMAIN, SITE_NAME } from '@/utils/site'
import { MobileLayout } from '@/components/MobileLayout'
import { Web3Provider } from '@/context/Web3'
import { EventManagementProvider } from '@/context/EventManagement'
import { NotificationProvider } from '@/context/Notification'
import PlausibleProvider from 'next-plausible'
import DataProvider from '@/context/Data'
import '../assets/globals.css'

export const metadata: Metadata = {
  applicationName: SITE_NAME,
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  manifest: '/manifest.json',
  appleWebApp: {
    title: SITE_NAME,
    capable: true,
    statusBarStyle: 'default',
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
  },
  twitter: {
    card: 'summary',
  },
}

export default function RootLayout(props: PropsWithChildren) {
  return (
    <html lang='en'>
      <head>
        <PlausibleProvider domain={SITE_DOMAIN} />
      </head>
      <body>
        <Web3Provider>
          <NotificationProvider>
            <DataProvider>
              <EventManagementProvider>
                <MobileLayout>{props.children}</MobileLayout>
              </EventManagementProvider>
            </DataProvider>
          </NotificationProvider>
        </Web3Provider>
      </body>
    </html>
  )
}
