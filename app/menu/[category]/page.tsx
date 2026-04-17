'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { client } from '@/lib/client'
import { getCategoryBySlugWithItemsQuery } from '@/lib/client/queries'
import { MenuItemGrid } from '@/components/menu-item/menu-item-grid'
import { FadeIn } from '@/lib/animations'
import type { Category, MenuItem } from '@/types/menu-types'

interface CategoryData extends Category {
  directItems: MenuItem[]
  subCategories: Category[]
}

export default function CategoryPage() {
  const params = useParams()
  const [category, setCategory] = useState<CategoryData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const data = await client.fetch(getCategoryBySlugWithItemsQuery, {
        slug: params.category,
      })
      setCategory(data)
      setLoading(false)
    }
    fetchData()
  }, [params.category])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
      </div>
    )
  }

  if (!category) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl text-brand-text">
          Category Not Found
        </h1>
        <Link href="/menu" className="text-brand-primary hover:underline">
          Back to Menu
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-brand-bg py-12 px-4">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 text-sm text-brand-text-secondary hover:text-brand-primary mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Menu
        </Link>

        <FadeIn>
          <div className="mb-8">
            <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl text-brand-text mb-2">
              {category.emoji && <span className="mr-2">{category.emoji}</span>}
              {category.title}
            </h1>
            {category.description && (
              <p className="text-brand-text-secondary">{category.description}</p>
            )}
          </div>
        </FadeIn>

        {/* Sub-categories links */}
        {category.subCategories && category.subCategories.length > 0 && (
          <FadeIn>
            <div className="flex flex-wrap gap-3 mb-8">
              {category.subCategories.map((sub) => (
                <Link
                  key={sub._id}
                  href={`/menu/${sub.slug.current}`}
                  className="rounded-full border border-white/10 bg-brand-card px-4 py-2 text-sm font-[family-name:var(--font-accent)] text-brand-text hover:border-brand-primary hover:text-brand-primary transition-colors"
                >
                  {sub.title}
                </Link>
              ))}
            </div>
          </FadeIn>
        )}

        <FadeIn delay={0.2}>
          <MenuItemGrid items={category.directItems || []} />
        </FadeIn>
      </div>
    </div>
  )
}
