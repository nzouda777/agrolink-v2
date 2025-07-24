"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, Download } from "lucide-react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface AnalyticsData {
  overview: {
    totalRevenue: number
    revenueChange: number
    totalOrders: number
    ordersChange: number
    totalCustomers: number
    customersChange: number
    averageOrderValue: number
    aovChange: number
  }
  salesData: Array<{
    date: string
    revenue: number
    orders: number
  }>
  topProducts: Array<{
    id: string
    name: string
    revenue: number
    orders: number
    views: number
  }>
  customerSegments: Array<{
    name: string
    value: number
    color: string
  }>
  monthlyTrends: Array<{
    month: string
    revenue: number
    orders: number
    customers: number
  }>
}

async function fetchAnalyticsData(): Promise<AnalyticsData> {
  try {
    const response = await fetch("/api/seller/analytics", {
      next: { revalidate: 0 },
    })
    const raw = await response.json()

    // Si l’API renvoie déjà la bonne forme, on la retourne.
    if (raw && raw.overview && Array.isArray(raw.salesData) && Array.isArray(raw.topProducts)) {
      return raw
    }

    /** ----------------------------------------------------------------
     *  Cas de compatibilité : l’API renvoie l’ancien format
     *  (ex. `dashboard`, `salesTrend` …). On adapte les données.
     * ----------------------------------------------------------------*/
    const transformed: AnalyticsData = {
      overview: {
        totalRevenue: raw.dashboard?.totalRevenue ?? 0,
        revenueChange: 0,
        totalOrders: raw.dashboard?.totalOrders ?? 0,
        ordersChange: 0,
        totalCustomers: raw.dashboard?.totalCustomers ?? 0,
        customersChange: 0,
        averageOrderValue:
          raw.dashboard?.totalRevenue && raw.dashboard?.totalOrders
            ? raw.dashboard.totalRevenue / raw.dashboard.totalOrders
            : 0,
        aovChange: 0,
      },
      salesData:
        raw.salesTrend?.map((d: any) => ({
          date: d.date,
          revenue: d.sales,
          orders: Math.round(d.sales / 1000), // approximation
        })) ?? [],
      topProducts: raw.topProducts ?? [],
      customerSegments: raw.customerSegments ?? [],
      monthlyTrends: raw.monthlyTrends ?? [],
    }

    return transformed
  } catch (error) {
    console.error("Erreur lors du chargement des analytics:", error)
    /** Valeurs de secours */
    return {
      overview: {
        totalRevenue: 0,
        revenueChange: 0,
        totalOrders: 0,
        ordersChange: 0,
        totalCustomers: 0,
        customersChange: 0,
        averageOrderValue: 0,
        aovChange: 0,
      },
      salesData: [],
      topProducts: [],
      customerSegments: [],
      monthlyTrends: [],
    }
  }
}

function AnalyticsContent({ data }: { data: AnalyticsData }) {
  const [timeRange, setTimeRange] = useState("7d")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercentage = (raw: unknown) => {
    const value = Number(raw ?? 0)
    const sign = value >= 0 ? "+" : ""
    return `${sign}${value.toFixed(1)}%`
  }

  const getTrendIcon = (raw: unknown) => {
    const value = Number(raw ?? 0)
    return value >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    )
  }

  const getTrendColor = (raw: unknown) => {
    const value = Number(raw ?? 0)
    return value >= 0 ? "text-green-600" : "text-red-600"
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center justify-between w-full">
          <h1 className="text-lg font-semibold">Analytics</h1>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 jours</SelectItem>
                <SelectItem value="30d">30 jours</SelectItem>
                <SelectItem value="90d">90 jours</SelectItem>
                <SelectItem value="1y">1 an</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chiffre d'Affaires</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(data.overview.totalRevenue)}</div>
              <div className="flex items-center gap-1 text-xs">
                {getTrendIcon(data.overview.revenueChange)}
                <span className={getTrendColor(data.overview.revenueChange)}>
                  {formatPercentage(data.overview.revenueChange)}
                </span>
                <span className="text-muted-foreground">vs période précédente</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commandes</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.overview.totalOrders}</div>
              <div className="flex items-center gap-1 text-xs">
                {getTrendIcon(data.overview.ordersChange)}
                <span className={getTrendColor(data.overview.ordersChange)}>
                  {formatPercentage(data.overview.ordersChange)}
                </span>
                <span className="text-muted-foreground">vs période précédente</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.overview.totalCustomers}</div>
              <div className="flex items-center gap-1 text-xs">
                {getTrendIcon(data.overview.customersChange)}
                <span className={getTrendColor(data.overview.customersChange)}>
                  {formatPercentage(data.overview.customersChange)}
                </span>
                <span className="text-muted-foreground">vs période précédente</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Panier Moyen</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(data.overview.averageOrderValue)}</div>
              <div className="flex items-center gap-1 text-xs">
                {getTrendIcon(data.overview.aovChange)}
                <span className={getTrendColor(data.overview.aovChange)}>
                  {formatPercentage(data.overview.aovChange)}
                </span>
                <span className="text-muted-foreground">vs période précédente</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="sales" className="space-y-4">
          <TabsList>
            <TabsTrigger value="sales">Ventes</TabsTrigger>
            <TabsTrigger value="products">Produits</TabsTrigger>
            <TabsTrigger value="customers">Clients</TabsTrigger>
            <TabsTrigger value="trends">Tendances</TabsTrigger>
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
                    <AreaChart data={data.salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) =>
                          new Date(value).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
                        }
                      />
                      <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                      <Tooltip formatter={(value) => [formatCurrency(Number(value)), "Revenus"]} />
                      <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                    </AreaChart>
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
                    <BarChart data={data.salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) =>
                          new Date(value).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
                        }
                      />
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
                <CardTitle>Top Produits</CardTitle>
                <CardDescription>Vos produits les plus performants</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.topProducts?.map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.views} vues</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(product.revenue)}</p>
                        <p className="text-sm text-muted-foreground">{product.orders} commandes</p>
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
                  <CardTitle>Segmentation Clients</CardTitle>
                  <CardDescription>Répartition de votre base client</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={data.customerSegments}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {data.customerSegments?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Acquisition Clients</CardTitle>
                  <CardDescription>Nouveaux clients par mois</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data.monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="customers" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tendances Mensuelles</CardTitle>
                <CardDescription>Évolution de vos métriques clés</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={data.monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8884d8"
                      strokeWidth={2}
                      name="Revenus"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="orders"
                      stroke="#82ca9d"
                      strokeWidth={2}
                      name="Commandes"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="customers"
                      stroke="#ffc658"
                      strokeWidth={2}
                      name="Clients"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function SellerAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalyticsData()
      .then(setData)
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
          <h1 className="text-lg font-semibold">Analytics</h1>
        </header>
        <div className="flex-1 p-6">
          <div className="text-center">
            <p className="text-muted-foreground">Erreur lors du chargement des analytics</p>
          </div>
        </div>
      </div>
    )
  }

  return <AnalyticsContent data={data} />
}
