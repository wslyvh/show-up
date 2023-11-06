import { GetRecords } from '@/services/protocol'
import { SITE_URL } from '@/utils/site'
import { Status } from '@/utils/types'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const events = await GetRecords()
  const pages = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1,
    },
    ...events.map((i) => {
      const isActive = Status[i.status.valueOf()] == Status.Active.toString()
      const isCancelled = Status[i.status.valueOf()] == Status.Cancelled.toString()
      return {
        url: `${SITE_URL}/events/${i.id}`,
        lastModified: new Date(i.updatedAt ?? i.createdAt),
        changeFrequency: isActive ? 'daily' : 'never',
        priority: isCancelled ? 0.1 : isActive ? 0.8 : 0.5,
      } as any
    })
  ]

  return pages
}
