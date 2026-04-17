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
