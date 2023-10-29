import { defaultOpenGraphImage } from '@/components/OpenGraph'
import { SITE_NAME } from '@/utils/site'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = SITE_NAME
export const size = { width: 1200, height: 630 }

export const contentType = 'image/png'

export default async function Image() {
  return defaultOpenGraphImage()
}
