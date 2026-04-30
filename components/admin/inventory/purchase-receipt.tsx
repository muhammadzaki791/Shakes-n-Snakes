'use client'

import { useState, useMemo } from 'react'
import type { Ingredient, PurchaseReceiptItem } from '@/types/admin-types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { exportPurchaseReceiptToCSV } from '@/lib/export-helpers'
import { adminWriteClient } from '@/lib/client'
import { Download, Printer, ShoppingCart } from 'lucide-react'

interface PurchaseReceiptProps {
  lowStockIngredients: Ingredient[]
  onStockUpdated: () => void
}

export function PurchaseReceipt({ lowStockIngredients, onStockUpdated }: PurchaseReceiptProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [purchasing, setPurchasing] = useState(false)

  const receiptItems: PurchaseReceiptItem[] = useMemo(() => {
    return lowStockIngredients.map((ing) => {
      const defaultQty = Math.max(ing.minimumStock - ing.currentStock, 0)
      const qtyToBuy = quantities[ing._id] ?? defaultQty
      return {
        ingredientId: ing._id,
        name: ing.name,
        currentStock: ing.currentStock,
        minimumStock: ing.minimumStock,
        quantityToBuy: qtyToBuy,
        unit: ing.unit,
        pricePerUnit: ing.pricePerUnit,
        totalCost: qtyToBuy * ing.pricePerUnit,
      }
    })
  }, [lowStockIngredients, quantities])

  const grandTotal = receiptItems.reduce((sum, item) => sum + item.totalCost, 0)

  function updateQuantity(id: string, qty: number) {
    setQuantities((prev) => ({ ...prev, [id]: qty }))
  }

  async function handleMarkPurchased() {
    const confirm = window.confirm('Mark all items as purchased? This will update stock levels.')
    if (!confirm) return

    setPurchasing(true)
    try {
      for (const item of receiptItems) {
        if (item.quantityToBuy <= 0) continue
        const ing = lowStockIngredients.find((i) => i._id === item.ingredientId)
        if (!ing) continue
        const newStock = ing.currentStock + item.quantityToBuy
        await adminWriteClient.patch(ing._id).set({ currentStock: newStock }).commit()
      }
      onStockUpdated()
    } catch (err) {
      console.error('Failed to update stock:', err)
    } finally {
      setPurchasing(false)
    }
  }

  function handlePrint() {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return
    const date = new Date().toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })
    printWindow.document.write(`
      <html><head><title>Purchase Receipt</title>
      <style>
        body { font-family: sans-serif; padding: 20px; max-width: 700px; margin: auto; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        td, th { padding: 8px 12px; text-align: left; border: 1px solid #ddd; }
        th { background: #f5f5f5; font-weight: bold; }
        .right { text-align: right; }
        .total-row { font-weight: bold; background: #f0f0f0; }
        h1 { font-size: 1.5em; margin-bottom: 4px; }
        .meta { color: #666; margin-bottom: 20px; }
      </style></head><body>
      <h1>Shakes n Snacks — Purchase Receipt</h1>
      <p class="meta">Date: ${date}</p>
      <table>
        <tr>
          <th>Ingredient</th>
          <th class="right">Current</th>
          <th class="right">Min Required</th>
          <th class="right">Qty to Buy</th>
          <th>Unit</th>
          <th class="right">Price/Unit</th>
          <th class="right">Total</th>
        </tr>
        ${receiptItems.map((i) => `
          <tr>
            <td>${i.name}</td>
            <td class="right">${i.currentStock}</td>
            <td class="right">${i.minimumStock}</td>
            <td class="right">${i.quantityToBuy}</td>
            <td>${i.unit}</td>
            <td class="right">Rs. ${i.pricePerUnit}</td>
            <td class="right">Rs. ${i.totalCost}</td>
          </tr>
        `).join('')}
        <tr class="total-row">
          <td colspan="6">Grand Total</td>
          <td class="right">Rs. ${grandTotal}</td>
        </tr>
      </table>
      <script>window.print(); window.close();</script>
      </body></html>
    `)
    printWindow.document.close()
  }

  if (lowStockIngredients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-brand-text-muted">
        <ShoppingCart className="h-12 w-12 mb-3 opacity-30" />
        <p className="text-lg">All stocked up!</p>
        <p className="text-sm mt-1">No ingredients are below minimum stock level.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-[family-name:var(--font-heading)] text-brand-text">Purchase Receipt</h3>
          <p className="text-sm text-brand-text-muted">
            {receiptItems.length} item{receiptItems.length !== 1 ? 's' : ''} need restocking
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportPurchaseReceiptToCSV(receiptItems)}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-brand-elevated px-3 py-2 text-sm text-brand-text hover:border-brand-primary transition-colors"
          >
            <Download className="h-4 w-4" /> Export CSV
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-brand-elevated px-3 py-2 text-sm text-brand-text hover:border-brand-primary transition-colors"
          >
            <Printer className="h-4 w-4" /> Print
          </button>
        </div>
      </div>

      {/* Receipt Table */}
      <div className="rounded-xl border border-white/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 bg-brand-elevated hover:bg-brand-elevated">
              <TableHead className="text-brand-text-secondary font-[family-name:var(--font-accent)]">Ingredient</TableHead>
              <TableHead className="text-brand-text-secondary font-[family-name:var(--font-accent)] text-right">Current</TableHead>
              <TableHead className="text-brand-text-secondary font-[family-name:var(--font-accent)] text-right">Min Required</TableHead>
              <TableHead className="text-brand-text-secondary font-[family-name:var(--font-accent)] text-right">Qty to Buy</TableHead>
              <TableHead className="text-brand-text-secondary font-[family-name:var(--font-accent)]">Unit</TableHead>
              <TableHead className="text-brand-text-secondary font-[family-name:var(--font-accent)] text-right">Price/Unit</TableHead>
              <TableHead className="text-brand-text-secondary font-[family-name:var(--font-accent)] text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {receiptItems.map((item) => (
              <TableRow key={item.ingredientId} className="border-white/5 hover:bg-white/5">
                <TableCell className="text-brand-text font-medium">{item.name}</TableCell>
                <TableCell className="text-right text-red-400">{item.currentStock}</TableCell>
                <TableCell className="text-right text-brand-text-secondary">{item.minimumStock}</TableCell>
                <TableCell className="text-right">
                  <Input
                    type="number"
                    value={item.quantityToBuy}
                    onChange={(e) => updateQuantity(item.ingredientId, parseFloat(e.target.value) || 0)}
                    min={0}
                    className="w-20 h-7 text-xs bg-brand-bg border-white/10 text-brand-text text-right ml-auto"
                  />
                </TableCell>
                <TableCell className="text-brand-text-secondary">{item.unit}</TableCell>
                <TableCell className="text-right text-brand-text">Rs. {item.pricePerUnit}</TableCell>
                <TableCell className="text-right text-brand-text font-medium">Rs. {item.totalCost}</TableCell>
              </TableRow>
            ))}
            {/* Grand Total Row */}
            <TableRow className="border-white/10 bg-brand-elevated hover:bg-brand-elevated">
              <TableCell colSpan={6} className="text-right font-[family-name:var(--font-heading)] text-brand-text text-lg">
                Grand Total
              </TableCell>
              <TableCell className="text-right font-[family-name:var(--font-heading)] text-brand-text text-lg">
                Rs. {grandTotal}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Mark as Purchased */}
      <button
        onClick={handleMarkPurchased}
        disabled={purchasing}
        className="w-full rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
      >
        {purchasing ? 'Updating Stock...' : 'Mark All as Purchased (Update Stock)'}
      </button>
    </div>
  )
}
