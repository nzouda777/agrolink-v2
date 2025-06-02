"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Tag, Search, MoreHorizontal, Eye, Edit, CheckCircle, XCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface User {
  id: string
  name: string
  email: string
  type: string
  status: string
  registeredAt: string
  lastLogin: string
  totalOrders?: number
  totalSpent?: number
  totalProducts?: number
  totalSales?: number
  verified: boolean
  location: string
  subscription?: string
  suspensionReason?: string
}

interface PendingProduct {
  id: string
  name: string
  seller: string
  sellerId: string
  category: string
  price: number
  submittedAt: string
  status: string
  images: number
  description: string
}

export default function AdminManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [pendingProducts, setPendingProducts] = useState<PendingProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [userFilter, setUserFilter] = useState("all")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/admin/users")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setUsers(data.users)
        setPendingProducts(data.pendingProducts)
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = userFilter === "all" || user.type === userFilter || user.status === userFilter
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "suspended":
        return "destructive"
      case "pending":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "seller":
        return "default"
      case "buyer":
        return "secondary"
      default:
        return "outline"
    }
  }

  if (loading) {
    return <div>Chargement...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestion Utilisateurs & Contenu</h1>
        <p className="text-muted-foreground">Gérer les utilisateurs, produits, catégories et régions</p>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="products">Modération Produits</TabsTrigger>
          <TabsTrigger value="categories">Catégories</TabsTrigger>
          <TabsTrigger value="regions">Régions</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Utilisateurs</CardTitle>
              <CardDescription>Gérer tous les utilisateurs de la plateforme</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un utilisateur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={userFilter} onValueChange={setUserFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrer par..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="seller">Vendeurs</SelectItem>
                    <SelectItem value="buyer">Acheteurs</SelectItem>
                    <SelectItem value="active">Actifs</SelectItem>
                    <SelectItem value="suspended">Suspendus</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{user.name}</h4>
                          <Badge variant={getTypeColor(user.type)}>
                            {user.type === "seller" ? "Vendeur" : "Acheteur"}
                          </Badge>
                          <Badge variant={getStatusColor(user.status)}>
                            {user.status === "active"
                              ? "Actif"
                              : user.status === "suspended"
                                ? "Suspendu"
                                : "En attente"}
                          </Badge>
                          {user.verified && <CheckCircle className="h-4 w-4 text-green-600" />}
                        </div>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.location} • Inscrit le {new Date(user.registeredAt).toLocaleDateString()}
                        </p>
                        {user.suspensionReason && (
                          <p className="text-xs text-red-600">Raison: {user.suspensionReason}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right text-sm">
                        {user.type === "seller" ? (
                          <>
                            <p>{user.totalProducts} produits</p>
                            <p className="text-muted-foreground">{user.totalSales?.toLocaleString()}FCFA ventes</p>
                          </>
                        ) : (
                          <>
                            <p>{user.totalOrders} commandes</p>
                            <p className="text-muted-foreground">{user.totalSpent?.toLocaleString()}FCFA dépensés</p>
                          </>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Voir le profil
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          {user.status === "active" ? (
                            <DropdownMenuItem className="text-red-600">
                              <XCircle className="h-4 w-4 mr-2" />
                              Suspendre
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem className="text-green-600">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Réactiver
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Modération des Produits</CardTitle>
              <CardDescription>Produits en attente d'approbation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{product.name}</h4>
                        <Badge variant="secondary">{product.category}</Badge>
                        <Badge variant="outline">{product.price}FCFA</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Par {product.seller} • {product.images} images
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Soumis le {new Date(product.submittedAt).toLocaleString()}
                      </p>
                      <p className="text-sm">{product.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        Examiner
                      </Button>
                      <Button size="sm" variant="destructive">
                        <XCircle className="h-4 w-4 mr-2" />
                        Rejeter
                      </Button>
                      <Button size="sm">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approuver
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Catégories</CardTitle>
              <CardDescription>Gérer les catégories de produits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Rechercher une catégorie..." className="pl-10 w-64" />
                </div>
                <Button>
                  <Tag className="h-4 w-4 mr-2" />
                  Ajouter une catégorie
                </Button>
              </div>
              <div className="text-center py-8 text-muted-foreground">
                Interface de gestion des catégories à implémenter
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Régions</CardTitle>
              <CardDescription>Gérer les régions et villes disponibles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Rechercher une région..." className="pl-10 w-64" />
                </div>
                <Button>
                  <MapPin className="h-4 w-4 mr-2" />
                  Ajouter une région
                </Button>
              </div>
              <div className="text-center py-8 text-muted-foreground">
                Interface de gestion des régions à implémenter
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
