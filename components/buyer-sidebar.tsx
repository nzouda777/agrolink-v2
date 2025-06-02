"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ShoppingBag, Heart, MessageSquare, User, Bell, Menu, X } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { useFavorites } from "@/contexts/favorites-context"

export function BuyerSidebar() {
  const pathname = usePathname()
  const { items = [] } = useCart() || {}
  const { favorites = [] } = useFavorites() || {}
  const [unreadMessages, setUnreadMessages] = useState(3)
  const [notifications, setNotifications] = useState(5)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const menuItems = [
    {
      title: "Tableau de bord",
      icon: Home,
      href: "/buyer/dashboard",
      badge: null,
    },
    {
      title: "Commandes",
      icon: ShoppingBag,
      href: "/buyer/orders",
      badge: items && items.length > 0 ? items.length : null,
    },
    {
      title: "Favoris",
      icon: Heart,
      href: "/buyer/favorites",
      badge: favorites && favorites.length > 0 ? favorites.length : null,
    },
    {
      title: "Messages",
      icon: MessageSquare,
      href: "/buyer/messages",
      badge: unreadMessages > 0 ? unreadMessages : null,
    },
    {
      title: "Profil",
      icon: User,
      href: "/buyer/profile",
      badge: null,
    },
    {
      title: "Notifications",
      icon: Bell,
      href: "/buyer/notifications",
      badge: notifications > 0 ? notifications : null,
    },
  ]

  // Mobile menu
  const MobileMenu = () => (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="z-50">
        {isMobileMenuOpen ? <X /> : <Menu />}
      </Button>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm">
          <div className="flex flex-col p-6 space-y-4 mt-16">
            {menuItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between p-3 rounded-md ${
                  pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </div>
                {item.badge && <Badge variant="secondary">{item.badge}</Badge>}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <>
      <MobileMenu />

      <div className="hidden md:block">
        <SidebarProvider>
          <Sidebar variant="floating" className="border-r">
            <SidebarHeader className="p-4">
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">Acheteur</h3>
                  <p className="text-xs text-muted-foreground">Compte Premium</p>
                </div>
              </div>
            </SidebarHeader>

            <SidebarContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                      <Link href={item.href}>
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    {item.badge && (
                      <Badge variant="secondary" className="absolute right-2 top-1/2 -translate-y-1/2">
                        {item.badge}
                      </Badge>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className="p-4">
              <Button variant="outline" className="w-full">
                <Link href="/" className="w-full flex items-center justify-center">
                  Retour à la boutique
                </Link>
              </Button>
            </SidebarFooter>

            <SidebarTrigger className="absolute right-0 top-4 translate-x-1/2" />
          </Sidebar>
        </SidebarProvider>
      </div>
    </>
  )
}
