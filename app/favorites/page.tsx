"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useFavorites } from "@/contexts/favorites-context"
import ProductCard from "@/components/product-card"
import { Heart } from "lucide-react"

export default function FavoritesPage() {
  const { favorites } = useFavorites()
  const [isMounted, setIsMounted] = useState(false)

  // Éviter les erreurs d'hydratation
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Mes favoris</h1>
          <p className="text-muted-foreground">Retrouvez ici tous les produits que vous avez ajoutés à vos favoris</p>
        </div>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Heart className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium mb-2">Aucun favori pour le moment</h2>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Vous n'avez pas encore ajouté de produits à vos favoris. Parcourez notre catalogue et cliquez sur le cœur
              pour ajouter des produits à vos favoris.
            </p>
            <Button asChild>
              <Link href="/products">Découvrir les produits</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
