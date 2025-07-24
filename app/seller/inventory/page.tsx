"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Search, Package, AlertTriangle, TrendingDown, Edit, Plus, Minus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface InventoryItem {
  id: string
  name: string
  category: string
  currentStock: number
  minStock: number
  maxStock: number
  unit: string
  price: number
  lastUpdated: string
  status: "in_stock" | "low_stock" | "out_of_stock"
  image: string
  recentMovements: Array<{
    type: "in" | "out"
    quantity: number
    date: string
    reason: string
  }>
}

async function fetchInventory(): Promise<InventoryItem[]> {
  try {
    const response = await fetch("/api/seller/inventory", {
      next: { revalidate: 0 },
    })

    if (!response.ok) {
      throw new Error("Erreur lors du chargement de l'inventaire")
    }

    return await response.json()
  } catch (error) {
    console.error("Erreur lors du chargement de l'inventaire:", error)
    return [
      {
        id: "1",
        name: "Tomates Bio",
        category: "Légumes",
        currentStock: 150,
        minStock: 20,
        maxStock: 200,
        unit: "kg",
        price: 2500,
        lastUpdated: "2024-01-22T14:30:00Z",
        status: "in_stock",
        image: "/placeholder.svg?height=100&width=100&text=Tomates",
        recentMovements: [
          { type: "out", quantity: 25, date: "2024-01-22T10:00:00Z", reason: "Vente" },
          { type: "in", quantity: 50, date: "2024-01-21T16:00:00Z", reason: "Récolte" },
        ],
      },
      {
        id: "2",
        name: "Carottes",
        category: "Légumes",
        currentStock: 8,
        minStock: 15,
        maxStock: 100,
        unit: "kg",
        price: 1800,
        lastUpdated: "2024-01-22T12:00:00Z",
        status: "low_stock",
        image: "/placeholder.svg?height=100&width=100&text=Carottes",
        recentMovements: [
          { type: "out", quantity: 12, date: "2024-01-22T09:00:00Z", reason: "Vente" },
          { type: "out", quantity: 8, date: "2024-01-21T14:00:00Z", reason: "Vente" },
        ],
      },
      {
        id: "3",
        name: "Pommes de Terre",
        category: "Légumes",
        currentStock: 0,
        minStock: 25,
        maxStock: 150,
        unit: "kg",
        price: 1200,
        lastUpdated: "2024-01-21T18:00:00Z",
        status: "out_of_stock",
        image: "/placeholder.svg?height=100&width=100&text=Pommes",
        recentMovements: [
          { type: "out", quantity: 15, date: "2024-01-21T16:00:00Z", reason: "Vente" },
          { type: "out", quantity: 10, date: "2024-01-21T11:00:00Z", reason: "Vente" },
        ],
      },
      {
        id: "4",
        name: "Salade Verte",
        category: "Légumes",
        currentStock: 25,
        minStock: 10,
        maxStock: 50,
        unit: "pièce",
        price: 800,
        lastUpdated: "2024-01-22T08:00:00Z",
        status: "in_stock",
        image: "/placeholder.svg?height=100&width=100&text=Salade",
        recentMovements: [
          { type: "in", quantity: 30, date: "2024-01-22T07:00:00Z", reason: "Récolte" },
          { type: "out", quantity: 5, date: "2024-01-21T15:00:00Z", reason: "Vente" },
        ],
      },
    ]
  }
}

function InventoryContent({ inventory }: { inventory: InventoryItem[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredInventory, setFilteredInventory] = useState(inventory)
  const [editingStock, setEditingStock] = useState<string | null>(null)
  const [newStockValue, setNewStockValue] = useState("")

  useEffect(() => {
    const filtered = inventory.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredInventory(filtered)
  }, [searchTerm, inventory])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_stock":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
            En Stock
          </Badge>
        )
      case "low_stock":
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
            Stock Faible
          </Badge>
        )
      case "out_of_stock":
        return <Badge variant="destructive">Rupture</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStockLevel = (current: number, min: number, max: number) => {
    const percentage = (current / max) * 100
    if (current === 0) return { color: "bg-red-500", width: "0%" }
    if (current <= min) return { color: "bg-orange-500", width: `${Math.max(percentage, 5)}%` }
    return { color: "bg-green-500", width: `${percentage}%` }
  }

  const handleStockEdit = (itemId: string, currentStock: number) => {
    setEditingStock(itemId)
    setNewStockValue(currentStock.toString())
  }

  const handleStockSave = async (itemId: string) => {
    // Simulation d'une mise à jour
    console.log(`Mise à jour du stock pour ${itemId}: ${newStockValue}`)
    setEditingStock(null)
    setNewStockValue("")
  }

  const handleStockCancel = () => {
    setEditingStock(null)
    setNewStockValue("")
  }

  const totalItems = inventory.length
  const inStockItems = inventory.filter((item) => item.status === "in_stock").length
  const lowStockItems = inventory.filter((item) => item.status === "low_stock").length
  const outOfStockItems = inventory.filter((item) => item.status === "out_of_stock").length

  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Gestion de l'Inventaire</h1>
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
                  <p className="text-2xl font-bold">{totalItems}</p>
                </div>
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">En Stock</p>
                  <p className="text-2xl font-bold text-green-600">{inStockItems}</p>
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
                  <p className="text-sm text-muted-foreground">Stock Faible</p>
                  <p className="text-2xl font-bold text-orange-600">{lowStockItems}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rupture</p>
                  <p className="text-2xl font-bold text-red-600">{outOfStockItems}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Inventory List */}
        <div className="space-y-4">
          {filteredInventory.map((item) => {
            const stockLevel = getStockLevel(item.currentStock, item.minStock, item.maxStock)

            return (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    {/* Product Image */}
                    <div className="w-16 h-16 relative rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.category}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(item.status)}
                          <span className="text-sm font-medium">
                            {formatCurrency(item.price)}/{item.unit}
                          </span>
                        </div>
                      </div>

                      {/* Stock Level Bar */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Stock actuel</span>
                          <span className="font-medium">
                            {item.currentStock} / {item.maxStock} {item.unit}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${stockLevel.color}`}
                            style={{ width: stockLevel.width }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>Min: {item.minStock}</span>
                          <span>Max: {item.maxStock}</span>
                        </div>
                      </div>

                      {/* Stock Management */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {editingStock === item.id ? (
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                value={newStockValue}
                                onChange={(e) => setNewStockValue(e.target.value)}
                                className="w-24 h-8"
                                min="0"
                              />
                              <Button size="sm" onClick={() => handleStockSave(item.id)}>
                                <Plus className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={handleStockCancel}>
                                <Minus className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStockEdit(item.id, item.currentStock)}
                            >
                              <Edit className="h-3 w-3 mr-2" />
                              Modifier Stock
                            </Button>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            Dernière mise à jour: {formatDate(item.lastUpdated)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Movements */}
                  {item.recentMovements.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="text-sm font-medium mb-2">Mouvements récents</h4>
                      <div className="space-y-1">
                        {item.recentMovements.slice(0, 2).map((movement, index) => (
                          <div key={index} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  movement.type === "in" ? "bg-green-500" : "bg-red-500"
                                }`}
                              ></span>
                              <span>
                                {movement.type === "in" ? "+" : "-"}
                                {movement.quantity} {item.unit}
                              </span>
                              <span className="text-muted-foreground">({movement.reason})</span>
                            </div>
                            <span className="text-muted-foreground">{formatDate(movement.date)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredInventory.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucun produit trouvé</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? "Aucun produit ne correspond à votre recherche." : "Votre inventaire est vide."}
              </p>
              <Button asChild>
                <Link href="/seller/products/add">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un produit
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default function SellerInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInventory()
      .then(setInventory)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
        </header>
        <div className="flex-1 p-6">
          <div className="animate-pulse space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <InventoryContent inventory={inventory} />
}
