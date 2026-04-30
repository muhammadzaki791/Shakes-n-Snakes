import { groq } from 'next-sanity'

const menuItemFields = `
  _id,
  _type,
  title,
  slug,
  images,
  description,
  category->{title, slug},
  tags,
  isAvailable,
  calories,
  "priceDisplay": sizes[0].price
`

export const getAllMenuItemsQuery = groq`
  *[_type in ["savoury", "shake", "teaCoffee", "limca", "golaGanda", "other"]] | order(title asc) {
    ${menuItemFields}
  }
`

export const getMenuItemBySlugQuery = groq`
  *[_type in ["savoury", "shake", "teaCoffee", "limca", "golaGanda", "other"] && slug.current == $slug][0] {
    _id,
    _type,
    title,
    slug,
    images,
    description,
    category->{title, slug},
    tags,
    isAvailable,
    calories,
    sizes,
    // Type-specific fields
    itemType,
    spiceLevel,
    isVegan,
    flavorProfile,
    toppings,
    drinkType,
    milkOption,
    isHot,
    fizzType,
    isCarbonated,
    flavor,
    protein,
    "priceDisplay": sizes[0].price
  }
`

export const getAllCategoriesQuery = groq`
  *[_type == "category"] | order(displayOrder asc, title asc) {
    _id,
    title,
    slug,
    description,
    parentCategory->{_id, title, slug},
    isTopLevel,
    showcaseImage,
    showcaseSubtitle,
    emoji,
    displayOrder
  }
`

export const getHierarchicalCategoriesWithItemsQuery = groq`
  *[_type == "category" && isTopLevel == true] | order(displayOrder asc) {
    _id,
    title,
    slug,
    description,
    showcaseImage,
    showcaseSubtitle,
    emoji,
    displayOrder,
    "subCategories": *[_type == "category" && parentCategory._ref == ^._id] | order(displayOrder asc) {
      _id, title, slug, description
    },
    "items": *[_type in ["savoury", "shake", "teaCoffee", "limca", "golaGanda", "other"] && category._ref == ^._id && isAvailable == true] | order(title asc) {
      ${menuItemFields}
    }
  }
`

export const getTopLevelCategoriesQuery = groq`
  *[_type == "category" && isTopLevel == true] | order(displayOrder asc) {
    _id,
    title,
    slug,
    showcaseImage,
    showcaseSubtitle,
    emoji
  }
`

export const getCategoryBySlugWithItemsQuery = groq`
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    showcaseImage,
    emoji,
    "subCategories": *[_type == "category" && parentCategory._ref == ^._id] | order(displayOrder asc) {
      _id, title, slug, description, showcaseImage, emoji
    },
    "directItems": *[_type in ["savoury", "shake", "teaCoffee", "limca", "golaGanda", "other"] && category._ref == ^._id && isAvailable == true] | order(title asc) {
      ${menuItemFields}
    }
  }
`

export const getCategoryBySlugQuery = groq`
  *[_type == "category" && slug.current == $slug][0] {
    _id, title, slug, description, showcaseImage, emoji, showcaseSubtitle
  }
`

export const getSeoByPageSlugQuery = groq`
  *[_type == "seo" && pageSlug == $pageSlug][0] {
    pageSlug, pageTitle, pageDescription, ogImage, keywords, canonicalUrl, noIndex
  }
`

export const getSearchResultsQuery = groq`
  *[_type in ["savoury", "shake", "teaCoffee", "limca", "golaGanda", "other"] && isAvailable == true && (title match $searchTerm || pt::text(description) match $searchTerm)] | order(title asc) [0...20] {
    _id,
    _type,
    title,
    slug,
    "image": images[0],
    tags,
    isAvailable,
    "priceDisplay": sizes[0].price
  }
`

export const getHomepageContentQuery = groq`{
  "featuredItems": *[_type in ["savoury", "shake", "teaCoffee", "limca", "golaGanda", "other"] && isAvailable == true] | order(_createdAt desc) [0...8] {
    ${menuItemFields}
  },
  "categories": *[_type == "category" && isTopLevel == true] | order(displayOrder asc) {
    _id,
    title,
    slug,
    showcaseImage,
    showcaseSubtitle,
    emoji
  }
}`

// ===== ORDER QUERIES =====

export const getOrdersQuery = groq`
  *[_type == "order"] | order(orderDate desc) {
    _id, orderNumber, orderDate, customerName, items,
    subtotal, discountType, discountValue, discountAmount,
    total, status, paymentMethod, orderSource, notes
  }
`

export const getOrdersByStatusQuery = groq`
  *[_type == "order" && status == $status] | order(orderDate desc) {
    _id, orderNumber, orderDate, customerName, items,
    subtotal, discountType, discountValue, discountAmount,
    total, status, paymentMethod, orderSource, notes
  }
`

export const getOrderByIdQuery = groq`
  *[_type == "order" && _id == $id][0] {
    _id, orderNumber, orderDate, customerName, items,
    subtotal, discountType, discountValue, discountAmount,
    total, status, paymentMethod, orderSource, notes
  }
`

export const getNextOrderNumberQuery = groq`
  {
    "nextNumber": coalesce(*[_type == "order"] | order(orderNumber desc) [0].orderNumber, 0) + 1
  }
`

export const getOrdersByDateRangeQuery = groq`
  *[_type == "order" && orderDate >= $startDate && orderDate <= $endDate] | order(orderDate desc) {
    _id, orderNumber, orderDate, customerName, items,
    subtotal, discountType, discountValue, discountAmount,
    total, status, paymentMethod, orderSource, notes
  }
`

export const getTodayOrderStatsQuery = groq`
  {
    "todayOrders": count(*[_type == "order" && orderDate >= $todayStart && orderDate <= $todayEnd]),
    "todayRevenue": math::sum(*[_type == "order" && orderDate >= $todayStart && orderDate <= $todayEnd && status in ["completed", "in-progress", "pending"]].total),
    "pendingOrders": count(*[_type == "order" && status == "pending"]),
    "lowStockCount": count(*[_type == "ingredient" && currentStock < minimumStock])
  }
`

// ===== SALES RECORD QUERIES =====

export const getSalesRecordByDateQuery = groq`
  *[_type == "salesRecord" && date == $date][0] {
    _id, date, totalOrders, completedOrders, cancelledOrders,
    totalRevenue, totalDiscount, netRevenue, paymentBreakdown,
    topItems, archivedOrdersData
  }
`

export const getSalesRecordsByDateRangeQuery = groq`
  *[_type == "salesRecord" && date >= $startDate && date <= $endDate] | order(date desc) {
    _id, date, totalOrders, completedOrders, cancelledOrders,
    totalRevenue, totalDiscount, netRevenue, paymentBreakdown, topItems
  }
`

export const getSalesRecordsByMonthQuery = groq`
  *[_type == "salesRecord" && date >= $monthStart && date <= $monthEnd] | order(date asc) {
    _id, date, totalOrders, completedOrders, cancelledOrders,
    totalRevenue, totalDiscount, netRevenue, paymentBreakdown, topItems
  }
`

// ===== INGREDIENT QUERIES =====

export const getAllIngredientsQuery = groq`
  *[_type == "ingredient"] | order(name asc) {
    _id, name, slug, unit, pricePerUnit, currentStock,
    minimumStock, supplier, ingredientCategory, notes
  }
`

export const getLowStockIngredientsQuery = groq`
  *[_type == "ingredient" && currentStock < minimumStock] | order(name asc) {
    _id, name, slug, unit, pricePerUnit, currentStock,
    minimumStock, supplier, ingredientCategory
  }
`

// ===== RECIPE QUERIES =====

export const getAllRecipesQuery = groq`
  *[_type == "recipe"] | order(menuItemTitle asc) {
    _id, menuItemTitle,
    menuItemRef->{_id, _type, title},
    ingredients[]{
      _key,
      ingredientRef->{_id, name, unit, pricePerUnit},
      quantityNeeded,
      unit
    }
  }
`

export const getRecipeByMenuItemQuery = groq`
  *[_type == "recipe" && menuItemRef._ref == $menuItemId][0] {
    _id, menuItemTitle,
    menuItemRef->{_id, _type, title},
    ingredients[]{
      _key,
      ingredientRef->{_id, name, unit, pricePerUnit},
      quantityNeeded,
      unit
    }
  }
`

// ===== MENU ITEMS FOR ORDER FORM =====

export const getAllMenuItemsForOrderQuery = groq`
  *[_type in ["savoury", "shake", "teaCoffee", "limca", "golaGanda", "other"] && isAvailable == true] | order(title asc) {
    _id, _type, title, sizes
  }
`
