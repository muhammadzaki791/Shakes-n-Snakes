'use client'

import { useEffect, useState, useMemo } from 'react'
import { client } from '@/lib/client'
import { getAllIngredientsQuery, getLowStockIngredientsQuery, getAllRecipesQuery } from '@/lib/client/queries'
import type { Ingredient, Recipe } from '@/types/admin-types'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { IngredientForm } from '@/components/admin/inventory/ingredient-form'
import { IngredientTable } from '@/components/admin/inventory/ingredient-table'
import { RecipeForm } from '@/components/admin/inventory/recipe-form'
import { RecipeCard } from '@/components/admin/inventory/recipe-card'
import { PurchaseReceipt } from '@/components/admin/inventory/purchase-receipt'
import { Plus, ArrowLeft, Search, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
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

export default function InventoryPage() {
  const [tab, setTab] = useState('ingredients')

  // Ingredients state
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [ingredientSearch, setIngredientSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [ingredientFormOpen, setIngredientFormOpen] = useState(false)
  const [editIngredient, setEditIngredient] = useState<Ingredient | null>(null)
  const [ingredientsLoading, setIngredientsLoading] = useState(true)

  // Recipes state
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [recipeFormOpen, setRecipeFormOpen] = useState(false)
  const [editRecipe, setEditRecipe] = useState<Recipe | null>(null)
  const [recipesLoading, setRecipesLoading] = useState(true)

  // Low stock
  const [lowStockIngredients, setLowStockIngredients] = useState<Ingredient[]>([])

  async function fetchIngredients() {
    setIngredientsLoading(true)
    const data = await client.fetch(getAllIngredientsQuery)
    setIngredients(data || [])
    setIngredientsLoading(false)
  }

  async function fetchRecipes() {
    setRecipesLoading(true)
    const data = await client.fetch(getAllRecipesQuery)
    setRecipes(data || [])
    setRecipesLoading(false)
  }

  async function fetchLowStock() {
    const data = await client.fetch(getLowStockIngredientsQuery)
    setLowStockIngredients(data || [])
  }

  useEffect(() => {
    fetchIngredients()
    fetchRecipes()
    fetchLowStock()
  }, [])

  const filteredIngredients = useMemo(() => {
    let result = ingredients
    if (categoryFilter !== 'all') {
      result = result.filter((i) => i.ingredientCategory === categoryFilter)
    }
    if (ingredientSearch) {
      const term = ingredientSearch.toLowerCase()
      result = result.filter((i) =>
        i.name.toLowerCase().includes(term) || i.supplier?.toLowerCase().includes(term)
      )
    }
    return result
  }, [ingredients, categoryFilter, ingredientSearch])

  const lowStockCount = useMemo(() => {
    return ingredients.filter((i) => i.currentStock < i.minimumStock).length
  }, [ingredients])

  function handleIngredientEdit(ing: Ingredient) {
    setEditIngredient(ing)
    setIngredientFormOpen(true)
  }

  function handleIngredientDelete(id: string) {
    setIngredients((prev) => prev.filter((i) => i._id !== id))
  }

  function handleStockUpdate(id: string, newStock: number) {
    setIngredients((prev) =>
      prev.map((i) => (i._id === id ? { ...i, currentStock: newStock } : i))
    )
  }

  function handleRecipeEdit(recipe: Recipe) {
    setEditRecipe(recipe)
    setRecipeFormOpen(true)
  }

  function handleRecipeDelete(id: string) {
    setRecipes((prev) => prev.filter((r) => r._id !== id))
  }

  function handleStockRefresh() {
    fetchIngredients()
    fetchLowStock()
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
                Inventory
              </h1>
              <p className="text-brand-text-secondary text-sm mt-1">
                {ingredients.length} ingredients &middot; {recipes.length} recipes
                {lowStockCount > 0 && (
                  <span className="ml-2 text-yellow-400">
                    <AlertTriangle className="inline h-3.5 w-3.5 mr-1" />
                    {lowStockCount} low stock
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-brand-elevated border border-white/10 mb-6">
            <TabsTrigger value="ingredients" className="data-[state=active]:bg-brand-primary data-[state=active]:text-white text-brand-text-secondary">
              Ingredients
            </TabsTrigger>
            <TabsTrigger value="recipes" className="data-[state=active]:bg-brand-primary data-[state=active]:text-white text-brand-text-secondary">
              Recipes
            </TabsTrigger>
            <TabsTrigger value="purchase" className="data-[state=active]:bg-brand-primary data-[state=active]:text-white text-brand-text-secondary relative">
              Purchase Receipt
              {lowStockCount > 0 && (
                <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-[10px] font-bold text-black">
                  {lowStockCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Ingredients Tab */}
          <TabsContent value="ingredients" className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1">
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-text-muted" />
                  <Input
                    placeholder="Search ingredients..."
                    value={ingredientSearch}
                    onChange={(e) => setIngredientSearch(e.target.value)}
                    className="pl-9 bg-brand-elevated border-white/10 text-brand-text"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40 bg-brand-elevated border-white/10 text-brand-text">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-brand-elevated border-white/10">
                    {categoryOptions.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <button
                onClick={() => {
                  setEditIngredient(null)
                  setIngredientFormOpen(true)
                }}
                className="flex items-center gap-1.5 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-primary-hover transition-colors"
              >
                <Plus className="h-4 w-4" /> Add Ingredient
              </button>
            </div>

            {ingredientsLoading ? (
              <div className="flex justify-center py-16">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
              </div>
            ) : (
              <IngredientTable
                ingredients={filteredIngredients}
                onEdit={handleIngredientEdit}
                onDelete={handleIngredientDelete}
                onStockUpdate={handleStockUpdate}
              />
            )}
          </TabsContent>

          {/* Recipes Tab */}
          <TabsContent value="recipes" className="space-y-4">
            <div className="flex items-center justify-end">
              <button
                onClick={() => {
                  setEditRecipe(null)
                  setRecipeFormOpen(true)
                }}
                className="flex items-center gap-1.5 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-primary-hover transition-colors"
              >
                <Plus className="h-4 w-4" /> Add Recipe
              </button>
            </div>

            {recipesLoading ? (
              <div className="flex justify-center py-16">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
              </div>
            ) : recipes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-brand-text-muted">
                <p className="text-lg">No recipes yet</p>
                <p className="text-sm mt-1">Link ingredients to menu items by adding a recipe.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recipes.map((recipe) => (
                  <RecipeCard
                    key={recipe._id}
                    recipe={recipe}
                    onEdit={handleRecipeEdit}
                    onDelete={handleRecipeDelete}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Purchase Receipt Tab */}
          <TabsContent value="purchase">
            <PurchaseReceipt
              lowStockIngredients={lowStockIngredients}
              onStockUpdated={handleStockRefresh}
            />
          </TabsContent>
        </Tabs>

        {/* Forms */}
        <IngredientForm
          open={ingredientFormOpen}
          onOpenChange={setIngredientFormOpen}
          onSuccess={() => {
            fetchIngredients()
            fetchLowStock()
          }}
          editIngredient={editIngredient}
        />
        <RecipeForm
          open={recipeFormOpen}
          onOpenChange={setRecipeFormOpen}
          onSuccess={fetchRecipes}
          editRecipe={editRecipe}
        />
      </div>
    </div>
  )
}
