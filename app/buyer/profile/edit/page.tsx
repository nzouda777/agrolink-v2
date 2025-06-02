"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Upload, User } from "lucide-react"
import { Separator } from "@/components/ui/separator"

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

export default function EditProfilePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: userProfile.name,
    email: userProfile.email,
    phone: userProfile.phone,
    bio: userProfile.bio || "",
    region: userProfile.region,
    city: userProfile.city,
  })
  const [selectedRegion, setSelectedRegion] = useState<string | null>("1")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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
    setIsSubmitting(true)

    try {
      // Simuler une requête API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Rediriger vers la page de profil
      router.push("/buyer/profile")
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Modifier le profil</h1>
          <p className="text-muted-foreground">Mettez à jour vos informations personnelles</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Photo de profil */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Photo de profil</CardTitle>
              <CardDescription>Cette photo sera affichée sur votre profil</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
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
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button">
                Supprimer
              </Button>
              <Button variant="outline" type="button">
                Télécharger
              </Button>
            </CardFooter>
          </Card>

          {/* Informations personnelles */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>Mettez à jour vos informations personnelles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  )
}
