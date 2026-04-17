import { createClient } from '@sanity/client'
import { sanityConfig } from './config'

export function getClient(writeToken?: string) {
  return createClient({
    ...sanityConfig,
    token: writeToken,
    useCdn: !writeToken,
  })
}

export const client = getClient()

export const writeClient = getClient(process.env.SANITY_API_WRITE_TOKEN)
