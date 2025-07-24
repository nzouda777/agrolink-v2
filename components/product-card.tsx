"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Heart } from "lucide-react"
import type { Product } from "@/types"
import { useFavorites } from "@/contexts/favorites-context"
import { useCart } from "@/contexts/cart-context"
import { useState, useEffect } from "react"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const { addItem } = useCart()
  const [isMounted, setIsMounted] = useState(false)

  // Éviter les erreurs d'hydratation
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(product)
  }

  return (
    <Card className="overflow-hidden group">
      <div className="aspect-square relative">
        <Link href={`/products/${product.id}`}>
          <Image
            src={process.env.NEXT_PUBLIC_URL +"storage/"+ product.images?.[0]?.image_url || "/placeholder.svg?height=200&width=200"}
                  
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </Link>
        <Badge className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm text-black hover:text-white">{product.category.name}</Badge>
        {isMounted && (
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 left-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm ${
              isFavorite(product.id) ? "text-red-500" : "text-muted-foreground"
            }`}
            onClick={handleToggleFavorite}
          >
            <Heart className={`h-4 w-4 ${isFavorite(product.id) ? "fill-current" : ""}`} />
            <span className="sr-only">Ajouter aux favoris</span>
          </Button>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link href={`/products/${product.id}`} className="font-medium line-clamp-1 hover:underline">
            {product.name}
          </Link>
          <div className="flex items-center text-amber-500">
            <Star className="fill-current h-4 w-4 mr-1" />
            <span className="text-sm">{product.rating}</span>
          </div>
        </div>
        <div className="flex justify-between items-center text-sm text-muted-foreground mb-3">
          <span>{product.seller.name}</span>
          <span>{product.region}</span>
        </div>
        <div className="flex justify-between items-center">
          <p className="font-bold">
            {product.price.toLocaleString()} FCFA/{product.unit}
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" asChild>
              <Link href={`/products/${product.id}`}>Détails</Link>
            </Button>
            <Button size="sm" variant="default" onClick={handleAddToCart}>
              Acheter
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
