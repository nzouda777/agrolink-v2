"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, MapPin, Home, Building2, Trash2, Edit, Check } from "lucide-react"
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

// Données fictives pour les adresses
const addresses = [
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
]

export default function AddressesPage() {
  const router = useRouter()
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSetDefault = async (id: number) => {
    // Simuler une requête API
    await new Promise((resolve) => setTimeout(resolve, 500))
    // Dans une application réelle, vous mettriez à jour l'état ici
  }

  const handleDelete = async () => {
    if (!addressToDelete) return

    setIsDeleting(true)
    try {
      // Simuler une requête API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // Dans une application réelle, vous supprimeriez l'adresse ici
    } catch (error) {
      console.error("Error deleting address:", error)
    } finally {
      setIsDeleting(false)
      setAddressToDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mes adresses</h1>
          <p className="text-muted-foreground">Gérez vos adresses de livraison et de facturation</p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button asChild>
          <Link href="/buyer/profile/addresses/add">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une adresse
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((address) => {
          const Icon = address.icon
          return (
            <Card key={address.id} className="relative">
              {address.default && <Badge className="absolute top-4 right-4">Par défaut</Badge>}
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{address.type}</CardTitle>
                </div>
                <CardDescription>Adresse {address.default ? "par défaut" : "secondaire"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="font-medium">{address.street}</p>
                    <p className="text-sm text-muted-foreground">
                      {address.city}, {address.region}
                    </p>
                    <p className="text-sm text-muted-foreground">{address.country}</p>
                    <p className="text-sm text-muted-foreground mt-2">{address.phone}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/buyer/profile/addresses/edit/${address.id}`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </Link>
                    </Button>

                    {!address.default && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => handleSetDefault(address.id)}>
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
                                Cette action ne peut pas être annulée. Cette adresse sera définitivement supprimée.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete()}
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
              </CardContent>
            </Card>
          )
        })}

        {addresses.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
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
      </div>
    </div>
  )
}
