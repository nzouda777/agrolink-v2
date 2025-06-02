"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Product } from "@/types"

type FavoritesContextType = {
  favorites: Product[]
  addFavorite: (product: Product) => void
  removeFavorite: (productId: number) => void
  isFavorite: (productId: number) => boolean
  toggleFavorite: (product: Product) => void
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Product[]>([])

  // Charger les favoris depuis le localStorage au démarrage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("agrolink-favorites")
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites))
      } catch (error) {
        console.error("Erreur lors du chargement des favoris:", error)
      }
    }
  }, [])

  // Sauvegarder les favoris dans le localStorage à chaque modification
  useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem("agrolink-favorites", JSON.stringify(favorites))
    } else {
      localStorage.removeItem("agrolink-favorites")
    }
  }, [favorites])

  const addFavorite = (product: Product) => {
    setFavorites((prevFavorites) => {
      // Vérifier si le produit est déjà dans les favoris
      if (prevFavorites.some((fav) => fav.id === product.id)) {
        return prevFavorites
      }
      return [...prevFavorites, product]
    })
  }

  const removeFavorite = (productId: number) => {
    setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.id !== productId))
  }

  const isFavorite = (productId: number) => {
    return favorites.some((fav) => fav.id === productId)
  }

  const toggleFavorite = (product: Product) => {
    if (isFavorite(product.id)) {
      removeFavorite(product.id)
    } else {
      addFavorite(product)
    }
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error("useFavorites doit être utilisé à l'intérieur d'un FavoritesProvider")
  }
  return context
}
