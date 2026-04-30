import { defineField, defineType } from 'sanity'

export const ingredient = defineType({
  name: 'ingredient',
  title: 'Ingredient',
  type: 'document',
  icon: () => '🧅',
  fields: [
    defineField({
      name: 'name',
      title: 'Ingredient Name',
      type: 'string',
      validation: (r) => r.required().max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'unit',
      title: 'Unit of Measurement',
      type: 'string',
      options: { list: ['kg', 'g', 'litre', 'ml', 'pieces', 'dozen', 'packet', 'box'] },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'pricePerUnit',
      title: 'Price Per Unit (Rs.)',
      type: 'number',
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: 'currentStock',
      title: 'Current Stock',
      type: 'number',
      initialValue: 0,
      validation: (r) => r.min(0),
    }),
    defineField({
      name: 'minimumStock',
      title: 'Minimum Stock Level',
      type: 'number',
      initialValue: 0,
      description: 'Alert when stock falls below this level',
      validation: (r) => r.min(0),
    }),
    defineField({
      name: 'supplier',
      title: 'Supplier',
      type: 'string',
    }),
    defineField({
      name: 'ingredientCategory',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          'dairy',
          'meat',
          'vegetables',
          'spices',
          'sauces',
          'bread',
          'frozen',
          'beverages',
          'dry-goods',
          'packaging',
          'other',
        ],
      },
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 2,
    }),
  ],
  orderings: [
    { title: 'Name', name: 'nameAsc', by: [{ field: 'name', direction: 'asc' }] },
    { title: 'Category', name: 'categoryAsc', by: [{ field: 'ingredientCategory', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'name', currentStock: 'currentStock', minimumStock: 'minimumStock', unit: 'unit' },
    prepare({ title, currentStock, minimumStock, unit }) {
      const status = currentStock <= 0 ? '🔴' : currentStock < minimumStock ? '🟡' : '🟢'
      return { title: `${status} ${title}`, subtitle: `${currentStock} ${unit} (min: ${minimumStock})` }
    },
  },
})
