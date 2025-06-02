"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"
import ProductCard from "@/components/product-card"
import { useSearch } from "@/contexts/search-context"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import Link from "next/link"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const { searchResults, performSearch, isSearching } = useSearch()
  const [searchQuery, setSearchQuery] = useState(query)
  const [isMounted, setIsMounted] = useState(false)

  // Éviter les erreurs d'hydratation
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (query) {
      performSearch(query)
    }
  }, [query, performSearch])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(searchQuery)
    // Mettre à jour l'URL sans rechargement de page
    const url = new URL(window.location.href)
    url.searchParams.set("q", searchQuery)
    window.history.pushState({}, "", url.toString())
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Résultats de recherche</h1>
          <p className="text-muted-foreground">
            {query ? `Résultats pour "${query}"` : "Recherchez parmi nos produits"}
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher des produits..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit">Rechercher</Button>
        </form>

        {isSearching ? (
          <div className="py-12">
            <LoadingSpinner size={40} />
          </div>
        ) : searchResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {searchResults.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : query ? (
          <div className="flex flex-col items-center justify-center py-16">
            <SearchIcon className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium mb-2">Aucun résultat trouvé</h2>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Nous n'avons trouvé aucun produit correspondant à votre recherche. Essayez avec d'autres mots-clés ou
              parcourez nos catégories.
            </p>
            <Button asChild>
              <Link href="/products">Voir tous les produits</Link>
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
