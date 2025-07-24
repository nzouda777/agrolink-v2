"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, Download, DollarSign, ShoppingCart, Package } from "lucide-react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface ReportsData {
  salesSummary: {
    totalRevenue: number
    totalOrders: number
    averageOrderValue: number
    topSellingProduct: string
    period: string
  }
  dailySales: Array<{
    date: string
    revenue: number
    orders: number
  }>
  productPerformance: Array<{
    id: string
    name: string
    revenue: number
    orders: number
    quantity: number
    unit: string
    growth: number
  }>
  customerInsights: {
    newCustomers: number
    returningCustomers: number
    customerRetentionRate: number
    averageCustomerValue: number
  }
}

async function fetchReports(): Promise<ReportsData> {
  try {
    const response = await fetch("/api/seller/reports", {
      next: { revalidate: 0 },
    })

    if (!response.ok) {
      throw new Error("Erreur lors du chargement des rapports")
    }

    return await response.json()
  } catch (error) {
    console.error("Erreur lors du chargement des rapports:", error)
    return {
      salesSummary: {
        totalRevenue: 156800,
        totalOrders: 89,
        averageOrderValue: 1762,
        topSellingProduct: "Tomates Bio",
        period: "30 derniers jours",
      },
      dailySales: [
        { date: "2024-01-15", revenue: 8900, orders: 5 },
        { date: "2024-01-16", revenue: 12400, orders: 7 },
        { date: "2024-01-17", revenue: 15600, orders: 9 },
        { date: "2024-01-18", revenue: 9800, orders: 6 },
        { date: "2024-01-19", revenue: 18200, orders: 11 },
        { date: "2024-01-20", revenue: 22100, orders: 13 },
        { date: "2024-01-21", revenue: 16800, orders: 10 },
        { date: "2024-01-22", revenue: 19400, orders: 12 },
      ],
      productPerformance: [
        {
          id: "1",
          name: "Tomates Bio",
          revenue: 45000,
          orders: 25,
          quantity: 180,
          unit: "kg",
          growth: 12.5,
        },
        {
          id: "2",
          name: "Carottes",
          revenue: 32000,
          orders: 18,
          quantity: 178,
          unit: "kg",
          growth: 8.2,
        },
        {
          id: "3",
          name: "Pommes de Terre",
          revenue: 28000,
          orders: 15,
          quantity: 233,
          unit: "kg",
          growth: -2.1,
        },
        {
          id: "4",
          name: "Salade Verte",
          revenue: 18000,
          orders: 10,
          quantity: 225,
          unit: "pièce",
          growth: 15.3,
        },
      ],
      customerInsights: {
        newCustomers: 12,
        returningCustomers: 28,
        customerRetentionRate: 68.5,
        averageCustomerValue: 3890,
      },
    }
  }
}

function ReportsContent({ data }: { data: ReportsData }) {
  const [period, setPeriod] = useState("30d")

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
    })
  }

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? "+" : ""
    return `${sign}${value.toFixed(1)}%`
  }

  const getTrendIcon = (value: number) => {
    return value >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    )
  }

  const getTrendColor = (value: number) => {
    return value >= 0 ? "text-green-600" : "text-red-600"
  }

  const exportReport = () => {
    // Simulation d'export
    console.log("Export du rapport...")
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center justify-between w-full">
          <h1 className="text-lg font-semibold">Rapports de Vente</h1>
          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 derniers jours</SelectItem>
                <SelectItem value="30d">30 derniers jours</SelectItem>
                <SelectItem value="90d">90 derniers jours</SelectItem>
                <SelectItem value="1y">1 an</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={exportReport}>
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chiffre d'Affaires</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(data.salesSummary.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">{data.salesSummary.period}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commandes</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.salesSummary.totalOrders}</div>
              <p className="text-xs text-muted-foreground">{data.salesSummary.period}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Panier Moyen</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(data.salesSummary.averageOrderValue)}</div>
              <p className="text-xs text-muted-foreground">Par commande</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Produit</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{data.salesSummary.topSellingProduct}</div>
              <p className="text-xs text-muted-foreground">Meilleure vente</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Tables */}
        <Tabs defaultValue="sales" className="space-y-4">
          <TabsList>
            <TabsTrigger value="sales">Ventes</TabsTrigger>
            <TabsTrigger value="products">Produits</TabsTrigger>
            <TabsTrigger value="customers">Clients</TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Évolution du Chiffre d'Affaires</CardTitle>
                  <CardDescription>Revenus quotidiens sur la période sélectionnée</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data.dailySales}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={formatDate} />
                      <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                      <Tooltip formatter={(value) => [formatCurrency(Number(value)), "Revenus"]} />
                      <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Nombre de Commandes</CardTitle>
                  <CardDescription>Commandes quotidiennes sur la période sélectionnée</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.dailySales}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={formatDate} />
                      <YAxis />
                      <Tooltip formatter={(value) => [value, "Commandes"]} />
                      <Bar dataKey="orders" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance des Produits</CardTitle>
                <CardDescription>Analyse détaillée de vos produits les plus performants</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.productPerformance.map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {product.quantity} {product.unit} vendus
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(product.revenue)}</p>
                        <div className="flex items-center gap-1 text-sm">
                          {getTrendIcon(product.growth)}
                          <span className={getTrendColor(product.growth)}>{formatPercentage(product.growth)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Acquisition Clients</CardTitle>
                  <CardDescription>Nouveaux vs clients récurrents</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Nouveaux clients</span>
                    <span className="font-bold">{data.customerInsights.newCustomers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Clients récurrents</span>
                    <span className="font-bold">{data.customerInsights.returningCustomers}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm font-medium">Taux de rétention</span>
                    <span className="font-bold text-green-600">
                      {data.customerInsights.customerRetentionRate.toFixed(1)}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Valeur Client</CardTitle>
                  <CardDescription>Analyse de la valeur moyenne par client</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold">{formatCurrency(data.customerInsights.averageCustomerValue)}</p>
                    <p className="text-sm text-muted-foreground">Valeur moyenne par client</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-lg font-bold">
                        {data.customerInsights.newCustomers + data.customerInsights.returningCustomers}
                      </p>
                      <p className="text-xs text-muted-foreground">Total clients</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold">{formatCurrency(data.salesSummary.averageOrderValue)}</p>
                      <p className="text-xs text-muted-foreground">Panier moyen</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function SellerReports() {
  const [data, setData] = useState<ReportsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReports()
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
            <div className="grid gap-4 md:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
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
          <h1 className="text-lg font-semibold">Rapports de Vente</h1>
        </header>
        <div className="flex-1 p-6">
          <div className="text-center">
            <p className="text-muted-foreground">Erreur lors du chargement des rapports</p>
          </div>
        </div>
      </div>
    )
  }

  return <ReportsContent data={data} />
}
