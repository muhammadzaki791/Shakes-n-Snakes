import type { MenuItem } from '@/types/menu-types'

export function getMenuItemPath(item: Pick<MenuItem, '_type' | 'slug'>): string {
  const typeToPath: Record<string, string> = {
    savoury: '/menu/savoury',
    shake: '/menu/shakes',
    teaCoffee: '/menu/tea-coffee',
    limca: '/menu/limca',
    golaGanda: '/menu/gola-ganda',
    other: '/menu/others',
  }
  const basePath = typeToPath[item._type] || '/menu'
  return `${basePath}/${item.slug.current}`
}

export function extractPlainText(blocks: { children?: { text?: string }[] }[]): string {
  if (!blocks) return ''
  return blocks
    .map((block) => block.children?.map((child) => child.text || '').join('') || '')
    .join(' ')
    .trim()
}

export function formatPrice(price: string): string {
  if (!price) return 'Rs. 0'
  if (price.startsWith('Rs.')) return price
  return `Rs. ${price}`
}
