"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Home, Building2, MapPin } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Données fictives pour les régions
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

export default function AddAddressPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    type: "home",
    name: "",
    phone: "",
    street: "",
    additionalInfo: "",
    region: "",
    city: "",
    isDefault: false,
  })
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value)
    setFormData((prev) => ({
      ...prev,
      region: regions.find((r) => r.id.toString() === value)?.name || "",
      city: "",
    }))
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

      // Rediriger vers la page des adresses
      router.push("/buyer/profile/addresses")
    } catch (error) {
      console.error("Error adding address:", error)
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
          <h1 className="text-3xl font-bold tracking-tight">Ajouter une adresse</h1>
          <p className="text-muted-foreground">Ajoutez une nouvelle adresse à votre compte</p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Nouvelle adresse</CardTitle>
            <CardDescription>Remplissez les informations ci-dessous pour ajouter une nouvelle adresse</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Type d'adresse</Label>
              <RadioGroup
                defaultValue="home"
                className="flex flex-col sm:flex-row gap-4"
                onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="home" id="home" />
                  <Label htmlFor="home" className="flex items-center gap-2 cursor-pointer">
                    <Home className="h-4 w-4" />
                    Domicile
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="work" id="work" />
                  <Label htmlFor="work" className="flex items-center gap-2 cursor-pointer">
                    <Building2 className="h-4 w-4" />
                    Travail
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other" className="flex items-center gap-2 cursor-pointer">
                    <MapPin className="h-4 w-4" />
                    Autre
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nom du destinataire"
                  required
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
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="street">Adresse</Label>
              <Input
                id="street"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="Numéro et nom de rue"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Complément d'adresse (optionnel)</Label>
              <Input
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                placeholder="Appartement, étage, bâtiment, etc."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="region">Région</Label>
                <Select value={selectedRegion || undefined} onValueChange={handleRegionChange} required>
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
                <Select disabled={!selectedRegion} onValueChange={handleCityChange} required>
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

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isDefault"
                checked={formData.isDefault}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isDefault: checked === true }))}
              />
              <Label htmlFor="isDefault">Définir comme adresse par défaut</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enregistrement..." : "Ajouter l'adresse"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
