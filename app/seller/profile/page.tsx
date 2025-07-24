"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Building, CreditCard, Settings, Camera, MapPin, Calendar, Star, Shield, Bell } from "lucide-react"

interface ProfileData {
  personalInfo: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    avatar: string
    joinDate: string
    lastLogin: string
  }
  businessInfo: {
    businessName: string
    businessType: string
    description: string
    address: {
      street: string
      city: string
      region: string
      country: string
      postalCode: string
    }
    taxNumber: string
    businessLicense: string
    certifications: string[]
  }
  bankInfo: {
    bankName: string
    accountNumber: string
    accountHolder: string
    iban: string
  }
  preferences: {
    language: string
    currency: string
    timezone: string
    notifications: {
      email: boolean
      sms: boolean
      push: boolean
      marketing: boolean
    }
  }
  stats: {
    totalProducts: number
    totalOrders: number
    totalRevenue: number
    rating: number
    reviewsCount: number
  }
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/seller/profile")
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      }
    } catch (error) {
      console.error("Erreur lors du chargement du profil:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (section: string, data: any) => {
    setSaving(true)
    try {
      const response = await fetch("/api/seller/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, data }),
      })

      if (response.ok) {
        await fetchProfile()
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    )
  }

  if (!profile) {
    return <div>Erreur lors du chargement du profil</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profil Vendeur</h1>
        <p className="text-muted-foreground">Gérez vos informations personnelles et professionnelles</p>
      </div>

      {/* En-tête du profil */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.personalInfo.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-lg">
                  {profile.personalInfo.firstName[0]}
                  {profile.personalInfo.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <Button size="sm" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0">
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">
                {profile.personalInfo.firstName} {profile.personalInfo.lastName}
              </h2>
              <p className="text-muted-foreground">{profile.businessInfo.businessName}</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{profile.stats.rating}</span>
                  <span className="text-sm text-muted-foreground">({profile.stats.reviewsCount} avis)</span>
                </div>
                <Badge variant="secondary">{profile.stats.totalProducts} produits</Badge>
                <Badge variant="secondary">{profile.stats.totalOrders} commandes</Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{profile.stats.totalRevenue.toLocaleString()} XOF</div>
              <p className="text-sm text-muted-foreground">Revenus totaux</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Personnel</span>
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center space-x-2">
            <Building className="h-4 w-4" />
            <span>Entreprise</span>
          </TabsTrigger>
          <TabsTrigger value="banking" className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>Bancaire</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Paramètres</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations Personnelles</CardTitle>
              <CardDescription>Gérez vos informations personnelles et de contact</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input id="firstName" defaultValue={profile.personalInfo.firstName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input id="lastName" defaultValue={profile.personalInfo.lastName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={profile.personalInfo.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" defaultValue={profile.personalInfo.phone} />
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Membre depuis le {new Date(profile.personalInfo.joinDate).toLocaleDateString("fr-FR")}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>
                      Dernière connexion: {new Date(profile.personalInfo.lastLogin).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>
                <Button onClick={() => handleSave("personal", {})} disabled={saving}>
                  {saving ? <LoadingSpinner className="h-4 w-4" /> : "Sauvegarder"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations Entreprise</CardTitle>
              <CardDescription>Gérez les informations de votre entreprise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Nom de l'entreprise</Label>
                  <Input id="businessName" defaultValue={profile.businessInfo.businessName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessType">Type d'entreprise</Label>
                  <Input id="businessType" defaultValue={profile.businessInfo.businessType} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" defaultValue={profile.businessInfo.description} rows={3} />
              </div>
              <div className="space-y-4">
                <h4 className="font-medium flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Adresse</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">Rue</Label>
                    <Input id="street" defaultValue={profile.businessInfo.address.street} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Ville</Label>
                    <Input id="city" defaultValue={profile.businessInfo.address.city} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="region">Région</Label>
                    <Input id="region" defaultValue={profile.businessInfo.address.region} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Code postal</Label>
                    <Input id="postalCode" defaultValue={profile.businessInfo.address.postalCode} />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taxNumber">Numéro fiscal</Label>
                  <Input id="taxNumber" defaultValue={profile.businessInfo.taxNumber} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessLicense">Licence commerciale</Label>
                  <Input id="businessLicense" defaultValue={profile.businessInfo.businessLicense} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Certifications</Label>
                <div className="flex flex-wrap gap-2">
                  {profile.businessInfo.certifications.map((cert, index) => (
                    <Badge key={index} variant="secondary">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t">
                <Button onClick={() => handleSave("business", {})} disabled={saving}>
                  {saving ? <LoadingSpinner className="h-4 w-4" /> : "Sauvegarder"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations Bancaires</CardTitle>
              <CardDescription>Gérez vos informations de paiement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Nom de la banque</Label>
                  <Input id="bankName" defaultValue={profile.bankInfo.bankName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountHolder">Titulaire du compte</Label>
                  <Input id="accountHolder" defaultValue={profile.bankInfo.accountHolder} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Numéro de compte</Label>
                  <Input id="accountNumber" defaultValue={profile.bankInfo.accountNumber} type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="iban">IBAN</Label>
                  <Input id="iban" defaultValue={profile.bankInfo.iban} />
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t">
                <Button onClick={() => handleSave("banking", {})} disabled={saving}>
                  {saving ? <LoadingSpinner className="h-4 w-4" /> : "Sauvegarder"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Préférences</CardTitle>
              <CardDescription>Configurez vos préférences d'application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Langue</Label>
                  <Input id="language" defaultValue={profile.preferences.language} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Devise</Label>
                  <Input id="currency" defaultValue={profile.preferences.currency} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuseau horaire</Label>
                  <Input id="timezone" defaultValue={profile.preferences.timezone} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </CardTitle>
              <CardDescription>Gérez vos préférences de notification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Notifications par email</Label>
                    <p className="text-sm text-muted-foreground">Recevez des notifications par email</p>
                  </div>
                  <Switch id="email-notifications" defaultChecked={profile.preferences.notifications.email} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-notifications">Notifications SMS</Label>
                    <p className="text-sm text-muted-foreground">Recevez des notifications par SMS</p>
                  </div>
                  <Switch id="sms-notifications" defaultChecked={profile.preferences.notifications.sms} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications">Notifications push</Label>
                    <p className="text-sm text-muted-foreground">Recevez des notifications push</p>
                  </div>
                  <Switch id="push-notifications" defaultChecked={profile.preferences.notifications.push} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketing-notifications">Notifications marketing</Label>
                    <p className="text-sm text-muted-foreground">Recevez des offres et promotions</p>
                  </div>
                  <Switch id="marketing-notifications" defaultChecked={profile.preferences.notifications.marketing} />
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t">
                <Button onClick={() => handleSave("settings", {})} disabled={saving}>
                  {saving ? <LoadingSpinner className="h-4 w-4" /> : "Sauvegarder"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
