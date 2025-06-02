"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Mail, Clock, CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

// Mock data for contact subjects
const contactSubjects = [
  "Question générale",
  "Support technique",
  "Devenir vendeur",
  "Partenariat",
  "Signaler un problème",
  "Autre",
]

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    setTimeout(() => {
      setFormSubmitted(true)
    }, 1000)
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Contactez-nous</h1>
          <p className="text-muted-foreground text-lg">
            Vous avez des questions ou des suggestions ? N'hésitez pas à nous contacter. Notre équipe est toujours prête
            à vous aider.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-2">Adresse</h3>
              <p className="text-muted-foreground">
                123 Rue Principale
                <br />
                Yaoundé, Centre
                <br />
                Cameroun
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-2">Téléphone</h3>
              <p className="text-muted-foreground">
                +237 6XX XXX XXX
                <br />
                +237 6XX XXX XXX
              </p>
              <p className="text-sm text-muted-foreground mt-2">Du lundi au vendredi, 8h - 17h</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-2">Email</h3>
              <p className="text-muted-foreground">
                contact@agrolink.cm
                <br />
                support@agrolink.cm
              </p>
              <p className="text-sm text-muted-foreground mt-2">Nous répondons généralement sous 24h</p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form and Map */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-2xl font-bold mb-6">Envoyez-nous un message</h2>

            {formSubmitted ? (
              <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-900 rounded-lg p-6 text-center">
                <div className="inline-flex items-center justify-center p-2 bg-green-100 dark:bg-green-900 rounded-full mb-4">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-medium mb-2">Message envoyé avec succès !</h3>
                <p className="text-muted-foreground mb-4">
                  Merci de nous avoir contactés. Nous vous répondrons dans les plus brefs délais.
                </p>
                <Button onClick={() => setFormSubmitted(false)}>Envoyer un autre message</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <Input id="name" placeholder="Votre nom" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="votre@email.com" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" placeholder="6XXXXXXXX" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Sujet</Label>
                    <Select>
                      <SelectTrigger id="subject">
                        <SelectValue placeholder="Sélectionnez un sujet" />
                      </SelectTrigger>
                      <SelectContent>
                        {contactSubjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Comment pouvons-nous vous aider ?" rows={6} required />
                </div>
                <Button type="submit" size="lg" className="w-full">
                  Envoyer le message
                </Button>
              </form>
            )}
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Nous trouver</h2>
            <div className="aspect-[4/3] relative rounded-lg overflow-hidden border">
              <Image src="/placeholder.svg?height=400&width=600" alt="Carte AgroLink" fill className="object-cover" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg text-center">
                  <p className="font-medium">Carte interactive à intégrer ici</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Heures d'ouverture</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium">Lundi - Vendredi</div>
                    <div className="text-muted-foreground">8h00 - 17h00</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium">Samedi</div>
                    <div className="text-muted-foreground">9h00 - 13h00</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium">Dimanche</div>
                    <div className="text-muted-foreground">Fermé</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 py-8 border-t">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h2 className="text-2xl font-bold mb-4">Questions fréquemment posées</h2>
            <p className="text-muted-foreground">
              Consultez nos réponses aux questions les plus courantes avant de nous contacter
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium">Comment puis-je devenir vendeur sur AgroLink ?</h3>
              <p className="text-muted-foreground">
                Pour devenir vendeur, créez un compte, sélectionnez "Agriculteur/Vendeur" comme type d'utilisateur, et
                suivez les étapes de vérification. Vous pourrez ensuite ajouter vos produits et commencer à vendre.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Comment fonctionne la livraison ?</h3>
              <p className="text-muted-foreground">
                AgroLink propose plusieurs options de livraison selon votre région. Vous pouvez choisir la livraison à
                domicile ou le retrait sur un point de collecte lors du processus de commande.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Quels sont les modes de paiement acceptés ?</h3>
              <p className="text-muted-foreground">
                Nous acceptons les paiements par mobile money (Orange Money, MTN Mobile Money), les virements bancaires
                et le paiement à la livraison dans certaines régions.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Comment puis-je signaler un problème avec ma commande ?</h3>
              <p className="text-muted-foreground">
                Vous pouvez signaler un problème directement depuis votre compte dans la section "Mes commandes". Vous
                pouvez également nous contacter par email ou téléphone pour une assistance rapide.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
