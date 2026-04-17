export interface SanityImage {
  _type: string
  asset: { _ref: string; _type: string }
}

export interface BaseMenuItem {
  _id: string
  _type: string
  title: string
  slug: { current: string }
  images: SanityImage[]
  category: { title: string; slug: { current: string } }
  description: any[]
  sizes: { sizeName: string; price: string }[]
  tags?: string[]
  isAvailable: boolean
  calories?: number
  priceDisplay?: string
}

export interface Savoury extends BaseMenuItem {
  _type: 'savoury'
  itemType: string
  spiceLevel?: string
  isVegan: boolean
}

export interface Shake extends BaseMenuItem {
  _type: 'shake'
  flavorProfile: string
  toppings?: string[]
  isVegan: boolean
}

export interface TeaCoffee extends BaseMenuItem {
  _type: 'teaCoffee'
  drinkType: string
  milkOption?: string
  isHot: boolean
}

export interface Limca extends BaseMenuItem {
  _type: 'limca'
  fizzType: string
  isCarbonated: boolean
}

export interface GolaGanda extends BaseMenuItem {
  _type: 'golaGanda'
  flavor?: string
}

export interface Other extends BaseMenuItem {
  _type: 'other'
  itemType: string
  protein?: string
  spiceLevel?: string
  isVegan: boolean
}

export type MenuItem = Savoury | Shake | TeaCoffee | Limca | GolaGanda | Other

export interface Category {
  _id: string
  title: string
  slug: { current: string }
  description?: string
  parentCategory?: Category
  isTopLevel: boolean
  showcaseImage?: SanityImage
  showcaseSubtitle?: string
  emoji?: string
  featuredItems?: MenuItem[]
  displayOrder?: number
}

export interface SearchResult {
  _id: string
  _type: string
  title: string
  slug: { current: string }
  image?: SanityImage
  tags?: string[]
  isAvailable: boolean
  priceDisplay?: string
}

export interface HomepageContent {
  featuredItems: MenuItem[]
  categories: Category[]
}
