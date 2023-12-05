import type { Metadata } from 'next'
import { PropsWithChildren } from 'react'
import { BLOG_DOMAIN, BLOG_NAME, BLOG_URL, DEFAULT_REVALIDATE_PERIOD, SITE_NAME } from "app/src/utils/site"
import PlausibleProvider from 'next-plausible'
import { BlogLayout } from '@/components/Layout'
import '../assets/globals.css'

export const metadata: Metadata = {
  applicationName: BLOG_NAME,
  title: {
    default: BLOG_NAME,
    template: `%s @ ${SITE_NAME} Blog`,
  },
  metadataBase: new URL(BLOG_URL),
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
