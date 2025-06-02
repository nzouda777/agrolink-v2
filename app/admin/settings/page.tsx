import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle } from "lucide-react"

async function fetchSettingsData() {
  // Données de secours en cas d'erreur
  const fallbackData = {
    general: {
      siteName: "AgroLink",
      siteDescription: "Plateforme de mise en relation entre agriculteurs et acheteurs",
      contactEmail: "contact@agrolink.com",
      supportPhone: "+33 1 23 45 67 89",
      maintenanceMode: false,
      registrationOpen: true,
    },
    roles: [
      {
        id: "role-001",
        name: "Admin",
        description: "Accès complet à toutes les fonctionnalités",
        permissions: ["all"],
        userCount: 3,
      },
      {
        id: "role-002",
        name: "Modérateur",
        description: "Peut modérer le contenu et les utilisateurs",
        permissions: ["moderate_content", "moderate_users", "view_reports"],
        userCount: 8,
      },
      {
        id: "role-003",
        name: "Support",
        description: "Peut aider les utilisateurs et voir les commandes",
        permissions: ["view_orders", "view_users", "respond_to_support"],
        userCount: 12,
      },
    ],
    subscriptionPlans: [
      {
        id: "plan-001",
        name: "Basique",
        price: 0,
        description: "Plan gratuit pour les petits producteurs",
        features: ["Jusqu'à 10 produits", "Accès aux statistiques de base", "Support par email"],
        userCount: 156,
      },
      {
        id: "plan-002",
        name: "Pro",
        price: 29.99,
        description: "Pour les producteurs en croissance",
        features: ["Produits illimités", "Statistiques avancées", "Support prioritaire", "Mise en avant des produits"],
        userCount: 78,
      },
      {
        id: "plan-003",
        name: "Enterprise",
        price: 99.99,
        description: "Pour les grandes exploitations",
        features: [
          "Produits illimités",
          "Statistiques avancées",
          "Support dédié",
          "Mise en avant des produits",
          "API d'intégration",
          "Gestion multi-utilisateurs",
        ],
        userCount: 11,
      },
    ],
    paymentGateways: [
      {
        id: "gateway-001",
        name: "Stripe",
        enabled: true,
        testMode: false,
      },
      {
        id: "gateway-002",
        name: "PayPal",
        enabled: true,
        testMode: false,
      },
      {
        id: "gateway-003",
        name: "Virement bancaire",
        enabled: true,
        testMode: false,
      },
    ],
    emailSettings: {
      provider: "SendGrid",
      fromEmail: "noreply@agrolink.com",
      replyToEmail: "support@agrolink.com",
      templatesEnabled: true,
    },
    securitySettings: {
      twoFactorAuthRequired: false,
      passwordMinLength: 8,
      passwordRequiresSpecialChars: true,
      sessionTimeout: 60,
    },
  }

  try {
    const response = await fetch("/api/admin/settings", {
      cache: "no-store",
      next: { revalidate: 0 },
    })

    if (!response.ok) {
      console.warn(`API response not ok: ${response.status}`)
      return fallbackData
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Erreur lors du chargement des données:", error)
    return fallbackData
  }
}

function GeneralSettings({ data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres généraux</CardTitle>
        <CardDescription>Configuration générale de la plateforme</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="siteName">Nom du site</Label>
              <Input id="siteName" defaultValue={data.siteName} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email de contact</Label>
              <Input id="contactEmail" type="email" defaultValue={data.contactEmail} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Description du site</Label>
              <Input id="siteDescription" defaultValue={data.siteDescription} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportPhone">Téléphone de support</Label>
              <Input id="supportPhone" defaultValue={data.supportPhone} />
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="maintenanceMode">Mode maintenance</Label>
                <div className="text-sm text-muted-foreground">
                  Activer le mode maintenance rend le site inaccessible aux utilisateurs
                </div>
              </div>
              <Switch id="maintenanceMode" checked={data.maintenanceMode} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="registrationOpen">Inscriptions ouvertes</Label>
                <div className="text-sm text-muted-foreground">Permettre aux nouveaux utilisateurs de s'inscrire</div>
              </div>
              <Switch id="registrationOpen" checked={data.registrationOpen} />
            </div>
          </div>

          <div className="flex justify-end">
            <Button>Enregistrer les modifications</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function RolesTable({ roles }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rôle</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Utilisateurs</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id}>
              <TableCell className="font-medium">{role.name}</TableCell>
              <TableCell>{role.description}</TableCell>
              <TableCell>{role.userCount}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  Modifier
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function SubscriptionPlansTable({ plans }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Plan</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Utilisateurs</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plans.map((plan) => (
            <TableRow key={plan.id}>
              <TableCell className="font-medium">{plan.name}</TableCell>
              <TableCell>{plan.price > 0 ? `${plan.price} FCFA/mois` : "Gratuit"}</TableCell>
              <TableCell>{plan.description}</TableCell>
              <TableCell>{plan.userCount}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  Modifier
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function PaymentGatewaysTable({ gateways }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Passerelle</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Mode test</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gateways.map((gateway) => (
            <TableRow key={gateway.id}>
              <TableCell className="font-medium">{gateway.name}</TableCell>
              <TableCell>
                {gateway.enabled ? (
                  <Badge className="bg-green-100 text-green-800 flex items-center gap-1 w-fit">
                    <CheckCircle2 size={14} />
                    Activé
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800 flex items-center gap-1 w-fit">
                    <XCircle size={14} />
                    Désactivé
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {gateway.testMode ? (
                  <Badge className="bg-yellow-100 text-yellow-800 w-fit">Mode test</Badge>
                ) : (
                  <Badge className="bg-blue-100 text-blue-800 w-fit">Production</Badge>
                )}
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  Configurer
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function EmailSettings({ data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration des emails</CardTitle>
        <CardDescription>Paramètres pour l'envoi d'emails</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="provider">Fournisseur</Label>
              <Input id="provider" defaultValue={data.provider} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fromEmail">Email d'expédition</Label>
              <Input id="fromEmail" type="email" defaultValue={data.fromEmail} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="replyToEmail">Email de réponse</Label>
              <Input id="replyToEmail" type="email" defaultValue={data.replyToEmail} />
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="templatesEnabled">Utiliser les templates</Label>
                <div className="text-sm text-muted-foreground">Activer l'utilisation de templates pour les emails</div>
              </div>
              <Switch id="templatesEnabled" checked={data.templatesEnabled} />
            </div>
          </div>

          <div className="flex justify-end">
            <Button>Enregistrer les modifications</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function SecuritySettings({ data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres de sécurité</CardTitle>
        <CardDescription>Configuration de la sécurité de la plateforme</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="passwordMinLength">Longueur minimale du mot de passe</Label>
              <Input id="passwordMinLength" type="number" defaultValue={data.passwordMinLength} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Timeout de session (minutes)</Label>
              <Input id="sessionTimeout" type="number" defaultValue={data.sessionTimeout} />
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="twoFactorAuthRequired">Authentification à deux facteurs obligatoire</Label>
                <div className="text-sm text-muted-foreground">
                  Exiger l'authentification à deux facteurs pour tous les utilisateurs
                </div>
              </div>
              <Switch id="twoFactorAuthRequired" checked={data.twoFactorAuthRequired} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="passwordRequiresSpecialChars">Caractères spéciaux requis</Label>
                <div className="text-sm text-muted-foreground">
                  Exiger des caractères spéciaux dans les mots de passe
                </div>
              </div>
              <Switch id="passwordRequiresSpecialChars" checked={data.passwordRequiresSpecialChars} />
            </div>
          </div>

          <div className="flex justify-end">
            <Button>Enregistrer les modifications</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

async function SettingsContent() {
  const data = await fetchSettingsData()

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="roles">Rôles</TabsTrigger>
          <TabsTrigger value="subscriptions">Abonnements</TabsTrigger>
          <TabsTrigger value="payment">Paiement</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <GeneralSettings data={data.general} />
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des rôles</CardTitle>
              <CardDescription>Configurer les rôles et permissions des utilisateurs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-end">
                <Button>Ajouter un rôle</Button>
              </div>
              <RolesTable roles={data.roles} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Plans d'abonnement</CardTitle>
              <CardDescription>Gérer les plans d'abonnement disponibles pour les vendeurs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-end">
                <Button>Ajouter un plan</Button>
              </div>
              <SubscriptionPlansTable plans={data.subscriptionPlans} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Passerelles de paiement</CardTitle>
              <CardDescription>Configurer les méthodes de paiement disponibles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-end">
                <Button>Ajouter une passerelle</Button>
              </div>
              <PaymentGatewaysTable gateways={data.paymentGateways} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <EmailSettings data={data.emailSettings} />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <SecuritySettings data={data.securitySettings} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Configuration système</h1>
      </div>
      <Suspense fallback={<div>Chargement des données...</div>}>
        <SettingsContent />
      </Suspense>
    </div>
  )
}
