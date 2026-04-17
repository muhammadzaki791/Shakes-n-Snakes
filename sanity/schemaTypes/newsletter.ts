import { defineField, defineType } from 'sanity'

export const newsletter = defineType({
  name: 'newsletter',
  title: 'Newsletter',
  type: 'document',
  icon: () => '📧',
  fields: [
    defineField({
      name: 'email', title: 'Email', type: 'string',
      validation: (r) => r.required().regex(/\S+@\S+\.\S+/, { name: 'email', invert: false }),
    }),
    defineField({
      name: 'source', title: 'Source', type: 'string',
      options: { list: ['Footer', 'Popup', 'Menu Page', 'Homepage'] },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'ipHash', title: 'IP Hash', type: 'string' }),
  ],
  preview: {
    select: { title: 'email', sub: 'source' },
    prepare({ title, sub }) {
      return { title, subtitle: `Source: ${sub}` }
    },
  },
})
