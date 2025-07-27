import { NextResponse } from "next/server"

const subscriptionData = {
  currentPlan: {
    id: "premium",
    name: "Premium",
    price: 15000,
    billingCycle: "monthly",
    features: ["Produits illimités", "Analytics avancées", "Support prioritaire", "Outils marketing", "API access"],
    nextBillingDate: "2024-02-22T00:00:00Z",
    status: "active",
  },
  usage: {
    productsUsed: 15,
    productsLimit: -1, // illimité
    ordersThisMonth: 38,
    ordersLimit: -1,
    storageUsed: 2.4, // GB
    storageLimit: 10,
  },
  availablePlans: [
    {
      id: "basic",
      name: "Basic",
      price: 5000,
      billingCycle: "monthly",
      features: ["Jusqu'à 10 produits", "Analytics de base", "Support email"],
      recommended: false,
    },
    {
      id: "premium",
      name: "Premium",
      price: 15000,
      billingCycle: "monthly",
      features: ["Produits illimités", "Analytics avancées", "Support prioritaire", "Outils marketing", "API access"],
      recommended: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 35000,
      billingCycle: "monthly",
      features: ["Tout du Premium", "Support dédié", "Intégrations personnalisées", "Formation incluse"],
      recommended: false,
    },
  ],
  billingHistory: [
    {
      id: "inv_001",
      date: "2024-01-22T00:00:00Z",
      amount: 15000,
      status: "paid",
      plan: "Premium",
      period: "Jan 2024",
    },
    {
      id: "inv_002",
      date: "2023-12-22T00:00:00Z",
      amount: 15000,
      status: "paid",
      plan: "Premium",
      period: "Déc 2023",
    },
  ],
}

export async function GET() {
  try {
    return NextResponse.json(subscriptionData)
  } catch (error) {
    console.error("Erreur lors du chargement de l'abonnement:", error)
    return NextResponse.json({ error: "Erreur lors du chargement de l'abonnement" }, { status: 500 })
  }
}
