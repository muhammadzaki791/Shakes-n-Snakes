'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { client } from '@/lib/client'
import { LayoutDashboard, UtensilsCrossed, Mail, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  totalItems: number
  availableItems: number
  categories: number
  subscribers: number
}

export default function AdminDashboard() {
  const { user } = useUser()
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    async function fetchStats() {
      const result = await client.fetch(`{
        "totalItems": count(*[_type in ["savoury", "shake", "teaCoffee", "limca", "golaGanda", "other"]]),
        "availableItems": count(*[_type in ["savoury", "shake", "teaCoffee", "limca", "golaGanda", "other"] && isAvailable == true]),
        "categories": count(*[_type == "category"]),
        "subscribers": count(*[_type == "newsletter"])
      }`)
      setStats(result)
    }
    fetchStats()
  }, [])

  const statCards = stats
    ? [
        { label: 'Total Menu Items', value: stats.totalItems, icon: UtensilsCrossed },
        { label: 'Available Items', value: stats.availableItems, icon: UtensilsCrossed },
        { label: 'Categories', value: stats.categories, icon: LayoutDashboard },
        { label: 'Newsletter Subscribers', value: stats.subscribers, icon: Mail },
      ]
    : []

  return (
    <div className="bg-brand-bg min-h-screen py-12 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="font-[family-name:var(--font-heading)] text-3xl text-brand-text">
            Admin Dashboard
          </h1>
          <p className="text-brand-text-secondary">
            Welcome back, {user?.firstName || 'Admin'}
          </p>
        </div>

        {/* Stats Grid */}
        {stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/10 bg-brand-card p-6"
              >
                <div className="flex items-center gap-3 mb-2">
                  <stat.icon className="h-5 w-5 text-brand-primary" />
                  <span className="text-sm text-brand-text-secondary">{stat.label}</span>
                </div>
                <p className="font-[family-name:var(--font-heading)] text-3xl text-brand-text">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/studio"
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-brand-card p-5 hover:border-brand-primary transition-colors"
          >
            <ExternalLink className="h-5 w-5 text-brand-primary" />
            <div>
              <h3 className="font-[family-name:var(--font-accent)] font-semibold text-brand-text">
                Sanity Studio
              </h3>
              <p className="text-xs text-brand-text-secondary">Manage content</p>
            </div>
          </Link>
          <Link
            href="/admin/newsletter"
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-brand-card p-5 hover:border-brand-primary transition-colors"
          >
            <Mail className="h-5 w-5 text-brand-primary" />
            <div>
              <h3 className="font-[family-name:var(--font-accent)] font-semibold text-brand-text">
                Newsletter
              </h3>
              <p className="text-xs text-brand-text-secondary">Manage subscribers</p>
            </div>
          </Link>
          <Link
            href="/menu"
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-brand-card p-5 hover:border-brand-primary transition-colors"
          >
            <UtensilsCrossed className="h-5 w-5 text-brand-primary" />
            <div>
              <h3 className="font-[family-name:var(--font-accent)] font-semibold text-brand-text">
                View Menu
              </h3>
              <p className="text-xs text-brand-text-secondary">See the live menu</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
