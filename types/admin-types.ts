export interface OrderItem {
  _key?: string
  menuItemTitle: string
  menuItemType: string
  sizeName: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

export interface Order {
  _id: string
  _type: 'order'
  _createdAt: string
  orderNumber: number
  orderDate: string
  customerName?: string
  items: OrderItem[]
  subtotal: number
  discountType: 'none' | 'percentage' | 'flat'
  discountValue: number
  discountAmount: number
  total: number
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  paymentMethod: 'cash' | 'online' | 'unpaid'
  orderSource: 'walk-in' | 'whatsapp' | 'phone'
  notes?: string
}

export interface Ingredient {
  _id: string
  _type: 'ingredient'
  name: string
  slug: { current: string }
  unit: 'kg' | 'g' | 'litre' | 'ml' | 'pieces' | 'dozen' | 'packet' | 'box'
  pricePerUnit: number
  currentStock: number
  minimumStock: number
  supplier?: string
  ingredientCategory?: string
  notes?: string
}

export interface RecipeIngredient {
  _key?: string
  ingredientRef: {
    _ref: string
    _id?: string
    name?: string
    unit?: string
    pricePerUnit?: number
  }
  quantityNeeded: number
  unit: string
}

export interface Recipe {
  _id: string
  _type: 'recipe'
  menuItemRef: {
    _ref: string
    _id?: string
    title?: string
    _type?: string
  }
  menuItemTitle: string
  ingredients: RecipeIngredient[]
}

export interface SalesRecord {
  _id: string
  _type: 'salesRecord'
  date: string
  totalOrders: number
  completedOrders: number
  cancelledOrders: number
  totalRevenue: number
  totalDiscount: number
  netRevenue: number
  paymentBreakdown: {
    cash: number
    online: number
  }
  topItems: { itemTitle: string; quantity: number; revenue: number }[]
  archivedOrdersData?: string
}

export interface DailySalesSummary {
  date: string
  totalOrders: number
  completedOrders: number
  cancelledOrders: number
  totalRevenue: number
  totalDiscount: number
  netRevenue: number
  avgOrderValue: number
  topItem?: string
}

export interface PurchaseReceiptItem {
  ingredientId: string
  name: string
  currentStock: number
  minimumStock: number
  quantityToBuy: number
  unit: string
  pricePerUnit: number
  totalCost: number
}

export interface MenuItemForOrder {
  _id: string
  _type: string
  title: string
  sizes: { sizeName: string; price: string }[]
}
