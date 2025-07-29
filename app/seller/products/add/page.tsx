"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { X, Save, ArrowLeft, ImagePlus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from 'sonner'


interface ProductForm {
  name: string
  description: string
  category_id: string
  price: string
  stock: string
  unit: string
  images: File[]
  status: string
  // categoryId: string
}

const categories = [
  "Légumes",
  "Fruits",
  "Céréales",
  "Légumineuses",
  "Herbes et Épices",
  "Produits Laitiers",
  "Viandes",
  "Autres",
]
// fetch categories from the backend



const units = ["kg", "g", "pièce", "litre", "ml", "sac", "caisse", "botte"]


export default function AddProduct() {

  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<ProductForm>({
    name: "",
    description: "",
    category_id: "",
    price: "",
    stock: "",
    unit: "",
    images: [],
    status: "active"
  })
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [categories, setCategories] = useState<Array<{id: string, name: string}>>([])

  // Vérifier l'authentification au montage
  useEffect(() => {
    const checkAuth = () => {
      const storedToken = localStorage.getItem("token")
      const storedUser = localStorage.getItem("user")
      console.log(storedToken)

      if (!storedToken) {
        router.push("/auth")
      } else {
        setToken(storedToken)
        setUser(JSON.parse(storedUser || "{}"))
      }
    }

    checkAuth()
  }, [router])





  const handleInputChange = (field: keyof ProductForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length > 0) {
      setForm((prev) => ({ ...prev, images: [...prev.images, ...files].slice(0, 5) }))
    }
  }

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('seller_id', user.id)
      formData.append('name', form.name)
      formData.append('category_id', form.category_id)
      formData.append('price', form.price)
      formData.append('quantity', form.stock)
      formData.append('unit', form.unit)
      formData.append('description', form.description)
      formData.append('status', form.status)

      // Append images with filename and type information
      form.images.forEach((file, index) => {
        formData.append(`images[${index}]`, file, file.name)
      })

      // Send the request to the API
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/products`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      // Handle the response
      if (response.status === 201) {
        toast.success('Produit ajouté avec succès')
        router.push("/seller/products")
      } else {
        throw new Error('Erreur lors de l\'ajout du produit')
      }
    } catch (error: any) {
      console.error("Erreur lors de l'ajout du produit:", error)
      toast.error(error.response?.data?.message || "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = form.name && form.category_id && form.price && form.stock && form.unit
  // const [categoriesLoading, setCategoriesLoading] = useState(true)
  // const [fetchedCategories, setFetchedCategories] = useState<string[]>([])

  // Fonction pour récupérer les catégories
  const defaultCategories: string[] = [
    "Fruits et légumes",
    "Céréales",
    "Viandes",
    "Autres",
  ]

  // Fonction pour récupérer les catégories
  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      // Set the categories with their IDs and names
      console.log("Fetched categories:", response.data)
      setCategories(response.data)
      return categoryNames
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error)
      return defaultCategories
    } finally {
      setCategoriesLoading(false)
    }
  }


  // Charger les catégories au montage
  useEffect(() => {
    fetchCategories()
  }, [])

  if (!token) {
    return null
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/seller/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Link>
          </Button>
          <Separator orientation="vertical" className="h-4" />
          <h1 className="text-lg font-semibold">Ajouter un Produit</h1>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-6">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informations de Base</CardTitle>
              <CardDescription>Renseignez les informations principales de votre produit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom du Produit *</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Tomates Bio"
                    value={form.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie *</Label>
                  <Select
                    value={form.category_id}
                    onValueChange={(value) => handleInputChange("category_id", value)}
                  >
                    <SelectTrigger>
                      <SelectValue>
                        {form.category_id
                          ? categories.find(cat => cat.id === form.category_id)?.name ||
                            defaultCategories.find(cat => cat === form.category_id) ||
                            form.category_id 
                          : "Sélectionner une catégorie"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {categoriesLoading ? (
                        <SelectItem value="loading" disabled>
                          Chargement des catégories...
                        </SelectItem>
                      ) : (
                        (categories.length > 0 ? categories : defaultCategories.map(name => ({id: name, name}))).map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez votre produit..."
                  value={form.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing and Stock */}
          <Card>
            <CardHeader>
              <CardTitle>Prix et Stock</CardTitle>
              <CardDescription>Définissez le prix et la quantité disponible</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="price">Prix *</Label>
                  <div className="relative">
                    <Input
                      id="price"
                      type="number"
                      placeholder="0"
                      value={form.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      required
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                      XOF
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Quantité en Stock *</Label>
                  <Input
                    id="stock"
                    type="number"
                    placeholder="0"
                    value={form.stock}
                    onChange={(e) => handleInputChange("stock", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unité *</Label>
                  <Select value={form.unit} onValueChange={(value) => handleInputChange("unit", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une unité" />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Images du Produit</CardTitle>
              <CardDescription>Ajoutez jusqu'à 5 images de votre produit (formats acceptés: JPG, PNG)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-5">
                {form.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square border-2 border-dashed border-gray-300 rounded-lg overflow-hidden"
                  >
                    <Image
                      src={URL.createObjectURL(image) || "/placeholder.svg"}
                      alt={`Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}

                {form.images.length < 5 && (
                  <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors">
                    <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-2 p-4">
                      <ImagePlus className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground text-center">Ajouter une image</span>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Statut du Produit</CardTitle>
              <CardDescription>Choisissez si le produit doit être publié immédiatement</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={form.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif (publié)</SelectItem>
                  <SelectItem value="inactive">Brouillon</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t">
            <Button type="button" variant="outline" asChild>
              <Link href="/seller/products">Annuler</Link>
            </Button>
            <Button type="submit" disabled={!isFormValid || loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Ajout en cours...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Ajouter le Produit
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
