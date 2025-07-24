"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Users, Star, Mail, Phone, MapPin, ShoppingBag } from "lucide-react"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  location: string
  totalOrders: number
  totalSpent: number
  averageOrderValue: number
  lastOrderDate: string
  joinDate: string
  status: "active" | "inactive"
  segment: "new" | "regular" | "vip"
  avatar: string
}

async function fetchCustomers(): Promise<Customer[]> {
  try {
    const response = await fetch("/api/seller/customers", {
      next: { revalidate: 0 },
    })

    if (!response.ok) {
      throw new Error("Erreur lors du chargement des clients")
    }

    return await response.json()
  } catch (error) {
    console.error("Erreur lors du chargement des clients:", error)
    return []
  }
}

function CustomersContent({ customers }: { customers: Customer[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredCustomers, setFilteredCustomers] = useState(customers)

  useEffect(() => {
    const filtered = customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.location.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredCustomers(filtered)
  }, [searchTerm, customers])

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
    })
  }

  const getSegmentBadge = (segment: string) => {
    switch (segment) {
      case "vip":
        return (
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            <Star className="h-3 w-3 mr-1" />
            VIP
          </Badge>
        )
      case "regular":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Régulier</Badge>
      case "new":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Nouveau</Badge>
      default:
        return <Badge variant="outline">{segment}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Actif</Badge>
      case "inactive":
        return <Badge variant="secondary">Inactif</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const totalCustomers = customers.length
  const activeCustomers = customers.filter((c) => c.status === "active").length
  const vipCustomers = customers.filter((c) => c.segment === "vip").length
  const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0)

  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Gestion des Clients</h1>
      </header>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Clients</p>
                  <p className="text-2xl font-bold">{totalCustomers}</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Clients Actifs</p>
                  <p className="text-2xl font-bold text-green-600">{activeCustomers}</p>
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
                  <p className="text-sm text-muted-foreground">Clients VIP</p>
                  <p className="text-2xl font-bold text-purple-600">{vipCustomers}</p>
                </div>
                <Star className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenus Clients</p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalRevenue)}</p>
                </div>
                <ShoppingBag className="h-8 w-8 text-blue-600" />
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
                placeholder="Rechercher un client par nom, email ou localisation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Customers List */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCustomers.map((customer) => (
            <Card key={customer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={customer.avatar || "/placeholder.svg"} alt={customer.name} />
                      <AvatarFallback>
                        {customer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{customer.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {getSegmentBadge(customer.segment)}
                        {getStatusBadge(customer.status)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{customer.location}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-lg font-bold">{customer.totalOrders}</p>
                    <p className="text-xs text-muted-foreground">Commandes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold">{formatCurrency(customer.totalSpent)}</p>
                    <p className="text-xs text-muted-foreground">Total dépensé</p>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Panier moyen:</span>
                    <span className="font-medium">{formatCurrency(customer.averageOrderValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dernière commande:</span>
                    <span className="font-medium">{formatDate(customer.lastOrderDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Client depuis:</span>
                    <span className="font-medium">{formatDate(customer.joinDate)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Mail className="h-4 w-4 mr-2" />
                    Contacter
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Commandes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucun client trouvé</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Aucun client ne correspond à votre recherche." : "Vous n'avez pas encore de clients."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default function SellerCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCustomers()
      .then(setCustomers)
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <CustomersContent customers={customers} />
}
