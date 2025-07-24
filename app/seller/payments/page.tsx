"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, CreditCard, Clock, CheckCircle, Plus, Edit, Trash2 } from "lucide-react"

interface PaymentData {
  overview: {
    totalEarnings: number
    pendingPayments: number
    thisMonthEarnings: number
    lastPaymentDate: string
  }
  recentPayments: Array<{
    id: string
    amount: number
    status: "completed" | "pending" | "failed"
    date: string
    method: string
    orderId: string
    customerName: string
  }>
  paymentMethods: Array<{
    id: string
    type: "bank_transfer" | "mobile_money"
    name: string
    details: string
    isDefault: boolean
    status: "active" | "inactive"
  }>
}

async function fetchPayments(): Promise<PaymentData> {
  try {
    const response = await fetch("/api/seller/payments", {
      next: { revalidate: 0 },
    })

    if (!response.ok) {
      throw new Error("Erreur lors du chargement des paiements")
    }

    return await response.json()
  } catch (error) {
    console.error("Erreur lors du chargement des paiements:", error)
    return {
      overview: {
        totalEarnings: 156800,
        pendingPayments: 12400,
        thisMonthEarnings: 45600,
        lastPaymentDate: "2024-01-20T10:00:00Z",
      },
      recentPayments: [],
      paymentMethods: [],
    }
  }
}

function PaymentsContent({ data }: { data: PaymentData }) {
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
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Complété
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            En attente
          </Badge>
        )
      case "failed":
        return <Badge variant="destructive">Échec</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getMethodIcon = (type: string) => {
    switch (type) {
      case "bank_transfer":
        return <CreditCard className="h-4 w-4" />
      case "mobile_money":
        return <DollarSign className="h-4 w-4" />
      default:
        return <CreditCard className="h-4 w-4" />
    }
  }

  const getMethodName = (type: string) => {
    switch (type) {
      case "bank_transfer":
        return "Virement Bancaire"
      case "mobile_money":
        return "Mobile Money"
      default:
        return type
    }
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Gestion des Paiements</h1>
      </header>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gains Totaux</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(data.overview.totalEarnings)}</div>
              <p className="text-xs text-muted-foreground">Depuis le début</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paiements en Attente</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{formatCurrency(data.overview.pendingPayments)}</div>
              <p className="text-xs text-muted-foreground">À recevoir</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ce Mois</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(data.overview.thisMonthEarnings)}</div>
              <p className="text-xs text-muted-foreground">Janvier 2024</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dernier Paiement</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{formatDate(data.overview.lastPaymentDate)}</div>
              <p className="text-xs text-muted-foreground">Date du dernier versement</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="payments" className="space-y-4">
          <TabsList>
            <TabsTrigger value="payments">Historique des Paiements</TabsTrigger>
            <TabsTrigger value="methods">Méthodes de Paiement</TabsTrigger>
          </TabsList>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Paiements Récents</CardTitle>
                <CardDescription>Historique de vos derniers paiements reçus</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.recentPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-full bg-gray-100">
                          <DollarSign className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{formatCurrency(payment.amount)}</p>
                          <p className="text-sm text-muted-foreground">
                            Commande {payment.orderId} - {payment.customerName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {getMethodName(payment.method)} • {formatDate(payment.date)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">{getStatusBadge(payment.status)}</div>
                    </div>
                  ))}
                  {data.recentPayments.length === 0 && (
                    <div className="text-center py-8">
                      <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Aucun paiement récent</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="methods" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Méthodes de Paiement</h3>
                <p className="text-sm text-muted-foreground">Gérez vos comptes de réception des paiements</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une méthode
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {data.paymentMethods.map((method) => (
                <Card key={method.id} className={method.isDefault ? "border-primary" : ""}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-gray-100">{getMethodIcon(method.type)}</div>
                        <div>
                          <h4 className="font-medium">{method.name}</h4>
                          <p className="text-sm text-muted-foreground">{method.details}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {method.isDefault && (
                          <Badge variant="default" className="text-xs">
                            Par défaut
                          </Badge>
                        )}
                        <Badge
                          variant={method.status === "active" ? "default" : "secondary"}
                          className={method.status === "active" ? "bg-green-100 text-green-800 border-green-200" : ""}
                        >
                          {method.status === "active" ? "Actif" : "Inactif"}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                      {!method.isDefault && (
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {data.paymentMethods.length === 0 && (
                <Card className="md:col-span-2">
                  <CardContent className="py-12 text-center">
                    <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucune méthode de paiement</h3>
                    <p className="text-muted-foreground mb-4">
                      Ajoutez une méthode de paiement pour recevoir vos gains
                    </p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter votre première méthode
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function SellerPayments() {
  const [data, setData] = useState<PaymentData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPayments()
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
          <h1 className="text-lg font-semibold">Gestion des Paiements</h1>
        </header>
        <div className="flex-1 p-6">
          <div className="text-center">
            <p className="text-muted-foreground">Erreur lors du chargement des paiements</p>
          </div>
        </div>
      </div>
    )
  }

  return <PaymentsContent data={data} />
}
