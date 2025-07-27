import { NextResponse } from "next/server"

const currentSubscription = {
  planId: "standard",
  planName: "Standard",
  status: "active",
  startDate: "2024-01-01T00:00:00Z",
  endDate: "2024-02-01T00:00:00Z",
  autoRenew: true,
  usage: {
    products: 12,
    orders: 45,
    maxProducts: 50,
    maxOrders: 100,
  },
}

export async function GET() {
  try {
    return NextResponse.json(currentSubscription)
  } catch (error) {
    console.error("Erreur lors du chargement de l'abonnement:", error)
    return NextResponse.json({ error: "Erreur lors du chargement de l'abonnement" }, { status: 500 })
  }
}
