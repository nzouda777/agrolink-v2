import type React from "react"
import { BarChart, ShoppingCart, FileText, Users, CreditCard, Crown, User, Home } from "lucide-react"

interface SidebarLink {
  title: string
  url: string
  icon: React.ComponentType
}

export function SellerSidebar() {
  const navigationLinks: SidebarLink[] = [
    {
      title: "Accueil",
      url: "/seller/dashboard",
      icon: Home,
    },
    {
      title: "Analyses",
      url: "/seller/analytics",
      icon: BarChart,
    },
    {
      title: "Produits",
      url: "/seller/products",
      icon: ShoppingCart,
    },
    {
      title: "Inventaires",
      url: "/seller/inventory",
      icon: ShoppingCart,
    },
    {
      title: "Commandes",
      url: "/seller/orders",
      icon: ShoppingCart,
    },
    {
      title: "Rapports",
      url: "/seller/reports",
      icon: FileText,
    },
    {
      title: "Clients",
      url: "/seller/customers",
      icon: Users,
    },
    {
      title: "Paiements",
      url: "/seller/payments",
      icon: CreditCard,
    },
    {
      title: "Abonnement",
      url: "/seller/subscription",
      icon: Crown,
    },
    {
      title: "Profil",
      url: "/seller/profile",
      icon: User,
    },
  ]

  return (
    <div className="bg-gray-100 p-4 w-64">
      <h2 className="text-lg font-semibold mb-4">Seller Dashboard</h2>
      <ul>
        {navigationLinks.map((link) => (
          <li key={link.title} className="mb-2">
            <a href={link.url} className="flex items-center text-gray-700 hover:text-blue-500">
              <link.icon className="mr-2 h-4 w-4" />
              {link.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
