import { client } from '@/lib/client'
import { getCategoryBySlugQuery } from '@/lib/client/queries'

export async function getCategoryBySlug(slug: string) {
  return client.fetch(getCategoryBySlugQuery, { slug })
}
