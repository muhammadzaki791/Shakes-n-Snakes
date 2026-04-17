import { defineField, defineType } from 'sanity'

export const shake = defineType({
  name: 'shake',
  title: 'Shake',
  type: 'document',
  icon: () => '🥤',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required().max(200) }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 }, validation: (r) => r.required() }),
    defineField({ name: 'images', title: 'Images', type: 'array', of: [{ type: 'image', options: { hotspot: true } }], validation: (r) => r.required().min(1).max(8) }),
    defineField({
      name: 'flavorProfile', title: 'Flavor Profile', type: 'string',
      options: { list: ['Chocolate', 'Vanilla', 'Strawberry', 'Oreo', 'Caramel', 'Banana', 'Blueberry', 'Mango', 'Mixed Berry', 'Peanut Butter'] },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'toppings', title: 'Toppings', type: 'array', of: [{ type: 'string' }],
      options: { list: ['Whipped Cream', 'Sprinkles', 'Chocolate Drizzle', 'Crushed Oreo', 'Fresh Fruit', 'Caramel Sauce', 'Nuts', 'Marshmallows'] },
    }),
    defineField({ name: 'isVegan', title: 'Is Vegan', type: 'boolean', initialValue: false }),
    defineField({ name: 'calories', title: 'Calories', type: 'number' }),
    defineField({
      name: 'sizes', title: 'Sizes & Prices', type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'sizeName', title: 'Size', type: 'string', options: { list: ['Regular', 'Large', 'Family'] } }),
          defineField({ name: 'price', title: 'Price', type: 'string', validation: (r) => r.required() }),
        ],
      }],
      validation: (r) => r.required().min(1),
    }),
    defineField({ name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }], options: { list: ['Bestseller', 'New', 'Seasonal', "Chef's Special"] } }),
    defineField({ name: 'isAvailable', title: 'Available', type: 'boolean', initialValue: true }),
    defineField({ name: 'category', title: 'Category', type: 'reference', to: [{ type: 'category' }], validation: (r) => r.required() }),
    defineField({ name: 'description', title: 'Description', type: 'array', of: [{ type: 'block' }], validation: (r) => r.required() }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'flavorProfile', media: 'images.0' },
  },
})
