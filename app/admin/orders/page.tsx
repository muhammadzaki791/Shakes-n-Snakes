'use client'

import { useEffect, useState, useMemo } from 'react'
import { client, adminWriteClient } from '@/lib/client'
import { getOrdersQuery } from '@/lib/client/queries'
import type { Order } from '@/types/admin-types'
import { OrderForm } from '@/components/admin/orders/order-form'
import { OrderTable } from '@/components/admin/orders/order-table'
import { OrderDetail } from '@/components/admin/orders/order-detail'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { exportOrdersToCSV } from '@/lib/export-helpers'
import { Plus, Download, Archive, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type StatusFilter = 'all' | 'pending' | 'in-progress' | 'completed' | 'cancelled'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [formOpen, setFormOpen] = useState(false)
  const [editOrder, setEditOrder] = useState<Order | null>(null)
  const [detailOrder, setDetailOrder] = useState<Order | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [archiving, setArchiving] = useState(false)

  async function fetchOrders() {
    setLoading(true)
    const data = await client.fetch(getOrdersQuery)
    setOrders(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') return orders
    return orders.filter((o) => o.status === statusFilter)
  }, [orders, statusFilter])

  const statusCounts = useMemo(() => {
    const counts = { all: orders.length, pending: 0, 'in-progress': 0, completed: 0, cancelled: 0 }
    orders.forEach((o) => { counts[o.status as keyof typeof counts]++ })
    return counts
  }, [orders])

  const todayRevenue = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return orders
      .filter((o) => o.orderDate.startsWith(today) && o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0)
  }, [orders])

  function handleToggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleToggleSelectAll() {
    if (selectedIds.size === filteredOrders.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredOrders.map((o) => o._id)))
    }
  }

  function handleStatusChange(orderId: string, newStatus: Order['status']) {
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
    )
    if (detailOrder?._id === orderId) {
      setDetailOrder((prev) => (prev ? { ...prev, status: newStatus } : null))
    }
  }

  function handleViewOrder(order: Order) {
    setDetailOrder(order)
    setDetailOpen(true)
  }

  function handleEditOrder(order: Order) {
    setEditOrder(order)
    setFormOpen(true)
  }

  async function handleArchiveSelected() {
    const completedSelected = orders.filter(
      (o) => selectedIds.has(o._id) && (o.status === 'completed' || o.status === 'cancelled')
    )
    if (completedSelected.length === 0) {
      alert('Select completed or cancelled orders to archive.')
      return
    }

    const confirm = window.confirm(
      `Archive ${completedSelected.length} order(s)? This will export them to CSV and remove them from active orders.`
    )
    if (!confirm) return

    setArchiving(true)
    try {
      exportOrdersToCSV(completedSelected, 'archived-orders')

      const dateGroups: Record<string, Order[]> = {}
      completedSelected.forEach((o) => {
        const date = o.orderDate.split('T')[0]
        if (!dateGroups[date]) dateGroups[date] = []
        dateGroups[date].push(o)
      })

      for (const [date, dateOrders] of Object.entries(dateGroups)) {
        const existing = await client.fetch(
          `*[_type == "salesRecord" && date == $date][0]`,
          { date }
        )

        const completed = dateOrders.filter((o) => o.status === 'completed')
        const cancelled = dateOrders.filter((o) => o.status === 'cancelled')
        const revenue = completed.reduce((s, o) => s + o.total, 0)
        const discount = completed.reduce((s, o) => s + o.discountAmount, 0)
        const cashTotal = completed.filter((o) => o.paymentMethod === 'cash').reduce((s, o) => s + o.total, 0)
        const onlineTotal = completed.filter((o) => o.paymentMethod === 'online').reduce((s, o) => s + o.total, 0)

        const itemCounts: Record<string, { quantity: number; revenue: number }> = {}
        completed.forEach((o) => {
          o.items.forEach((i) => {
            if (!itemCounts[i.menuItemTitle]) itemCounts[i.menuItemTitle] = { quantity: 0, revenue: 0 }
            itemCounts[i.menuItemTitle].quantity += i.quantity
            itemCounts[i.menuItemTitle].revenue += i.lineTotal
          })
        })
        const topItems = Object.entries(itemCounts)
          .map(([itemTitle, data]) => ({ itemTitle, ...data }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 10)

        if (existing) {
          const prevData = existing.archivedOrdersData ? JSON.parse(existing.archivedOrdersData) : []
          await adminWriteClient.patch(existing._id).set({
            totalOrders: existing.totalOrders + dateOrders.length,
            completedOrders: (existing.completedOrders || 0) + completed.length,
            cancelledOrders: (existing.cancelledOrders || 0) + cancelled.length,
            totalRevenue: existing.totalRevenue + revenue,
            totalDiscount: (existing.totalDiscount || 0) + discount,
            netRevenue: existing.netRevenue + revenue,
            paymentBreakdown: {
              cash: (existing.paymentBreakdown?.cash || 0) + cashTotal,
              online: (existing.paymentBreakdown?.online || 0) + onlineTotal,
            },
            topItems,
            archivedOrdersData: JSON.stringify([...prevData, ...dateOrders]),
          }).commit()
        } else {
          await adminWriteClient.create({
            _type: 'salesRecord',
            date,
            totalOrders: dateOrders.length,
            completedOrders: completed.length,
            cancelledOrders: cancelled.length,
            totalRevenue: revenue,
            totalDiscount: discount,
            netRevenue: revenue,
            paymentBreakdown: { cash: cashTotal, online: onlineTotal },
            topItems,
            archivedOrdersData: JSON.stringify(dateOrders),
          })
        }
      }

      for (const order of completedSelected) {
        await adminWriteClient.delete(order._id)
      }

      setSelectedIds(new Set())
      fetchOrders()
    } catch (err) {
      console.error('Archive failed:', err)
      alert('Archive failed. Check console for details.')
    } finally {
      setArchiving(false)
    }
  }

  return (
    <div className="bg-brand-bg min-h-screen py-12 px-4">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-brand-text-muted hover:text-brand-primary mb-3">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-[family-name:var(--font-heading)] text-3xl text-brand-text">
                Orders
              </h1>
              <p className="text-brand-text-secondary text-sm mt-1">
                {statusCounts.all} total &middot; Today&apos;s revenue: Rs. {todayRevenue}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {selectedIds.size > 0 && (
                <>
                  <button
                    onClick={handleArchiveSelected}
                    disabled={archiving}
                    className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-brand-elevated px-3 py-2 text-sm text-brand-text hover:border-brand-primary transition-colors disabled:opacity-50"
                  >
                    <Archive className="h-4 w-4" />
                    {archiving ? 'Archiving...' : `Archive (${selectedIds.size})`}
                  </button>
                  <button
                    onClick={() => exportOrdersToCSV(orders.filter((o) => selectedIds.has(o._id)), 'orders-export')}
                    className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-brand-elevated px-3 py-2 text-sm text-brand-text hover:border-brand-primary transition-colors"
                  >
                    <Download className="h-4 w-4" /> Export
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  setEditOrder(null)
                  setFormOpen(true)
                }}
                className="flex items-center gap-1.5 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-primary-hover transition-colors"
              >
                <Plus className="h-4 w-4" /> New Order
              </button>
            </div>
          </div>
        </div>

        {/* Status Tabs */}
        <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)} className="mb-4">
          <TabsList className="bg-brand-elevated border border-white/10">
            <TabsTrigger value="all" className="data-[state=active]:bg-brand-primary data-[state=active]:text-white text-brand-text-secondary">
              All ({statusCounts.all})
            </TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white text-brand-text-secondary">
              Pending ({statusCounts.pending})
            </TabsTrigger>
            <TabsTrigger value="in-progress" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-brand-text-secondary">
              In Progress ({statusCounts['in-progress']})
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-brand-text-secondary">
              Completed ({statusCounts.completed})
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-brand-text-secondary">
              Cancelled ({statusCounts.cancelled})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
          </div>
        ) : (
          <OrderTable
            orders={filteredOrders}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
            onViewOrder={handleViewOrder}
            onStatusChange={handleStatusChange}
          />
        )}

        {/* Dialogs */}
        <OrderForm
          open={formOpen}
          onOpenChange={setFormOpen}
          onSuccess={fetchOrders}
          editOrder={editOrder}
        />
        <OrderDetail
          order={detailOrder}
          open={detailOpen}
          onOpenChange={setDetailOpen}
          onStatusChange={handleStatusChange}
          onEdit={handleEditOrder}
        />
      </div>
    </div>
  )
}
