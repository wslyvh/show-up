import { CONFIG } from '@/utils/config'
import { SITE_URL } from '@/utils/site'
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  if (CONFIG.NETWORK_ENV === 'test') {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    }
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
