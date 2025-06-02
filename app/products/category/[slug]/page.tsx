"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import ProductCard from "@/components/product-card"
import { categoriesData, productsData } from "@/data"
import { ChevronLeft } from "lucide-react"
import type { Product, Category } from "@/types"

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const [products, setProducts] = useState<Product[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Simuler un délai réseau
        await new Promise((resolve) => setTimeout(resolve, 800))

        const foundCategory = categoriesData.find((cat) => cat.slug === params.slug)
        setCategory(foundCategory || null)

        if (foundCategory) {
          const filteredProducts = productsData.filter(
            (product) => product.category.toLowerCase() === foundCategory.name.toLowerCase(),
          )
          setProducts(filteredProducts)
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [params.slug])

  if (isLoading) {
    return (
      <div className="container py-20">
        <LoadingSpinner size={40} />
      </div>
    )
  }

  if (!category) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Catégorie non trouvée</h2>
          <p className="text-muted-foreground mb-6">La catégorie que vous recherchez n'existe pas.</p>
          <Button asChild>
            <Link href="/products">Voir toutes les catégories</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col gap-6">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="sm" asChild className="mr-4">
            <Link href="/products">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Retour aux produits
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
          <p className="text-muted-foreground">
            Découvrez notre sélection de {category.name.toLowerCase()} frais et de qualité
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun produit trouvé dans cette catégorie</p>
          </div>
        )}
      </div>
    </div>
  )
}
