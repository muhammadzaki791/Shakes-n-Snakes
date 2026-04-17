import { createImageUrlBuilder } from '@sanity/image-url'
import { dataset, projectId } from '../env'

const builder = createImageUrlBuilder({ projectId, dataset })

export function urlFor(source: { asset: { _ref: string; _type: string } }) {
  return builder.image(source)
}
