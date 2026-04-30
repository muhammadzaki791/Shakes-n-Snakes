'use client'

import { useState, useEffect } from 'react'
import { client, adminWriteClient } from '@/lib/client'
import { getAllMenuItemsForOrderQuery, getAllIngredientsQuery } from '@/lib/client/queries'
import type { MenuItemForOrder, Ingredient, Recipe } from '@/types/admin-types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Plus, Trash2, ChevronsUpDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RecipeFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  editRecipe?: Recipe | null
}

interface RecipeIngredientRow {
  ingredientId: string
  ingredientName: string
  quantityNeeded: number
  unit: string
  pricePerUnit: number
}

export function RecipeForm({ open, onOpenChange, onSuccess, editRecipe }: RecipeFormProps) {
  const [menuItems, setMenuItems] = useState<MenuItemForOrder[]>([])
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemForOrder | null>(null)
  const [menuPopoverOpen, setMenuPopoverOpen] = useState(false)
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredientRow[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    Promise.all([
      client.fetch(getAllMenuItemsForOrderQuery),
      client.fetch(getAllIngredientsQuery),
    ]).then(([items, ings]) => {
      setMenuItems(items || [])
      setIngredients(ings || [])
    })
  }, [])

  useEffect(() => {
    if (open && editRecipe) {
      const menuItem = menuItems.find((m) => m._id === editRecipe.menuItemRef?._id)
      setSelectedMenuItem(menuItem || null)
      setRecipeIngredients(
        (editRecipe.ingredients || []).map((ri) => ({
          ingredientId: ri.ingredientRef?._id || '',
          ingredientName: ri.ingredientRef?.name || '',
          quantityNeeded: ri.quantityNeeded,
          unit: ri.unit || ri.ingredientRef?.unit || '',
          pricePerUnit: ri.ingredientRef?.pricePerUnit || 0,
        }))
      )
    } else if (open && !editRecipe) {
      setSelectedMenuItem(null)
      setRecipeIngredients([])
    }
  }, [open, editRecipe, menuItems])

  function addIngredientRow() {
    setRecipeIngredients((prev) => [
      ...prev,
      { ingredientId: '', ingredientName: '', quantityNeeded: 0, unit: '', pricePerUnit: 0 },
    ])
  }

  function removeIngredientRow(index: number) {
    setRecipeIngredients((prev) => prev.filter((_, i) => i !== index))
  }

  function selectIngredient(index: number, ing: Ingredient) {
    setRecipeIngredients((prev) =>
      prev.map((row, i) =>
        i === index
          ? { ...row, ingredientId: ing._id, ingredientName: ing.name, unit: ing.unit, pricePerUnit: ing.pricePerUnit }
          : row
      )
    )
  }

  function updateQuantity(index: number, qty: number) {
    setRecipeIngredients((prev) =>
      prev.map((row, i) => (i === index ? { ...row, quantityNeeded: qty } : row))
    )
  }

  const costPerServing = recipeIngredients.reduce(
    (sum, row) => sum + row.quantityNeeded * row.pricePerUnit,
    0
  )

  async function handleSubmit() {
    if (!selectedMenuItem) return alert('Please select a menu item.')
    if (recipeIngredients.length === 0) return alert('Add at least one ingredient.')
    if (recipeIngredients.some((r) => !r.ingredientId)) return alert('Select all ingredients.')

    setLoading(true)
    try {
      const recipeData = {
        menuItemRef: { _type: 'reference', _ref: selectedMenuItem._id },
        menuItemTitle: selectedMenuItem.title,
        ingredients: recipeIngredients.map((r) => ({
          _type: 'object',
          _key: crypto.randomUUID().slice(0, 8),
          ingredientRef: { _type: 'reference', _ref: r.ingredientId },
          quantityNeeded: r.quantityNeeded,
          unit: r.unit,
        })),
      }

      if (editRecipe) {
        await adminWriteClient.patch(editRecipe._id).set(recipeData).commit()
      } else {
        await adminWriteClient.create({ _type: 'recipe', ...recipeData })
      }

      onOpenChange(false)
      onSuccess()
    } catch (err) {
      console.error('Failed to save recipe:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] bg-brand-card border-white/10">
        <DialogHeader>
          <DialogTitle className="font-[family-name:var(--font-heading)] text-brand-text">
            {editRecipe ? 'Edit Recipe' : 'Add Recipe'}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-4">
            {/* Menu Item Selector */}
            <div>
              <Label className="text-brand-text-secondary">Menu Item *</Label>
              <Popover open={menuPopoverOpen} onOpenChange={setMenuPopoverOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      'flex h-9 w-full items-center justify-between rounded-md border border-white/10 bg-brand-elevated px-3 mt-1 text-sm',
                      selectedMenuItem ? 'text-brand-text' : 'text-brand-text-muted'
                    )}
                  >
                    {selectedMenuItem?.title || 'Select menu item...'}
                    <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0 bg-brand-elevated border-white/10" align="start">
                  <Command className="bg-brand-elevated">
                    <CommandInput placeholder="Search items..." className="text-brand-text" />
                    <CommandList>
                      <CommandEmpty className="text-brand-text-muted">No items found.</CommandEmpty>
                      <CommandGroup>
                        {menuItems.map((item) => (
                          <CommandItem
                            key={item._id}
                            value={item.title}
                            onSelect={() => {
                              setSelectedMenuItem(item)
                              setMenuPopoverOpen(false)
                            }}
                            className="text-brand-text"
                          >
                            <Check className={cn('mr-2 h-4 w-4', selectedMenuItem?._id === item._id ? 'opacity-100' : 'opacity-0')} />
                            {item.title}
                            <span className="ml-auto text-xs text-brand-text-muted">{item._type}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <Separator className="bg-white/10" />

            {/* Ingredients List */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-brand-text-secondary">Ingredients</Label>
                <button
                  type="button"
                  onClick={addIngredientRow}
                  className="flex items-center gap-1 text-xs text-brand-primary hover:text-brand-primary-hover"
                >
                  <Plus className="h-3 w-3" /> Add Ingredient
                </button>
              </div>

              <div className="space-y-2">
                {recipeIngredients.map((row, index) => (
                  <RecipeIngredientSelector
                    key={index}
                    row={row}
                    ingredients={ingredients}
                    onSelect={(ing) => selectIngredient(index, ing)}
                    onQuantityChange={(qty) => updateQuantity(index, qty)}
                    onRemove={() => removeIngredientRow(index)}
                  />
                ))}
              </div>

              {recipeIngredients.length === 0 && (
                <p className="text-sm text-brand-text-muted text-center py-4">No ingredients added yet.</p>
              )}
            </div>

            {recipeIngredients.length > 0 && (
              <>
                <Separator className="bg-white/10" />
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-brand-text-secondary">Cost Per Serving</span>
                  <span className="text-brand-text">Rs. {costPerServing.toFixed(2)}</span>
                </div>
              </>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-lg bg-brand-primary py-2.5 text-sm font-semibold text-white hover:bg-brand-primary-hover disabled:opacity-50 transition-colors"
            >
              {loading ? 'Saving...' : editRecipe ? 'Update Recipe' : 'Create Recipe'}
            </button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

function RecipeIngredientSelector({
  row,
  ingredients,
  onSelect,
  onQuantityChange,
  onRemove,
}: {
  row: RecipeIngredientRow
  ingredients: Ingredient[]
  onSelect: (ing: Ingredient) => void
  onQuantityChange: (qty: number) => void
  onRemove: () => void
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-brand-elevated p-2">
      <Select
        value={row.ingredientId}
        onValueChange={(v) => {
          const ing = ingredients.find((i) => i._id === v)
          if (ing) onSelect(ing)
        }}
      >
        <SelectTrigger className="flex-1 bg-brand-bg border-white/10 text-brand-text text-xs h-8">
          <SelectValue placeholder="Select ingredient" />
        </SelectTrigger>
        <SelectContent className="bg-brand-elevated border-white/10 max-h-[200px]">
          {ingredients.map((ing) => (
            <SelectItem key={ing._id} value={ing._id} className="text-xs">
              {ing.name} ({ing.unit})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="number"
        value={row.quantityNeeded || ''}
        onChange={(e) => onQuantityChange(parseFloat(e.target.value) || 0)}
        placeholder="Qty"
        min={0}
        step={0.1}
        className="w-20 bg-brand-bg border-white/10 text-brand-text text-xs h-8"
      />

      <span className="text-xs text-brand-text-muted w-12">{row.unit}</span>

      <span className="text-xs text-brand-text w-16 text-right">
        Rs. {(row.quantityNeeded * row.pricePerUnit).toFixed(0)}
      </span>

      <button onClick={onRemove} className="text-red-400 hover:text-red-300">
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
