import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem().title('🍔 Savoury').child(S.documentTypeList('savoury').title('Savoury Items').defaultOrdering([{ field: '_createdAt', direction: 'desc' }])),
      S.listItem().title('🥤 Shakes').child(S.documentTypeList('shake').title('Shakes').defaultOrdering([{ field: '_createdAt', direction: 'desc' }])),
      S.listItem().title('☕ Tea & Coffee').child(S.documentTypeList('teaCoffee').title('Tea & Coffee').defaultOrdering([{ field: '_createdAt', direction: 'desc' }])),
      S.listItem().title('🍋 Limca').child(S.documentTypeList('limca').title('Limca Drinks').defaultOrdering([{ field: '_createdAt', direction: 'desc' }])),
      S.listItem().title('🍧 Gola Ganda').child(S.documentTypeList('golaGanda').title('Gola Ganda').defaultOrdering([{ field: '_createdAt', direction: 'desc' }])),
      S.listItem().title('🍱 Others').child(S.documentTypeList('other').title('Other Items').defaultOrdering([{ field: '_createdAt', direction: 'desc' }])),
      S.divider(),
      S.listItem().title('Categories').child(S.documentTypeList('category').title('Categories')),
      S.listItem().title('Newsletter').child(S.documentTypeList('newsletter').title('Subscribers').defaultOrdering([{ field: '_createdAt', direction: 'desc' }])),
      S.listItem().title('SEO').child(S.documentTypeList('seo').title('SEO Metadata')),
      S.divider(),
      S.listItem().title('📋 Orders').child(S.documentTypeList('order').title('Orders').defaultOrdering([{ field: 'orderDate', direction: 'desc' }])),
      S.listItem().title('📊 Sales Records').child(S.documentTypeList('salesRecord').title('Sales Records').defaultOrdering([{ field: 'date', direction: 'desc' }])),
      S.listItem().title('🧅 Ingredients').child(S.documentTypeList('ingredient').title('Ingredients').defaultOrdering([{ field: 'name', direction: 'asc' }])),
      S.listItem().title('📖 Recipes').child(S.documentTypeList('recipe').title('Recipes')),
    ])
