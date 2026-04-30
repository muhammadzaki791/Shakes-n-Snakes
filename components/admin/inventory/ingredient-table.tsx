'use client'

import type { Ingredient } from '@/types/admin-types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { adminWriteClient } from '@/lib/client'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface IngredientTableProps {
  ingredients: Ingredient[]
  onEdit: (ingredient: Ingredient) => void
  onDelete: (id: string) => void
  onStockUpdate: (id: string, newStock: number) => void
}

function getStockStatus(current: number, minimum: number): { label: string; className: string } {
  if (current <= 0) return { label: 'Out of Stock', className: 'text-red-400 bg-red-500/20 border-red-500/30' }
  if (current < minimum) return { label: 'Low Stock', className: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30' }
  return { label: 'In Stock', className: 'text-green-400 bg-green-500/20 border-green-500/30' }
}

export function IngredientTable({ ingredients, onEdit, onDelete, onStockUpdate }: IngredientTableProps) {
  const [editingStockId, setEditingStockId] = useState<string | null>(null)
  const [stockValue, setStockValue] = useState<number>(0)

  async function handleStockSave(id: string) {
    try {
      await adminWriteClient.patch(id).set({ currentStock: stockValue }).commit()
      onStockUpdate(id, stockValue)
      setEditingStockId(null)
    } catch (err) {
      console.error('Failed to update stock:', err)
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this ingredient? This cannot be undone.')) return
    try {
      await adminWriteClient.delete(id)
      onDelete(id)
    } catch (err) {
      console.error('Failed to delete ingredient:', err)
    }
  }

  if (ingredients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-brand-text-muted">
        <p className="text-lg">No ingredients yet</p>
        <p className="text-sm mt-1">Add your first ingredient to get started</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 bg-brand-elevated hover:bg-brand-elevated">
            <TableHead className="text-brand-text-secondary font-[family-name:var(--font-accent)]">Name</TableHead>
            <TableHead className="text-brand-text-secondary font-[family-name:var(--font-accent)]">Category</TableHead>
            <TableHead className="text-brand-text-secondary font-[family-name:var(--font-accent)]">Unit</TableHead>
            <TableHead className="text-brand-text-secondary font-[family-name:var(--font-accent)] text-right">Price/Unit</TableHead>
            <TableHead className="text-brand-text-secondary font-[family-name:var(--font-accent)] text-right">Stock</TableHead>
            <TableHead className="text-brand-text-secondary font-[family-name:var(--font-accent)] text-right">Min Stock</TableHead>
            <TableHead className="text-brand-text-secondary font-[family-name:var(--font-accent)]">Status</TableHead>
            <TableHead className="text-brand-text-secondary w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ingredients.map((ing) => {
            const status = getStockStatus(ing.currentStock, ing.minimumStock)
            return (
              <TableRow key={ing._id} className="border-white/5 hover:bg-white/5">
                <TableCell>
                  <div>
                    <span className="text-brand-text font-medium">{ing.name}</span>
                    {ing.supplier && <span className="block text-xs text-brand-text-muted">{ing.supplier}</span>}
                  </div>
                </TableCell>
                <TableCell className="text-brand-text-secondary text-sm capitalize">{ing.ingredientCategory || '—'}</TableCell>
                <TableCell className="text-brand-text-secondary text-sm">{ing.unit}</TableCell>
                <TableCell className="text-right text-brand-text">Rs. {ing.pricePerUnit}</TableCell>
                <TableCell className="text-right">
                  {editingStockId === ing._id ? (
                    <div className="flex items-center justify-end gap-1">
                      <Input
                        type="number"
                        value={stockValue}
                        onChange={(e) => setStockValue(parseFloat(e.target.value) || 0)}
                        className="w-20 h-7 text-xs bg-brand-bg border-white/10 text-brand-text"
                        min={0}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleStockSave(ing._id)
                          if (e.key === 'Escape') setEditingStockId(null)
                        }}
                      />
                      <button
                        onClick={() => handleStockSave(ing._id)}
                        className="text-xs text-green-400 hover:text-green-300"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingStockId(ing._id)
                        setStockValue(ing.currentStock)
                      }}
                      className="text-brand-text hover:text-brand-primary transition-colors cursor-pointer"
                      title="Click to edit stock"
                    >
                      {ing.currentStock}
                    </button>
                  )}
                </TableCell>
                <TableCell className="text-right text-brand-text-secondary">{ing.minimumStock}</TableCell>
                <TableCell>
                  <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium', status.className)}>
                    {status.label}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-white/10">
                        <MoreHorizontal className="h-4 w-4 text-brand-text-muted" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-brand-elevated border-white/10">
                      <DropdownMenuItem onClick={() => onEdit(ing)} className="text-brand-text focus:bg-white/5">
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(ing._id)} className="text-red-400 focus:text-red-300 focus:bg-white/5">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
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
