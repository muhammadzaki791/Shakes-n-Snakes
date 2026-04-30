'use client'

import { cn } from '@/lib/utils'
import { Banknote, CreditCard, CircleAlert } from 'lucide-react'

type PaymentMethod = 'cash' | 'online' | 'unpaid'

const paymentConfig: Record<PaymentMethod, { label: string; className: string; Icon: typeof Banknote }> = {
  cash: {
    label: 'Cash',
    className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    Icon: Banknote,
  },
  online: {
    label: 'Online',
    className: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    Icon: CreditCard,
  },
  unpaid: {
    label: 'Unpaid',
    className: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    Icon: CircleAlert,
  },
}

export function PaymentMethodBadge({ method }: { method: PaymentMethod }) {
  const config = paymentConfig[method] || paymentConfig.unpaid
  const { Icon } = config
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium', config.className)}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  )
}
