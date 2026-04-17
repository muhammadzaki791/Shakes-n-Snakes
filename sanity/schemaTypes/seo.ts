import { defineField, defineType } from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'document',
  icon: () => '🔍',
  fields: [
    defineField({ name: 'pageSlug', title: 'Page Slug', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'pageTitle', title: 'Page Title', type: 'string', validation: (r) => r.required().max(70) }),
    defineField({ name: 'pageDescription', title: 'Description', type: 'text', validation: (r) => r.required().max(160) }),
    defineField({ name: 'ogImage', title: 'OG Image', type: 'image' }),
    defineField({ name: 'keywords', title: 'Keywords', type: 'array', of: [{ type: 'string' }], validation: (r) => r.max(10) }),
    defineField({ name: 'canonicalUrl', title: 'Canonical URL', type: 'url' }),
    defineField({ name: 'noIndex', title: 'No Index', type: 'boolean', initialValue: false }),
  ],
  preview: {
    select: { title: 'pageSlug', subtitle: 'pageTitle' },
  },
})
