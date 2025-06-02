"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ShoppingCart, Package, MessageSquare, Tag, AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

// Types pour les préférences de notification
interface NotificationPreferences {
  channels: {
    email: boolean
    sms: boolean
    push: boolean
    inApp: boolean
  }
  types: {
    order: {
      enabled: boolean
      channels: {
        email: boolean
        sms: boolean
        push: boolean
        inApp: boolean
      }
    }
    delivery: {
      enabled: boolean
      channels: {
        email: boolean
        sms: boolean
        push: boolean
        inApp: boolean
      }
    }
    message: {
      enabled: boolean
      channels: {
        email: boolean
        sms: boolean
        push: boolean
        inApp: boolean
      }
    }
    promotion: {
      enabled: boolean
      channels: {
        email: boolean
        sms: boolean
        push: boolean
        inApp: boolean
      }
    }
    system: {
      enabled: boolean
      channels: {
        email: boolean
        sms: boolean
        push: boolean
        inApp: boolean
      }
    }
  }
  frequency: "immediate" | "hourly" | "daily" | "weekly"
  quiet_hours: {
    enabled: boolean
    start: string
    end: string
  }
}

// Données fictives pour les préférences de notification
const defaultPreferences: NotificationPreferences = {
  channels: {
    email: true,
    sms: false,
    push: true,
    inApp: true,
  },
  types: {
    order: {
      enabled: true,
      channels: {
        email: true,
        sms: false,
        push: true,
        inApp: true,
      },
    },
    delivery: {
      enabled: true,
      channels: {
        email: true,
        sms: true,
        push: true,
        inApp: true,
      },
    },
    message: {
      enabled: true,
      channels: {
        email: true,
        sms: false,
        push: true,
        inApp: true,
      },
    },
    promotion: {
      enabled: true,
      channels: {
        email: true,
        sms: false,
        push: false,
        inApp: true,
      },
    },
    system: {
      enabled: true,
      channels: {
        email: true,
        sms: false,
        push: true,
        inApp: true,
      },
    },
  },
  frequency: "immediate",
  quiet_hours: {
    enabled: false,
    start: "22:00",
    end: "07:00",
  },
}

export default function NotificationSettingsPage() {
  const router = useRouter()
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences)
  const [activeTab, setActiveTab] = useState("channels")
  const [isSaving, setIsSaving] = useState(false)

  // Mettre à jour les préférences de canal
  const updateChannelPreference = (channel: keyof NotificationPreferences["channels"], value: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      channels: {
        ...prev.channels,
        [channel]: value,
      },
    }))
  }

  // Mettre à jour les préférences de type
  const updateTypeEnabled = (type: keyof NotificationPreferences["types"], value: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      types: {
        ...prev.types,
        [type]: {
          ...prev.types[type],
          enabled: value,
        },
      },
    }))
  }

  // Mettre à jour les préférences de canal pour un type spécifique
  const updateTypeChannelPreference = (
    type: keyof NotificationPreferences["types"],
    channel: keyof NotificationPreferences["channels"],
    value: boolean,
  ) => {
    setPreferences((prev) => ({
      ...prev,
      types: {
        ...prev.types,
        [type]: {
          ...prev.types[type],
          channels: {
            ...prev.types[type].channels,
            [channel]: value,
          },
        },
      },
    }))
  }

  // Mettre à jour la fréquence des notifications
  const updateFrequency = (value: NotificationPreferences["frequency"]) => {
    setPreferences((prev) => ({
      ...prev,
      frequency: value,
    }))
  }

  // Mettre à jour les heures silencieuses
  const updateQuietHours = (field: keyof NotificationPreferences["quiet_hours"], value: any) => {
    setPreferences((prev) => ({
      ...prev,
      quiet_hours: {
        ...prev.quiet_hours,
        [field]: value,
      },
    }))
  }

  // Enregistrer les préférences
  const savePreferences = async () => {
    setIsSaving(true)

    try {
      // Simuler une requête API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Afficher un toast de succès
      toast({
        title: "Préférences enregistrées",
        description: "Vos préférences de notification ont été mises à jour avec succès.",
        action: <ToastAction altText="OK">OK</ToastAction>,
      })
    } catch (error) {
      console.error("Error saving preferences:", error)

      // Afficher un toast d'erreur
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de vos préférences.",
        variant: "destructive",
        action: <ToastAction altText="Réessayer">Réessayer</ToastAction>,
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paramètres de notification</h1>
          <p className="text-muted-foreground">Personnalisez vos préférences de notification</p>
        </div>
      </div>

      <Tabs defaultValue="channels" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="channels">Canaux</TabsTrigger>
          <TabsTrigger value="types">Types</TabsTrigger>
          <TabsTrigger value="advanced">Avancé</TabsTrigger>
        </TabsList>

        {/* Onglet Canaux */}
        <TabsContent value="channels" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Canaux de notification</CardTitle>
              <CardDescription>Choisissez comment vous souhaitez recevoir vos notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Notifications par email</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevez des emails concernant vos commandes, livraisons et messages
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={preferences.channels.email}
                    onCheckedChange={(checked) => updateChannelPreference("email", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-notifications">Notifications par SMS</Label>
                    <p className="text-sm text-muted-foreground">Recevez des SMS pour les mises à jour importantes</p>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={preferences.channels.sms}
                    onCheckedChange={(checked) => updateChannelPreference("sms", checked)}
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
                    checked={preferences.channels.push}
                    onCheckedChange={(checked) => updateChannelPreference("push", checked)}
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
                    checked={preferences.channels.inApp}
                    onCheckedChange={(checked) => updateChannelPreference("inApp", checked)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={savePreferences} disabled={isSaving} className="ml-auto">
                {isSaving ? "Enregistrement..." : "Enregistrer les préférences"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Onglet Types */}
        <TabsContent value="types" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Types de notification</CardTitle>
              <CardDescription>Personnalisez les notifications par type et par canal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Commandes */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                      <ShoppingCart className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <Label htmlFor="order-notifications">Commandes</Label>
                      <p className="text-sm text-muted-foreground">Notifications concernant vos commandes</p>
                    </div>
                  </div>
                  <Switch
                    id="order-notifications"
                    checked={preferences.types.order.enabled}
                    onCheckedChange={(checked) => updateTypeEnabled("order", checked)}
                  />
                </div>

                {preferences.types.order.enabled && (
                  <div className="ml-10 space-y-3 border-l pl-6">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="order-email" className="text-sm">
                        Email
                      </Label>
                      <Switch
                        id="order-email"
                        checked={preferences.types.order.channels.email}
                        onCheckedChange={(checked) => updateTypeChannelPreference("order", "email", checked)}
                        disabled={!preferences.channels.email}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="order-sms" className="text-sm">
                        SMS
                      </Label>
                      <Switch
                        id="order-sms"
                        checked={preferences.types.order.channels.sms}
                        onCheckedChange={(checked) => updateTypeChannelPreference("order", "sms", checked)}
                        disabled={!preferences.channels.sms}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="order-push" className="text-sm">
                        Push
                      </Label>
                      <Switch
                        id="order-push"
                        checked={preferences.types.order.channels.push}
                        onCheckedChange={(checked) => updateTypeChannelPreference("order", "push", checked)}
                        disabled={!preferences.channels.push}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="order-inapp" className="text-sm">
                        Dans l'application
                      </Label>
                      <Switch
                        id="order-inapp"
                        checked={preferences.types.order.channels.inApp}
                        onCheckedChange={(checked) => updateTypeChannelPreference("order", "inApp", checked)}
                        disabled={!preferences.channels.inApp}
                      />
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Livraisons */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-green-100 p-2 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                      <Package className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <Label htmlFor="delivery-notifications">Livraisons</Label>
                      <p className="text-sm text-muted-foreground">Notifications concernant vos livraisons</p>
                    </div>
                  </div>
                  <Switch
                    id="delivery-notifications"
                    checked={preferences.types.delivery.enabled}
                    onCheckedChange={(checked) => updateTypeEnabled("delivery", checked)}
                  />
                </div>

                {preferences.types.delivery.enabled && (
                  <div className="ml-10 space-y-3 border-l pl-6">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="delivery-email" className="text-sm">
                        Email
                      </Label>
                      <Switch
                        id="delivery-email"
                        checked={preferences.types.delivery.channels.email}
                        onCheckedChange={(checked) => updateTypeChannelPreference("delivery", "email", checked)}
                        disabled={!preferences.channels.email}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="delivery-sms" className="text-sm">
                        SMS
                      </Label>
                      <Switch
                        id="delivery-sms"
                        checked={preferences.types.delivery.channels.sms}
                        onCheckedChange={(checked) => updateTypeChannelPreference("delivery", "sms", checked)}
                        disabled={!preferences.channels.sms}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="delivery-push" className="text-sm">
                        Push
                      </Label>
                      <Switch
                        id="delivery-push"
                        checked={preferences.types.delivery.channels.push}
                        onCheckedChange={(checked) => updateTypeChannelPreference("delivery", "push", checked)}
                        disabled={!preferences.channels.push}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="delivery-inapp" className="text-sm">
                        Dans l'application
                      </Label>
                      <Switch
                        id="delivery-inapp"
                        checked={preferences.types.delivery.channels.inApp}
                        onCheckedChange={(checked) => updateTypeChannelPreference("delivery", "inApp", checked)}
                        disabled={!preferences.channels.inApp}
                      />
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Messages */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-purple-100 p-2 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <Label htmlFor="message-notifications">Messages</Label>
                      <p className="text-sm text-muted-foreground">Notifications concernant vos messages</p>
                    </div>
                  </div>
                  <Switch
                    id="message-notifications"
                    checked={preferences.types.message.enabled}
                    onCheckedChange={(checked) => updateTypeEnabled("message", checked)}
                  />
                </div>

                {preferences.types.message.enabled && (
                  <div className="ml-10 space-y-3 border-l pl-6">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="message-email" className="text-sm">
                        Email
                      </Label>
                      <Switch
                        id="message-email"
                        checked={preferences.types.message.channels.email}
                        onCheckedChange={(checked) => updateTypeChannelPreference("message", "email", checked)}
                        disabled={!preferences.channels.email}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="message-sms" className="text-sm">
                        SMS
                      </Label>
                      <Switch
                        id="message-sms"
                        checked={preferences.types.message.channels.sms}
                        onCheckedChange={(checked) => updateTypeChannelPreference("message", "sms", checked)}
                        disabled={!preferences.channels.sms}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="message-push" className="text-sm">
                        Push
                      </Label>
                      <Switch
                        id="message-push"
                        checked={preferences.types.message.channels.push}
                        onCheckedChange={(checked) => updateTypeChannelPreference("message", "push", checked)}
                        disabled={!preferences.channels.push}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="message-inapp" className="text-sm">
                        Dans l'application
                      </Label>
                      <Switch
                        id="message-inapp"
                        checked={preferences.types.message.channels.inApp}
                        onCheckedChange={(checked) => updateTypeChannelPreference("message", "inApp", checked)}
                        disabled={!preferences.channels.inApp}
                      />
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Promotions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-amber-100 p-2 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
                      <Tag className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <Label htmlFor="promotion-notifications">Promotions</Label>
                      <p className="text-sm text-muted-foreground">
                        Notifications concernant les promotions et offres spéciales
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="promotion-notifications"
                    checked={preferences.types.promotion.enabled}
                    onCheckedChange={(checked) => updateTypeEnabled("promotion", checked)}
                  />
                </div>

                {preferences.types.promotion.enabled && (
                  <div className="ml-10 space-y-3 border-l pl-6">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="promotion-email" className="text-sm">
                        Email
                      </Label>
                      <Switch
                        id="promotion-email"
                        checked={preferences.types.promotion.channels.email}
                        onCheckedChange={(checked) => updateTypeChannelPreference("promotion", "email", checked)}
                        disabled={!preferences.channels.email}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="promotion-sms" className="text-sm">
                        SMS
                      </Label>
                      <Switch
                        id="promotion-sms"
                        checked={preferences.types.promotion.channels.sms}
                        onCheckedChange={(checked) => updateTypeChannelPreference("promotion", "sms", checked)}
                        disabled={!preferences.channels.sms}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="promotion-push" className="text-sm">
                        Push
                      </Label>
                      <Switch
                        id="promotion-push"
                        checked={preferences.types.promotion.channels.push}
                        onCheckedChange={(checked) => updateTypeChannelPreference("promotion", "push", checked)}
                        disabled={!preferences.channels.push}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="promotion-inapp" className="text-sm">
                        Dans l'application
                      </Label>
                      <Switch
                        id="promotion-inapp"
                        checked={preferences.types.promotion.channels.inApp}
                        onCheckedChange={(checked) => updateTypeChannelPreference("promotion", "inApp", checked)}
                        disabled={!preferences.channels.inApp}
                      />
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Système */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-red-100 p-2 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <Label htmlFor="system-notifications">Système</Label>
                      <p className="text-sm text-muted-foreground">
                        Notifications concernant votre compte et la sécurité
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="system-notifications"
                    checked={preferences.types.system.enabled}
                    onCheckedChange={(checked) => updateTypeEnabled("system", checked)}
                  />
                </div>

                {preferences.types.system.enabled && (
                  <div className="ml-10 space-y-3 border-l pl-6">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="system-email" className="text-sm">
                        Email
                      </Label>
                      <Switch
                        id="system-email"
                        checked={preferences.types.system.channels.email}
                        onCheckedChange={(checked) => updateTypeChannelPreference("system", "email", checked)}
                        disabled={!preferences.channels.email}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="system-sms" className="text-sm">
                        SMS
                      </Label>
                      <Switch
                        id="system-sms"
                        checked={preferences.types.system.channels.sms}
                        onCheckedChange={(checked) => updateTypeChannelPreference("system", "sms", checked)}
                        disabled={!preferences.channels.sms}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="system-push" className="text-sm">
                        Push
                      </Label>
                      <Switch
                        id="system-push"
                        checked={preferences.types.system.channels.push}
                        onCheckedChange={(checked) => updateTypeChannelPreference("system", "push", checked)}
                        disabled={!preferences.channels.push}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="system-inapp" className="text-sm">
                        Dans l'application
                      </Label>
                      <Switch
                        id="system-inapp"
                        checked={preferences.types.system.channels.inApp}
                        onCheckedChange={(checked) => updateTypeChannelPreference("system", "inApp", checked)}
                        disabled={!preferences.channels.inApp}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={savePreferences} disabled={isSaving} className="ml-auto">
                {isSaving ? "Enregistrement..." : "Enregistrer les préférences"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Onglet Avancé */}
        <TabsContent value="advanced" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres avancés</CardTitle>
              <CardDescription>Configurez des paramètres avancés pour vos notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="frequency">Fréquence des notifications</Label>
                  <Select value={preferences.frequency} onValueChange={(value: any) => updateFrequency(value)}>
                    <SelectTrigger id="frequency">
                      <SelectValue placeholder="Sélectionnez une fréquence" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immédiate</SelectItem>
                      <SelectItem value="hourly">Toutes les heures</SelectItem>
                      <SelectItem value="daily">Quotidienne</SelectItem>
                      <SelectItem value="weekly">Hebdomadaire</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {preferences.frequency === "immediate"
                      ? "Recevez les notifications dès qu'elles sont disponibles"
                      : preferences.frequency === "hourly"
                        ? "Recevez un résumé des notifications toutes les heures"
                        : preferences.frequency === "daily"
                          ? "Recevez un résumé quotidien des notifications"
                          : "Recevez un résumé hebdomadaire des notifications"}
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="quiet-hours">Heures silencieuses</Label>
                      <p className="text-sm text-muted-foreground">
                        Ne pas recevoir de notifications pendant certaines heures
                      </p>
                    </div>
                    <Switch
                      id="quiet-hours"
                      checked={preferences.quiet_hours.enabled}
                      onCheckedChange={(checked) => updateQuietHours("enabled", checked)}
                    />
                  </div>

                  {preferences.quiet_hours.enabled && (
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="quiet-start">Début</Label>
                        <input
                          id="quiet-start"
                          type="time"
                          value={preferences.quiet_hours.start}
                          onChange={(e) => updateQuietHours("start", e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quiet-end">Fin</Label>
                        <input
                          id="quiet-end"
                          type="time"
                          value={preferences.quiet_hours.end}
                          onChange={(e) => updateQuietHours("end", e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={savePreferences} disabled={isSaving} className="ml-auto">
                {isSaving ? "Enregistrement..." : "Enregistrer les préférences"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
