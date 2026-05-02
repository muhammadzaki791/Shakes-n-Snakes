'use client'

import type { Order } from '@/types/admin-types'
import { OrderStatusBadge } from './order-status-badge'
import { PaymentMethodBadge } from './payment-method-badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, ArrowRight, CheckCircle, XCircle } from 'lucide-react'
import { adminWriteClient } from '@/lib/client'

interface OrderTableProps {
  orders: Order[]
  selectedIds: Set<string>
  onToggleSelect: (id: string) => void
  onToggleSelectAll: () => void
  onViewOrder: (order: Order) => void
  onStatusChange: (orderId: string, status: Order['status']) => void
}

export function OrderTable({
  orders,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onViewOrder,
  onStatusChange,
}: OrderTableProps) {
  const allSelected = orders.length > 0 && orders.every((o) => selectedIds.has(o._id))

  async function handleQuickStatus(order: Order, newStatus: Order['status']) {
    try {
      await adminWriteClient.patch(order._id).set({ status: newStatus }).commit()
      onStatusChange(order._id, newStatus)
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-brand-text-muted">
        <p className="text-lg">No orders found</p>
        <p className="text-sm mt-1">Create a new order to get started</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 bg-brand-elevated hover:bg-brand-elevated">
            <TableHead className="w-10">
              <Checkbox
                checked={allSelected}
                onCheckedChange={onToggleSelectAll}
                className="border-white/20"
              />
            </TableHead>
            <TableHead className="text-brand-text-secondary font-[family-name:var(--font-accent)]">Order #</TableHead>
            <TableHead className="text-brand-text-secondary font-[family-name:var(--font-accent)]">Date/Time</TableHead>
            <TableHead className="text-brand-text-secondary font-[family-name:var(--font-accent)]">Customer</TableHead>
            <TableHead className="text-brand-text-secondary font-[family-name:var(--font-accent)]">Items</TableHead>
            <TableHead className="text-brand-text-secondary font-[family-name:var(--font-accent)] text-right">Total</TableHead>
            <TableHead className="text-brand-text-secondary font-[family-name:var(--font-accent)]">Status</TableHead>
            <TableHead className="text-brand-text-secondary font-[family-name:var(--font-accent)]">Payment</TableHead>
            <TableHead className="text-brand-text-secondary font-[family-name:var(--font-accent)] w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const date = new Date(order.orderDate)
            return (
              <TableRow
                key={order._id}
                className="border-white/5 hover:bg-white/5 cursor-pointer"
                onClick={() => onViewOrder(order)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedIds.has(order._id)}
                    onCheckedChange={() => onToggleSelect(order._id)}
                    className="border-white/20"
                  />
                </TableCell>
                <TableCell className="font-medium text-brand-text">#{order.orderNumber}</TableCell>
                <TableCell className="text-brand-text-secondary text-xs">
                  <div>{date.toLocaleDateString('en-PK')}</div>
                  <div>{date.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })}</div>
                </TableCell>
                <TableCell className="text-brand-text">
                  <div>{order.customerName || 'Walk-in'}</div>
                  {order.tableNumber && (
                    <div className="text-xs text-brand-text-muted mt-0.5">Table {order.tableNumber}</div>
                  )}
                </TableCell>
                <TableCell className="text-brand-text-secondary text-xs max-w-[260px]">
                  <div className="truncate" title={order.items.map((i) => `${i.menuItemTitle}${i.quantity > 1 ? ` ×${i.quantity}` : ''}`).join(', ')}>
                    {order.items.map((i, idx) => (
                      <span key={idx}>
                        {idx > 0 && ', '}
                        <span className="text-brand-text">{i.menuItemTitle}</span>
                        {i.quantity > 1 && <span className="text-brand-text-muted"> ×{i.quantity}</span>}
                      </span>
                    ))}
                  </div>
                  <div className="text-[10px] text-brand-text-muted mt-0.5">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</div>
                </TableCell>
                <TableCell className="text-right font-medium text-brand-text">Rs. {order.total}</TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell>
                  <PaymentMethodBadge method={order.paymentMethod} />
                </TableCell>
                <TableCell
                  onClick={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        onClick={(e) => e.stopPropagation()}
                        className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-white/10"
                      >
                        <MoreHorizontal className="h-4 w-4 text-brand-text-muted" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-brand-elevated border-white/10">
                      {order.status === 'pending' && (
                        <DropdownMenuItem
                          onClick={(e) => { e.stopPropagation(); handleQuickStatus(order, 'in-progress') }}
                          className="text-blue-400 focus:text-blue-300 focus:bg-white/5"
                        >
                          <ArrowRight className="mr-2 h-4 w-4" /> Start Order
                        </DropdownMenuItem>
                      )}
                      {(order.status === 'pending' || order.status === 'in-progress') && (
                        <DropdownMenuItem
                          onClick={(e) => { e.stopPropagation(); handleQuickStatus(order, 'completed') }}
                          className="text-green-400 focus:text-green-300 focus:bg-white/5"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" /> Complete
                        </DropdownMenuItem>
                      )}
                      {(order.status === 'pending' || order.status === 'in-progress') && (
                        <DropdownMenuItem
                          onClick={(e) => { e.stopPropagation(); handleQuickStatus(order, 'cancelled') }}
                          className="text-red-400 focus:text-red-300 focus:bg-white/5"
                        >
                          <XCircle className="mr-2 h-4 w-4" /> Cancel
                        </DropdownMenuItem>
                      )}
                      {order.status === 'completed' && (
                        <DropdownMenuItem disabled className="text-brand-text-muted">
                          No actions available
                        </DropdownMenuItem>
                      )}
                      {order.status === 'cancelled' && (
                        <DropdownMenuItem disabled className="text-brand-text-muted">
                          No actions available
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
