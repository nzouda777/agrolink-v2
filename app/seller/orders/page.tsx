"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Package, Clock, CheckCircle, XCircle, Eye, Truck } from "lucide-react"
import Link from "next/link"

interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
    unit: string
  }>
  total: number
  status: "pending" | "confirmed" | "preparing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed"
  orderDate: string
  deliveryDate?: string
  shippingAddress: {
    street: string
    city: string
    region: string
    postalCode: string
  }
  notes?: string
}

async function fetchOrders(): Promise<Order[]> {
  try {
    const response = await fetch("/api/seller/orders", {
      next: { revalidate: 0 },
    })

    if (!response.ok) {
      throw new Error("Erreur lors du chargement des commandes")
    }

    return await response.json()
  } catch (error) {
    console.error("Erreur lors du chargement des commandes:", error)
    return [
      {
        id: "ORD-001",
        customerName: "Marie Dubois",
        customerEmail: "marie.dubois@email.com",
        customerPhone: "+221 77 123 45 67",
        items: [
          { id: "1", name: "Tomates Bio", quantity: 5, price: 2500, unit: "kg" },
          { id: "2", name: "Carottes", quantity: 3, price: 1800, unit: "kg" },
        ],
        total: 17900,
        status: "pending",
        paymentStatus: "paid",
        orderDate: "2024-01-22T10:30:00Z",
        shippingAddress: {
          street: "Rue 10, Cité Keur Gorgui",
          city: "Dakar",
          region: "Dakar",
          postalCode: "12500",
        },
        notes: "Livraison le matin de préférence",
      },
      {
        id: "ORD-002",
        customerName: "Amadou Ba",
        customerEmail: "amadou.ba@email.com",
        customerPhone: "+221 76 987 65 43",
        items: [{ id: "3", name: "Pommes de Terre", quantity: 10, price: 1200, unit: "kg" }],
        total: 12000,
        status: "confirmed",
        paymentStatus: "paid",
        orderDate: "2024-01-21T14:15:00Z",
        deliveryDate: "2024-01-23T09:00:00Z",
        shippingAddress: {
          street: "Avenue Bourguiba",
          city: "Thiès",
          region: "Thiès",
          postalCode: "21000",
        },
      },
      {
        id: "ORD-003",
        customerName: "Fatou Sall",
        customerEmail: "fatou.sall@email.com",
        customerPhone: "+221 78 456 78 90",
        items: [
          { id: "1", name: "Tomates Bio", quantity: 8, price: 2500, unit: "kg" },
          { id: "4", name: "Salade Verte", quantity: 12, price: 800, unit: "pièce" },
        ],
        total: 29600,
        status: "delivered",
        paymentStatus: "paid",
        orderDate: "2024-01-20T09:45:00Z",
        deliveryDate: "2024-01-21T16:30:00Z",
        shippingAddress: {
          street: "Quartier Sor",
          city: "Saint-Louis",
          region: "Saint-Louis",
          postalCode: "32000",
        },
      },
    ]
  }
}

function OrdersContent({ orders }: { orders: Order[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [filteredOrders, setFilteredOrders] = useState(orders)

  useEffect(() => {
    let filtered = orders.filter(
      (order) =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }, [searchTerm, statusFilter, orders])

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
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "En attente", variant: "secondary" as const, icon: Clock },
      confirmed: { label: "Confirmée", variant: "default" as const, icon: CheckCircle },
      preparing: { label: "Préparation", variant: "secondary" as const, icon: Package },
      shipped: { label: "Expédiée", variant: "default" as const, icon: Truck },
      delivered: { label: "Livrée", variant: "default" as const, icon: CheckCircle },
      cancelled: { label: "Annulée", variant: "destructive" as const, icon: XCircle },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Payé</Badge>
      case "pending":
        return <Badge variant="secondary">En attente</Badge>
      case "failed":
        return <Badge variant="destructive">Échec</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    // Simulation d'une mise à jour
    console.log(`Mise à jour de la commande ${orderId} vers ${newStatus}`)
  }

  const pendingOrders = orders.filter((o) => o.status === "pending").length
  const confirmedOrders = orders.filter((o) => o.status === "confirmed").length
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total ?? 0), 0)

  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Gestion des Commandes</h1>
      </header>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Commandes</p>
                  <p className="text-2xl font-bold">{orders.length}</p>
                </div>
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">En Attente</p>
                  <p className="text-2xl font-bold text-orange-600">{pendingOrders}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Confirmées</p>
                  <p className="text-2xl font-bold text-blue-600">{confirmedOrders}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Chiffre d'Affaires</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-green-600"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par numéro de commande ou nom client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="confirmed">Confirmée</SelectItem>
                  <SelectItem value="preparing">Préparation</SelectItem>
                  <SelectItem value="shipped">Expédiée</SelectItem>
                  <SelectItem value="delivered">Livrée</SelectItem>
                  <SelectItem value="cancelled">Annulée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{order.id}</h3>
                      {getStatusBadge(order.status)}
                      {getPaymentStatusBadge(order.paymentStatus)}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>
                        <strong>Client:</strong> {order.customerName}
                      </p>
                      <p>
                        <strong>Email:</strong> {order.customerEmail}
                      </p>
                      <p>
                        <strong>Téléphone:</strong> {order.customerPhone}
                      </p>
                      <p>
                        <strong>Commande:</strong> {formatDate(order.orderDate)}
                      </p>
                      {order.deliveryDate && (
                        <p>
                          <strong>Livraison:</strong> {formatDate(order.deliveryDate)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{formatCurrency(order.total)}</p>
                    <p className="text-sm text-muted-foreground">{order.items?.length ?? 0} article(s)</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t pt-4 mb-4">
                  <h4 className="font-medium mb-2">Articles commandés:</h4>
                  <div className="space-y-2">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <span>
                          {item.name} x {item.quantity} {item.unit}
                        </span>
                        <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="border-t pt-4 mb-4">
                  <h4 className="font-medium mb-2">Adresse de livraison:</h4>
                  <p className="text-sm text-muted-foreground">
                    {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.region}{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                </div>

                {/* Notes */}
                {order.notes && (
                  <div className="border-t pt-4 mb-4">
                    <h4 className="font-medium mb-2">Notes:</h4>
                    <p className="text-sm text-muted-foreground">{order.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    {order.status === "pending" && (
                      <>
                        <Button size="sm" onClick={() => updateOrderStatus(order.id, "confirmed")}>
                          Confirmer
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => updateOrderStatus(order.id, "cancelled")}>
                          Annuler
                        </Button>
                      </>
                    )}
                    {order.status === "confirmed" && (
                      <Button size="sm" onClick={() => updateOrderStatus(order.id, "preparing")}>
                        Marquer en préparation
                      </Button>
                    )}
                    {order.status === "preparing" && (
                      <Button size="sm" onClick={() => updateOrderStatus(order.id, "shipped")}>
                        Marquer comme expédiée
                      </Button>
                    )}
                    {order.status === "shipped" && (
                      <Button size="sm" onClick={() => updateOrderStatus(order.id, "delivered")}>
                        Marquer comme livrée
                      </Button>
                    )}
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/seller/orders/${order.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      Détails
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucune commande trouvée</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all"
                  ? "Aucune commande ne correspond à vos critères de recherche."
                  : "Vous n'avez pas encore de commandes."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default function SellerOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
      .then(setOrders)
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
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <OrdersContent orders={orders} />
}
