'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { client } from '@/lib/client'
import { getTopLevelCategoriesQuery } from '@/lib/client/queries'
import { CategoryShowcase } from './category-showcase'
import type { Category } from '@/types/menu-types'

const fallbackCategories: Category[] = [
  { _id: '1', title: 'Savoury', slug: { current: 'savoury' }, isTopLevel: true, emoji: '🍔', showcaseSubtitle: 'Fries, Pizza, Nuggets & more' },
  { _id: '2', title: 'Shakes', slug: { current: 'shakes' }, isTopLevel: true, emoji: '🥤', showcaseSubtitle: 'Thick, creamy & delicious' },
  { _id: '3', title: 'Tea & Coffee', slug: { current: 'tea-coffee' }, isTopLevel: true, emoji: '☕', showcaseSubtitle: 'Hot brews & milk drinks' },
  { _id: '4', title: 'Limca', slug: { current: 'limca' }, isTopLevel: true, emoji: '🍋', showcaseSubtitle: 'Refreshing fizzy drinks' },
  { _id: '5', title: 'Gola Ganda', slug: { current: 'gola-ganda' }, isTopLevel: true, emoji: '🍧', showcaseSubtitle: 'Cool & colorful treats' },
  { _id: '6', title: 'Others', slug: { current: 'others' }, isTopLevel: true, emoji: '🍱', showcaseSubtitle: 'Shawarma, Biryani & more' },
]

export function CategoryShowcaseWrapper() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client.fetch(getTopLevelCategoriesQuery)
      .then((data) => setCategories(data?.length ? data : fallbackCategories))
      .catch(() => setCategories(fallbackCategories))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-brand-primary" /></div>
  }

  return <CategoryShowcase categories={categories} />
}
