"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  ShoppingCart,
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Activity,
} from "lucide-react"

interface AdminMetrics {
  platformMetrics: {
    totalUsers: number
    activeUsers: number
    totalSellers: number
    activeSellers: number
    totalBuyers: number
    activeBuyers: number
    totalProducts: number
    activeProducts: number
    pendingProducts: number
    totalOrders: number
    pendingOrders: number
    completedOrders: number
    totalRevenue: number
    monthlyRevenue: number
    averageOrderValue: number
  }
  moderationQueue: Array<{
    id: string
    type: string
    title: string
    priority: string
    reason: string
    submittedAt: string
  }>
  systemStatus: {
    apiStatus: string
    databaseStatus: string
    paymentGateway: string
    emailService: string
    storageService: string
    uptime: string
    responseTime: string
  }
  recentActivity: Array<{
    id: string
    type: string
    description: string
    timestamp: string
    details: string
  }>
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Utiliser l'API route au lieu du fichier JSON
        const response = await fetch("/api/admin/metrics")
        const data = await response.json()
        setMetrics(data)
      } catch (error) {
        console.error("Erreur lors du chargement des métriques:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  if (loading) {
    return <div>Chargement...</div>
  }

  if (!metrics) {
    return <div>Erreur lors du chargement des données</div>
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "text-green-600"
      case "degraded":
        return "text-yellow-600"
      case "down":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-4 w-4" />
      case "degraded":
        return <AlertTriangle className="h-4 w-4" />
      case "down":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Administrateur</h1>
        <p className="text-muted-foreground">Vue d'ensemble de la plateforme AgroLink</p>
      </div>

      {/* Métriques principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.platformMetrics.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.platformMetrics.activeUsers.toLocaleString()} actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produits</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.platformMetrics.totalProducts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{metrics.platformMetrics.pendingProducts} en attente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commandes</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.platformMetrics.totalOrders.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{metrics.platformMetrics.pendingOrders} en cours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.platformMetrics.totalRevenue.toLocaleString()}FCFA</div>
            <p className="text-xs text-muted-foreground">
              {metrics.platformMetrics.monthlyRevenue.toLocaleString()}FCFA ce mois
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="moderation" className="space-y-4">
        <TabsList>
          <TabsTrigger value="moderation">File de Modération</TabsTrigger>
          <TabsTrigger value="system">Statut Système</TabsTrigger>
          <TabsTrigger value="activity">Activité Récente</TabsTrigger>
        </TabsList>

        <TabsContent value="moderation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>File de Modération</CardTitle>
              <CardDescription>Éléments nécessitant une attention administrative</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.moderationQueue.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{item.title}</h4>
                        <Badge variant={getPriorityColor(item.priority)}>{item.priority}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.reason}</p>
                      <p className="text-xs text-muted-foreground">{new Date(item.submittedAt).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Examiner
                      </Button>
                      <Button size="sm">Approuver</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Statut du Système</CardTitle>
              <CardDescription>État des services de la plateforme</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>API</span>
                    <div className={`flex items-center gap-2 ${getStatusColor(metrics.systemStatus.apiStatus)}`}>
                      {getStatusIcon(metrics.systemStatus.apiStatus)}
                      <span className="capitalize">{metrics.systemStatus.apiStatus}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Base de données</span>
                    <div className={`flex items-center gap-2 ${getStatusColor(metrics.systemStatus.databaseStatus)}`}>
                      {getStatusIcon(metrics.systemStatus.databaseStatus)}
                      <span className="capitalize">{metrics.systemStatus.databaseStatus}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Passerelle de paiement</span>
                    <div className={`flex items-center gap-2 ${getStatusColor(metrics.systemStatus.paymentGateway)}`}>
                      {getStatusIcon(metrics.systemStatus.paymentGateway)}
                      <span className="capitalize">{metrics.systemStatus.paymentGateway}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Service email</span>
                    <div className={`flex items-center gap-2 ${getStatusColor(metrics.systemStatus.emailService)}`}>
                      {getStatusIcon(metrics.systemStatus.emailService)}
                      <span className="capitalize">{metrics.systemStatus.emailService}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Stockage</span>
                    <div className={`flex items-center gap-2 ${getStatusColor(metrics.systemStatus.storageService)}`}>
                      {getStatusIcon(metrics.systemStatus.storageService)}
                      <span className="capitalize">{metrics.systemStatus.storageService}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Temps de fonctionnement</span>
                    <span className="text-green-600 font-medium">{metrics.systemStatus.uptime}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activité Récente</CardTitle>
              <CardDescription>Dernières actions sur la plateforme</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium">{activity.description}</p>
                      <p className="text-sm text-muted-foreground">{activity.details}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
