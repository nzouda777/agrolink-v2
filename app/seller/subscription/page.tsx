"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Check, Crown, Star, Zap, Shield, Users, Calendar } from "lucide-react"

interface SubscriptionPlan {
  id: string
  name: string
  price: number
  currency: string
  interval: string
  features: string[]
  isPopular?: boolean
  maxProducts: number
  maxOrders: number
  commission: number
}

interface CurrentSubscription {
  planId: string
  planName: string
  status: "active" | "expired" | "cancelled"
  startDate: string
  endDate: string
  autoRenew: boolean
  usage: {
    products: number
    orders: number
    maxProducts: number
    maxOrders: number
  }
}

export default function SubscriptionPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [currentSubscription, setCurrentSubscription] = useState<CurrentSubscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState<string | null>(null)

  useEffect(() => {
    fetchSubscriptionData()
  }, [])

  const fetchSubscriptionData = async () => {
    try {
      const [plansRes, subscriptionRes] = await Promise.all([
        fetch("/api/seller/subscription/plans"),
        fetch("/api/seller/subscription/current"),
      ])

      if (plansRes.ok && subscriptionRes.ok) {
        const plansData = await plansRes.json()
        const subscriptionData = await subscriptionRes.json()
        setPlans(plansData)
        setCurrentSubscription(subscriptionData)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données d'abonnement:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async (planId: string) => {
    setUpgrading(planId)
    try {
      const response = await fetch("/api/seller/subscription/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      })

      if (response.ok) {
        await fetchSubscriptionData()
      }
    } catch (error) {
      console.error("Erreur lors de la mise à niveau:", error)
    } finally {
      setUpgrading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    )
  }

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case "gratuit":
        return <Users className="h-6 w-6" />
      case "standard":
        return <Star className="h-6 w-6" />
      case "premium":
        return <Crown className="h-6 w-6" />
      case "enterprise":
        return <Zap className="h-6 w-6" />
      default:
        return <Shield className="h-6 w-6" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Abonnement</h1>
        <p className="text-muted-foreground">Gérez votre abonnement et découvrez nos plans</p>
      </div>

      <Tabs defaultValue="current" className="space-y-6">
        <TabsList>
          <TabsTrigger value="current">Abonnement Actuel</TabsTrigger>
          <TabsTrigger value="plans">Plans Disponibles</TabsTrigger>
          <TabsTrigger value="billing">Facturation</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-6">
          {currentSubscription && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getPlanIcon(currentSubscription.planName)}
                    <div>
                      <CardTitle>Plan {currentSubscription.planName}</CardTitle>
                      <CardDescription>
                        Actif jusqu'au {new Date(currentSubscription.endDate).toLocaleDateString("fr-FR")}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={currentSubscription.status === "active" ? "default" : "destructive"}>
                    {currentSubscription.status === "active" ? "Actif" : "Expiré"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Produits utilisés</span>
                        <span>
                          {currentSubscription.usage.products}/{currentSubscription.usage.maxProducts}
                        </span>
                      </div>
                      <Progress
                        value={(currentSubscription.usage.products / currentSubscription.usage.maxProducts) * 100}
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Commandes ce mois</span>
                        <span>
                          {currentSubscription.usage.orders}/{currentSubscription.usage.maxOrders}
                        </span>
                      </div>
                      <Progress
                        value={(currentSubscription.usage.orders / currentSubscription.usage.maxOrders) * 100}
                        className="h-2"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Renouvellement automatique</span>
                      <Badge variant={currentSubscription.autoRenew ? "default" : "secondary"}>
                        {currentSubscription.autoRenew ? "Activé" : "Désactivé"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Date de début</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(currentSubscription.startDate).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className={`relative ${plan.isPopular ? "border-primary" : ""}`}>
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Plus Populaire</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">{getPlanIcon(plan.name)}</div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold">
                    {plan.price === 0 ? "Gratuit" : `${plan.price.toLocaleString()} ${plan.currency}`}
                    {plan.price > 0 && (
                      <span className="text-sm font-normal text-muted-foreground">/{plan.interval}</span>
                    )}
                  </div>
                  <CardDescription>Commission: {plan.commission}%</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Produits max</span>
                      <span className="font-medium">{plan.maxProducts === -1 ? "Illimité" : plan.maxProducts}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Commandes/mois</span>
                      <span className="font-medium">{plan.maxOrders === -1 ? "Illimité" : plan.maxOrders}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    className="w-full"
                    variant={plan.isPopular ? "default" : "outline"}
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={upgrading === plan.id || currentSubscription?.planId === plan.id}
                  >
                    {upgrading === plan.id ? (
                      <LoadingSpinner className="h-4 w-4" />
                    ) : currentSubscription?.planId === plan.id ? (
                      "Plan Actuel"
                    ) : plan.price === 0 ? (
                      "Commencer Gratuitement"
                    ) : (
                      "Choisir ce Plan"
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Historique de Facturation</span>
              </CardTitle>
              <CardDescription>Consultez vos factures et paiements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { date: "2024-01-01", amount: 15000, status: "Payé", invoice: "INV-2024-001" },
                  { date: "2023-12-01", amount: 15000, status: "Payé", invoice: "INV-2023-012" },
                  { date: "2023-11-01", amount: 15000, status: "Payé", invoice: "INV-2023-011" },
                ].map((bill, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{bill.invoice}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(bill.date).toLocaleDateString("fr-FR")}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{bill.amount.toLocaleString()} XOF</div>
                      <Badge variant={bill.status === "Payé" ? "default" : "destructive"}>{bill.status}</Badge>
                    </div>
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
