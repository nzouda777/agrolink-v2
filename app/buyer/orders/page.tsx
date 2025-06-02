"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import {
  Package,
  Search,
  Filter,
  ArrowUpDown,
  ChevronDown,
  ArrowLeft,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

// Types pour les commandes
interface OrderItem {
  id: number
  name: string
  quantity: number
  price: number
  image: string
}

interface Order {
  id: string
  date: string
  status: "Livré" | "En cours" | "En attente" | "Annulé"
  total: number
  items: OrderItem[]
  seller: {
    name: string
    avatar?: string
  }
  paymentMethod: string
  shippingAddress: {
    street: string
    city: string
    region: string
    country: string
  }
  trackingNumber?: string
  estimatedDelivery?: string
}

// Données fictives pour les commandes
const ordersData: Order[] = [
  {
    id: "ORD-001",
    date: "2023-05-01",
    status: "Livré",
    total: 125.5,
    items: [
      {
        id: 1,
        name: "Tomates Bio",
        quantity: 2,
        price: 25.75,
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: 2,
        name: "Pommes de terre",
        quantity: 5,
        price: 15.0,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
    seller: {
      name: "Ferme Durand",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    paymentMethod: "Carte bancaire",
    shippingAddress: {
      street: "123 Rue Principale",
      city: "Yaoundé",
      region: "Centre",
      country: "Cameroun",
    },
    trackingNumber: "TRK12345678",
    estimatedDelivery: "2023-05-05",
  },
  {
    id: "ORD-002",
    date: "2023-05-15",
    status: "En cours",
    total: 78.25,
    items: [
      {
        id: 3,
        name: "Carottes",
        quantity: 3,
        price: 12.75,
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: 4,
        name: "Oignons",
        quantity: 2,
        price: 20.0,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
    seller: {
      name: "Ferme Martin",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    paymentMethod: "PayPal",
    shippingAddress: {
      street: "456 Avenue des Affaires",
      city: "Douala",
      region: "Littoral",
      country: "Cameroun",
    },
    trackingNumber: "TRK87654321",
    estimatedDelivery: "2023-05-20",
  },
  {
    id: "ORD-003",
    date: "2023-05-28",
    status: "En attente",
    total: 210.0,
    items: [
      {
        id: 5,
        name: "Bananes",
        quantity: 4,
        price: 30.0,
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: 6,
        name: "Ananas",
        quantity: 2,
        price: 45.0,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
    seller: {
      name: "Ferme Petit",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    paymentMethod: "Carte bancaire",
    shippingAddress: {
      street: "789 Boulevard Central",
      city: "Yaoundé",
      region: "Centre",
      country: "Cameroun",
    },
    estimatedDelivery: "2023-06-02",
  },
  {
    id: "ORD-004",
    date: "2023-04-10",
    status: "Livré",
    total: 45.75,
    items: [
      {
        id: 7,
        name: "Poivrons",
        quantity: 3,
        price: 15.25,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
    seller: {
      name: "Ferme Durand",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    paymentMethod: "Carte bancaire",
    shippingAddress: {
      street: "123 Rue Principale",
      city: "Yaoundé",
      region: "Centre",
      country: "Cameroun",
    },
    trackingNumber: "TRK23456789",
    estimatedDelivery: "2023-04-15",
  },
  {
    id: "ORD-005",
    date: "2023-04-22",
    status: "Annulé",
    total: 89.99,
    items: [
      {
        id: 8,
        name: "Aubergines",
        quantity: 2,
        price: 22.5,
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: 9,
        name: "Courgettes",
        quantity: 3,
        price: 15.0,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
    seller: {
      name: "Ferme Legrand",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    paymentMethod: "PayPal",
    shippingAddress: {
      street: "321 Avenue Commerciale",
      city: "Douala",
      region: "Littoral",
      country: "Cameroun",
    },
  },
]

export default function OrdersPage() {
  const searchParams = useSearchParams()
  const orderIdParam = searchParams.get("id")

  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [sortField, setSortField] = useState<"date" | "total">("date")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    const loadData = async () => {
      try {
        // Simuler un délai réseau
        await new Promise((resolve) => setTimeout(resolve, 800))

        setOrders(ordersData)

        // Si un ID de commande est spécifié dans l'URL, sélectionner cette commande
        if (orderIdParam) {
          const order = ordersData.find((o) => o.id === orderIdParam)
          if (order) {
            setSelectedOrder(order)
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [orderIdParam])

  // Filtrer les commandes en fonction de l'onglet actif, de la recherche et des filtres
  const filteredOrders = orders.filter((order) => {
    // Filtre par onglet
    if (activeTab === "processing" && !(order.status === "En cours" || order.status === "En attente")) return false
    if (activeTab === "delivered" && order.status !== "Livré") return false
    if (activeTab === "cancelled" && order.status !== "Annulé") return false

    // Filtre par recherche
    if (
      searchQuery &&
      !order.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !order.seller.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false

    // Filtre par statut
    if (statusFilter !== "all" && order.status !== statusFilter) return false

    return true
  })

  // Trier les commandes
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortField === "date") {
      return sortOrder === "asc"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    } else {
      return sortOrder === "asc" ? a.total - b.total : b.total - a.total
    }
  })

  // Sélectionner une commande pour afficher les détails
  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order)
    // Mettre à jour l'URL sans recharger la page
    const url = new URL(window.location.href)
    url.searchParams.set("id", order.id)
    window.history.pushState({}, "", url.toString())
  }

  // Revenir à la liste des commandes
  const handleBackToList = () => {
    setSelectedOrder(null)
    // Supprimer le paramètre id de l'URL
    const url = new URL(window.location.href)
    url.searchParams.delete("id")
    window.history.pushState({}, "", url.toString())
  }

  if (isLoading) {
    return (
      <div className="container py-20">
        <LoadingSpinner size={40} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {selectedOrder ? (
        // Vue détaillée d'une commande
        <OrderDetail order={selectedOrder} onBack={handleBackToList} />
      ) : (
        // Liste des commandes
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Mes commandes</h1>
              <p className="text-muted-foreground">Gérez et suivez vos commandes</p>
            </div>
            <Button asChild>
              <Link href="/products">Acheter à nouveau</Link>
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une commande..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-10">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtrer
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setStatusFilter("all")}>Tous les statuts</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("Livré")}>Livré</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("En cours")}>En cours</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("En attente")}>En attente</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("Annulé")}>Annulé</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-10">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    Trier
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setSortField("date")
                      setSortOrder("desc")
                    }}
                  >
                    Date (récent d'abord)
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSortField("date")
                      setSortOrder("asc")
                    }}
                  >
                    Date (ancien d'abord)
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSortField("total")
                      setSortOrder("desc")
                    }}
                  >
                    Montant (élevé d'abord)
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSortField("total")
                      setSortOrder("asc")
                    }}
                  >
                    Montant (faible d'abord)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full md:w-auto grid-cols-4">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="processing">En cours</TabsTrigger>
              <TabsTrigger value="delivered">Livrées</TabsTrigger>
              <TabsTrigger value="cancelled">Annulées</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4 mt-6">
              <OrdersTable orders={sortedOrders} onSelectOrder={handleSelectOrder} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}

function OrdersTable({ orders, onSelectOrder }: { orders: Order[]; onSelectOrder: (order: Order) => void }) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Package className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">Aucune commande trouvée</h3>
        <p className="text-sm text-muted-foreground mt-1">Vous n'avez pas encore de commandes dans cette catégorie.</p>
        <Button className="mt-4" asChild>
          <Link href="/products">Découvrir des produits</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Commande</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Vendeur</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="cursor-pointer" onClick={() => onSelectOrder(order)}>
              <TableCell className="font-medium">
                {order.id}
                <div className="text-xs text-muted-foreground">{order.items.length} article(s)</div>
              </TableCell>
              <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
              <TableCell>{order.seller.name}</TableCell>
              <TableCell>
                <OrderStatusBadge status={order.status} />
              </TableCell>
              <TableCell className="text-right">{order.total.toFixed(2)} FCFA</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectOrder(order)
                  }}
                >
                  Détails
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="p-4 border-t">
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
  )
}

function OrderDetail({ order, onBack }: { order: Order; onBack: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Commande {order.id}</h1>
          <p className="text-muted-foreground">Passée le {new Date(order.date).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Résumé de la commande */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Résumé de la commande</CardTitle>
            <CardDescription>Détails de votre commande et statut de livraison</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Statut de la commande */}
            <div className="rounded-lg border p-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                  {order.status === "Livré" ? (
                    <div className="rounded-full bg-green-100 p-2 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                  ) : order.status === "Annulé" ? (
                    <div className="rounded-full bg-red-100 p-2 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                      <XCircle className="h-5 w-5" />
                    </div>
                  ) : order.status === "En cours" ? (
                    <div className="rounded-full bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                      <Truck className="h-5 w-5" />
                    </div>
                  ) : (
                    <div className="rounded-full bg-orange-100 p-2 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
                      <Clock className="h-5 w-5" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium">Statut: {order.status}</h3>
                    {order.status === "Livré" ? (
                      <p className="text-sm text-muted-foreground">Votre commande a été livrée avec succès.</p>
                    ) : order.status === "En cours" ? (
                      <p className="text-sm text-muted-foreground">
                        Votre commande est en cours de livraison et arrivera bientôt.
                      </p>
                    ) : order.status === "En attente" ? (
                      <p className="text-sm text-muted-foreground">
                        Votre commande est en cours de préparation par le vendeur.
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">Votre commande a été annulée.</p>
                    )}
                  </div>
                </div>
                {order.trackingNumber && (
                  <div className="text-right">
                    <p className="text-sm font-medium">Numéro de suivi</p>
                    <p className="text-sm">{order.trackingNumber}</p>
                  </div>
                )}
              </div>

              {order.estimatedDelivery && order.status !== "Livré" && order.status !== "Annulé" && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium">Livraison estimée</p>
                  <p className="text-sm">{new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                </div>
              )}
            </div>

            {/* Articles de la commande */}
            <div>
              <h3 className="text-lg font-medium mb-4">Articles commandés</h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">Quantité: {item.quantity}</p>
                      <p className="text-sm font-medium mt-1">{item.price.toFixed(2)} FCFA / unité</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{(item.price * item.quantity).toFixed(2)} FCFA</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Résumé des coûts */}
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-medium mb-4">Résumé des coûts</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span>{order.items.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frais de livraison</span>
                  <span>1,000.00 FCFA</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>{order.total.toFixed(2)} FCFA</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={onBack}>
              Retour aux commandes
            </Button>
            {(order.status === "En attente" || order.status === "En cours") && (
              <Button variant="destructive">Annuler la commande</Button>
            )}
          </CardFooter>
        </Card>

        {/* Informations complémentaires */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Informations</CardTitle>
            <CardDescription>Détails de livraison et de paiement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Vendeur */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Vendeur</h3>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={order.seller.avatar || "/placeholder.svg"} alt={order.seller.name} />
                  <AvatarFallback>{order.seller.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{order.seller.name}</p>
                  <Button variant="link" size="sm" className="h-auto p-0" asChild>
                    <Link href={`/seller/${order.seller.name.toLowerCase().replace(/\s+/g, "-")}`}>Voir le profil</Link>
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Adresse de livraison */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Adresse de livraison</h3>
              <div className="space-y-1">
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.region}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            <Separator />

            {/* Méthode de paiement */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Méthode de paiement</h3>
              <p>{order.paymentMethod}</p>
            </div>

            <Separator />

            {/* Dates importantes */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Dates importantes</h3>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Date de commande</span>
                  <span className="text-sm">{new Date(order.date).toLocaleDateString()}</span>
                </div>
                {order.estimatedDelivery && (
                  <div className="flex justify-between">
                    <span className="text-sm">Livraison estimée</span>
                    <span className="text-sm">{new Date(order.estimatedDelivery).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/buyer/messages">Contacter le vendeur</Link>
            </Button>
            {order.status === "Livré" && (
              <Button variant="outline" className="w-full">
                Laisser un avis
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

function OrderStatusBadge({ status }: { status: string }) {
  let variant: "default" | "secondary" | "destructive" | "outline" = "default"

  switch (status) {
    case "Livré":
      variant = "default"
      break
    case "En cours":
      variant = "secondary"
      break
    case "En attente":
      variant = "outline"
      break
    case "Annulé":
      variant = "destructive"
      break
  }

  return <Badge variant={variant}>{status}</Badge>
}
