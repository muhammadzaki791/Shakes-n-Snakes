'use client'

import type { Order } from '@/types/admin-types'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { OrderStatusBadge } from './order-status-badge'
import { adminWriteClient } from '@/lib/client'
import { Printer, ChefHat } from 'lucide-react'

interface OrderDetailProps {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (orderId: string, status: Order['status']) => void
  onEdit: (order: Order) => void
}

const statusFlow: Record<string, Order['status'][]> = {
  pending: ['in-progress', 'cancelled'],
  'in-progress': ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
}

export function OrderDetail({ order, open, onOpenChange, onStatusChange, onEdit }: OrderDetailProps) {
  if (!order) return null

  const nextStatuses = statusFlow[order.status] || []
  const date = new Date(order.orderDate)

  async function handleStatusChange(newStatus: Order['status']) {
    try {
      await adminWriteClient.patch(order!._id).set({ status: newStatus }).commit()
      onStatusChange(order!._id, newStatus)
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  function handlePrintKitchenChit() {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return
    const itemsHtml = order!.items
      .map(
        (i) => `
          <tr>
            <td class="qty">${i.quantity}×</td>
            <td>
              <div class="name">${i.menuItemTitle}</div>
              <div class="size">${i.sizeName}</div>
            </td>
          </tr>
        `,
      )
      .join('')
    printWindow.document.write(`
      <html><head><title>KOT #${order!.orderNumber}</title>
      <style>
        @page { size: 80mm auto; margin: 4mm; }
        * { box-sizing: border-box; }
        body { font-family: 'Courier New', monospace; padding: 0; margin: 0; width: 80mm; color: #000; }
        .wrap { padding: 4px 6px; }
        h1 { text-align: center; margin: 4px 0; font-size: 18px; letter-spacing: 1px; border-top: 2px solid #000; border-bottom: 2px solid #000; padding: 4px 0; }
        .meta-row { display: flex; justify-content: space-between; font-size: 13px; margin: 4px 0; }
        .meta-row strong { font-weight: bold; }
        .order-no { text-align: center; font-size: 22px; font-weight: bold; margin: 6px 0; }
        .table-no { text-align: center; font-size: 16px; font-weight: bold; margin-bottom: 6px; }
        table { width: 100%; border-collapse: collapse; margin-top: 6px; }
        th { text-align: left; font-size: 12px; border-bottom: 2px solid #000; padding: 4px 0; }
        td { padding: 6px 2px; border-bottom: 1px dashed #888; vertical-align: top; }
        td.qty { font-size: 18px; font-weight: bold; width: 38px; }
        td .name { font-size: 15px; font-weight: bold; }
        td .size { font-size: 12px; color: #333; }
        .notes { margin-top: 8px; padding: 6px; border: 1px dashed #000; font-size: 13px; }
        .footer { text-align: center; margin-top: 10px; font-size: 11px; border-top: 2px solid #000; padding-top: 4px; }
      </style></head><body>
      <div class="wrap">
        <h1>KITCHEN ORDER</h1>
        <div class="order-no">Order #${order!.orderNumber}</div>
        ${order!.tableNumber ? `<div class="table-no">Table ${order!.tableNumber}</div>` : ''}
        <div class="meta-row">
          <span>${date.toLocaleDateString('en-PK')}</span>
          <span><strong>${date.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })}</strong></span>
        </div>
        <div class="meta-row">
          <span>Customer:</span>
          <span><strong>${order!.customerName || 'Walk-in'}</strong></span>
        </div>
        <table>
          <thead><tr><th>Qty</th><th>Item</th></tr></thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        ${order!.notes ? `<div class="notes"><strong>NOTE:</strong> ${order!.notes}</div>` : ''}
        <div class="footer">-- ${order!.items.reduce((s, i) => s + i.quantity, 0)} item(s) --</div>
      </div>
      <script>window.print(); window.close();</script>
      </body></html>
    `)
    printWindow.document.close()
  }

  function handlePrint() {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return
    printWindow.document.write(`
      <html><head><title>Order #${order!.orderNumber}</title>
      <style>
        body { font-family: monospace; padding: 20px; max-width: 400px; margin: auto; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        td, th { padding: 4px 8px; text-align: left; border-bottom: 1px dashed #ccc; }
        th { font-weight: bold; }
        .right { text-align: right; }
        .total { font-size: 1.2em; font-weight: bold; border-top: 2px solid #000; }
        h2 { margin-bottom: 4px; }
        .meta { color: #666; font-size: 0.85em; }
      </style></head><body>
      <h2>Shakes n Snacks</h2>
      <p class="meta">Order #${order!.orderNumber}</p>
      <p class="meta">${date.toLocaleDateString('en-PK')} ${date.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })}</p>
      <p class="meta">Customer: ${order!.customerName || 'Walk-in'}${order!.tableNumber ? ` &nbsp;|&nbsp; Table: ${order!.tableNumber}` : ''}</p>
      <table>
        <tr><th>Item</th><th>Qty</th><th class="right">Price</th></tr>
        ${order!.items.map((i) => `<tr><td>${i.menuItemTitle} (${i.sizeName})</td><td>${i.quantity}</td><td class="right">Rs. ${i.lineTotal}</td></tr>`).join('')}
      </table>
      <table>
        <tr><td>Subtotal</td><td class="right">Rs. ${order!.subtotal}</td></tr>
        ${order!.discountAmount > 0 ? `<tr><td>Discount</td><td class="right">- Rs. ${order!.discountAmount}</td></tr>` : ''}
        <tr class="total"><td>Total</td><td class="right">Rs. ${order!.total}</td></tr>
      </table>
      <p class="meta">Payment: ${order!.paymentMethod} | Source: ${order!.orderSource}</p>
      ${order!.notes ? `<p class="meta">Notes: ${order!.notes}</p>` : ''}
      <script>window.print(); window.close();</script>
      </body></html>
    `)
    printWindow.document.close()
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-brand-card border-white/10 w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-[family-name:var(--font-heading)] text-brand-text flex items-center gap-3">
            Order #{order.orderNumber}
            <OrderStatusBadge status={order.status} />
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Meta */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-brand-text-muted">Date</span>
              <p className="text-brand-text">{date.toLocaleDateString('en-PK')}</p>
            </div>
            <div>
              <span className="text-brand-text-muted">Time</span>
              <p className="text-brand-text">{date.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <div>
              <span className="text-brand-text-muted">Customer</span>
              <p className="text-brand-text">{order.customerName || 'Walk-in'}</p>
            </div>
            <div>
              <span className="text-brand-text-muted">Table</span>
              <p className="text-brand-text">{order.tableNumber || '—'}</p>
            </div>
            <div>
              <span className="text-brand-text-muted">Source</span>
              <p className="text-brand-text capitalize">{order.orderSource}</p>
            </div>
            <div>
              <span className="text-brand-text-muted">Payment</span>
              <p className="text-brand-text capitalize">{order.paymentMethod}</p>
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* Items */}
          <div>
            <h4 className="text-sm font-medium text-brand-text-secondary mb-2">Items</h4>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-brand-text">{item.menuItemTitle}</span>
                    <span className="text-brand-text-muted"> ({item.sizeName}) x{item.quantity}</span>
                  </div>
                  <span className="text-brand-text font-medium">Rs. {item.lineTotal}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* Totals */}
          <div className="space-y-1 text-sm">
            <div className="flex justify-between text-brand-text-secondary">
              <span>Subtotal</span>
              <span>Rs. {order.subtotal}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-green-400">
                <span>Discount ({order.discountType === 'percentage' ? `${order.discountValue}%` : 'Flat'})</span>
                <span>- Rs. {order.discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-brand-text pt-1">
              <span>Total</span>
              <span>Rs. {order.total}</span>
            </div>
          </div>

          {order.notes && (
            <>
              <Separator className="bg-white/10" />
              <div>
                <h4 className="text-sm font-medium text-brand-text-secondary mb-1">Notes</h4>
                <p className="text-sm text-brand-text-muted">{order.notes}</p>
              </div>
            </>
          )}

          <Separator className="bg-white/10" />

          {/* Actions */}
          <div className="space-y-2">
            {nextStatuses.length > 0 && (
              <div className="flex gap-2">
                {nextStatuses.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    className={`flex-1 rounded-lg py-2 text-sm font-medium text-white transition-colors ${
                      s === 'completed'
                        ? 'bg-green-600 hover:bg-green-700'
                        : s === 'in-progress'
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {s === 'in-progress' ? 'Start' : s === 'completed' ? 'Complete' : 'Cancel'}
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onOpenChange(false)
                  onEdit(order)
                }}
                className="flex-1 rounded-lg border border-white/10 py-2 text-sm font-medium text-brand-text hover:border-brand-primary transition-colors"
              >
                Edit Order
              </button>
              <button
                onClick={handlePrintKitchenChit}
                className="flex items-center justify-center gap-2 rounded-lg bg-brand-primary/10 border border-brand-primary/40 px-3 py-2 text-sm font-medium text-brand-primary hover:bg-brand-primary/20 transition-colors"
                title="Print kitchen order ticket"
              >
                <ChefHat className="h-4 w-4" /> Kitchen Chit
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm font-medium text-brand-text hover:border-brand-primary transition-colors"
                title="Print customer receipt"
              >
                <Printer className="h-4 w-4" /> Receipt
              </button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
