import { NextResponse } from "next/server"

// Données de test pour les commandes et paiements
const ordersData = {
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
    {
      id: "ORD-1003",
      date: "2023-05-16T09:15:00Z",
      customer: "Pierre Dubois",
      total: 56.2,
      status: "Shipped",
      paymentMethod: "Carte bancaire",
      paymentStatus: "Paid",
    },
    {
      id: "ORD-1004",
      date: "2023-05-16T16:30:00Z",
      customer: "Sophie Bernard",
      total: 210.0,
      status: "Pending",
      paymentMethod: "Virement bancaire",
      paymentStatus: "Pending",
    },
    {
      id: "ORD-1005",
      date: "2023-05-17T11:20:00Z",
      customer: "Lucas Petit",
      total: 45.9,
      status: "Cancelled",
      paymentMethod: "Carte bancaire",
      paymentStatus: "Refunded",
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
    {
      id: "PS-002",
      name: "PayPal",
      status: "Operational",
      lastChecked: "2023-05-17T18:00:00Z",
      transactionsToday: 28,
      volumeToday: 2145.5,
    },
    {
      id: "PS-003",
      name: "Bank Transfer",
      status: "Operational",
      lastChecked: "2023-05-17T18:00:00Z",
      transactionsToday: 5,
      volumeToday: 1250.0,
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
    {
      id: "ISS-002",
      orderId: "ORD-1004",
      description: "Virement en attente depuis plus de 24h",
      date: "2023-05-17T10:15:00Z",
      status: "Pending",
    },
  ],
}

export async function GET() {
  // Simuler un délai de réseau
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json(ordersData)
}
