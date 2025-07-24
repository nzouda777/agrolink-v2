"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, Mail, Lock, User, Phone, Facebook, Twitter, Github } from "lucide-react"
import { useRouter } from "next/navigation"
import axios from 'axios'




// Mock data for regions and cities
let regions = [
  { id: 1, name: "Centre" },
  { id: 2, name: "Littoral" },
  { id: 3, name: "Ouest" },
  { id: 4, name: "Nord" },
  { id: 5, name: "Sud" },
  { id: 6, name: "Est" },
  { id: 7, name: "Extrême-Nord" },
  { id: 8, name: "Nord-Ouest" },
  { id: 9, name: "Sud-Ouest" },
  { id: 10, name: "Adamaoua" },
]

let cities = {
  1: [{ id: 1, name: "Yaoundé" }],
  2: [{ id: 2, name: "Douala" }],
  3: [{ id: 3, name: "Bafoussam" }],
  4: [{ id: 4, name: "Garoua" }],
  5: [
    { id: 5, name: "Ebolowa" },
    { id: 6, name: "Kribi" },
  ],
  6: [{ id: 7, name: "Bertoua" }],
  7: [{ id: 8, name: "Maroua" }],
}

// Mock data for user types
let userTypes = [
  { id: 1, name: "Particulier" },
  { id: 2, name: "Restaurant" },
  { id: 3, name: "Revendeur" },
  { id: 4, name: "Supermarché" },
  { id: 5, name: "Coopérative" },
]

// fetch userType from backend
const fetchUserTypes = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/types`)
    userTypes = response.data
    return response.data
  } catch (error) {
    console.error("Error fetching user types:", error)
    return []
  }
}
// userType
const userType = fetchUserTypes()

// fetch regions
const fetchRegions = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/regions`)
    regions = response.data
    return response.data
  } catch (error) {
    console.error("Error fetching regions:", error)
    return []
  }
}
const region = fetchRegions()

// fetch cities matching selected region
const fetchCitiesByRegions = async (selectedRegion: string) => {
  console.log(selectedRegion)
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/regions/${selectedRegion}/cities`)
    let cities = response.data
    return response.data
  } catch (error) {
    console.error("Error fetching cities by region:", error)
    return []
  }
}
// const city = fetchCitiesByRegions("Centre")  
// console.log(city)

// get register form data
const registerFormData = {
  
}
// register user
// const registerUser = async (user: any) => {
//   try {
//     const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/register`, user)
//     return response.data
//   } catch (error) {
//     console.error("Error registering user:", error)
//     return null
//   }
// }

// handle register inputs datas

export default function AuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get("tab") === "register" ? "register" : "login"
  
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [regionCities, setRegionCities] = useState<any[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    // Vérifier si tous les champs sont remplis
    const name = formData.get("register-name")
    const email = formData.get("register-email")
    const phone = formData.get("register-phone")
    const password = formData.get("register-password")
    const type_id = formData.get("user-type")
    const city = formData.get("city")
    
    if (!name || !email || !phone || !password || !type_id || !city) {
      setError('Veuillez remplir tous les champs obligatoires')
      return
    }
  
    const data = {
      name: name as string,
      email: email as string,
      phone: phone as string,
      password: password as string,
      type_id: type_id as string,
      city_id: city as string,
      role_id: '2'
    }
    
    try {
      setIsLoading(true)
      setError(null)
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/register`, data)
      console.log('Inscription réussie:', response.data)
      router.push('/auth')
    } catch (error) {
      const message = error.response?.data?.message || "Une erreur est survenue lors de l'inscription"
      setError(message)
      console.error("Error registering user:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get("login-email")
    const password = formData.get("login-password")
    
    if (!email || !password) {
      setError('Veuillez remplir tous les champs obligatoires')
      return
    }
    
    const data = {
      email: email as string,
      password: password as string
    }
    
    try {
      setIsLoading(true)
      setError(null)
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, data)
      console.log('Connexion réussie:', response.data)
      localStorage.setItem("token", response.data.access_token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
      router.push('/seller/dashboard')
    } catch (error) {
      const message = error.response?.data?.message || "Une erreur est survenue lors de la connexion"
      setError(message)
      console.error("Error logging in:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch cities when region changes
  useEffect(() => {
    if (selectedRegion) {
      fetchCitiesByRegions(selectedRegion).then((data) => {
        setRegionCities(data)
        console.log(data)
      })
    } else {
      setRegionCities([])
    }
  }, [selectedRegion])

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="container py-8 md:py-12 flex flex-col items-center">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-1 font-bold text-2xl mb-2">
            <span className="text-primary">Agro</span>Link
          </Link>
          <p className="text-muted-foreground">Connectez-vous pour accéder à votre compte ou créez-en un nouveau</p>
        </div>

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="register">Inscription</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleSubmitLogin}>
            <Card>
              <CardHeader>
                <CardTitle>Connexion</CardTitle>
                <CardDescription>Entrez vos identifiants pour accéder à votre compte</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="login-email" type="email" name="login-email" placeholder="exemple@email.com" className="pl-9" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password">Mot de passe</Label>
                    <Link href="/auth/reset-password" className="text-xs text-primary hover:underline">
                      Mot de passe oublié?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      name="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-9"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                      </span>
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Se souvenir de moi
                  </label>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col">
                <Button className="w-full mb-4" type="submit">Se connecter</Button>
                <div className="relative w-full mb-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Ou continuer avec</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" size="icon">
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Github className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <Card>

            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Créer un compte</CardTitle>
                <CardDescription>Remplissez le formulaire ci-dessous pour créer votre compte</CardDescription>
                {error && (
                  <div className="text-red-500 text-sm">
                    {error}
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Nom complet</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="register-name" placeholder="Votre nom complet" name="register-name" className="pl-9" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="register-email" type="email" placeholder="exemple@email.com" name="register-email" className="pl-9" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-phone">Téléphone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="register-phone" placeholder="6XXXXXXXX" name="register-phone" className="pl-9" />
                  </div>
                </div>
                {/* <div className="space-y-2">
                  <Label htmlFor=" register-password">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="register-password" type="password" placeholder="••••••••" name="register-password" required className="pl-9" />
                  </div>
                </div> */}
                <div className="space-y-2">
                  <Label htmlFor="user-type">Type d'utilisateur</Label>
                  <Select name="user-type">
                    <SelectTrigger id="user-type">
                      <SelectValue placeholder="Sélectionnez votre type" />
                    </SelectTrigger>
                    <SelectContent>
                      {userTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="region">Région</Label>
                    <Select name="region" onValueChange={(value) => setSelectedRegion(value)}>
                      <SelectTrigger id="region">
                        <SelectValue placeholder="Sélectionnez" />
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
                    <Select name="city" disabled={!selectedRegion}>
                      <SelectTrigger id="city">
                        <SelectValue placeholder="Sélectionnez" />
                      </SelectTrigger>
                      <SelectContent>
                        {regionCities.length > 0 ? (
                          regionCities.map((city) => (
                            <SelectItem key={city.id} value={city.id.toString()}>
                              {city.name}
                            </SelectItem>
                          ))
                        ) : (
                          
                          <SelectItem value="no-cities">Aucune ville disponible</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      name="register-password"
                      required
                      className="pl-9"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                      </span>
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" name="terms" required />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    J'accepte les{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      conditions d'utilisation
                    </Link>{" "}
                    et la{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      politique de confidentialité
                    </Link>
                  </label>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col">
                <Button className="w-full mb-4" disabled={isLoading} type="submit">
                  {isLoading ? "En cours..." : "Créer un compte"}
                </Button>
                <div className="relative w-full mb-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Ou continuer avec</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" size="icon">
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Github className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
