'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { client } from '@/lib/client'
import { getHierarchicalCategoriesWithItemsQuery, getTopLevelCategoriesQuery } from '@/lib/client/queries'
import { urlFor } from '@/sanity/lib/image'
import { MenuItemGrid } from '@/components/menu-item/menu-item-grid'
import { FadeIn, StaggerContainer, StaggerItem } from '@/lib/animations'
import type { Category, MenuItem } from '@/types/menu-types'

interface CategoryWithItems extends Category {
  items: MenuItem[]
  subCategories: Category[]
}

export default function MenuPage() {
  const [categories, setCategories] = useState<CategoryWithItems[]>([])
  const [topCategories, setTopCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const [hierarchical, top] = await Promise.all([
        client.fetch(getHierarchicalCategoriesWithItemsQuery),
        client.fetch(getTopLevelCategoriesQuery),
      ])
      setCategories(hierarchical)
      setTopCategories(top)
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="bg-brand-bg py-12 px-4">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <div className="text-center mb-12">
            <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl text-brand-text mb-2">
              Our Menu
            </h1>
            <p className="text-brand-text-secondary">
              Fresh, bold, and made to order. Pick your craving.
            </p>
          </div>
        </FadeIn>

        {/* Category Quick Links */}
        <StaggerContainer className="flex flex-wrap justify-center gap-3 mb-12">
          {topCategories.map((cat) => (
            <StaggerItem key={cat._id}>
              <Link
                href={`/menu/${cat.slug.current}`}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-brand-card px-5 py-2.5 text-sm font-[family-name:var(--font-accent)] text-brand-text hover:border-brand-primary hover:text-brand-primary transition-colors"
              >
                {cat.emoji && <span>{cat.emoji}</span>}
                {cat.title}
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Category Sections */}
        <div className="space-y-16">
          {categories.map((cat) => (
            <FadeIn key={cat._id}>
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl text-brand-text">
                      {cat.emoji && <span className="mr-2">{cat.emoji}</span>}
                      {cat.title}
                    </h2>
                    {cat.description && (
                      <p className="text-sm text-brand-text-secondary mt-1">{cat.description}</p>
                    )}
                  </div>
                  <Link
                    href={`/menu/${cat.slug.current}`}
                    className="text-sm text-brand-primary hover:underline font-[family-name:var(--font-accent)]"
                  >
                    View All
                  </Link>
                </div>
                {cat.items && cat.items.length > 0 ? (
                  <MenuItemGrid items={cat.items} />
                ) : (
                  <p className="text-sm text-brand-text-muted py-4">
                    No items available right now. Check back soon!
                  </p>
                )}
              </section>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  )
}
