"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Product } from "@/types"
import { productsData } from "@/data"

type SearchContextType = {
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchResults: Product[]
  isSearching: boolean
  performSearch: (query: string) => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const performSearch = (query: string) => {
    setSearchQuery(query)
    setIsSearching(true)

    if (!query.trim()) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    // Recherche simple dans les produits
    const lowerCaseQuery = query.toLowerCase()
    const results = productsData.filter(
      (product) =>
        product.name.toLowerCase().includes(lowerCaseQuery) ||
        product.description.toLowerCase().includes(lowerCaseQuery) ||
        product.category.toLowerCase().includes(lowerCaseQuery),
    )

    setSearchResults(results)
    setIsSearching(false)
  }

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        searchResults,
        isSearching,
        performSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error("useSearch doit être utilisé à l'intérieur d'un SearchProvider")
  }
  return context
}
