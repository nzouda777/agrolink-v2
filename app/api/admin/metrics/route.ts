import { NextResponse } from "next/server"

export async function GET() {
  // Ces données seraient normalement récupérées depuis une base de données
  const adminMetrics = {
    platformMetrics: {
      totalUsers: 15847,
      activeUsers: 12456,
      totalSellers: 2341,
      activeSellers: 1987,
      totalBuyers: 13506,
      activeBuyers: 10469,
      totalProducts: 8934,
      activeProducts: 7821,
      pendingProducts: 156,
      totalOrders: 45678,
      pendingOrders: 234,
      completedOrders: 43891,
      totalRevenue: 2847593.45,
      monthlyRevenue: 234567.89,
      averageOrderValue: 62.34,
    },
    moderationQueue: [
      {
        id: "mod_001",
        type: "product",
        title: "Tomates biologiques fraîches",
        sellerId: "seller_123",
        sellerName: "Ferme Martin",
        submittedAt: "2024-01-15T10:30:00Z",
        priority: "high",
        reason: "Automatic flagging - price verification needed",
      },
      {
        id: "mod_002",
        type: "user",
        title: "Compte utilisateur suspect",
        userId: "user_456",
        userName: "Jean Dupont",
        submittedAt: "2024-01-15T09:15:00Z",
        priority: "medium",
        reason: "Multiple failed payment attempts",
      },
      {
        id: "mod_003",
        type: "review",
        title: "Avis inapproprié signalé",
        productId: "prod_789",
        productName: "Pommes de terre nouvelles",
        reviewerId: "user_321",
        submittedAt: "2024-01-15T08:45:00Z",
        priority: "low",
        reason: "Inappropriate language reported",
      },
    ],
    systemStatus: {
      apiStatus: "operational",
      databaseStatus: "operational",
      paymentGateway: "operational",
      emailService: "degraded",
      storageService: "operational",
      lastBackup: "2024-01-15T02:00:00Z",
      uptime: "99.97%",
      responseTime: "245ms",
    },
    recentActivity: [
      {
        id: "act_001",
        type: "user_registration",
        description: "Nouvel utilisateur inscrit",
        timestamp: "2024-01-15T11:30:00Z",
        details: "Marie Dubois - Acheteur",
      },
      {
        id: "act_002",
        type: "product_approval",
        description: "Produit approuvé",
        timestamp: "2024-01-15T11:15:00Z",
        details: "Carottes bio - Ferme Leclerc",
      },
      {
        id: "act_003",
        type: "order_completed",
        description: "Commande terminée",
        timestamp: "2024-01-15T11:00:00Z",
        details: "Commande #12345 - 89.50€",
      },
    ],
  }

  return NextResponse.json(adminMetrics)
}
