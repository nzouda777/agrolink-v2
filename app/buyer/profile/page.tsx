"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  User,
  MapPin,
  Shield,
  Bell,
  CreditCard,
  LogOut,
  Edit,
  Plus,
  Trash2,
  Check,
  Mail,
  Phone,
  Calendar,
  Home,
  Building2,
  Smartphone,
  Laptop,
  Upload,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Données fictives pour le profil utilisateur
const userProfile = {
  id: 1,
  name: "Jean Dupont",
  email: "jean.dupont@example.com",
  phone: "+237 6XX XX XX XX",
  avatar: "/placeholder.svg?height=128&width=128",
  memberSince: "Janvier 2023",
  type: "Particulier",
  verified: true,
  bio: "Passionné de produits frais et locaux. J'aime cuisiner avec des ingrédients de qualité.",
  region: "Centre",
  city: "Yaoundé",
  addresses: [
    {
      id: 1,
      type: "Domicile",
      icon: Home,
      default: true,
      street: "123 Rue Principale",
      city: "Yaoundé",
      region: "Centre",
      country: "Cameroun",
      phone: "+237 6XX XX XX XX",
    },
    {
      id: 2,
      type: "Travail",
      icon: Building2,
      default: false,
      street: "456 Avenue des Affaires",
      city: "Yaoundé",
      region: "Centre",
      country: "Cameroun",
      phone: "+237 6XX XX XX XX",
    },
  ],
  paymentMethods: [
    {
      id: 1,
      type: "Carte bancaire",
      default: true,
      last4: "4242",
      expiry: "04/25",
      provider: "Visa",
    },
    {
      id: 2,
      type: "Mobile Money",
      default: false,
      provider: "Orange Money",
      phone: "+237 6XX XX XX XX",
    },
  ],
  preferences: {
    notifications: {
      email: true,
      sms: false,
      push: true,
      inApp: true,
    },
    privacy: {
      shareData: false,
      showProfile: true,
    },
  },
  security: {
    twoFactorAuth: false,
    loginNotifications: true,
    sessionTimeout: true,
    lastPasswordChange: "2023-01-15",
  },
  connectedDevices: [
    {
      id: 1,
      name: "iPhone 13",
      type: "Mobile",
      icon: Smartphone,
      location: "Yaoundé, Cameroun",
      lastActive: "Aujourd'hui à 10:30",
      current: true,
    },
    {
      id: 2,
      name: "MacBook Pro",
      type: "Desktop",
      icon: Laptop,
      location: "Yaoundé, Cameroun",
      lastActive: "Hier à 18:45",
      current: false,
    },
  ],
}

// Données fictives pour les régions et villes
const regions = [
  { id: 1, name: "Centre" },
  { id: 2, name: "Littoral" },
  { id: 3, name: "Ouest" },
  { id: 4, name: "Nord" },
  { id: 5, name: "Sud" },
]

const cities = {
  1: [
    { id: 1, name: "Yaoundé" },
    { id: 2, name: "Mbalmayo" },
  ],
  2: [
    { id: 3, name: "Douala" },
    { id: 4, name: "Edéa" },
  ],
  3: [
    { id: 5, name: "Bafoussam" },
    { id: 6, name: "Dschang" },
  ],
  4: [
    { id: 7, name: "Garoua" },
    { id: 8, name: "Maroua" },
  ],
  5: [
    { id: 9, name: "Ebolowa" },
    { id: 10, name: "Kribi" },
  ],
}

export default function ProfilePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("personal")
  const [editMode, setEditMode] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState<string | null>("1")
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null)
  const [paymentToDelete, setPaymentToDelete] = useState<number | null>(null)
  const [deviceToLogout, setDeviceToLogout] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    name: userProfile.name,
    email: userProfile.email,
    phone: userProfile.phone,
    bio: userProfile.bio || "",
    region: userProfile.region,
    city: userProfile.city,
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value)
    // Reset city when region changes
    setFormData((prev) => ({ ...prev, region: regions.find((r) => r.id.toString() === value)?.name || "", city: "" }))
  }

  const handleCityChange = (value: string) => {
    const cityName = cities[Number.parseInt(selectedRegion || "1")]?.find((c) => c.id.toString() === value)?.name || ""
    setFormData((prev) => ({ ...prev, city: cityName }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Simuler une requête API
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setEditMode(false)
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    // Simuler une requête API
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  const handleSetDefaultAddress = async (id: number) => {
    // Simuler une requête API
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  const handleDeleteAddress = async () => {
    if (!addressToDelete) return

    setIsDeleting(true)
    try {
      // Simuler une requête API
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (error) {
      console.error("Error deleting address:", error)
    } finally {
      setIsDeleting(false)
      setAddressToDelete(null)
    }
  }

  const handleSetDefaultPayment = async (id: number) => {
    // Simuler une requête API
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  const handleDeletePayment = async () => {
    if (!paymentToDelete) return

    setIsDeleting(true)
    try {
      // Simuler une requête API
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (error) {
      console.error("Error deleting payment method:", error)
    } finally {
      setIsDeleting(false)
      setPaymentToDelete(null)
    }
  }

  const handleLogoutDevice = async () => {
    if (!deviceToLogout) return

    setIsLoggingOut(true)
    try {
      // Simuler une requête API
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (error) {
      console.error("Error logging out device:", error)
    } finally {
      setIsLoggingOut(false)
      setDeviceToLogout(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mon profil</h1>
          <p className="text-muted-foreground">Gérez vos informations personnelles et vos préférences</p>
        </div>
        {activeTab === "personal" && !editMode && (
          <Button variant="outline" onClick={() => setEditMode(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Modifier le profil
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="md:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={userProfile.avatar || "/placeholder.svg"} alt={userProfile.name} />
                <AvatarFallback>
                  {userProfile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{userProfile.name}</h2>
              <p className="text-sm text-muted-foreground mb-2">{userProfile.email}</p>
              <div className="flex items-center gap-1 mb-4">
                <Badge variant="outline" className="text-xs">
                  {userProfile.type}
                </Badge>
                {userProfile.verified && (
                  <Badge className="bg-green-500 text-white text-xs">
                    <Check className="mr-1 h-3 w-3" />
                    Vérifié
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Membre depuis {userProfile.memberSince}</p>
            </div>

            <Separator className="my-6" />

            <nav className="space-y-2">
              <Button
                variant={activeTab === "personal" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab("personal")
                  setEditMode(false)
                }}
              >
                <User className="mr-2 h-4 w-4" />
                Informations personnelles
              </Button>
              <Button
                variant={activeTab === "addresses" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("addresses")}
              >
                <MapPin className="mr-2 h-4 w-4" />
                Adresses
              </Button>
              <Button
                variant={activeTab === "payment" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("payment")}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Moyens de paiement
              </Button>
              <Button
                variant={activeTab === "notifications" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("notifications")}
              >
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </Button>
              <Button
                variant={activeTab === "security" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("security")}
              >
                <Shield className="mr-2 h-4 w-4" />
                Sécurité
              </Button>
            </nav>

            <Separator className="my-6" />

            <Button variant="outline" className="w-full text-destructive hover:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="md:col-span-3 space-y-6">
          {/* Personal Information */}
          {activeTab === "personal" && !editMode && (
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>
                  Vos informations personnelles telles qu'elles apparaissent sur votre compte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Nom complet</Label>
                    <p className="font-medium">{userProfile.name}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Type de compte</Label>
                    <p className="font-medium">{userProfile.type}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Email</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{userProfile.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Téléphone</Label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{userProfile.phone}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Membre depuis</Label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{userProfile.memberSince}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Localisation</Label>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">
                        {userProfile.city}, {userProfile.region}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-muted-foreground">Bio</Label>
                  <p>{userProfile.bio || "Aucune bio renseignée."}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => setEditMode(true)}>
                  Modifier les informations
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Edit Personal Information */}
          {activeTab === "personal" && editMode && (
            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>Modifier les informations personnelles</CardTitle>
                  <CardDescription>Mettez à jour vos informations personnelles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center mb-6">
                    <div className="relative mb-4">
                      <Avatar className="h-32 w-32">
                        <AvatarImage src={userProfile.avatar || "/placeholder.svg"} alt={userProfile.name} />
                        <AvatarFallback className="text-2xl">
                          <User className="h-12 w-12" />
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        size="icon"
                        variant="outline"
                        className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-background"
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-sm font-medium">Changer la photo</p>
                      <p className="text-xs text-muted-foreground">JPG, PNG ou GIF. 1MB maximum.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Votre nom complet"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="votre@email.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="6XXXXXXXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Type de compte</Label>
                      <Select defaultValue={userProfile.type === "Particulier" ? "1" : "2"} disabled>
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Sélectionnez un type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Particulier</SelectItem>
                          <SelectItem value="2">Restaurant</SelectItem>
                          <SelectItem value="3">Revendeur</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Le type de compte ne peut pas être modifié. Contactez le support pour changer de type de compte.
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Parlez-nous un peu de vous..."
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">Maximum 200 caractères</p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="region">Région</Label>
                      <Select value={selectedRegion || undefined} onValueChange={handleRegionChange}>
                        <SelectTrigger id="region">
                          <SelectValue placeholder="Sélectionnez une région" />
                        </SelectTrigger>
                        <SelectContent>
                          {regions.map((region) => (
                            <SelectItem key={region.id} value={region.id.toString()}>
                              {region.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Ville</Label>
                      <Select disabled={!selectedRegion} onValueChange={handleCityChange}>
                        <SelectTrigger id="city">
                          <SelectValue placeholder="Sélectionnez une ville" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedRegion &&
                            cities[Number.parseInt(selectedRegion)]?.map((city) => (
                              <SelectItem key={city.id} value={city.id.toString()}>
                                {city.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button" onClick={() => setEditMode(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">Enregistrer les modifications</Button>
                </CardFooter>
              </Card>
            </form>
          )}

          {/* Addresses */}
          {activeTab === "addresses" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle>Adresses</CardTitle>
                  <CardDescription>Gérez vos adresses de livraison et de facturation</CardDescription>
                </div>
                <Button asChild>
                  <Link href="/buyer/profile/addresses/add">
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter une adresse
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {userProfile.addresses.map((address) => {
                  const Icon = address.icon
                  return (
                    <div key={address.id} className="border rounded-lg p-4 relative">
                      {address.default && <Badge className="absolute top-2 right-2">Par défaut</Badge>}
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="rounded-full bg-primary/10 p-2">
                              <Icon className="h-4 w-4 text-primary" />
                            </div>
                            <h3 className="font-medium">{address.type}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{address.street}</p>
                          <p className="text-sm text-muted-foreground">
                            {address.city}, {address.region}, {address.country}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">{address.phone}</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/buyer/profile/addresses/edit/${address.id}`}>Modifier</Link>
                          </Button>

                          {!address.default && (
                            <>
                              <Button variant="outline" size="sm" onClick={() => handleSetDefaultAddress(address.id)}>
                                <Check className="mr-2 h-4 w-4" />
                                Définir par défaut
                              </Button>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Supprimer
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Cette action ne peut pas être annulée. Cette adresse sera définitivement
                                      supprimée.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteAddress()}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      {isDeleting ? "Suppression..." : "Supprimer"}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}

                {userProfile.addresses.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                      <MapPin className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">Aucune adresse enregistrée</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-4">
                      Vous n'avez pas encore ajouté d'adresse à votre compte.
                    </p>
                    <Button asChild>
                      <Link href="/buyer/profile/addresses/add">
                        <Plus className="mr-2 h-4 w-4" />
                        Ajouter une adresse
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Payment Methods */}
          {activeTab === "payment" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle>Moyens de paiement</CardTitle>
                  <CardDescription>Gérez vos moyens de paiement pour vos achats</CardDescription>
                </div>
                <Button asChild>
                  <Link href="/buyer/profile/payment/add">
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter un moyen de paiement
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {userProfile.paymentMethods.map((method) => (
                  <div key={method.id} className="border rounded-lg p-4 relative">
                    {method.default && <Badge className="absolute top-2 right-2">Par défaut</Badge>}
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium">{method.type}</h3>
                          {method.type === "Carte bancaire" ? (
                            <p className="text-sm text-muted-foreground">
                              {method.provider} •••• {method.last4} | Exp: {method.expiry}
                            </p>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              {method.provider} | {method.phone}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/buyer/profile/payment/edit/${method.id}`}>Modifier</Link>
                        </Button>
                        {!method.default && (
                          <>
                            <Button variant="outline" size="sm" onClick={() => handleSetDefaultPayment(method.id)}>
                              <Check className="mr-2 h-4 w-4" />
                              Définir par défaut
                            </Button>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Supprimer
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Cette action ne peut pas être annulée. Ce moyen de paiement sera définitivement
                                    supprimé.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeletePayment()}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    {isDeleting ? "Suppression..." : "Supprimer"}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {userProfile.paymentMethods.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                      <CreditCard className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">Aucun moyen de paiement enregistré</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-4">
                      Vous n'avez pas encore ajouté de moyen de paiement à votre compte.
                    </p>
                    <Button asChild>
                      <Link href="/buyer/profile/payment/add">
                        <Plus className="mr-2 h-4 w-4" />
                        Ajouter un moyen de paiement
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Préférences de notifications</CardTitle>
                <CardDescription>Choisissez comment vous souhaitez être informé</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Notifications par email</Label>
                      <p className="text-sm text-muted-foreground">
                        Recevez des emails concernant vos commandes et votre compte
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={userProfile.preferences.notifications.email}
                      onCheckedChange={(checked) => {
                        // Dans une application réelle, vous mettriez à jour l'état ici
                      }}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sms-notifications">Notifications par SMS</Label>
                      <p className="text-sm text-muted-foreground">
                        Recevez des SMS concernant vos commandes et votre compte
                      </p>
                    </div>
                    <Switch
                      id="sms-notifications"
                      checked={userProfile.preferences.notifications.sms}
                      onCheckedChange={(checked) => {
                        // Dans une application réelle, vous mettriez à jour l'état ici
                      }}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Notifications push</Label>
                      <p className="text-sm text-muted-foreground">Recevez des notifications push sur votre appareil</p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={userProfile.preferences.notifications.push}
                      onCheckedChange={(checked) => {
                        // Dans une application réelle, vous mettriez à jour l'état ici
                      }}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="inapp-notifications">Notifications dans l'application</Label>
                      <p className="text-sm text-muted-foreground">Recevez des notifications dans l'application</p>
                    </div>
                    <Switch
                      id="inapp-notifications"
                      checked={userProfile.preferences.notifications.inApp}
                      onCheckedChange={(checked) => {
                        // Dans une application réelle, vous mettriez à jour l'état ici
                      }}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/buyer/notifications/settings">Paramètres avancés</Link>
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <div className="space-y-6">
              {/* Changement de mot de passe */}
              <Card>
                <CardHeader>
                  <CardTitle>Changer le mot de passe</CardTitle>
                  <CardDescription>Mettez à jour votre mot de passe pour sécuriser votre compte</CardDescription>
                </CardHeader>
                <form onSubmit={handleChangePassword}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? "Masquer" : "Afficher"}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? "Masquer" : "Afficher"}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? "Masquer" : "Afficher"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="submit"
                      disabled={passwordForm.newPassword !== passwordForm.confirmPassword}
                      className="w-full"
                    >
                      Changer le mot de passe
                    </Button>
                  </CardFooter>
                </form>
              </Card>

              {/* Paramètres de sécurité */}
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres de sécurité</CardTitle>
                  <CardDescription>Configurez les options de sécurité supplémentaires</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="twoFactorAuth">Authentification à deux facteurs</Label>
                      <p className="text-sm text-muted-foreground">
                        Ajoutez une couche de sécurité supplémentaire à votre compte
                      </p>
                    </div>
                    <Switch
                      id="twoFactorAuth"
                      checked={userProfile.security.twoFactorAuth}
                      onCheckedChange={(checked) => {
                        // Dans une application réelle, vous mettriez à jour l'état ici
                      }}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="loginNotifications">Notifications de connexion</Label>
                      <p className="text-sm text-muted-foreground">
                        Recevez une notification lorsque quelqu'un se connecte à votre compte
                      </p>
                    </div>
                    <Switch
                      id="loginNotifications"
                      checked={userProfile.security.loginNotifications}
                      onCheckedChange={(checked) => {
                        // Dans une application réelle, vous mettriez à jour l'état ici
                      }}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sessionTimeout">Expiration de session</Label>
                      <p className="text-sm text-muted-foreground">
                        Déconnexion automatique après 30 minutes d'inactivité
                      </p>
                    </div>
                    <Switch
                      id="sessionTimeout"
                      checked={userProfile.security.sessionTimeout}
                      onCheckedChange={(checked) => {
                        // Dans une application réelle, vous mettriez à jour l'état ici
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Appareils connectés */}
              <Card>
                <CardHeader>
                  <CardTitle>Appareils connectés</CardTitle>
                  <CardDescription>Gérez les appareils connectés à votre compte</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {userProfile.connectedDevices.map((device) => {
                    const Icon = device.icon
                    return (
                      <div
                        key={device.id}
                        className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center gap-4">
                          <div className="rounded-full bg-muted p-2">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{device.name}</h3>
                              {device.current && (
                                <Badge variant="outline" className="text-xs">
                                  Cet appareil
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{device.location}</p>
                            <p className="text-xs text-muted-foreground">Dernière activité: {device.lastActive}</p>
                          </div>
                        </div>
                        {!device.current && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                                <LogOut className="mr-2 h-4 w-4" />
                                Déconnecter
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Déconnecter cet appareil ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Cette action déconnectera l'appareil "{device.name}" de votre compte. L'utilisateur
                                  devra se reconnecter pour accéder à votre compte.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleLogoutDevice()}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  {isLoggingOut ? "Déconnexion..." : "Déconnecter"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
