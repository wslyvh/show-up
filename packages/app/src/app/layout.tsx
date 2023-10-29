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
  themeColor: '#000000',
  viewport: 'width=device-width, initial-scale=1.0, viewport-fit=cover',
  appleWebApp: {
    title: SITE_NAME,
    capable: true,
    statusBarStyle: 'black-translucent',
  },
  openGraph: {
    type: 'website',
    title: SITE_NAME,
    siteName: SITE_NAME,
    images: '/opengraph-image.png',
  },
  twitter: {
    card: 'summary',
    title: SITE_NAME,
    images: '/opengraph-image.png',
  },
}

export default function RootLayout(props: PropsWithChildren) {
  return (
    <html lang='en'>
      <head>
        <PlausibleProvider domain={SITE_DOMAIN} />
        <link rel="icon" href="/icons/favicon.ico" sizes="any" />
        <link rel="shortcut icon" href="/icons/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon-180x180.png" type="image/png" sizes="any" />
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
