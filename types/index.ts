export interface Product {
  id: number
  name: string
  description: string
  price: number
  oldPrice?: number
  unit: string
  quantity: number
  category: string
  rating: number
  reviewCount: number
  seller: Seller
  images: string[]
  details: Record<string, string>
  region: string
}

export interface Seller {
  id: number
  name: string
  image: string
  rating: number
  location: string
  memberSince: string
  responseRate: string
}

export interface Category {
  name: string
  image: string
  slug: string
  color: string
  count: number
}

export interface Region {
  name: string
  count: number
}

export interface Review {
  id: number
  productId: number
  user: {
    name: string
    image: string
  }
  rating: number
  date: string
  comment: string
}
