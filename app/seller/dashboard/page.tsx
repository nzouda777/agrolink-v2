"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { TrendingUp, Package, ShoppingCart, Users, AlertTriangle, Eye, Plus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
interface DashboardData {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  totalCustomers: number
  pendingOrders: number
  lowStockProducts: number
  recentActivity: Array<{
    id: string
    type: string
    message: string
    timestamp: string
  }>
}

async function fetchDashboardData(): Promise<DashboardData> {
 
  try {
    const response = await fetch("/api/seller/dashboard", {
      next: { revalidate: 0 },
    })

    if (!response.ok) {
      throw new Error("Erreur lors du chargement des données")
    }

    return await response.json()
  } catch (error) {
    console.error("Erreur lors du chargement des données:", error)
    return {
      totalRevenue: 76200,
      totalOrders: 38,
      totalProducts: 15,
      totalCustomers: 28,
      pendingOrders: 3,
      lowStockProducts: 2,
      recentActivity: [
        {
          id: "1",
          type: "order",
          message: "Nouvelle commande de Marie Dubois",
          timestamp: "2024-01-22T10:30:00Z",
        },
        {
          id: "2",
          type: "product",
          message: "Stock faible pour Pommes de Terre",
          timestamp: "2024-01-22T09:15:00Z",
        },
        {
          id: "3",
          type: "review",
          message: "Nouvel avis 5 étoiles sur Tomates Bio",
          timestamp: "2024-01-22T08:45:00Z",
        },
      ],
    }
  }
}

function DashboardContent({ data }: { data: DashboardData }) {
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingCart className="h-4 w-4" />
      case "product":
        return <Package className="h-4 w-4" />
      case "review":
        return <Eye className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "order":
        return "text-green-600"
      case "product":
        return "text-orange-600"
      case "review":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }
  const token = localStorage.getItem("token")
  const router = useRouter()
  !token ? router.push("/auth") : null
  console.log(token)
  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Dashboard Vendeur</h1>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Bienvenue sur votre dashboard</h2>
            <p className="text-muted-foreground">Vue d'ensemble de votre activité commerciale</p>
          </div>
          <Button asChild>
            <Link href="/seller/products/add">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un produit
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chiffre d'Affaires</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(data.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">+12% par rapport au mois dernier</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commandes</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalOrders}</div>
              <p className="text-xs text-muted-foreground">{data.pendingOrders} en attente</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produits</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalProducts}</div>
              <p className="text-xs text-muted-foreground">{data.lowStockProducts} stock faible</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalCustomers}</div>
              <p className="text-xs text-muted-foreground">+3 nouveaux cette semaine</p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {(data.pendingOrders > 0 || data.lowStockProducts > 0) && (
          <div className="grid gap-4 md:grid-cols-2">
            {data.pendingOrders > 0 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="text-orange-800 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Commandes en attente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-orange-700">
                    Vous avez {data.pendingOrders} commande(s) en attente de traitement.
                  </p>
                  <Button variant="outline" className="mt-2 bg-transparent" asChild>
                    <Link href="/seller/orders">Voir les commandes</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {data.lowStockProducts > 0 && (
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-red-800 flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Stock faible
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-red-700">{data.lowStockProducts} produit(s) ont un stock faible.</p>
                  <Button variant="outline" className="mt-2 bg-transparent" asChild>
                    <Link href="/seller/inventory">Gérer l'inventaire</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Activité Récente</CardTitle>
            <CardDescription>Les dernières actions sur votre compte vendeur</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4">
                  <div className={`p-2 rounded-full bg-gray-100 ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
            <CardDescription>Accès rapide aux fonctionnalités principales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Button variant="outline" asChild>
                <Link href="/seller/products/add">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un produit
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/seller/orders">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Voir les commandes
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/seller/analytics">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Voir les analytics
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function SellerDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
      .then(setData)
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
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid gap-4 md:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Dashboard Vendeur</h1>
        </header>
        <div className="flex-1 p-6">
          <div className="text-center">
            <p className="text-muted-foreground">Erreur lors du chargement des données</p>
          </div>
        </div>
      </div>
    )
  }

  return <DashboardContent data={data} />
}
