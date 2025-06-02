import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Données de secours en cas d'échec de l'API
const fallbackData = {
  overview: {
    totalUsers: 5000,
    totalSellers: 200,
    totalProducts: 3000,
    totalOrders: 10000,
    totalRevenue: 750000,
    averageOrderValue: 75,
  },
  userGrowth: [
    { month: "Jan", users: 4000 },
    { month: "Feb", users: 4200 },
    { month: "Mar", users: 4400 },
    { month: "Apr", users: 4700 },
    { month: "May", users: 5000 },
  ],
  salesByCategory: [
    { category: "Fruits", sales: 200000 },
    { category: "Légumes", sales: 300000 },
    { category: "Produits laitiers", sales: 150000 },
    { category: "Viandes", sales: 100000 },
    { category: "Autres", sales: 50000 },
  ],
  salesByRegion: [
    { region: "Île-de-France", sales: 200000 },
    { region: "Auvergne-Rhône-Alpes", sales: 150000 },
    { region: "Nouvelle-Aquitaine", sales: 120000 },
    { region: "Occitanie", sales: 100000 },
    { region: "Hauts-de-France", sales: 80000 },
    { region: "Autres régions", sales: 50000 },
  ],
  monthlyRevenue: [
    { month: "Jan", revenue: 150000 },
    { month: "Feb", revenue: 160000 },
    { month: "Mar", revenue: 170000 },
    { month: "Apr", revenue: 180000 },
    { month: "May", revenue: 190000 },
  ],
  topSellingProducts: [
    { name: "Pommes Bio", sales: 10000, revenue: 20000 },
    { name: "Tomates Cerises", sales: 9000, revenue: 18000 },
    { name: "Fromage de Chèvre", sales: 8000, revenue: 24000 },
    { name: "Carottes Bio", sales: 7000, revenue: 14000 },
    { name: "Miel de Montagne", sales: 6000, revenue: 30000 },
  ],
  customerRetention: {
    newCustomers: 1200,
    returningCustomers: 3500,
    churnRate: 5,
  },
}

async function fetchAnalyticsData() {
  try {
    // Utiliser une URL relative au lieu d'une URL complète
    const response = await fetch("/api/admin/analytics", {
      next: { revalidate: 0 }, // Désactiver le cache
    })

    if (!response.ok) {
      console.error(`Erreur HTTP: ${response.status}`)
      return fallbackData
    }

    return await response.json()
  } catch (error) {
    console.error("Erreur lors du chargement des données:", error)
    // Retourner les données de secours en cas d'erreur
    return fallbackData
  }
}

function OverviewCards({ data }) {
  const metrics = [
    { title: "Utilisateurs totaux", value: data.totalUsers },
    { title: "Vendeurs", value: data.totalSellers },
    { title: "Produits", value: data.totalProducts },
    { title: "Commandes", value: data.totalOrders },
    { title: "Chiffre d'affaires", value: `${data.totalRevenue.toLocaleString("fr-FR")} FCFA` },
    { title: "Valeur moyenne", value: `${data.averageOrderValue.toLocaleString("fr-FR")} FCFA` },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function SalesByCategoryTable({ data }) {
  const total = data.reduce((sum, item) => sum + item.sales, 0)

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Catégorie</TableHead>
            <TableHead className="text-right">Ventes</TableHead>
            <TableHead className="text-right">Pourcentage</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.category}>
              <TableCell className="font-medium">{item.category}</TableCell>
              <TableCell className="text-right">{item.sales.toLocaleString("fr-FR")} FCFA</TableCell>
              <TableCell className="text-right">{((item.sales / total) * 100).toFixed(1)}%</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell className="font-bold">Total</TableCell>
            <TableCell className="text-right font-bold">{total.toLocaleString("fr-FR")} FCFA</TableCell>
            <TableCell className="text-right font-bold">100%</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

function SalesByRegionTable({ data }) {
  const total = data.reduce((sum, item) => sum + item.sales, 0)

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Région</TableHead>
            <TableHead className="text-right">Ventes</TableHead>
            <TableHead className="text-right">Pourcentage</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.region}>
              <TableCell className="font-medium">{item.region}</TableCell>
              <TableCell className="text-right">{item.sales.toLocaleString("fr-FR")} FCFA</TableCell>
              <TableCell className="text-right">{((item.sales / total) * 100).toFixed(1)}%</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell className="font-bold">Total</TableCell>
            <TableCell className="text-right font-bold">{total.toLocaleString("fr-FR")} FCFA</TableCell>
            <TableCell className="text-right font-bold">100%</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

function TopSellingProductsTable({ data }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produit</TableHead>
            <TableHead className="text-right">Ventes (unités)</TableHead>
            <TableHead className="text-right">Chiffre d'affaires</TableHead>
            <TableHead className="text-right">Prix moyen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.name}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell className="text-right">{item.sales.toLocaleString("fr-FR")}</TableCell>
              <TableCell className="text-right">{item.revenue.toLocaleString("fr-FR")} FCFA</TableCell>
              <TableCell className="text-right">{(item.revenue / item.sales).toFixed(2)} FCFA</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function UserGrowthChart({ data }) {
  // Dans un environnement réel, nous utiliserions une bibliothèque comme Chart.js ou Recharts
  // Pour cette démonstration, nous allons créer une visualisation simple
  const maxUsers = Math.max(...data.map((item) => item.users))

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0</span>
        <span>{maxUsers}</span>
      </div>
      <div className="flex items-end gap-2 h-40">
        {data.map((item) => {
          const height = (item.users / maxUsers) * 100
          return (
            <div key={item.month} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-primary rounded-t" style={{ height: `${height}%` }}></div>
              <span className="text-xs mt-2">{item.month}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function MonthlyRevenueChart({ data }) {
  // Visualisation simple pour la démonstration
  const maxRevenue = Math.max(...data.map((item) => item.revenue))

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0 FCFA</span>
        <span>{maxRevenue.toLocaleString("fr-FR")} FCFA</span>
      </div>
      <div className="flex items-end gap-2 h-40">
        {data.map((item) => {
          const height = (item.revenue / maxRevenue) * 100
          return (
            <div key={item.month} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-green-500 rounded-t" style={{ height: `${height}%` }}></div>
              <span className="text-xs mt-2">{item.month}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CustomerRetentionCard({ data }) {
  const total = data.newCustomers + data.returningCustomers
  const newPercentage = (data.newCustomers / total) * 100
  const returningPercentage = (data.returningCustomers / total) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fidélisation des clients</CardTitle>
        <CardDescription>Répartition entre nouveaux clients et clients fidèles</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <div>
              <div className="text-sm font-medium">Nouveaux clients</div>
              <div className="text-2xl font-bold">{data.newCustomers}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Clients fidèles</div>
              <div className="text-2xl font-bold">{data.returningCustomers}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Taux d'attrition</div>
              <div className="text-2xl font-bold">{data.churnRate}%</div>
            </div>
          </div>

          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500" style={{ width: `${newPercentage}%`, float: "left" }}></div>
            <div className="h-full bg-green-500" style={{ width: `${returningPercentage}%`, float: "left" }}></div>
          </div>

          <div className="flex justify-between text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span>Nouveaux ({newPercentage.toFixed(1)}%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>Fidèles ({returningPercentage.toFixed(1)}%)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

async function AnalyticsContent() {
  const data = await fetchAnalyticsData()

  return (
    <div className="space-y-6">
      <OverviewCards data={data.overview} />

      <Tabs defaultValue="sales">
        <TabsList className="mb-4">
          <TabsTrigger value="sales">Ventes</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="products">Produits</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Chiffre d'affaires mensuel</CardTitle>
                <CardDescription>Évolution du chiffre d'affaires sur les 5 derniers mois</CardDescription>
              </CardHeader>
              <CardContent>
                <MonthlyRevenueChart data={data.monthlyRevenue} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ventes par catégorie</CardTitle>
                <CardDescription>Répartition des ventes par catégorie de produits</CardDescription>
              </CardHeader>
              <CardContent>
                <SalesByCategoryTable data={data.salesByCategory} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Ventes par région</CardTitle>
              <CardDescription>Répartition géographique des ventes</CardDescription>
            </CardHeader>
            <CardContent>
              <SalesByRegionTable data={data.salesByRegion} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Croissance des utilisateurs</CardTitle>
                <CardDescription>Évolution du nombre d'utilisateurs sur les 5 derniers mois</CardDescription>
              </CardHeader>
              <CardContent>
                <UserGrowthChart data={data.userGrowth} />
              </CardContent>
            </Card>

            <CustomerRetentionCard data={data.customerRetention} />
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Produits les plus vendus</CardTitle>
              <CardDescription>Les 5 produits générant le plus de ventes</CardDescription>
            </CardHeader>
            <CardContent>
              <TopSellingProductsTable data={data.topSellingProducts} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Analyses & Rapports</h1>
      </div>
      <Suspense fallback={<div>Chargement des données...</div>}>
        <AnalyticsContent />
      </Suspense>
    </div>
  )
}
