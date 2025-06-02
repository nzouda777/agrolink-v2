import { NextResponse } from "next/server"

// Données de test pour les analyses
const analyticsData = {
  overview: {
    totalUsers: 5842,
    totalSellers: 245,
    totalProducts: 3678,
    totalOrders: 12459,
    totalRevenue: 875420.5,
    averageOrderValue: 70.26,
  },
  userGrowth: [
    { month: "Jan", users: 4250 },
    { month: "Feb", users: 4580 },
    { month: "Mar", users: 4890 },
    { month: "Apr", users: 5320 },
    { month: "May", users: 5842 },
  ],
  salesByCategory: [
    { category: "Fruits", sales: 245680.5 },
    { category: "Légumes", sales: 312450.75 },
    { category: "Produits laitiers", sales: 156780.25 },
    { category: "Viandes", sales: 98540.5 },
    { category: "Autres", sales: 61968.5 },
  ],
  salesByRegion: [
    { region: "Île-de-France", sales: 245680.5 },
    { region: "Auvergne-Rhône-Alpes", sales: 198450.75 },
    { region: "Nouvelle-Aquitaine", sales: 156780.25 },
    { region: "Occitanie", sales: 128540.5 },
    { region: "Hauts-de-France", sales: 85968.5 },
    { region: "Autres régions", sales: 60000.0 },
  ],
  monthlyRevenue: [
    { month: "Jan", revenue: 156420.5 },
    { month: "Feb", revenue: 165780.25 },
    { month: "Mar", revenue: 178450.75 },
    { month: "Apr", revenue: 185680.5 },
    { month: "May", revenue: 189088.5 },
  ],
  topSellingProducts: [
    { name: "Pommes Bio", sales: 12450, revenue: 24900.0 },
    { name: "Tomates Cerises", sales: 10580, revenue: 21160.0 },
    { name: "Fromage de Chèvre", sales: 8750, revenue: 26250.0 },
    { name: "Carottes Bio", sales: 7890, revenue: 15780.0 },
    { name: "Miel de Montagne", sales: 6540, revenue: 32700.0 },
  ],
  customerRetention: {
    newCustomers: 1245,
    returningCustomers: 3580,
    churnRate: 5.2,
  },
}

export async function GET() {
  // Simuler un délai de réseau
  await new Promise((resolve) => setTimeout(resolve, 800))

  return NextResponse.json(analyticsData)
}
