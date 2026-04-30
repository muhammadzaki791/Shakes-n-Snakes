'use client'

import type { Recipe } from '@/types/admin-types'
import { Pencil, Trash2 } from 'lucide-react'
import { adminWriteClient } from '@/lib/client'

interface RecipeCardProps {
  recipe: Recipe
  onEdit: (recipe: Recipe) => void
  onDelete: (id: string) => void
}

export function RecipeCard({ recipe, onEdit, onDelete }: RecipeCardProps) {
  const costPerServing = (recipe.ingredients || []).reduce((sum, ri) => {
    const price = ri.ingredientRef?.pricePerUnit || 0
    return sum + ri.quantityNeeded * price
  }, 0)

  async function handleDelete() {
    if (!window.confirm(`Delete recipe for "${recipe.menuItemTitle}"?`)) return
    try {
      await adminWriteClient.delete(recipe._id)
      onDelete(recipe._id)
    } catch (err) {
      console.error('Failed to delete recipe:', err)
    }
  }

  return (
    <div className="rounded-xl border border-white/10 bg-brand-card p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-[family-name:var(--font-accent)] font-semibold text-brand-text">
            {recipe.menuItemTitle || 'Untitled'}
          </h3>
          <span className="text-xs text-brand-text-muted capitalize">
            {recipe.menuItemRef?._type || 'item'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onEdit(recipe)} className="p-1.5 rounded-md hover:bg-white/10 text-brand-text-muted hover:text-brand-text">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button onClick={handleDelete} className="p-1.5 rounded-md hover:bg-white/10 text-red-400 hover:text-red-300">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        {(recipe.ingredients || []).map((ri, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <span className="text-brand-text-secondary">
              {ri.ingredientRef?.name || 'Unknown'}
            </span>
            <span className="text-brand-text-muted">
              {ri.quantityNeeded} {ri.unit || ri.ingredientRef?.unit || ''}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-white/10 flex justify-between text-sm">
        <span className="text-brand-text-secondary">Cost per serving</span>
        <span className="font-medium text-brand-text">Rs. {costPerServing.toFixed(0)}</span>
      </div>
    </div>
  )
}
