import { SITE_URL } from '@/utils/site'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // const events = await GetAllEvents()
  const pages = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1,
    },
    // {
    //   url: `${SITE_URL}/past`,
    //   lastModified: new Date(),
    //   changeFrequency: 'always',
    //   priority: 0.8,
    // },
    // ...events.map((i) => {
    //   const isActive = i.status == Status.Active
    //   const isCancelled = i.status == Status.Cancelled

    //   return {
    //     url: `${SITE_URL}/events/${i.id}`,
    //     lastModified: new Date(i.createdAt),
    //     changeFrequency: isActive ? 'daily' : 'never',
    //     priority: isCancelled ? 0.1 : isActive ? 0.6 : 0.4,
    //   } as any
    // }),
  ]

  return pages as any
}
