import { defineField, defineType } from 'sanity'

export const order = defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  icon: () => '📋',
  fields: [
    defineField({
      name: 'orderNumber',
      title: 'Order Number',
      type: 'number',
      validation: (r) => r.required().integer().positive(),
    }),
    defineField({
      name: 'orderDate',
      title: 'Order Date & Time',
      type: 'datetime',
      validation: (r) => r.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
    }),
    defineField({
      name: 'tableNumber',
      title: 'Table Number',
      type: 'string',
    }),
    defineField({
      name: 'items',
      title: 'Order Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'menuItemTitle',
              title: 'Item Name',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'menuItemType',
              title: 'Item Type',
              type: 'string',
            }),
            defineField({
              name: 'sizeName',
              title: 'Size',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'quantity',
              title: 'Quantity',
              type: 'number',
              validation: (r) => r.required().integer().min(1),
              initialValue: 1,
            }),
            defineField({
              name: 'unitPrice',
              title: 'Unit Price (Rs.)',
              type: 'number',
              validation: (r) => r.required().min(0),
            }),
            defineField({
              name: 'lineTotal',
              title: 'Line Total (Rs.)',
              type: 'number',
              validation: (r) => r.required().min(0),
            }),
          ],
          preview: {
            select: { title: 'menuItemTitle', subtitle: 'sizeName', quantity: 'quantity', lineTotal: 'lineTotal' },
            prepare({ title, subtitle, quantity, lineTotal }) {
              return { title: `${title} (${subtitle})`, subtitle: `x${quantity} — Rs. ${lineTotal}` }
            },
          },
        },
      ],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: 'subtotal',
      title: 'Subtotal (Rs.)',
      type: 'number',
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: 'discountType',
      title: 'Discount Type',
      type: 'string',
      options: { list: ['none', 'percentage', 'flat'] },
      initialValue: 'none',
    }),
    defineField({
      name: 'discountValue',
      title: 'Discount Value',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'discountAmount',
      title: 'Discount Amount (Rs.)',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'total',
      title: 'Total (Rs.)',
      type: 'number',
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: ['pending', 'in-progress', 'completed', 'cancelled'] },
      initialValue: 'pending',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'paymentMethod',
      title: 'Payment Method',
      type: 'string',
      options: { list: ['cash', 'online', 'unpaid'] },
      initialValue: 'cash',
    }),
    defineField({
      name: 'orderSource',
      title: 'Order Source',
      type: 'string',
      options: { list: ['walk-in', 'whatsapp', 'phone'] },
      initialValue: 'walk-in',
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 3,
    }),
  ],
  orderings: [
    { title: 'Order Date (Newest)', name: 'orderDateDesc', by: [{ field: 'orderDate', direction: 'desc' }] },
    { title: 'Order Number', name: 'orderNumberDesc', by: [{ field: 'orderNumber', direction: 'desc' }] },
  ],
  preview: {
    select: { orderNumber: 'orderNumber', customerName: 'customerName', total: 'total', status: 'status' },
    prepare({ orderNumber, customerName, total, status }) {
      const statusIcons: Record<string, string> = { pending: '🟡', 'in-progress': '🔵', completed: '🟢', cancelled: '🔴' }
      return {
        title: `#${orderNumber} — ${customerName || 'Walk-in'}`,
        subtitle: `Rs. ${total} ${statusIcons[status] || ''} ${status}`,
      }
    },
  },
})
