"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Filter, Search, Star } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import ProductCard from "@/components/product-card"
import { categoriesData, productsData, regionsData } from "@/data"
import type { Product, Category, Region } from "@/types"
import axios from 'axios'


export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [regions, setRegions] = useState<Region[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Simuler un délai réseau
        // await new Promise((resolve) => setTimeout(resolve, 800))
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || ""}/products`)
        const data = response.data
        setProducts(data.data)
        setCategories(categoriesData)
        setRegions(regionsData)

        console.log("Données chargées:", {
          products: data.data,
          categories: categoriesData,
          regions: regionsData,
        })
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  if (isLoading) {
    return (
      <div className="container py-20">
        <LoadingSpinner size={40} />
      </div>
    )
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Tous les produits</h1>
          <p className="text-muted-foreground">Découvrez notre sélection de produits agricoles frais et de qualité</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher des produits..." className="pl-9" />
          </div>
          <div className="flex gap-4">
            <Select defaultValue="newest">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Plus récents</SelectItem>
                <SelectItem value="price-low">Prix croissant</SelectItem>
                <SelectItem value="price-high">Prix décroissant</SelectItem>
                <SelectItem value="rating">Mieux notés</SelectItem>
              </SelectContent>
            </Select>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filtres</SheetTitle>
                  <SheetDescription>Affinez votre recherche de produits</SheetDescription>
                </SheetHeader>
                <div className="py-4">
                  <MobileFilters categories={categories} regions={regions} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Desktop Filters */}
          <div className="hidden md:block">
            <DesktopFilters categories={categories} regions={regions} />
          </div>

          {/* Product Grid */}
          <div className="md:col-span-3">
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Aucun produit trouvé</p>
              </div>
            )}

            {/* Pagination */}
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface FiltersProps {
  categories: Category[]
  regions: Region[]
}

function DesktopFilters({ categories, regions }: FiltersProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-4">Catégories</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.name} className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox id={`category-${category.name}`} />
                <label htmlFor={`category-${category.name}`} className="ml-2 text-sm">
                  {category.name}
                </label>
              </div>
              <span className="text-xs text-muted-foreground">{category.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="font-medium mb-4">Prix</h3>
        <div className="space-y-4">
          <Slider defaultValue={[0, 5000]} max={10000} step={100} />
          <div className="flex items-center justify-between">
            <div className="text-sm">0 FCFA</div>
            <div className="text-sm">10,000 FCFA</div>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="font-medium mb-4">Régions</h3>
        <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
          {regions.map((region) => (
            <div key={region.name} className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox id={`region-${region.name}`} />
                <label htmlFor={`region-${region.name}`} className="ml-2 text-sm">
                  {region.name}
                </label>
              </div>
              <span className="text-xs text-muted-foreground">{region.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="font-medium mb-4">Évaluation</h3>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center">
              <Checkbox id={`rating-${rating}`} />
              <label htmlFor={`rating-${rating}`} className="ml-2 flex items-center">
                {Array.from({ length: rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
                ))}
                {Array.from({ length: 5 - rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-muted-foreground" />
                ))}
                <span className="ml-1 text-sm">et plus</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <Button className="w-full">Appliquer les filtres</Button>
    </div>
  )
}

function MobileFilters({ categories, regions }: FiltersProps) {
  return (
    <div className="space-y-6">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="categories">
          <AccordionTrigger>Catégories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {categories.map((category) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Checkbox id={`mobile-category-${category.name}`} />
                    <label htmlFor={`mobile-category-${category.name}`} className="ml-2 text-sm">
                      {category.name}
                    </label>
                  </div>
                  <span className="text-xs text-muted-foreground">{category.count}</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Prix</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <Slider defaultValue={[0, 5000]} max={10000} step={100} />
              <div className="flex items-center justify-between">
                <div className="text-sm">0 FCFA</div>
                <div className="text-sm">10,000 FCFA</div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="regions">
          <AccordionTrigger>Régions</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2 max-h-[200px] overflow-y-auto pr-2">
              {regions.map((region) => (
                <div key={region.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Checkbox id={`mobile-region-${region.name}`} />
                    <label htmlFor={`mobile-region-${region.name}`} className="ml-2 text-sm">
                      {region.name}
                    </label>
                  </div>
                  <span className="text-xs text-muted-foreground">{region.count}</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="rating">
          <AccordionTrigger>Évaluation</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center">
                  <Checkbox id={`mobile-rating-${rating}`} />
                  <label htmlFor={`mobile-rating-${rating}`} className="ml-2 flex items-center">
                    {Array.from({ length: rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
                    ))}
                    {Array.from({ length: 5 - rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-muted-foreground" />
                    ))}
                    <span className="ml-1 text-sm">et plus</span>
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button className="w-full">Appliquer les filtres</Button>
    </div>
  )
}
