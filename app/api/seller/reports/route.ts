import { NextResponse } from "next/server"

const reportsData = {
  salesSummary: {
    totalRevenue: 156800,
    totalOrders: 89,
    averageOrderValue: 1762,
    topSellingProduct: "Tomates Bio",
    period: "30 derniers jours",
  },
  dailySales: [
    { date: "2024-01-15", revenue: 8900, orders: 5 },
    { date: "2024-01-16", revenue: 12400, orders: 7 },
    { date: "2024-01-17", revenue: 15600, orders: 9 },
    { date: "2024-01-18", revenue: 9800, orders: 6 },
    { date: "2024-01-19", revenue: 18200, orders: 11 },
    { date: "2024-01-20", revenue: 22100, orders: 13 },
    { date: "2024-01-21", revenue: 16800, orders: 10 },
    { date: "2024-01-22", revenue: 19400, orders: 12 },
  ],
  productPerformance: [
    {
      id: "1",
      name: "Tomates Bio",
      revenue: 45000,
      orders: 25,
      quantity: 180,
      unit: "kg",
      growth: 12.5,
    },
    {
      id: "2",
      name: "Carottes",
      revenue: 32000,
      orders: 18,
      quantity: 178,
      unit: "kg",
      growth: 8.2,
    },
    {
      id: "3",
      name: "Pommes de Terre",
      revenue: 28000,
      orders: 15,
      quantity: 233,
      unit: "kg",
      growth: -2.1,
    },
    {
      id: "4",
      name: "Salade Verte",
      revenue: 18000,
      orders: 10,
      quantity: 225,
      unit: "pièce",
      growth: 15.3,
    },
  ],
  customerInsights: {
    newCustomers: 12,
    returningCustomers: 28,
    customerRetentionRate: 68.5,
    averageCustomerValue: 3890,
  },
}

export async function GET() {
  try {
    return NextResponse.json(reportsData)
  } catch (error) {
    console.error("Erreur lors du chargement des rapports:", error)
    return NextResponse.json({ error: "Erreur lors du chargement des rapports" }, { status: 500 })
  }
}
