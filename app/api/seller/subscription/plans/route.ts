import { NextResponse } from "next/server"

const subscriptionPlans = [
  {
    id: "free",
    name: "Gratuit",
    price: 0,
    currency: "XOF",
    interval: "mois",
    maxProducts: 5,
    maxOrders: 10,
    commission: 15,
    features: ["5 produits maximum", "10 commandes par mois", "Support par email", "Tableau de bord basique"],
  },
  {
    id: "standard",
    name: "Standard",
    price: 15000,
    currency: "XOF",
    interval: "mois",
    maxProducts: 50,
    maxOrders: 100,
    commission: 10,
    isPopular: true,
    features: [
      "50 produits maximum",
      "100 commandes par mois",
      "Support prioritaire",
      "Analytics avancées",
      "Promotion des produits",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 35000,
    currency: "XOF",
    interval: "mois",
    maxProducts: 200,
    maxOrders: 500,
    commission: 7,
    features: [
      "200 produits maximum",
      "500 commandes par mois",
      "Support téléphonique",
      "Analytics complètes",
      "Marketing automatisé",
      "API access",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 75000,
    currency: "XOF",
    interval: "mois",
    maxProducts: -1,
    maxOrders: -1,
    commission: 5,
    features: [
      "Produits illimités",
      "Commandes illimitées",
      "Support dédié",
      "Analytics personnalisées",
      "Intégrations personnalisées",
      "Formation incluse",
    ],
  },
]

export async function GET() {
  try {
    return NextResponse.json(subscriptionPlans)
  } catch (error) {
    console.error("Erreur lors du chargement des plans:", error)
    return NextResponse.json({ error: "Erreur lors du chargement des plans" }, { status: 500 })
  }
}
