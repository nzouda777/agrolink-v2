"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Plus, Search, Edit, Trash2, Eye, Package, Filter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import axios from "axios"
import { toast } from "sonner"


interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  unit: string
  status: string
  images: string[]
  description: string
  createdAt: string
  updatedAt: string
  views: number
  orders: number
  revenue: number
}

// delete product
const deleteProduct = async (id: string) => {
  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  console.log(user.id)
  console.log(token)
  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/seller/${user.id}/products/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.status !== 200) {
      throw new Error("Erreur lors de la suppression du produit")
    }

    console.log(response.data)
    toast.success("Produit supprimé avec succès")
    window.location.reload()
    return response.data

  } catch (error) {
    console.error("Erreur lors de la suppression du produit:", error)
    return null
  }
}

async function fetchProducts(): Promise<Product[]> {
  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  console.log(user.id)
  console.log(token)
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/seller/${user.id}/products`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.status !== 200) {
      throw new Error("Erreur lors du chargement des produits")
    }

    console.log(response.data.products)
    return response.data.products
  } catch (error) {
    console.error("Erreur lors du chargement des produits:", error)
    return [
      {
        id: "1",
        name: "Tomates Bio",
        category: "Légumes",
        price: 2500,
        stock: 150,
        unit: "kg",
        status: "active",
        images: ["/placeholder.svg?height=200&width=200&text=Tomates"],
        description: "Tomates biologiques fraîches cultivées sans pesticides",
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-20T14:30:00Z",
        views: 245,
        orders: 18,
        revenue: 45000,
      },
      {
        id: "2",
        name: "Carottes",
        category: "Légumes",
        price: 1800,
        stock: 5,
        unit: "kg",
        status: "active",
        images: ["/placeholder.svg?height=200&width=200&text=Carottes"],
        description: "Carottes fraîches de notre ferme",
        createdAt: "2024-01-10T08:00:00Z",
        updatedAt: "2024-01-22T16:00:00Z",
        views: 189,
        orders: 12,
        revenue: 21600,
      },
      {
        id: "3",
        name: "Pommes de Terre",
        category: "Légumes",
        price: 1200,
        stock: 0,
        unit: "kg",
        status: "out_of_stock",
        images: ["/placeholder.svg?height=200&width=200&text=Pommes"],
        description: "Pommes de terre de qualité supérieure",
        createdAt: "2024-01-05T12:00:00Z",
        updatedAt: "2024-01-21T10:00:00Z",
        views: 156,
        orders: 8,
        revenue: 9600,
      },
      {
        id: "4",
        name: "Salade Verte",
        category: "Légumes",
        price: 800,
        stock: 25,
        unit: "pièce",
        status: "active",
        images: ["/placeholder.svg?height=200&width=200&text=Salade"],
        description: "Salade fraîche et croquante",
        createdAt: "2024-01-12T14:00:00Z",
        updatedAt: "2024-01-22T09:00:00Z",
        views: 98,
        orders: 6,
        revenue: 4800,
      },
      {
        id: "5",
        name: "Oignons",
        category: "Légumes",
        price: 1500,
        stock: 80,
        unit: "kg",
        status: "active",
        images: ["/placeholder.svg?height=200&width=200&text=Oignons"],
        description: "Oignons jaunes de qualité",
        createdAt: "2024-01-08T11:00:00Z",
        updatedAt: "2024-01-20T15:00:00Z",
        views: 134,
        orders: 10,
        revenue: 15000,
      },
    ]
  }
}

function ProductsContent({ products }: { products: Product[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    let filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (statusFilter !== "all") {
      filtered = filtered.filter((product) => product.status === statusFilter)
    }

    setFilteredProducts(filtered)
  }, [searchTerm, statusFilter, products])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
            Actif
          </Badge>
        )
      case "out_of_stock":
        return <Badge variant="destructive">Rupture de stock</Badge>
      case "draft":
        return <Badge variant="secondary">Brouillon</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return <span className="text-red-600 font-medium">Rupture</span>
    } else if (stock < 10) {
      return <span className="text-orange-600 font-medium">Stock faible ({stock})</span>
    }
    return <span className="text-green-600 font-medium">{stock}</span>
  }

  const totalProducts = products.length
  const activeProducts = products.filter((p) => p.status === "active").length
  const outOfStockProducts = products.filter((p) => p.status === "out_of_stock").length
  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock < 10).length

  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center justify-between w-full">
          <h1 className="text-lg font-semibold">Mes Produits</h1>
          <Button asChild>
            <Link href="/seller/products/add">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un produit
            </Link>
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Produits</p>
                  <p className="text-2xl font-bold">{totalProducts}</p>
                </div>
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Produits Actifs</p>
                  <p className="text-2xl font-bold text-green-600">{activeProducts}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-green-600"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rupture Stock</p>
                  <p className="text-2xl font-bold text-red-600">{outOfStockProducts}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-red-600"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Stock Faible</p>
                  <p className="text-2xl font-bold text-orange-600">{lowStockProducts}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-orange-600"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="active">Actif</option>
                  <option value="out_of_stock">Rupture de stock</option>
                  <option value="draft">Brouillon</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative">
                <Image
                  src={process.env.NEXT_PUBLIC_URL +"storage/"+ product.images?.[0]?.image_url || "/placeholder.svg?height=200&width=200"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">{getStatusBadge(product.status)}</div>
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                    <CardDescription>{product.category.name}</CardDescription>
                  </div>
                  <div className="text-right ml-2">
                    <p className="text-lg font-bold">{formatCurrency(product.price)}</p>
                    {/* <p className="text-sm text-muted-foreground">{product.quantity} {product.unit}</p> */}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stock Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Stock:</span>
                  <div className="flex items-center gap-2">
                    {getStockStatus(product.quantity)}
                    <span className="text-sm text-muted-foreground">{product.unit}</span>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-3 gap-4 text-center py-2 border-t border-b">
                  <div>
                    <p className="text-sm font-medium">{product.views}</p>
                    <p className="text-xs text-muted-foreground">Vues</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{product.orders}</p>
                    <p className="text-xs text-muted-foreground">Commandes</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {/* {formatCurrency(product.revenue)} */}
                      400k FCFA
                      </p>
                    <p className="text-xs text-muted-foreground">Revenus</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                    <Link href={`/seller/products/${product.id}/edit`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/products/${product.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                    onClick={() => deleteProduct(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucun produit trouvé</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Aucun produit ne correspond à vos critères de recherche."
                  : "Vous n'avez pas encore de produits."}
              </p>
              <Button asChild>
                <Link href="/seller/products/add">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter votre premier produit
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default function SellerProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
        </header>
        <div className="flex-1 p-6">
          <div className="animate-pulse space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <ProductsContent products={products} />
}
