import { Metadata } from 'next/types'
import { PropsWithChildren } from 'react'
import {
  DEFAULT_REVALIDATE_PERIOD,
  SITE_DESCRIPTION,
  SITE_DOMAIN,
  SITE_NAME,
  SITE_URL,
  SOCIAL_TWITTER,
} from '@/utils/site'
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
    default: `${SITE_NAME} Events`,
    template: `${SITE_NAME} @ %s`,
  },
  metadataBase: new URL(SITE_URL),
  description: SITE_DESCRIPTION,
  manifest: '/manifest.json',
  themeColor: '#000000',
  appleWebApp: {
    title: SITE_NAME,
    capable: true,
    statusBarStyle: 'black-translucent',
  },
  openGraph: {
    type: 'website',
    title: SITE_NAME,
    siteName: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: '/opengraph-image',
  },
  twitter: {
    card: 'summary_large_image',
    site: SOCIAL_TWITTER,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: '/opengraph-image',
  },
}

export const revalidate = DEFAULT_REVALIDATE_PERIOD

export default function RootLayout(props: PropsWithChildren) {
  return (
    <html lang='en'>
      <head>
        <PlausibleProvider domain={SITE_DOMAIN} />
        <link rel='icon' href='/icons/favicon.ico' sizes='any' />
        <link rel='shortcut icon' href='/icons/favicon.ico' sizes='any' />
        <link rel='apple-touch-icon' href='/icons/apple-touch-icon-180x180.png' type='image/png' sizes='any' />
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
