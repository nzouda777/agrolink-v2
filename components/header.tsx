"use client"

import React from "react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { Search, ShoppingCart, Menu, X, User, Heart, ChevronRight } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "./mode-toggle"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { useSearch } from "@/contexts/search-context"
import { categoriesData } from "@/data"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

export default function Header() {
  const router = useRouter()
  const { totalItems, setIsCartOpen } = useCart()
  const { searchQuery, setSearchQuery, searchResults, performSearch } = useSearch()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Éviter les erreurs d'hydratation
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setShowSearchResults(false)
    }
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    performSearch(query)
    setShowSearchResults(!!query)
  }

  const handleSearchInputFocus = () => {
    if (searchQuery) {
      setShowSearchResults(true)
    }
  }

  // Fermer les résultats de recherche lors d'un clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest("[data-search-container]")) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-2 md:gap-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[80%] sm:w-[350px]">
              <div className="px-2 py-6">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-6">
                  <span className="text-primary">Agro</span>Link
                </Link>
                <div className="flex flex-col gap-4">
                  <Link href="/" className="text-sm font-medium">
                    Accueil
                  </Link>
                  <Link href="/products" className="text-sm font-medium">
                    Produits
                  </Link>
                  <div className="py-2">
                    <p className="text-sm font-medium mb-2">Catégories</p>
                    <div className="flex flex-col gap-2 pl-2">
                      {categoriesData.map((category) => (
                        <Link
                          key={category.name}
                          href={`/products/category/${category.slug}`}
                          className="text-sm text-muted-foreground hover:text-foreground"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <Link href="/about" className="text-sm font-medium">
                    À propos
                  </Link>
                  <Link href="/contact" className="text-sm font-medium">
                    Contact
                  </Link>
                  <Link href="/favorites" className="text-sm font-medium">
                    Mes favoris
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-1 font-bold text-xl">
            <span className="text-primary">Agro</span>Link
          </Link>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Accueil</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Catégories</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {categoriesData.map((category) => (
                      <ListItem key={category.name} title={category.name} href={`/products/category/${category.slug}`}>
                        Découvrez nos {category.name.toLowerCase()} frais et de qualité
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/products" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Produits</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/about" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>À propos</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {isSearchOpen ? (
            <div className="relative flex items-center" data-search-container>
              <form onSubmit={handleSearch} className="flex-1">
                <Input
                  type="search"
                  placeholder="Rechercher des produits..."
                  className="w-[160px] sm:w-[200px] md:w-[300px]"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onFocus={handleSearchInputFocus}
                />
              </form>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0"
                onClick={() => {
                  setIsSearchOpen(false)
                  setShowSearchResults(false)
                }}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close search</span>
              </Button>

              {/* Résultats de recherche */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-md z-50">
                  <ScrollArea className="max-h-[300px]">
                    <div className="p-2">
                      {searchResults.slice(0, 5).map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.id}`}
                          onClick={() => {
                            setShowSearchResults(false)
                            setIsSearchOpen(false)
                          }}
                          className="flex items-center gap-3 p-2 hover:bg-muted rounded-md"
                        >
                          <div className="relative h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={product.images[0] || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{product.name}</div>
                            <div className="text-sm text-muted-foreground">{product.price.toLocaleString()} FCFA</div>
                          </div>
                        </Link>
                      ))}

                      {searchResults.length > 5 && (
                        <Link
                          href={`/search?q=${encodeURIComponent(searchQuery)}`}
                          onClick={() => {
                            setShowSearchResults(false)
                            setIsSearchOpen(false)
                          }}
                          className="flex items-center justify-center p-2 mt-1 text-sm text-primary hover:underline"
                        >
                          Voir tous les résultats ({searchResults.length})
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          )}

          <div className="hidden sm:flex gap-1">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/favorites">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Favorites</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(true)} className="relative">
              <ShoppingCart className="h-5 w-5" />
              {isMounted && totalItems > 0 && (
                <Badge
                  variant="secondary"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {totalItems}
                </Badge>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </div>

          <ModeToggle />

          <div className="hidden md:flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <User className="mr-2 h-4 w-4" />
                  Compte
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>IN</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-medium">Invité</p>
                    <p className="text-xs text-muted-foreground">Non connecté</p>
                  </div>
                </div>
                <DropdownMenuItem asChild>
                  <Link href="/auth">Se connecter</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/auth?tab=register">S'inscrire</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Button variant="ghost" size="icon" className="md:hidden" asChild>
            <Link href="/auth">
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Link>
          </Button>

          <Button variant="ghost" size="icon" className="sm:hidden relative" onClick={() => setIsCartOpen(true)}>
            <ShoppingCart className="h-5 w-5" />
            {isMounted && totalItems > 0 && (
              <Badge
                variant="secondary"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {totalItems}
              </Badge>
            )}
            <span className="sr-only">Cart</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = "ListItem"
