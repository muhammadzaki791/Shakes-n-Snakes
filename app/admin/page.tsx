'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { client } from '@/lib/client'
import { getTodayOrderStatsQuery } from '@/lib/client/queries'
import {
  LayoutDashboard,
  UtensilsCrossed,
  Mail,
  ExternalLink,
  ClipboardList,
  BarChart3,
  Package,
  AlertTriangle,
} from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  totalItems: number
  availableItems: number
  categories: number
  subscribers: number
  todayOrders: number
  todayRevenue: number
  pendingOrders: number
  lowStockCount: number
}

export default function AdminDashboard() {
  const { user } = useUser()
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    async function fetchStats() {
      const now = new Date()
      const todayStr = now.toISOString().split('T')[0]
      const todayStart = `${todayStr}T00:00:00.000Z`
      const todayEnd = `${todayStr}T23:59:59.999Z`

      const [menuStats, orderStats] = await Promise.all([
        client.fetch(`{
          "totalItems": count(*[_type in ["savoury", "shake", "teaCoffee", "limca", "golaGanda", "other"]]),
          "availableItems": count(*[_type in ["savoury", "shake", "teaCoffee", "limca", "golaGanda", "other"] && isAvailable == true]),
          "categories": count(*[_type == "category"]),
          "subscribers": count(*[_type == "newsletter"])
        }`),
        client.fetch(getTodayOrderStatsQuery, { todayStart, todayEnd }),
      ])

      setStats({
        ...menuStats,
        todayOrders: orderStats.todayOrders || 0,
        todayRevenue: orderStats.todayRevenue || 0,
        pendingOrders: orderStats.pendingOrders || 0,
        lowStockCount: orderStats.lowStockCount || 0,
      })
    }
    fetchStats()
  }, [])

  const statCards = stats
    ? [
        { label: 'Total Menu Items', value: stats.totalItems, icon: UtensilsCrossed },
        { label: 'Available Items', value: stats.availableItems, icon: UtensilsCrossed },
        { label: "Today's Orders", value: stats.todayOrders, icon: ClipboardList },
        { label: "Today's Revenue", value: `Rs. ${stats.todayRevenue.toLocaleString()}`, icon: BarChart3 },
        { label: 'Pending Orders', value: stats.pendingOrders, icon: ClipboardList },
        { label: 'Categories', value: stats.categories, icon: LayoutDashboard },
        { label: 'Subscribers', value: stats.subscribers, icon: Mail },
        {
          label: 'Low Stock Items',
          value: stats.lowStockCount,
          icon: stats.lowStockCount > 0 ? AlertTriangle : Package,
          highlight: stats.lowStockCount > 0,
        },
      ]
    : []

  const quickLinks = [
    { href: '/admin/orders', icon: ClipboardList, title: 'Orders', desc: 'Manage orders' },
    { href: '/admin/sales', icon: BarChart3, title: 'Sales Reports', desc: 'View sales data' },
    { href: '/admin/inventory', icon: Package, title: 'Inventory', desc: 'Manage ingredients' },
    { href: '/studio', icon: ExternalLink, title: 'Sanity Studio', desc: 'Manage content' },
    { href: '/admin/newsletter', icon: Mail, title: 'Newsletter', desc: 'Manage subscribers' },
    { href: '/menu', icon: UtensilsCrossed, title: 'View Menu', desc: 'See the live menu' },
  ]

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
                className={`rounded-xl border bg-brand-card p-6 ${
                  'highlight' in stat && stat.highlight
                    ? 'border-yellow-500/40'
                    : 'border-white/10'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <stat.icon
                    className={`h-5 w-5 ${
                      'highlight' in stat && stat.highlight ? 'text-yellow-400' : 'text-brand-primary'
                    }`}
                  />
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
        <h2 className="font-[family-name:var(--font-accent)] text-lg text-brand-text mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-brand-card p-5 hover:border-brand-primary transition-colors"
            >
              <link.icon className="h-5 w-5 text-brand-primary" />
              <div>
                <h3 className="font-[family-name:var(--font-accent)] font-semibold text-brand-text">
                  {link.title}
                </h3>
                <p className="text-xs text-brand-text-secondary">{link.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
