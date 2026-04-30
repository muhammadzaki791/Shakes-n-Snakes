'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { adminWriteClient } from '@/lib/client'
import type { Ingredient } from '@/types/admin-types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'

const ingredientSchema = z.object({
  name: z.string().min(1, 'Name required').max(100),
  unit: z.enum(['kg', 'g', 'litre', 'ml', 'pieces', 'dozen', 'packet', 'box']),
  pricePerUnit: z.number().min(0, 'Must be positive'),
  currentStock: z.number().min(0),
  minimumStock: z.number().min(0),
  supplier: z.string().optional(),
  ingredientCategory: z.string().optional(),
  notes: z.string().optional(),
})

type IngredientFormValues = z.infer<typeof ingredientSchema>

const units = ['kg', 'g', 'litre', 'ml', 'pieces', 'dozen', 'packet', 'box'] as const
const categories = [
  { value: 'dairy', label: 'Dairy' },
  { value: 'meat', label: 'Meat' },
  { value: 'vegetables', label: 'Vegetables' },
  { value: 'spices', label: 'Spices' },
  { value: 'sauces', label: 'Sauces' },
  { value: 'bread', label: 'Bread' },
  { value: 'frozen', label: 'Frozen' },
  { value: 'beverages', label: 'Beverages' },
  { value: 'dry-goods', label: 'Dry Goods' },
  { value: 'packaging', label: 'Packaging' },
  { value: 'other', label: 'Other' },
]

interface IngredientFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  editIngredient?: Ingredient | null
}

export function IngredientForm({ open, onOpenChange, onSuccess, editIngredient }: IngredientFormProps) {
  const [loading, setLoading] = useState(false)

  const form = useForm<IngredientFormValues>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: editIngredient
      ? {
          name: editIngredient.name,
          unit: editIngredient.unit,
          pricePerUnit: editIngredient.pricePerUnit,
          currentStock: editIngredient.currentStock,
          minimumStock: editIngredient.minimumStock,
          supplier: editIngredient.supplier || '',
          ingredientCategory: editIngredient.ingredientCategory || '',
          notes: editIngredient.notes || '',
        }
      : {
          name: '',
          unit: 'kg',
          pricePerUnit: 0,
          currentStock: 0,
          minimumStock: 0,
          supplier: '',
          ingredientCategory: '',
          notes: '',
        },
  })

  // Reset form when dialog opens or editIngredient changes
  useEffect(() => {
    if (open) {
      form.reset(
        editIngredient
          ? {
              name: editIngredient.name,
              unit: editIngredient.unit,
              pricePerUnit: editIngredient.pricePerUnit,
              currentStock: editIngredient.currentStock,
              minimumStock: editIngredient.minimumStock,
              supplier: editIngredient.supplier || '',
              ingredientCategory: editIngredient.ingredientCategory || '',
              notes: editIngredient.notes || '',
            }
          : {
              name: '',
              unit: 'kg' as const,
              pricePerUnit: 0,
              currentStock: 0,
              minimumStock: 0,
              supplier: '',
              ingredientCategory: '',
              notes: '',
            }
      )
    }
  }, [open, editIngredient, form])

  async function onSubmit(data: IngredientFormValues) {
    setLoading(true)
    try {
      const slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

      if (editIngredient) {
        await adminWriteClient.patch(editIngredient._id).set({
          name: data.name,
          slug: { _type: 'slug', current: slug },
          unit: data.unit,
          pricePerUnit: data.pricePerUnit,
          currentStock: data.currentStock,
          minimumStock: data.minimumStock,
          supplier: data.supplier || undefined,
          ingredientCategory: data.ingredientCategory || undefined,
          notes: data.notes || undefined,
        }).commit()
      } else {
        await adminWriteClient.create({
          _type: 'ingredient',
          name: data.name,
          slug: { _type: 'slug', current: slug },
          unit: data.unit,
          pricePerUnit: data.pricePerUnit,
          currentStock: data.currentStock,
          minimumStock: data.minimumStock,
          supplier: data.supplier || undefined,
          ingredientCategory: data.ingredientCategory || undefined,
          notes: data.notes || undefined,
        })
      }

      onOpenChange(false)
      onSuccess()
    } catch (err) {
      console.error('Failed to save ingredient:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-brand-card border-white/10">
        <DialogHeader>
          <DialogTitle className="font-[family-name:var(--font-heading)] text-brand-text">
            {editIngredient ? 'Edit Ingredient' : 'Add Ingredient'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label className="text-brand-text-secondary">Name *</Label>
            <Input
              {...form.register('name')}
              placeholder="e.g., Chicken Breast"
              className="mt-1 bg-brand-elevated border-white/10 text-brand-text"
            />
            {form.formState.errors.name && (
              <p className="text-brand-error text-xs mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-brand-text-secondary">Unit *</Label>
              <Select value={form.watch('unit')} onValueChange={(v) => form.setValue('unit', v as typeof units[number])}>
                <SelectTrigger className="mt-1 bg-brand-elevated border-white/10 text-brand-text">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-brand-elevated border-white/10">
                  {units.map((u) => (
                    <SelectItem key={u} value={u}>{u}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-brand-text-secondary">Price Per Unit (Rs.) *</Label>
              <Input
                type="number"
                {...form.register('pricePerUnit', { valueAsNumber: true })}
                className="mt-1 bg-brand-elevated border-white/10 text-brand-text"
                min={0}
              />
              {form.formState.errors.pricePerUnit && (
                <p className="text-brand-error text-xs mt-1">{form.formState.errors.pricePerUnit.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-brand-text-secondary">Current Stock</Label>
              <Input
                type="number"
                {...form.register('currentStock', { valueAsNumber: true })}
                className="mt-1 bg-brand-elevated border-white/10 text-brand-text"
                min={0}
              />
            </div>
            <div>
              <Label className="text-brand-text-secondary">Minimum Stock</Label>
              <Input
                type="number"
                {...form.register('minimumStock', { valueAsNumber: true })}
                className="mt-1 bg-brand-elevated border-white/10 text-brand-text"
                min={0}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-brand-text-secondary">Category</Label>
              <Select
                value={form.watch('ingredientCategory') || ''}
                onValueChange={(v) => form.setValue('ingredientCategory', v)}
              >
                <SelectTrigger className="mt-1 bg-brand-elevated border-white/10 text-brand-text">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-brand-elevated border-white/10">
                  {categories.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-brand-text-secondary">Supplier</Label>
              <Input
                {...form.register('supplier')}
                placeholder="Supplier name"
                className="mt-1 bg-brand-elevated border-white/10 text-brand-text"
              />
            </div>
          </div>

          <div>
            <Label className="text-brand-text-secondary">Notes</Label>
            <Textarea
              {...form.register('notes')}
              placeholder="Additional notes..."
              className="mt-1 bg-brand-elevated border-white/10 text-brand-text"
              rows={2}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand-primary py-2.5 text-sm font-semibold text-white hover:bg-brand-primary-hover disabled:opacity-50 transition-colors"
          >
            {loading ? 'Saving...' : editIngredient ? 'Update Ingredient' : 'Add Ingredient'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
