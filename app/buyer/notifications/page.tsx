"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import {
  Bell,
  Settings,
  ShoppingCart,
  Package,
  MessageSquare,
  Tag,
  AlertCircle,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  Trash2,
  CheckCheck,
  Filter,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
  {
    id: 5,
    type: "system",
    title: "Mise à jour des conditions d'utilisation",
    message: "Nos conditions d'utilisation ont été mises à jour. Veuillez les consulter.",
    time: "28/04",
    date: "28 Avril",
    status: "read",
    priority: "medium",
    link: "/terms",
  },
  {
    id: 6,
    type: "order",
    title: "Commande livrée",
    message: "Votre commande #12344 a été livrée avec succès. Merci pour votre achat !",
    time: "27/04",
    date: "27 Avril",
    status: "read",
    priority: "medium",
    link: "/buyer/orders/12344",
  },
  {
    id: 7,
    type: "message",
    title: "Nouveau message",
    message: "Ferme Martin vous a envoyé un message concernant votre commande récente.",
    time: "26/04",
    date: "26 Avril",
    status: "read",
    priority: "medium",
    link: "/buyer/messages?seller=Ferme%20Martin",
    sender: {
      name: "Ferme Martin",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 8,
    type: "promotion",
    title: "Nouveaux produits disponibles",
    message: "Découvrez les nouveaux produits de saison disponibles sur notre plateforme.",
    time: "25/04",
    date: "25 Avril",
    status: "read",
    priority: "low",
    link: "/products",
  },
]

// Icônes pour les types de notifications
const notificationIcons: Record<NotificationType, React.ReactNode> = {
  order: <ShoppingCart className="h-5 w-5" />,
  delivery: <Package className="h-5 w-5" />,
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

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>(notificationsData)
  const [activeTab, setActiveTab] = useState("all")
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [filters, setFilters] = useState({
    type: "all",
    priority: "all",
    status: "all",
  })

  // Filtrer les notifications en fonction de l'onglet actif et des filtres
  const filteredNotifications = notifications.filter((notification) => {
    // Filtre par onglet
    if (activeTab === "unread" && notification.status !== "unread") return false

    // Filtre par type
    if (filters.type !== "all" && notification.type !== filters.type) return false

    // Filtre par priorité
    if (filters.priority !== "all" && notification.priority !== filters.priority) return false

    // Filtre par statut
    if (filters.status !== "all" && notification.status !== filters.status) return false

    return true
  })

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

  // Ouvrir le dialogue de détail de notification
  const openNotificationDetail = (notification: Notification) => {
    setSelectedNotification(notification)
    setIsDialogOpen(true)

    // Marquer comme lue si elle ne l'est pas déjà
    if (notification.status === "unread") {
      markAsRead(notification.id)
    }
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
    } else {
      // Sinon, ouvrir le dialogue de détail
      openNotificationDetail(notification)
    }
  }

  // Réinitialiser les filtres
  const resetFilters = () => {
    setFilters({
      type: "all",
      priority: "all",
      status: "all",
    })
    setIsFilterDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Restez informé des mises à jour de vos commandes et messages</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filtrer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Filtrer les notifications</DialogTitle>
                <DialogDescription>Sélectionnez les critères pour filtrer vos notifications</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type de notification</Label>
                  <Select
                    value={filters.type}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Tous les types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      <SelectItem value="order">Commandes</SelectItem>
                      <SelectItem value="delivery">Livraisons</SelectItem>
                      <SelectItem value="message">Messages</SelectItem>
                      <SelectItem value="promotion">Promotions</SelectItem>
                      <SelectItem value="system">Système</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priorité</Label>
                  <Select
                    value={filters.priority}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Toutes les priorités" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les priorités</SelectItem>
                      <SelectItem value="high">Haute</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="low">Basse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Statut</Label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="read">Lu</SelectItem>
                      <SelectItem value="unread">Non lu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={resetFilters}>
                  Réinitialiser
                </Button>
                <Button onClick={() => setIsFilterDialogOpen(false)}>Appliquer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="sm" asChild>
            <Link href="/buyer/notifications/settings">
              <Settings className="mr-2 h-4 w-4" />
              Paramètres
            </Link>
          </Button>

          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <CheckCheck className="mr-2 h-4 w-4" />
              Tout marquer comme lu
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">
            Toutes
            <Badge variant="secondary" className="ml-2">
              {notifications.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="unread">
            Non lues
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Toutes les notifications</CardTitle>
              <CardDescription>
                {filteredNotifications.length === 0
                  ? "Vous n'avez aucune notification."
                  : `Vous avez ${filteredNotifications.length} notification${
                      filteredNotifications.length > 1 ? "s" : ""
                    }.`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[60vh] pr-4">
                {filteredNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                      <Bell className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">Aucune notification</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Vous n'avez aucune notification correspondant à vos critères.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredNotifications.map((notification) => (
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
          </Card>
        </TabsContent>
        <TabsContent value="unread" className="mt-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Notifications non lues</CardTitle>
              <CardDescription>
                {unreadCount === 0
                  ? "Vous n'avez aucune notification non lue."
                  : `Vous avez ${unreadCount} notification${unreadCount > 1 ? "s" : ""} non lue${
                      unreadCount > 1 ? "s" : ""
                    }.`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[60vh] pr-4">
                {filteredNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                      <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">Tout est à jour</h3>
                    <p className="text-sm text-muted-foreground mt-1">Vous n'avez aucune notification non lue.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
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
                              <Badge variant="default" className="mt-1">
                                Nouveau
                              </Badge>
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
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                markAsRead(notification.id)
                              }}
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Marquer comme lu
                            </DropdownMenuItem>
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
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogue de détail de notification */}
      {selectedNotification && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedNotification.title}</DialogTitle>
              <DialogDescription>
                <span className="text-xs text-muted-foreground">
                  {selectedNotification.date} à {selectedNotification.time}
                </span>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className={`rounded-full p-2 ${priorityColors[selectedNotification.priority]}`}>
                  {notificationIcons[selectedNotification.type]}
                </div>
                <div>
                  <span className="text-sm font-medium">
                    {selectedNotification.type === "order"
                      ? "Commande"
                      : selectedNotification.type === "delivery"
                        ? "Livraison"
                        : selectedNotification.type === "message"
                          ? "Message"
                          : selectedNotification.type === "promotion"
                            ? "Promotion"
                            : "Système"}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    Priorité{" "}
                    {selectedNotification.priority === "high"
                      ? "haute"
                      : selectedNotification.priority === "medium"
                        ? "moyenne"
                        : "basse"}
                  </span>
                </div>
              </div>

              {selectedNotification.sender && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                  <Avatar>
                    <AvatarImage
                      src={selectedNotification.sender.avatar || "/placeholder.svg"}
                      alt={selectedNotification.sender.name}
                    />
                    <AvatarFallback>{selectedNotification.sender.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{selectedNotification.sender.name}</h4>
                    <p className="text-xs text-muted-foreground">Expéditeur</p>
                  </div>
                </div>
              )}

              <Separator />

              <div className="py-2">
                <p className="text-sm">{selectedNotification.message}</p>
              </div>
            </div>
            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Fermer
              </Button>
              {selectedNotification.link && (
                <Button
                  onClick={() => {
                    setIsDialogOpen(false)
                    router.push(selectedNotification.link!)
                  }}
                >
                  Voir les détails
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
