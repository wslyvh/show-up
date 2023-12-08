import { GetPosts } from '@/utils/data'
import { BLOG_URL } from 'app/src/utils/site'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = GetPosts()
  const pages = [
    {
      url: BLOG_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...posts.map((i) => {
      return {
        url: `${BLOG_URL}/${i.slug}`,
        lastModified: new Date(i.date),
        changeFrequency: 'never',
        priority: 0.6,
      } as any
    }),
  ]

  return pages
}
