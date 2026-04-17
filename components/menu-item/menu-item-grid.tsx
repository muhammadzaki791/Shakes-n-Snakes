import { MenuItemCard } from './menu-item-card'
import type { MenuItem } from '@/types/menu-types'

interface MenuItemGridProps {
  items: MenuItem[]
  showUnavailable?: boolean
}

export function MenuItemGrid({ items, showUnavailable = true }: MenuItemGridProps) {
  const displayItems = showUnavailable ? items : items.filter((i) => i.isAvailable)

  if (!displayItems.length) {
    return (
      <div className="py-12 text-center text-brand-text-muted">
        <p className="text-lg">No items found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {displayItems.map((item) => (
        <MenuItemCard key={item._id} item={item} />
      ))}
    </div>
  )
}
