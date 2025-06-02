"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "@/contexts/cart-context"
import Image from "next/image"
import { ChevronLeft, CreditCard, Truck, MapPin } from "lucide-react"

export default function CheckoutPage() {
  const { items, totalPrice } = useCart()
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [shippingMethod, setShippingMethod] = useState("standard")

  // Calculer les frais de livraison en fonction de la méthode
  const shippingCost = shippingMethod === "express" ? 2500 : 1000
  const totalWithShipping = totalPrice + shippingCost

  if (items.length === 0) {
    return (
      <div className="container py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Votre panier est vide</h1>
          <p className="text-muted-foreground mb-8">
            Vous n'avez aucun article dans votre panier. Ajoutez des produits pour passer à la caisse.
          </p>
          <Button asChild>
            <Link href="/products">Découvrir les produits</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/products">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Retour aux produits
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Finaliser la commande</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Informations de livraison */}
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center mb-4">
              <MapPin className="h-5 w-5 text-primary mr-2" />
              <h2 className="text-xl font-bold">Adresse de livraison</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input id="firstName" placeholder="Votre prénom" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input id="lastName" placeholder="Votre nom" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="votre@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" placeholder="6XXXXXXXX" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Adresse</Label>
                <Input id="address" placeholder="Votre adresse complète" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Ville</Label>
                <Input id="city" placeholder="Votre ville" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Région</Label>
                <Input id="region" placeholder="Votre région" />
              </div>
            </div>
          </div>

          {/* Méthode de livraison */}
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center mb-4">
              <Truck className="h-5 w-5 text-primary mr-2" />
              <h2 className="text-xl font-bold">Méthode de livraison</h2>
            </div>
            <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
              <div className="flex items-start space-x-3 space-y-0 mb-4">
                <RadioGroupItem value="standard" id="standard" />
                <div className="grid gap-1.5">
                  <Label htmlFor="standard" className="font-medium">
                    Livraison standard (2-3 jours)
                  </Label>
                  <p className="text-sm text-muted-foreground">1,000 FCFA</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 space-y-0">
                <RadioGroupItem value="express" id="express" />
                <div className="grid gap-1.5">
                  <Label htmlFor="express" className="font-medium">
                    Livraison express (24h)
                  </Label>
                  <p className="text-sm text-muted-foreground">2,500 FCFA</p>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Méthode de paiement */}
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center mb-4">
              <CreditCard className="h-5 w-5 text-primary mr-2" />
              <h2 className="text-xl font-bold">Méthode de paiement</h2>
            </div>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-start space-x-3 space-y-0 mb-4">
                <RadioGroupItem value="card" id="card" />
                <div className="grid gap-1.5">
                  <Label htmlFor="card" className="font-medium">
                    Carte bancaire
                  </Label>
                  <p className="text-sm text-muted-foreground">Paiement sécurisé par carte</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 space-y-0 mb-4">
                <RadioGroupItem value="mobile" id="mobile" />
                <div className="grid gap-1.5">
                  <Label htmlFor="mobile" className="font-medium">
                    Mobile Money
                  </Label>
                  <p className="text-sm text-muted-foreground">Orange Money, MTN Mobile Money</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 space-y-0">
                <RadioGroupItem value="delivery" id="delivery" />
                <div className="grid gap-1.5">
                  <Label htmlFor="delivery" className="font-medium">
                    Paiement à la livraison
                  </Label>
                  <p className="text-sm text-muted-foreground">Payez en espèces à la réception</p>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Notes de commande */}
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-bold mb-4">Notes de commande</h2>
            <div className="space-y-2">
              <Label htmlFor="notes">Instructions spéciales (optionnel)</Label>
              <Textarea
                id="notes"
                placeholder="Instructions pour la livraison, préférences particulières, etc."
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Récapitulatif de commande */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border p-6 sticky top-20">
            <h2 className="text-xl font-bold mb-4">Récapitulatif de commande</h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3">
                  <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0 border">
                    <Image
                      src={item.product.images[0] || "/placeholder.svg"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="font-medium truncate">{item.product.name}</div>
                    <div className="text-sm text-muted-foreground">Quantité: {item.quantity}</div>
                    <div className="text-sm font-medium">
                      {(item.product.price * item.quantity).toLocaleString()} FCFA
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sous-total</span>
                <span>{totalPrice.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Livraison</span>
                <span>{shippingCost.toLocaleString()} FCFA</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>{totalWithShipping.toLocaleString()} FCFA</span>
              </div>
            </div>

            <Button size="lg" className="w-full mt-6">
              Confirmer la commande
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              En confirmant votre commande, vous acceptez nos{" "}
              <Link href="/terms" className="text-primary hover:underline">
                conditions d'utilisation
              </Link>{" "}
              et notre{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                politique de confidentialité
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
