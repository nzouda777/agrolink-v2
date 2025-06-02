import { NextResponse } from "next/server"

// Données de test pour les paramètres système
const settingsData = {
  general: {
    siteName: "AgroLink",
    siteDescription: "Plateforme de mise en relation entre agriculteurs et acheteurs",
    contactEmail: "contact@agrolink.com",
    supportPhone: "+33 1 23 45 67 89",
    maintenanceMode: false,
    registrationOpen: true,
  },
  roles: [
    {
      id: "role-001",
      name: "Admin",
      description: "Accès complet à toutes les fonctionnalités",
      permissions: ["all"],
      userCount: 3,
    },
    {
      id: "role-002",
      name: "Modérateur",
      description: "Peut modérer le contenu et les utilisateurs",
      permissions: ["moderate_content", "moderate_users", "view_reports"],
      userCount: 8,
    },
    {
      id: "role-003",
      name: "Support",
      description: "Peut aider les utilisateurs et voir les commandes",
      permissions: ["view_orders", "view_users", "respond_to_support"],
      userCount: 12,
    },
  ],
  subscriptionPlans: [
    {
      id: "plan-001",
      name: "Basique",
      price: 0,
      description: "Plan gratuit pour les petits producteurs",
      features: ["Jusqu'à 10 produits", "Accès aux statistiques de base", "Support par email"],
      userCount: 156,
    },
    {
      id: "plan-002",
      name: "Pro",
      price: 29.99,
      description: "Pour les producteurs en croissance",
      features: ["Produits illimités", "Statistiques avancées", "Support prioritaire", "Mise en avant des produits"],
      userCount: 78,
    },
    {
      id: "plan-003",
      name: "Enterprise",
      price: 99.99,
      description: "Pour les grandes exploitations",
      features: [
        "Produits illimités",
        "Statistiques avancées",
        "Support dédié",
        "Mise en avant des produits",
        "API d'intégration",
        "Gestion multi-utilisateurs",
      ],
      userCount: 11,
    },
  ],
  paymentGateways: [
    {
      id: "gateway-001",
      name: "Stripe",
      enabled: true,
      testMode: false,
    },
    {
      id: "gateway-002",
      name: "PayPal",
      enabled: true,
      testMode: false,
    },
    {
      id: "gateway-003",
      name: "Virement bancaire",
      enabled: true,
      testMode: false,
    },
  ],
  emailSettings: {
    provider: "SendGrid",
    fromEmail: "noreply@agrolink.com",
    replyToEmail: "support@agrolink.com",
    templatesEnabled: true,
  },
  securitySettings: {
    twoFactorAuthRequired: false,
    passwordMinLength: 8,
    passwordRequiresSpecialChars: true,
    sessionTimeout: 60,
  },
}

export async function GET() {
  // Simuler un délai de réseau
  await new Promise((resolve) => setTimeout(resolve, 600))

  return NextResponse.json(settingsData)
}
