"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, TrendingUp, ShieldCheck, Truck, ChevronRight } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import ProductCard from "@/components/product-card"
import { categoriesData, productsData, regionsData } from "@/data"
import type { Product, Category, Region } from "@/types"

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [regions, setRegions] = useState<Region[]>([])
  const [isLoading, setIsLoading] = useState({
    products: true,
    categories: true,
    regions: true,
  })

  useEffect(() => {
    // Simuler un délai de chargement pour montrer les états de chargement
    const loadData = async () => {
      try {
        // Simuler un délai réseau
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Charger les données directement depuis les fichiers importés
        setCategories(categoriesData)
        setFeaturedProducts(productsData.slice(0, 4)) // Prendre les 4 premiers produits comme produits en vedette
        setRegions(regionsData)

        console.log("Données chargées:", {
          categories: categoriesData,
          featuredProducts: productsData.slice(0, 4),
          regions: regionsData,
        })
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error)
      } finally {
        setIsLoading({
          products: false,
          categories: false,
          regions: false,
        })
      }
    }

    loadData()
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 py-16 md:py-24">
        <div className="container grid gap-8 md:grid-cols-2 items-center">
          <div className="space-y-6">
            <Badge className="px-3 py-1 text-sm bg-primary/10 text-primary border-primary/20 mb-4">
              Marketplace Agricole
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Des produits frais <br />
              <span className="text-primary">directement des champs</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Connectez-vous directement avec les agriculteurs locaux pour des produits frais, de qualité et à des prix
              équitables.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/products">Explorer les produits</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/become-seller">Devenir vendeur</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="Produits agricoles frais"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Catégories populaires</h2>
              <p className="text-muted-foreground">Découvrez nos produits par catégorie</p>
            </div>
            <Button variant="ghost" className="mt-4 md:mt-0" asChild>
              <Link href="/products" className="flex items-center">
                Voir toutes les catégories
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          {isLoading.categories ? (
            <LoadingSpinner className="py-20" />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Array.isArray(categories) && categories.length > 0 ? (
                categories.map((category) => (
                  <Link key={category.name} href={`/products/category/${category.slug}`} className="group">
                    <div className={`${category.color} rounded-lg p-4 h-full transition-all group-hover:shadow-md`}>
                      <div className="aspect-square relative mb-4 rounded-md overflow-hidden">
                        <Image
                          src={category.image || "/placeholder.svg"}
                          alt={category.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <h3 className="font-medium text-center">{category.name}</h3>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="col-span-full text-center py-8 text-muted-foreground">Aucune catégorie disponible</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Produits en vedette</h2>
              <p className="text-muted-foreground">Sélection de produits frais et de qualité</p>
            </div>
            <Button variant="ghost" className="mt-4 md:mt-0" asChild>
              <Link href="/products" className="flex items-center">
                Voir tous les produits
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          {isLoading.products ? (
            <LoadingSpinner className="py-20" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.isArray(featuredProducts) && featuredProducts.length > 0 ? (
                featuredProducts.map((product) => <ProductCard key={product.id} product={product} />)
              ) : (
                <p className="col-span-full text-center py-8 text-muted-foreground">
                  Aucun produit en vedette disponible
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Pourquoi choisir AgroLink?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Notre plateforme offre de nombreux avantages tant pour les agriculteurs que pour les acheteurs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-background">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Produits frais</h3>
                <p className="text-muted-foreground">Des produits frais directement des champs, sans intermédiaires.</p>
              </CardContent>
            </Card>
            <Card className="bg-background">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Prix équitables</h3>
                <p className="text-muted-foreground">Des prix justes pour les agriculteurs et les consommateurs.</p>
              </CardContent>
            </Card>
            <Card className="bg-background">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Qualité garantie</h3>
                <p className="text-muted-foreground">Tous nos produits sont vérifiés pour garantir leur qualité.</p>
              </CardContent>
            </Card>
            <Card className="bg-background">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Livraison rapide</h3>
                <p className="text-muted-foreground">Livraison rapide et sécurisée dans toutes les régions.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Regions Section */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Disponible dans tout le pays</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              AgroLink connecte les agriculteurs et les acheteurs dans toutes les régions du Cameroun
            </p>
          </div>
          {isLoading.regions ? (
            <LoadingSpinner className="py-10" />
          ) : (
            <div className="flex flex-wrap justify-center gap-3">
              {Array.isArray(regions) && regions.length > 0 ? (
                regions.map((region) => (
                  <Badge key={region.name} variant="outline" className="text-sm py-1 px-3">
                    {region.name}
                  </Badge>
                ))
              ) : (
                <p className="text-center py-4 text-muted-foreground">Aucune région disponible</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">Rejoignez notre communauté</h2>
              <p className="text-primary-foreground/80 max-w-md">
                Que vous soyez agriculteur ou acheteur, AgroLink vous offre une plateforme simple et efficace pour
                vendre ou acheter des produits agricoles.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/auth">Créer un compte</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10"
                  asChild
                >
                  <Link href="/about">En savoir plus</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-[300px] rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=300&width=500"
                alt="Communauté AgroLink"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
