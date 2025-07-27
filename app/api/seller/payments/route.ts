import { NextResponse } from "next/server"

const paymentsData = {
  overview: {
    totalEarnings: 156800,
    pendingPayments: 12400,
    thisMonthEarnings: 45600,
    lastPaymentDate: "2024-01-20T10:00:00Z",
  },
  recentPayments: [
    {
      id: "pay_001",
      amount: 15600,
      status: "completed",
      date: "2024-01-20T10:00:00Z",
      method: "bank_transfer",
      orderId: "ORD-001",
      customerName: "Marie Dubois",
    },
    {
      id: "pay_002",
      amount: 8900,
      status: "pending",
      date: "2024-01-19T14:30:00Z",
      method: "mobile_money",
      orderId: "ORD-002",
      customerName: "Amadou Ba",
    },
    {
      id: "pay_003",
      amount: 22400,
      status: "completed",
      date: "2024-01-18T09:15:00Z",
      method: "bank_transfer",
      orderId: "ORD-003",
      customerName: "Fatou Sall",
    },
  ],
  paymentMethods: [
    {
      id: "bank_001",
      type: "bank_transfer",
      name: "Compte Bancaire Principal",
      details: "CBAO - ****1234",
      isDefault: true,
      status: "active",
    },
    {
      id: "mobile_001",
      type: "mobile_money",
      name: "Orange Money",
      details: "+221 77 123 45 67",
      isDefault: false,
      status: "active",
    },
  ],
}

export async function GET() {
  try {
    return NextResponse.json(paymentsData)
  } catch (error) {
    console.error("Erreur lors du chargement des paiements:", error)
    return NextResponse.json({ error: "Erreur lors du chargement des paiements" }, { status: 500 })
  }
}
