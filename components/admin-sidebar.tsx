"use client"

import { BarChart3, Settings, Users, ShoppingCart, Home, Shield } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const adminNavItems = [
  {
    title: "Vue d'ensemble",
    items: [
      {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: Home,
      },
    ],
  },
  {
    title: "Gestion",
    items: [
      {
        title: "Utilisateurs & Contenu",
        url: "/admin/management",
        icon: Users,
      },
      {
        title: "Commandes & Paiements",
        url: "/admin/orders",
        icon: ShoppingCart,
      },
    ],
  },
  {
    title: "Analyses",
    items: [
      {
        title: "Analytics & Rapports",
        url: "/admin/analytics",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Configuration",
    items: [
      {
        title: "Paramètres Système",
        url: "/admin/settings",
        icon: Settings,
      },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <Shield className="h-6 w-6 text-red-600" />
          <span className="font-bold text-lg">Admin AgroLink</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {adminNavItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
