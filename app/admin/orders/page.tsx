import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, CheckCircle2, Clock } from "lucide-react"

// Données de secours en cas d'erreur
const fallbackData = {
  orders: [
    {
      id: "ORD-1001",
      date: "2023-05-15T10:30:00Z",
      customer: "Jean Dupont",
      total: 89.5,
      status: "Completed",
      paymentMethod: "Carte bancaire",
      paymentStatus: "Paid",
    },
    {
      id: "ORD-1002",
      date: "2023-05-15T14:45:00Z",
      customer: "Marie Martin",
      total: 124.75,
      status: "Processing",
      paymentMethod: "PayPal",
      paymentStatus: "Paid",
    },
  ],
  paymentSystems: [
    {
      id: "PS-001",
      name: "Stripe",
      status: "Operational",
      lastChecked: "2023-05-17T18:00:00Z",
      transactionsToday: 42,
      volumeToday: 3567.8,
    },
  ],
  recentIssues: [
    {
      id: "ISS-001",
      orderId: "ORD-998",
      description: "Paiement refusé - fonds insuffisants",
      date: "2023-05-17T14:30:00Z",
      status: "Resolved",
    },
  ],
}

async function fetchOrdersData() {
  try {
    // Utiliser directement l'URL relative pour l'API
    const response = await fetch("/api/admin/orders", {
      cache: "no-store",
      next: { revalidate: 0 },
    })

    if (!response.ok) {
      console.error(`Erreur HTTP: ${response.status}`)
      return fallbackData
    }

    return await response.json()
  } catch (error) {
    console.error("Erreur lors du chargement des données:", error)
    // Retourner des données de secours en cas d'erreur
    return fallbackData
  }
}

function OrderStatusBadge({ status }) {
  const statusConfig = {
    Completed: { color: "bg-green-100 text-green-800", icon: CheckCircle2 },
    Processing: { color: "bg-blue-100 text-blue-800", icon: Clock },
    Shipped: { color: "bg-purple-100 text-purple-800", icon: null },
    Pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
    Cancelled: { color: "bg-red-100 text-red-800", icon: AlertCircle },
  }

  const config = statusConfig[status] || { color: "bg-gray-100 text-gray-800", icon: null }
  const Icon = config.icon

  return (
    <Badge className={`${config.color} flex items-center gap-1`}>
      {Icon && <Icon size={14} />}
      {status}
    </Badge>
  )
}

function PaymentStatusBadge({ status }) {
  const statusConfig = {
    Paid: { color: "bg-green-100 text-green-800" },
    Pending: { color: "bg-yellow-100 text-yellow-800" },
    Refunded: { color: "bg-blue-100 text-blue-800" },
    Failed: { color: "bg-red-100 text-red-800" },
  }

  const config = statusConfig[status] || { color: "bg-gray-100 text-gray-800" }

  return <Badge className={config.color}>{status}</Badge>
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

function OrdersTable({ orders }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Paiement</TableHead>
            <TableHead>Statut paiement</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{formatDate(order.date)}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>{order.total.toFixed(2)} FCFA</TableCell>
              <TableCell>
                <OrderStatusBadge status={order.status} />
              </TableCell>
              <TableCell>{order.paymentMethod}</TableCell>
              <TableCell>
                <PaymentStatusBadge status={order.paymentStatus} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function PaymentSystemsTable({ systems }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Système</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Dernière vérification</TableHead>
            <TableHead>Transactions aujourd'hui</TableHead>
            <TableHead>Volume aujourd'hui</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {systems.map((system) => (
            <TableRow key={system.id}>
              <TableCell className="font-medium">{system.name}</TableCell>
              <TableCell>
                <Badge
                  className={
                    system.status === "Operational" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }
                >
                  {system.status}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(system.lastChecked)}</TableCell>
              <TableCell>{system.transactionsToday}</TableCell>
              <TableCell>{system.volumeToday.toFixed(2)} FCFA</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function RecentIssuesTable({ issues }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Commande</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issues.map((issue) => (
            <TableRow key={issue.id}>
              <TableCell className="font-medium">{issue.id}</TableCell>
              <TableCell>{issue.orderId}</TableCell>
              <TableCell>{issue.description}</TableCell>
              <TableCell>{formatDate(issue.date)}</TableCell>
              <TableCell>
                <Badge
                  className={
                    issue.status === "Resolved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }
                >
                  {issue.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

async function OrdersContent() {
  const data = await fetchOrdersData()

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Commandes totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.orders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En cours de traitement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.orders.filter((order) => order.status === "Processing" || order.status === "Pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Problèmes de paiement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.recentIssues.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders">
        <TabsList className="mb-4">
          <TabsTrigger value="orders">Commandes</TabsTrigger>
          <TabsTrigger value="payment-systems">Systèmes de paiement</TabsTrigger>
          <TabsTrigger value="issues">Problèmes récents</TabsTrigger>
        </TabsList>
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Toutes les commandes</CardTitle>
              <CardDescription>Vue d'ensemble de toutes les commandes sur la plateforme</CardDescription>
            </CardHeader>
            <CardContent>
              <OrdersTable orders={data.orders} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payment-systems" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Systèmes de paiement</CardTitle>
              <CardDescription>Statut et performance des systèmes de paiement</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentSystemsTable systems={data.paymentSystems} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="issues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Problèmes récents</CardTitle>
              <CardDescription>Problèmes de paiement récents nécessitant une attention</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentIssuesTable issues={data.recentIssues} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function OrdersPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Commandes & Paiements</h1>
      </div>
      <Suspense fallback={<div>Chargement des données...</div>}>
        <OrdersContent />
      </Suspense>
    </div>
  )
}
