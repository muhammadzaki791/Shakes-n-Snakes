'use client'

import { ShoppingCart, DollarSign, TrendingUp, Star } from 'lucide-react'

interface SalesSummaryProps {
  totalOrders: number
  totalRevenue: number
  avgOrderValue: number
  topItem?: string
}

export function SalesSummaryCards({ totalOrders, totalRevenue, avgOrderValue, topItem }: SalesSummaryProps) {
  const cards = [
    { label: 'Total Orders', value: totalOrders.toString(), icon: ShoppingCart },
    { label: 'Revenue', value: `Rs. ${totalRevenue.toLocaleString()}`, icon: DollarSign },
    { label: 'Avg Order Value', value: `Rs. ${avgOrderValue.toLocaleString()}`, icon: TrendingUp },
    { label: 'Top Item', value: topItem || 'N/A', icon: Star },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border border-white/10 bg-brand-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <card.icon className="h-5 w-5 text-brand-primary" />
            <span className="text-sm text-brand-text-secondary">{card.label}</span>
          </div>
          <p className="font-[family-name:var(--font-heading)] text-2xl text-brand-text truncate">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  )
}
