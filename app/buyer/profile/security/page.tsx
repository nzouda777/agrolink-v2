"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Smartphone, Laptop, LogOut } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"

// Données fictives pour les appareils connectés
const connectedDevices = [
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
]

export default function SecurityPage() {
  const router = useRouter()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [deviceToLogout, setDeviceToLogout] = useState<number | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginNotifications: true,
    sessionTimeout: true,
  })

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsChangingPassword(true)

    try {
      // Simuler une requête API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Réinitialiser le formulaire
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      // Afficher un message de succès (dans une application réelle)
    } catch (error) {
      console.error("Error changing password:", error)
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleLogoutDevice = async () => {
    if (!deviceToLogout) return

    setIsLoggingOut(true)
    try {
      // Simuler une requête API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // Dans une application réelle, vous déconnecteriez l'appareil ici
    } catch (error) {
      console.error("Error logging out device:", error)
    } finally {
      setIsLoggingOut(false)
      setDeviceToLogout(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sécurité</h1>
          <p className="text-muted-foreground">Gérez les paramètres de sécurité de votre compte</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Changement de mot de passe */}
        <Card className="md:col-span-1">
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
                disabled={isChangingPassword || passwordForm.newPassword !== passwordForm.confirmPassword}
                className="w-full"
              >
                {isChangingPassword ? "Modification en cours..." : "Changer le mot de passe"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Paramètres de sécurité */}
        <Card className="md:col-span-1">
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
                checked={securitySettings.twoFactorAuth}
                onCheckedChange={(checked) => setSecuritySettings((prev) => ({ ...prev, twoFactorAuth: checked }))}
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
                checked={securitySettings.loginNotifications}
                onCheckedChange={(checked) => setSecuritySettings((prev) => ({ ...prev, loginNotifications: checked }))}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sessionTimeout">Expiration de session</Label>
                <p className="text-sm text-muted-foreground">Déconnexion automatique après 30 minutes d'inactivité</p>
              </div>
              <Switch
                id="sessionTimeout"
                checked={securitySettings.sessionTimeout}
                onCheckedChange={(checked) => setSecuritySettings((prev) => ({ ...prev, sessionTimeout: checked }))}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Enregistrer les paramètres</Button>
          </CardFooter>
        </Card>

        {/* Appareils connectés */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Appareils connectés</CardTitle>
            <CardDescription>Gérez les appareils connectés à votre compte</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {connectedDevices.map((device) => {
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
                            Cette action déconnectera l'appareil "{device.name}" de votre compte. L'utilisateur devra se
                            reconnecter pour accéder à votre compte.
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
    </div>
  )
}
