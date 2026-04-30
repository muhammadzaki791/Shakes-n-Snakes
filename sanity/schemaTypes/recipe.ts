import { defineField, defineType } from 'sanity'

export const recipe = defineType({
  name: 'recipe',
  title: 'Recipe',
  type: 'document',
  icon: () => '📖',
  fields: [
    defineField({
      name: 'menuItemRef',
      title: 'Menu Item',
      type: 'reference',
      to: [
        { type: 'savoury' },
        { type: 'shake' },
        { type: 'teaCoffee' },
        { type: 'limca' },
        { type: 'golaGanda' },
        { type: 'other' },
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'menuItemTitle',
      title: 'Menu Item Name',
      type: 'string',
      description: 'Cached name for quick display',
    }),
    defineField({
      name: 'ingredients',
      title: 'Ingredients',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'ingredientRef',
              title: 'Ingredient',
              type: 'reference',
              to: [{ type: 'ingredient' }],
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'quantityNeeded',
              title: 'Quantity Needed (per serving)',
              type: 'number',
              validation: (r) => r.required().min(0),
            }),
            defineField({
              name: 'unit',
              title: 'Unit',
              type: 'string',
              description: 'Display unit (from ingredient)',
            }),
          ],
          preview: {
            select: { ingredientName: 'ingredientRef.name', quantity: 'quantityNeeded', unit: 'unit' },
            prepare({ ingredientName, quantity, unit }) {
              return { title: ingredientName || 'Ingredient', subtitle: `${quantity} ${unit || ''}` }
            },
          },
        },
      ],
      validation: (r) => r.required().min(1),
    }),
  ],
  preview: {
    select: { title: 'menuItemTitle', ingredientCount: 'ingredients.length' },
    prepare({ title }) {
      return { title: title || 'Untitled Recipe' }
    },
  },
})
