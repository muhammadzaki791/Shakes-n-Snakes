import { defineField, defineType } from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required().max(100) }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 }, validation: (r) => r.required() }),
    defineField({ name: 'parentCategory', title: 'Parent Category', type: 'reference', to: [{ type: 'category' }] }),
    defineField({ name: 'isTopLevel', title: 'Top Level Category', type: 'boolean', initialValue: false }),
    defineField({ name: 'description', title: 'Description', type: 'text', validation: (r) => r.max(500) }),
    defineField({ name: 'showcaseImage', title: 'Showcase Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'showcaseSubtitle', title: 'Showcase Subtitle', type: 'string', validation: (r) => r.max(150) }),
    defineField({ name: 'emoji', title: 'Emoji', type: 'string' }),
    defineField({
      name: 'featuredItems', title: 'Featured Items', type: 'array',
      of: [{ type: 'reference', to: [{ type: 'savoury' }, { type: 'shake' }, { type: 'teaCoffee' }, { type: 'limca' }, { type: 'golaGanda' }, { type: 'other' }] }],
      validation: (r) => r.max(20),
    }),
    defineField({ name: 'displayOrder', title: 'Display Order', type: 'number' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'showcaseSubtitle', media: 'showcaseImage' },
  },
})
