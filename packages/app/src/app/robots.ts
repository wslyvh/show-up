import { CONFIG } from '@/utils/config'
import { SITE_URL } from '@/utils/site'
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  if (CONFIG.DEFAULT_CHAIN_ID === 11155111) {
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
