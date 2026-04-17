'use client'

import Link from 'next/link'
import { Badge, getTagVariant } from '@/components/ui/badge'
import { urlFor } from '@/sanity/lib/image'
import { getMenuItemPath, extractPlainText } from '@/lib/client/utils'
import type { MenuItem } from '@/types/menu-types'

interface MenuItemCardProps {
  item: MenuItem
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const imageUrl = item.images?.[0]
    ? urlFor(item.images[0]).width(400).height(300).url()
    : 'https://placehold.co/400x300/1A1A1A/666?text=No+Image'
  const path = getMenuItemPath(item)
  const descText = extractPlainText(item.description)

  return (
    <Link href={path} className="group block">
      <div className="rounded-xl border border-white/10 bg-brand-card overflow-hidden transition-all hover:border-brand-primary/30 hover:shadow-[var(--glow-pink)]">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={imageUrl}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {!item.isAvailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70">
              <Badge variant="unavailable">Currently Unavailable</Badge>
            </div>
          )}
          {item.tags && item.tags.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-1">
              {item.tags.map((tag) => (
                <Badge key={tag} variant={getTagVariant(tag)}>{tag}</Badge>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-[family-name:var(--font-heading)] text-lg text-brand-text mb-1 truncate">{item.title}</h3>
          <p className="text-xs text-brand-text-secondary line-clamp-2 mb-3">{descText}</p>
          <div className="flex items-center justify-between">
            <span className="font-[family-name:var(--font-accent)] text-lg font-bold text-brand-yellow">{item.priceDisplay || item.sizes?.[0]?.price}</span>
            {item.isAvailable && (
              <span className="text-xs font-[family-name:var(--font-accent)] text-brand-primary group-hover:underline">View Details →</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
