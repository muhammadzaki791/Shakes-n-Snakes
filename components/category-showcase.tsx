'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ScaleIn, StaggerContainer, StaggerItem } from '@/lib/animations'
import { urlFor } from '@/sanity/lib/image'
import type { Category } from '@/types/menu-types'

interface CategoryShowcaseProps {
  categories: Category[]
}

const categoryPaths: Record<string, string> = {
  savoury: '/menu/savoury',
  shakes: '/menu/shakes',
  'tea-coffee': '/menu/tea-coffee',
  limca: '/menu/limca',
  'gola-ganda': '/menu/gola-ganda',
  others: '/menu/others',
}

export function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  return (
    <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((cat) => {
        const path = categoryPaths[cat.slug.current] || `/menu/${cat.slug.current}`
        const imageUrl = cat.showcaseImage
          ? urlFor(cat.showcaseImage).width(600).height(400).url()
          : 'https://placehold.co/600x400/1A1A1A/666?text=' + encodeURIComponent(cat.title)

        return (
          <StaggerItem key={cat._id}>
            <Link href={path} className="group block relative rounded-2xl overflow-hidden aspect-[3/2]">
              <img
                src={imageUrl}
                alt={cat.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 mb-1">
                  {cat.emoji && <span className="text-2xl">{cat.emoji}</span>}
                  <h3 className="font-[family-name:var(--font-heading)] text-xl text-white">{cat.title}</h3>
                </div>
                {cat.showcaseSubtitle && (
                  <p className="text-sm text-white/70 mb-2">{cat.showcaseSubtitle}</p>
                )}
                <span className="inline-flex items-center gap-1 text-sm font-[family-name:var(--font-accent)] text-brand-primary group-hover:gap-2 transition-all">
                  Explore <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </StaggerItem>
        )
      })}
    </StaggerContainer>
  )
}
