'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { client } from '@/lib/client'
import { getMenuItemBySlugQuery } from '@/lib/client/queries'
import { MenuItemDetail } from '@/components/menu-item/menu-item-detail'
import type { MenuItem } from '@/types/menu-types'

export default function MenuItemPage() {
  const params = useParams()
  const [item, setItem] = useState<MenuItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const data = await client.fetch(getMenuItemBySlugQuery, { slug: params.slug })
      setItem(data)
      setLoading(false)
    }
    fetchData()
  }, [params.slug])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
      </div>
    )
  }

  if (!item) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl text-brand-text">
          Item Not Found
        </h1>
        <Link href="/menu" className="text-brand-primary hover:underline">
          Back to Menu
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-brand-bg py-8">
      <MenuItemDetail item={item} />
    </div>
  )
}
