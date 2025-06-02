"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import {
  ShoppingBag,
  Heart,
  MessageSquare,
  Package,
  Bell,
  ChevronRight,
  Star,
  Clock,
  Calendar,
  TrendingUp,
  Search,
  CheckCircle2,
  Truck,
  AlertCircle,
  Tag,
  MoreHorizontal,
  Trash2,
  CheckCheck,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ProductCard from "@/components/product-card"

// Types pour les notifications
type NotificationType = "order" | "delivery" | "message" | "promotion" | "system"
type NotificationStatus = "unread" | "read"
type NotificationPriority = "high" | "medium" | "low"

interface Notification {
  id: number
  type: NotificationType
  title: string
  message: string
  time: string
  date: string
  status: NotificationStatus
  priority: NotificationPriority
  link?: string
  sender?: {
    name: string
    avatar?: string
  }
}

// Données fictives pour les notifications
const notificationsData: Notification[] = [
  {
    id: 1,
    type: "order",
    title: "Commande confirmée",
    message: "Votre commande #12345 a été confirmée et est en cours de préparation.",
    time: "10:30",
    date: "Aujourd'hui",
    status: "unread",
    priority: "medium",
    link: "/buyer/orders/12345",
  },
  {
    id: 2,
    type: "delivery",
    title: "Livraison en cours",
    message: "Votre commande #12345 est en cours de livraison et arrivera aujourd'hui.",
    time: "09:15",
    date: "Aujourd'hui",
    status: "unread",
    priority: "high",
    link: "/buyer/orders/12345",
  },
  {
    id: 3,
    type: "message",
    title: "Nouveau message",
    message: "Ferme Durand a répondu à votre question concernant les tomates bio.",
    time: "Hier",
    date: "Hier",
    status: "read",
    priority: "medium",
    link: "/buyer/messages?seller=Ferme%20Durand",
    sender: {
      name: "Ferme Durand",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 4,
    type: "promotion",
    title: "Offre spéciale",
    message: "Profitez de 15% de réduction sur les fruits et légumes de saison jusqu'à dimanche.",
    time: "Lun",
    date: "Lundi",
    status: "read",
    priority: "low",
    link: "/products/category/fruits",
  },
]

// Icônes pour les types de notifications
const notificationIcons: Record<NotificationType, React.ReactNode> = {
  order: <ShoppingBag className="h-5 w-5" />,
  delivery: <Truck className="h-5 w-5" />,
  message: <MessageSquare className="h-5 w-5" />,
  promotion: <Tag className="h-5 w-5" />,
  system: <AlertCircle className="h-5 w-5" />,
}

// Couleurs pour les priorités
const priorityColors: Record<NotificationPriority, string> = {
  high: "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400",
  medium: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
  low: "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
}

// Données fictives pour les commandes récentes
const recentOrders = [
  { id: "ORD-001", date: "2023-05-01", status: "Livré", total: 125.5, items: 3 },
  { id: "ORD-002", date: "2023-05-15", status: "En cours", total: 78.25, items: 2 },
  { id: "ORD-003", date: "2023-05-28", status: "En attente", total: 210.0, items: 5 },
]

// Données fictives pour les livraisons à venir
const upcomingDeliveries = [
  { id: "ORD-002", date: "2023-06-02", product: "Tomates Bio", quantity: "5kg", seller: "Ferme Durand" },
  { id: "ORD-003", date: "2023-06-05", product: "Pommes de terre", quantity: "10kg", seller: "Ferme Martin" },
]

export default function BuyerDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [products, setProducts] = useState<any[]>([])
  const [favoriteProducts, setFavoriteProducts] = useState<any[]>([])
  const [notifications, setNotifications] = useState<Notification[]>(notificationsData)
  const [loading, setLoading] = useState({
    products: true,
    favorites: true,
  })
  const [searchQuery, setSearchQuery] = useState("")

  // Nombre de notifications non lues
  const unreadCount = notifications.filter((notification) => notification.status === "unread").length

  // Marquer une notification comme lue
  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, status: "read" as NotificationStatus } : notification,
      ),
    )
  }

  // Marquer toutes les notifications comme lues
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, status: "read" as NotificationStatus })))
  }

  // Supprimer une notification
  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  // Gérer le clic sur une notification
  const handleNotificationClick = (notification: Notification) => {
    // Marquer comme lue
    if (notification.status === "unread") {
      markAsRead(notification.id)
    }

    // Si un lien est spécifié, naviguer vers ce lien
    if (notification.link) {
      router.push(notification.link)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simuler un délai réseau pour les produits recommandés
        await new Promise((resolve) => setTimeout(resolve, 800))
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/featured-products`)
        const data = await response.json()
        setProducts(data)
        setLoading((prev) => ({ ...prev, products: false }))

        // Simuler un délai réseau pour les favoris
        await new Promise((resolve) => setTimeout(resolve, 500))
        // Dans une application réelle, vous feriez une requête API pour obtenir les favoris
        setFavoriteProducts(data.slice(0, 3)) // Utiliser les 3 premiers produits comme favoris pour la démo
        setLoading((prev) => ({ ...prev, favorites: false }))
      } catch (error) {
        console.error("Error fetching data:", error)
        setLoading({ products: false, favorites: false })
      }
    }

    fetchData()
  }, [])

  // Filtrer les favoris en fonction de la recherche
  const filteredFavorites = favoriteProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground">Bienvenue sur votre espace acheteur AgroLink</p>
        </div>
        <Button asChild>
          <Link href="/products">Découvrir des produits</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DashboardCard
          title="Commandes récentes"
          value="3"
          description="Commandes ce mois-ci"
          icon={ShoppingBag}
          href="/buyer/orders"
        />
        <DashboardCard
          title="Produits favoris"
          value="12"
          description="Produits enregistrés"
          icon={Heart}
          href="/buyer/favorites"
        />
        <DashboardCard title="Messages" value="5" description="3 non lus" icon={MessageSquare} href="/buyer/messages" />
        <DashboardCard
          title="Notifications"
          value={unreadCount.toString()}
          description="Notifications non lues"
          icon={Bell}
          href="/buyer/notifications"
        />
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="orders">Commandes</TabsTrigger>
          <TabsTrigger value="favorites">Favoris</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Onglet Aperçu */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Activité récente */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Activité récente</CardTitle>
                <CardDescription>Résumé de votre activité récente sur AgroLink</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <ShoppingBag className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Commande passée</p>
                      <p className="text-sm text-muted-foreground">Vous avez passé une commande de 125.50 FCFA</p>
                      <p className="text-xs text-muted-foreground">Il y a 2 jours</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Heart className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Produit ajouté aux favoris</p>
                      <p className="text-sm text-muted-foreground">Vous avez ajouté "Tomates Bio" à vos favoris</p>
                      <p className="text-xs text-muted-foreground">Il y a 3 jours</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Star className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Avis publié</p>
                      <p className="text-sm text-muted-foreground">Vous avez donné 5 étoiles à "Pommes de terre"</p>
                      <p className="text-xs text-muted-foreground">Il y a 5 jours</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link href="/buyer/profile">Voir toute l'activité</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Statistiques */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Vos statistiques</CardTitle>
                <CardDescription>Aperçu de votre activité sur AgroLink</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">Client depuis</p>
                    </div>
                    <p className="font-medium">Janvier 2023</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">Commandes totales</p>
                    </div>
                    <p className="font-medium">12</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">Montant total dépensé</p>
                    </div>
                    <p className="font-medium">125,000 FCFA</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Catégories les plus achetées</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "75%" }}></div>
                      </div>
                      <span className="text-xs min-w-[60px]">Légumes (75%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "60%" }}></div>
                      </div>
                      <span className="text-xs min-w-[60px]">Fruits (60%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "40%" }}></div>
                      </div>
                      <span className="text-xs min-w-[60px]">Céréales (40%)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Commandes récentes */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Commandes récentes</CardTitle>
              <CardDescription>Vos dernières commandes sur AgroLink</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-2"
                  >
                    <div>
                      <h4 className="font-medium">{order.id}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.date).toLocaleDateString()} • {order.items} article(s)
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">{order.total.toFixed(2)} FCFA</p>
                        <p
                          className={`text-sm ${
                            order.status === "Livré"
                              ? "text-green-500"
                              : order.status === "En cours"
                                ? "text-blue-500"
                                : "text-orange-500"
                          }`}
                        >
                          {order.status}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/buyer/orders/${order.id}`}>Détails</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link href="/buyer/orders">
                  Voir toutes les commandes
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Produits recommandés */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Recommandations pour vous</CardTitle>
              <CardDescription>Produits qui pourraient vous intéresser</CardDescription>
            </CardHeader>
            <CardContent>
              {loading.products ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {products.slice(0, 3).map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link href="/products">
                  Découvrir plus de produits
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Onglet Commandes */}
        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Vos commandes</CardTitle>
              <CardDescription>Historique de vos commandes sur AgroLink</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-md border">
                <div className="p-4">
                  <h3 className="text-lg font-medium">Vos dernières commandes</h3>
                </div>
                <div className="divide-y">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-2"
                    >
                      <div>
                        <h4 className="font-medium">{order.id}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.date).toLocaleDateString()} • {order.items} article(s)
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">{order.total.toFixed(2)} FCFA</p>
                          <p
                            className={`text-sm ${
                              order.status === "Livré"
                                ? "text-green-500"
                                : order.status === "En cours"
                                  ? "text-blue-500"
                                  : "text-orange-500"
                            }`}
                          >
                            {order.status}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/buyer/orders/${order.id}`}>Détails</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-md border">
                <div className="p-4">
                  <h3 className="text-lg font-medium">Livraisons prévues</h3>
                </div>
                <div className="divide-y">
                  {upcomingDeliveries.map((delivery) => (
                    <div
                      key={delivery.id}
                      className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-2"
                    >
                      <div className="flex items-center gap-3">
                        <Package className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">{delivery.product}</h4>
                          <p className="text-sm text-muted-foreground">
                            {delivery.quantity} • {delivery.seller}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">Livraison prévue</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(delivery.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/buyer/orders/${delivery.id}`}>Détails</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/buyer/orders">Voir toutes les commandes</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Onglet Favoris */}
        <TabsContent value="favorites" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Vos produits favoris</CardTitle>
              <CardDescription>Produits que vous avez enregistrés pour plus tard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher dans vos favoris..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {loading.favorites ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : filteredFavorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted p-3 mb-4">
                    <Heart className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">Aucun favori trouvé</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {searchQuery
                      ? "Aucun produit ne correspond à votre recherche."
                      : "Vous n'avez pas encore ajouté de produits à vos favoris."}
                  </p>
                  {searchQuery && (
                    <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
                      Effacer la recherche
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {filteredFavorites.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/buyer/favorites">Voir tous les favoris</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Onglet Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle>Vos notifications</CardTitle>
                <CardDescription>
                  {unreadCount === 0
                    ? "Vous n'avez aucune notification non lue."
                    : `Vous avez ${unreadCount} notification${unreadCount > 1 ? "s" : ""} non lue${
                        unreadCount > 1 ? "s" : ""
                      }.`}
                </CardDescription>
              </div>
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  <CheckCheck className="mr-2 h-4 w-4" />
                  Tout marquer comme lu
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                      <Bell className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">Aucune notification</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Vous n'avez aucune notification pour le moment.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`flex items-start gap-4 p-4 rounded-lg transition-colors cursor-pointer ${
                          notification.status === "unread" ? "bg-muted/50 hover:bg-muted" : "hover:bg-muted/30"
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className={`rounded-full p-2 ${priorityColors[notification.priority]}`}>
                          {notificationIcons[notification.type]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-sm">{notification.title}</h4>
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{notification.message}</p>
                              {notification.sender && (
                                <div className="flex items-center gap-2 mt-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage
                                      src={notification.sender.avatar || "/placeholder.svg"}
                                      alt={notification.sender.name}
                                    />
                                    <AvatarFallback>
                                      {notification.sender.name.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs font-medium">{notification.sender.name}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-xs text-muted-foreground">{notification.time}</span>
                              {notification.status === "unread" && (
                                <Badge variant="default" className="mt-1">
                                  Nouveau
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {notification.status === "unread" ? (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  markAsRead(notification.id)
                                }}
                              >
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Marquer comme lu
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setNotifications((prev) =>
                                    prev.map((n) =>
                                      n.id === notification.id ? { ...n, status: "unread" as NotificationStatus } : n,
                                    ),
                                  )
                                }}
                              >
                                <Clock className="mr-2 h-4 w-4" />
                                Marquer comme non lu
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteNotification(notification.id)
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/buyer/notifications">Gérer les notifications</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function DashboardCard({
  title,
  value,
  description,
  icon: Icon,
  href,
}: {
  title: string
  value: string
  description: string
  icon: React.ElementType
  href: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        <Button variant="ghost" size="sm" className="mt-4 p-0" asChild>
          <Link href={href}>Voir tout</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
