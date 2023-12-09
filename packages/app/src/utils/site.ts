export const SITE_EMOJI = '😎👋'
export const SITE_NAME = 'Show Up'
export const SITE_SHORT_NAME = 'Sup'
export const SITE_DESCRIPTION = 'Earn $$ by showing up!'
export const SITE_INFO = 'Onchain RSVP and Event management'
export const SITE_DOMAIN = 'showup.events'
export const SITE_URL = process.env.NODE_ENV === 'development' ? `https://test.${SITE_DOMAIN}` : `https://www.${SITE_DOMAIN}`

export const BLOG_NAME = 'Show Up Blog'
export const BLOG_DOMAIN = 'blog.showup.events'
export const BLOG_URL = `https://${BLOG_DOMAIN}`

export const SOCIAL_TWITTER = 'wslyvh'
export const SOCIAL_GITHUB = 'wslyvh/show-up'

export const DEFAULT_REVALIDATE_PERIOD = 600 // in seconds // 600 = 10 mins // 3600 = 1 hour
export const DEFAULT_STALE_TIME = 60 * 1000 // in milliseconds // 60 * 1000 = 1 min
