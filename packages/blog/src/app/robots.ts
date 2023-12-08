import { BLOG_URL } from 'app/src/utils/site'
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${BLOG_URL}/sitemap.xml`,
  }
}
