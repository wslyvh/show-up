import type { Metadata, Viewport } from 'next'
import { PropsWithChildren } from 'react'
import { BLOG_DOMAIN, BLOG_NAME, BLOG_URL, SITE_DESCRIPTION, SITE_NAME, SOCIAL_TWITTER } from "app/src/utils/site"
import PlausibleProvider from 'next-plausible'
import { BlogLayout } from '@/components/Layout'
import '../assets/globals.css'

export const metadata: Metadata = {
  applicationName: BLOG_NAME,
  title: {
    default: BLOG_NAME,
    template: `%s · ${BLOG_NAME}`,
  },
  metadataBase: new URL(BLOG_URL),
  description: SITE_DESCRIPTION,
  openGraph: {
    type: 'website',
    title: BLOG_NAME,
    siteName: BLOG_NAME,
    description: SITE_DESCRIPTION,
    url: BLOG_URL,
    images: `${BLOG_URL}/opengraph-image`,
  },
  twitter: {
    card: 'summary_large_image',
    site: SOCIAL_TWITTER,
    title: BLOG_NAME,
    description: SITE_DESCRIPTION,
    images: `${BLOG_URL}/opengraph-image`,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  height: 'device-height',
  initialScale: 1.0,
  viewportFit: 'cover',
  themeColor: '#000000',
}

export default function RootLayout(props: PropsWithChildren) {
  return (
    <html lang='en'>
      <head>
        <PlausibleProvider domain={BLOG_DOMAIN} />
        <link rel="icon" href="/icons/favicon.ico" sizes="any" />
        <link rel="shortcut icon" href="/icons/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon-180x180.png" type="image/png" sizes="any" />
      </head>
      <body>
        <BlogLayout>{props.children}</BlogLayout>
      </body>
    </html>
  )
}
