import { defineField, defineType } from 'sanity'

export const salesRecord = defineType({
  name: 'salesRecord',
  title: 'Sales Record',
  type: 'document',
  icon: () => '📊',
  fields: [
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'totalOrders',
      title: 'Total Orders',
      type: 'number',
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: 'completedOrders',
      title: 'Completed Orders',
      type: 'number',
      validation: (r) => r.min(0),
    }),
    defineField({
      name: 'cancelledOrders',
      title: 'Cancelled Orders',
      type: 'number',
      validation: (r) => r.min(0),
    }),
    defineField({
      name: 'totalRevenue',
      title: 'Total Revenue (Rs.)',
      type: 'number',
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: 'totalDiscount',
      title: 'Total Discount (Rs.)',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'netRevenue',
      title: 'Net Revenue (Rs.)',
      type: 'number',
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: 'paymentBreakdown',
      title: 'Payment Breakdown',
      type: 'object',
      fields: [
        defineField({ name: 'cash', title: 'Cash (Rs.)', type: 'number', initialValue: 0 }),
        defineField({ name: 'online', title: 'Online (Rs.)', type: 'number', initialValue: 0 }),
      ],
    }),
    defineField({
      name: 'topItems',
      title: 'Top Selling Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'itemTitle', title: 'Item', type: 'string' }),
            defineField({ name: 'quantity', title: 'Qty Sold', type: 'number' }),
            defineField({ name: 'revenue', title: 'Revenue (Rs.)', type: 'number' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'archivedOrdersData',
      title: 'Archived Orders (JSON)',
      type: 'text',
      description: 'Full order data stored as JSON for Excel export',
    }),
  ],
  orderings: [
    { title: 'Date (Newest)', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] },
  ],
  preview: {
    select: { date: 'date', totalOrders: 'totalOrders', netRevenue: 'netRevenue' },
    prepare({ date, totalOrders, netRevenue }) {
      return {
        title: date || 'No Date',
        subtitle: `${totalOrders} orders — Rs. ${netRevenue}`,
      }
    },
  },
})
