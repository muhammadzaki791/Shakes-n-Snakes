import type { Order, SalesRecord, PurchaseReceiptItem } from '@/types/admin-types'

function downloadCSV(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function escapeCSV(value: string | number | undefined | null): string {
  const str = String(value ?? '')
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-PK', {
    year: 'numeric', month: '2-digit', day: '2-digit',
  })
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-PK', {
    hour: '2-digit', minute: '2-digit',
  })
}

export function exportOrdersToCSV(orders: Order[], filenamePrefix = 'orders') {
  const headers = 'Order #,Date,Time,Customer,Items,Subtotal (Rs.),Discount (Rs.),Total (Rs.),Payment,Status,Source,Notes\n'
  const rows = orders.map((o) => {
    const itemsSummary = o.items.map((i) => `${i.menuItemTitle} x${i.quantity}`).join('; ')
    return [
      o.orderNumber,
      formatDate(o.orderDate),
      formatTime(o.orderDate),
      escapeCSV(o.customerName || 'Walk-in'),
      escapeCSV(itemsSummary),
      o.subtotal,
      o.discountAmount,
      o.total,
      o.paymentMethod,
      o.status,
      o.orderSource,
      escapeCSV(o.notes || ''),
    ].join(',')
  }).join('\n')

  const date = new Date().toISOString().split('T')[0]
  downloadCSV(headers + rows, `${filenamePrefix}-${date}.csv`)
}

export function exportSalesRecordsToCSV(records: SalesRecord[], filenamePrefix = 'sales') {
  const headers = 'Date,Total Orders,Completed,Cancelled,Revenue (Rs.),Discount (Rs.),Net Revenue (Rs.),Cash (Rs.),Online (Rs.)\n'
  const rows = records.map((r) => [
    r.date,
    r.totalOrders,
    r.completedOrders,
    r.cancelledOrders,
    r.totalRevenue,
    r.totalDiscount,
    r.netRevenue,
    r.paymentBreakdown?.cash || 0,
    r.paymentBreakdown?.online || 0,
  ].join(',')).join('\n')

  const date = new Date().toISOString().split('T')[0]
  downloadCSV(headers + rows, `${filenamePrefix}-${date}.csv`)
}

export function exportPurchaseReceiptToCSV(items: PurchaseReceiptItem[]) {
  const headers = 'Ingredient,Current Stock,Min Required,Qty to Buy,Unit,Price/Unit (Rs.),Total (Rs.)\n'
  const rows = items.map((i) => [
    escapeCSV(i.name),
    i.currentStock,
    i.minimumStock,
    i.quantityToBuy,
    i.unit,
    i.pricePerUnit,
    i.totalCost,
  ].join(',')).join('\n')

  const grandTotal = items.reduce((sum, i) => sum + i.totalCost, 0)
  const totalRow = `\n,,,,,,${grandTotal}`

  const date = new Date().toISOString().split('T')[0]
  downloadCSV(headers + rows + totalRow, `purchase-receipt-${date}.csv`)
}
