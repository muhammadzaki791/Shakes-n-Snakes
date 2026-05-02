'use client'

import { useState, useEffect, useCallback } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { client, adminWriteClient } from '@/lib/client'
import { getAllMenuItemsForOrderQuery, getNextOrderNumberQuery } from '@/lib/client/queries'
import type { MenuItemForOrder, Order } from '@/types/admin-types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, Trash2, Search, ShoppingBag } from 'lucide-react'

const orderItemSchema = z.object({
  menuItemTitle: z.string().min(1, 'Item required'),
  menuItemType: z.string(),
  sizeName: z.string().min(1, 'Size required'),
  quantity: z.number().int().min(1, 'Min 1'),
  unitPrice: z.number().min(0),
  lineTotal: z.number().min(0),
})

const orderFormSchema = z.object({
  customerName: z.string().optional(),
  tableNumber: z.string().optional(),
  items: z.array(orderItemSchema).min(1, 'Add at least one item'),
  discountType: z.enum(['none', 'percentage', 'flat']),
  discountValue: z.number().min(0).optional(),
  paymentMethod: z.enum(['cash', 'online', 'unpaid']),
  orderSource: z.enum(['walk-in', 'whatsapp', 'phone']),
  notes: z.string().optional(),
})

type OrderFormValues = z.infer<typeof orderFormSchema>

interface OrderFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  editOrder?: Order | null
}

export function OrderForm({ open, onOpenChange, onSuccess, editOrder }: OrderFormProps) {
  const [menuItems, setMenuItems] = useState<MenuItemForOrder[]>([])
  const [loading, setLoading] = useState(false)
  const [menuLoading, setMenuLoading] = useState(true)

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customerName: '',
      tableNumber: '',
      items: [{ menuItemTitle: '', menuItemType: '', sizeName: '', quantity: 1, unitPrice: 0, lineTotal: 0 }],
      discountType: 'none',
      discountValue: 0,
      paymentMethod: 'cash',
      orderSource: 'walk-in',
      notes: '',
    },
  })

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'items' })
  const watchItems = form.watch('items')
  const watchDiscountType = form.watch('discountType')
  const watchDiscountValue = form.watch('discountValue')

  useEffect(() => {
    setMenuLoading(true)
    client.fetch(getAllMenuItemsForOrderQuery).then((data) => {
      setMenuItems(data || [])
      setMenuLoading(false)
    })
  }, [])

  useEffect(() => {
    if (editOrder && open) {
      form.reset({
        customerName: editOrder.customerName || '',
        tableNumber: editOrder.tableNumber || '',
        items: editOrder.items.map((i) => ({
          menuItemTitle: i.menuItemTitle,
          menuItemType: i.menuItemType,
          sizeName: i.sizeName,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          lineTotal: i.lineTotal,
        })),
        discountType: editOrder.discountType || 'none',
        discountValue: editOrder.discountValue || 0,
        paymentMethod: editOrder.paymentMethod || 'cash',
        orderSource: editOrder.orderSource || 'walk-in',
        notes: editOrder.notes || '',
      })
    } else if (open && !editOrder) {
      form.reset({
        customerName: '',
        tableNumber: '',
        items: [{ menuItemTitle: '', menuItemType: '', sizeName: '', quantity: 1, unitPrice: 0, lineTotal: 0 }],
        discountType: 'none',
        discountValue: 0,
        paymentMethod: 'cash',
        orderSource: 'walk-in',
        notes: '',
      })
    }
  }, [editOrder, open, form])

  const calculateTotals = useCallback(() => {
    const subtotal = watchItems.reduce((sum, item) => sum + (item.lineTotal || 0), 0)
    let discountAmount = 0
    const dv = watchDiscountValue || 0
    if (watchDiscountType === 'percentage') {
      discountAmount = Math.round((subtotal * dv) / 100)
    } else if (watchDiscountType === 'flat') {
      discountAmount = Math.min(dv, subtotal)
    }
    return { subtotal, discountAmount, total: subtotal - discountAmount }
  }, [watchItems, watchDiscountType, watchDiscountValue])

  const totals = calculateTotals()

  function handleItemSelect(index: number, menuItemId: string) {
    const item = menuItems.find((m) => m._id === menuItemId)
    if (!item) return
    form.setValue(`items.${index}.menuItemTitle`, item.title)
    form.setValue(`items.${index}.menuItemType`, item._type)
    form.setValue(`items.${index}.sizeName`, '')
    form.setValue(`items.${index}.unitPrice`, 0)
    form.setValue(`items.${index}.lineTotal`, 0)
  }

  function parsePriceString(priceStr: string): number {
    const match = String(priceStr).match(/\d+(?:\.\d+)?/)
    return match ? parseFloat(match[0]) : 0
  }

  function handleSizeSelect(index: number, sizeName: string) {
    const itemTitle = form.getValues(`items.${index}.menuItemTitle`)
    const menuItem = menuItems.find((m) => m.title === itemTitle)
    const size = menuItem?.sizes.find((s) => s.sizeName === sizeName)
    const price = size ? parsePriceString(size.price) : 0
    const qty = form.getValues(`items.${index}.quantity`) || 1
    form.setValue(`items.${index}.sizeName`, sizeName)
    form.setValue(`items.${index}.unitPrice`, price)
    form.setValue(`items.${index}.lineTotal`, price * qty)
  }

  function handleQuantityChange(index: number, qty: number) {
    const price = form.getValues(`items.${index}.unitPrice`) || 0
    form.setValue(`items.${index}.quantity`, qty)
    form.setValue(`items.${index}.lineTotal`, price * qty)
  }

  async function onSubmit(data: OrderFormValues) {
    setLoading(true)
    try {
      const { subtotal, discountAmount, total } = calculateTotals()

      const sanitizedItems = data.items.map((i) => ({
        _key: crypto.randomUUID().slice(0, 8),
        menuItemTitle: i.menuItemTitle,
        menuItemType: i.menuItemType,
        sizeName: i.sizeName,
        quantity: i.quantity,
        unitPrice: i.unitPrice || 0,
        lineTotal: i.lineTotal || 0,
      }))

      if (editOrder) {
        await adminWriteClient.patch(editOrder._id).set({
          customerName: data.customerName || undefined,
          tableNumber: data.tableNumber || undefined,
          items: sanitizedItems,
          subtotal,
          discountType: data.discountType,
          discountValue: data.discountValue || 0,
          discountAmount,
          total,
          paymentMethod: data.paymentMethod,
          orderSource: data.orderSource,
          notes: data.notes || undefined,
        }).commit()
      } else {
        const { nextNumber } = await client.fetch(getNextOrderNumberQuery)
        await adminWriteClient.create({
          _type: 'order',
          orderNumber: nextNumber || 1,
          orderDate: new Date().toISOString(),
          customerName: data.customerName || undefined,
          tableNumber: data.tableNumber || undefined,
          items: sanitizedItems,
          subtotal,
          discountType: data.discountType,
          discountValue: data.discountValue || 0,
          discountAmount,
          total,
          status: 'pending',
          paymentMethod: data.paymentMethod,
          orderSource: data.orderSource,
          notes: data.notes || undefined,
        })
      }

      onOpenChange(false)
      onSuccess()
    } catch (err) {
      console.error('Failed to save order:', err)
      const message = err instanceof Error ? err.message : 'Unknown error'
      alert(`Failed to save order: ${message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] bg-brand-card border-white/10">
        <DialogHeader>
          <DialogTitle className="font-[family-name:var(--font-heading)] text-brand-text">
            {editOrder ? `Edit Order #${editOrder.orderNumber}` : 'New Order'}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Customer Name + Table Number */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <Label className="text-brand-text-secondary">Customer Name (optional)</Label>
                <Input
                  {...form.register('customerName')}
                  placeholder="Walk-in customer"
                  className="mt-1 bg-brand-elevated border-white/10 text-brand-text"
                />
              </div>
              <div>
                <Label className="text-brand-text-secondary">Table # (optional)</Label>
                <Input
                  {...form.register('tableNumber')}
                  placeholder="e.g. 5"
                  className="mt-1 bg-brand-elevated border-white/10 text-brand-text"
                />
              </div>
            </div>

            {/* Order Items */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-brand-text-secondary flex items-center gap-1.5">
                  <ShoppingBag className="h-4 w-4" /> Order Items
                </Label>
                <button
                  type="button"
                  onClick={() => append({ menuItemTitle: '', menuItemType: '', sizeName: '', quantity: 1, unitPrice: 0, lineTotal: 0 })}
                  className="flex items-center gap-1 rounded-md bg-brand-primary/10 border border-brand-primary/30 px-2.5 py-1 text-xs text-brand-primary hover:bg-brand-primary/20 transition-colors"
                >
                  <Plus className="h-3 w-3" /> Add Another Item
                </button>
              </div>
              {form.formState.errors.items?.message && (
                <p className="text-brand-error text-xs mb-2">{form.formState.errors.items.message}</p>
              )}

              {menuLoading ? (
                <div className="flex items-center justify-center py-8 text-brand-text-muted text-sm">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-primary border-t-transparent mr-2" />
                  Loading menu items...
                </div>
              ) : menuItems.length === 0 ? (
                <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-400">
                  No menu items found in your website. Make sure you have items added in Sanity Studio with &quot;Available&quot; set to true.
                </div>
              ) : (
                <div className="space-y-3">
                  {fields.map((field, index) => {
                    const currentItem = watchItems[index]
                    const selectedMenuItem = menuItems.find((m) => m.title === currentItem?.menuItemTitle)

                    return (
                      <div key={field.id} className="rounded-lg border border-white/10 bg-brand-elevated p-3 space-y-3">
                        {/* Row Header */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-brand-text-muted">Item #{index + 1}</span>
                          {fields.length > 1 && (
                            <button type="button" onClick={() => remove(index)} className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1">
                              <Trash2 className="h-3 w-3" /> Remove
                            </button>
                          )}
                        </div>

                        {/* Step 1: Select Menu Item from dropdown */}
                        <div>
                          <label className="text-xs text-brand-text-muted mb-1 block">Select Item from Menu</label>
                          <MenuItemSelector
                            menuItems={menuItems}
                            selectedTitle={currentItem?.menuItemTitle || ''}
                            onSelect={(id) => handleItemSelect(index, id)}
                          />
                          {form.formState.errors.items?.[index]?.menuItemTitle && (
                            <p className="text-brand-error text-xs mt-1">{form.formState.errors.items[index].menuItemTitle?.message}</p>
                          )}
                        </div>

                        {/* Step 2: Size & Quantity (shown after item is selected) */}
                        {selectedMenuItem && (
                          <div className="grid grid-cols-3 gap-3 pt-1">
                            <div>
                              <label className="text-xs text-brand-text-muted mb-1 block">Size & Price</label>
                              <Select value={currentItem?.sizeName || ''} onValueChange={(v) => handleSizeSelect(index, v)}>
                                <SelectTrigger className="bg-brand-bg border-white/10 text-brand-text text-sm h-9">
                                  <SelectValue placeholder="Pick size" />
                                </SelectTrigger>
                                <SelectContent className="bg-brand-elevated border-white/10">
                                  {selectedMenuItem.sizes.map((s) => (
                                    <SelectItem key={s.sizeName} value={s.sizeName}>
                                      {s.sizeName} — {s.price}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {form.formState.errors.items?.[index]?.sizeName && (
                                <p className="text-brand-error text-xs mt-1">{form.formState.errors.items[index].sizeName?.message}</p>
                              )}
                            </div>

                            <div>
                              <label className="text-xs text-brand-text-muted mb-1 block">Quantity</label>
                              <div className="flex items-center h-9">
                                <button
                                  type="button"
                                  onClick={() => handleQuantityChange(index, Math.max(1, (currentItem?.quantity || 1) - 1))}
                                  className="h-9 w-9 rounded-l-md border border-white/10 bg-brand-bg text-brand-text hover:bg-white/10 text-lg font-bold"
                                >
                                  −
                                </button>
                                <Input
                                  type="number"
                                  value={currentItem?.quantity || 1}
                                  onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                                  min={1}
                                  className="h-9 w-14 rounded-none border-y border-white/10 bg-brand-bg text-brand-text text-center text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleQuantityChange(index, (currentItem?.quantity || 1) + 1)}
                                  className="h-9 w-9 rounded-r-md border border-white/10 bg-brand-bg text-brand-text hover:bg-white/10 text-lg font-bold"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className="text-xs text-brand-text-muted mb-1 block">Total</label>
                              <div className="flex items-center h-9 px-3 rounded-md bg-brand-bg border border-white/10 text-brand-text font-semibold text-sm">
                                Rs. {currentItem?.lineTotal || 0}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <Separator className="bg-white/10" />

            {/* Discount */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-brand-text-secondary">Discount Type</Label>
                <Select
                  value={watchDiscountType}
                  onValueChange={(v) => form.setValue('discountType', v as 'none' | 'percentage' | 'flat')}
                >
                  <SelectTrigger className="mt-1 bg-brand-elevated border-white/10 text-brand-text">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-brand-elevated border-white/10">
                    <SelectItem value="none">No Discount</SelectItem>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="flat">Flat (Rs.)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {watchDiscountType !== 'none' && (
                <div>
                  <Label className="text-brand-text-secondary">
                    {watchDiscountType === 'percentage' ? 'Percentage' : 'Amount (Rs.)'}
                  </Label>
                  <Input
                    type="number"
                    {...form.register('discountValue', { valueAsNumber: true })}
                    className="mt-1 bg-brand-elevated border-white/10 text-brand-text"
                    min={0}
                    max={watchDiscountType === 'percentage' ? 100 : undefined}
                  />
                </div>
              )}
            </div>

            {/* Payment & Source */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-brand-text-secondary">Payment Method</Label>
                <Select
                  value={form.watch('paymentMethod')}
                  onValueChange={(v) => form.setValue('paymentMethod', v as 'cash' | 'online' | 'unpaid')}
                >
                  <SelectTrigger className="mt-1 bg-brand-elevated border-white/10 text-brand-text">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-brand-elevated border-white/10">
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-brand-text-secondary">Order Source</Label>
                <Select
                  value={form.watch('orderSource')}
                  onValueChange={(v) => form.setValue('orderSource', v as 'walk-in' | 'whatsapp' | 'phone')}
                >
                  <SelectTrigger className="mt-1 bg-brand-elevated border-white/10 text-brand-text">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-brand-elevated border-white/10">
                    <SelectItem value="walk-in">Walk-in</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label className="text-brand-text-secondary">Notes (optional)</Label>
              <Textarea
                {...form.register('notes')}
                placeholder="Special instructions..."
                className="mt-1 bg-brand-elevated border-white/10 text-brand-text"
                rows={2}
              />
            </div>

            <Separator className="bg-white/10" />

            {/* Totals */}
            <div className="rounded-lg bg-brand-elevated border border-white/10 p-4 space-y-2">
              <div className="flex justify-between text-sm text-brand-text-secondary">
                <span>Subtotal</span>
                <span>Rs. {totals.subtotal}</span>
              </div>
              {totals.discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-400">
                  <span>Discount</span>
                  <span>- Rs. {totals.discountAmount}</span>
                </div>
              )}
              <Separator className="bg-white/10" />
              <div className="flex justify-between text-xl font-bold text-brand-text">
                <span>Total</span>
                <span>Rs. {totals.total}</span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-brand-primary py-3 text-sm font-semibold text-white hover:bg-brand-primary-hover disabled:opacity-50 transition-colors"
            >
              {loading ? 'Saving...' : editOrder ? 'Update Order' : 'Create Order'}
            </button>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Searchable menu item selector with filtering.
 * Shows all your website's menu items in a dropdown with search.
 */
function MenuItemSelector({
  menuItems,
  selectedTitle,
  onSelect,
}: {
  menuItems: MenuItemForOrder[]
  selectedTitle: string
  onSelect: (menuItemId: string) => void
}) {
  const [search, setSearch] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const typeLabels: Record<string, string> = {
    savoury: '🍔 Savoury',
    shake: '🥤 Shake',
    teaCoffee: '☕ Tea/Coffee',
    limca: '🍋 Limca',
    golaGanda: '🍧 Gola Ganda',
    other: '🍱 Other',
  }

  const filtered = search
    ? menuItems.filter((m) => m.title.toLowerCase().includes(search.toLowerCase()))
    : menuItems

  // Group by type
  const grouped: Record<string, MenuItemForOrder[]> = {}
  filtered.forEach((item) => {
    const group = typeLabels[item._type] || item._type
    if (!grouped[group]) grouped[group] = []
    grouped[group].push(item)
  })

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className={`flex h-10 w-full items-center justify-between rounded-md border bg-brand-bg px-3 text-sm text-left transition-colors ${
          dropdownOpen
            ? 'border-brand-primary ring-1 ring-brand-primary/30'
            : 'border-white/10 hover:border-white/20'
        } ${selectedTitle ? 'text-brand-text' : 'text-brand-text-muted'}`}
      >
        <span className="truncate">{selectedTitle || 'Click to select a menu item...'}</span>
        <Search className="ml-2 h-4 w-4 shrink-0 text-brand-text-muted" />
      </button>

      {/* Dropdown */}
      {dropdownOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-white/10 bg-brand-card shadow-xl shadow-black/30 overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type to search items..."
                className="w-full h-9 rounded-md bg-brand-elevated border border-white/10 pl-9 pr-3 text-sm text-brand-text placeholder:text-brand-text-muted outline-none focus:border-brand-primary"
                autoFocus
              />
            </div>
          </div>

          {/* Items List */}
          <div className="max-h-[250px] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="py-6 text-center text-sm text-brand-text-muted">
                No items match &quot;{search}&quot;
              </div>
            ) : (
              Object.entries(grouped).map(([group, items]) => (
                <div key={group}>
                  <div className="px-3 py-1.5 text-xs font-semibold text-brand-text-muted bg-brand-elevated sticky top-0">
                    {group}
                  </div>
                  {items.map((item) => {
                    const priceRange = item.sizes.length > 0
                      ? item.sizes.length === 1
                        ? item.sizes[0].price
                        : `${item.sizes[0].price} - ${item.sizes[item.sizes.length - 1].price}`
                      : ''
                    return (
                      <button
                        key={item._id}
                        type="button"
                        onClick={() => {
                          onSelect(item._id)
                          setDropdownOpen(false)
                          setSearch('')
                        }}
                        className={`flex w-full items-center justify-between px-3 py-2.5 text-sm hover:bg-brand-primary/10 transition-colors ${
                          selectedTitle === item.title ? 'bg-brand-primary/15 text-brand-primary' : 'text-brand-text'
                        }`}
                      >
                        <span className="truncate font-medium">{item.title}</span>
                        <span className="ml-2 text-xs text-brand-text-muted whitespace-nowrap">{priceRange}</span>
                      </button>
                    )
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {dropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setDropdownOpen(false); setSearch('') }}
        />
      )}
    </div>
  )
}
