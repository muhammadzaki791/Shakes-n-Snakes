import { defineField, defineType } from 'sanity'

export const limca = defineType({
  name: 'limca',
  title: 'Limca',
  type: 'document',
  icon: () => '🍋',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required().max(200) }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 }, validation: (r) => r.required() }),
    defineField({ name: 'images', title: 'Images', type: 'array', of: [{ type: 'image', options: { hotspot: true } }], validation: (r) => r.required().min(1).max(8) }),
    defineField({
      name: 'fizzType', title: 'Fizz Type', type: 'string',
      options: { list: ['Citrus', 'Berry', 'Tropical', 'Classic', 'Fizz'] },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'isCarbonated', title: 'Carbonated', type: 'boolean', initialValue: true }),
    defineField({ name: 'calories', title: 'Calories', type: 'number' }),
    defineField({
      name: 'sizes', title: 'Sizes & Prices', type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'sizeName', title: 'Size', type: 'string', options: { list: ['Regular', 'Large'] } }),
          defineField({ name: 'price', title: 'Price', type: 'string', validation: (r) => r.required() }),
        ],
      }],
      validation: (r) => r.required().min(1),
    }),
    defineField({ name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'isAvailable', title: 'Available', type: 'boolean', initialValue: true }),
    defineField({ name: 'category', title: 'Category', type: 'reference', to: [{ type: 'category' }], validation: (r) => r.required() }),
    defineField({ name: 'description', title: 'Description', type: 'array', of: [{ type: 'block' }], validation: (r) => r.required() }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'fizzType', media: 'images.0' },
  },
})
