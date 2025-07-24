"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Upload, X, Plus, Save, Eye } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"

interface Product {
  id: number
  name: string
  description: string
  price: number
  oldPrice?: number
  unit: string
  quantity: number
  category: string
  images: string[]
  details: Record<string, string>
  region: string
  status: "active" | "inactive" | "out_of_stock"
  tags: string[]
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    oldPrice: "",
    unit: "kg",
    quantity: "",
    category: "",
    region: "",
    status: "active" as "active" | "inactive" | "out_of_stock",
    tags: [] as string[],
    details: {} as Record<string, string>,
    images: [] as string[],
    files: [] as File[]
  })

  const [token] = useState(() => localStorage.getItem('token') || '')
  const [newTag, setNewTag] = useState("")
  const [newDetailKey, setNewDetailKey] = useState("")
  const [newDetailValue, setNewDetailValue] = useState("")

  const categories = [
    "Fruits",
    "Légumes",
    "Céréales",
    "Légumineuses",
    "Épices",
    "Herbes",
    "Produits laitiers",
    "Viandes",
    "Poissons",
    "Autres",
  ]

  const regions = [
    "Dakar",
    "Thiès",
    "Saint-Louis",
    "Diourbel",
    "Kaolack",
    "Tambacounda",
    "Ziguinchor",
    "Louga",
    "Fatick",
    "Kolda",
    "Matam",
    "Kaffrine",
    "Kédougou",
    "Sédhiou",
  ]

  useEffect(() => {
    fetchProduct()
  }, [params.id])

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/${params.id}`)
      if (!response) {
        throw new Error("Product not found")
      }
      const productData = await response.data
      setProduct(productData)

      // Remplir le formulaire avec les données existantes
      setFormData({
        name: productData.name || "",
        description: productData.description || "",
        price: productData.price?.toString() || "",
        oldPrice: productData.oldPrice?.toString() || "",
        unit: productData.unit || "kg",
        quantity: productData.quantity?.toString() || "",
        category: productData.category || "",
        region: productData.region || "",
        status: productData.status || "active",
        tags: productData.tags || [],
        details: productData.details || {},
        images: productData.images || [],
        files: []
      })
    } catch (error) {
      toast.error("Erreur lors du chargement du produit")
      router.push("/seller/products")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const validFiles = Array.from(files).filter(file => {
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']
        return validTypes.includes(file.type)
      })

      if (validFiles.length === 0) {
        toast.error("Veuillez sélectionner des fichiers d'image valides (JPEG, PNG, JPG, GIF)")
        return
      }

      // Check file size (2MB limit)
      const maxSize = 2 * 1024 * 1024 // 2MB
      const tooLargeFiles = validFiles.filter(file => file.size > maxSize)
      
      if (tooLargeFiles.length > 0) {
        toast.error("Les fichiers doivent être plus petits que 2MB")
        return
      }

      const newImages = validFiles.map(file => URL.createObjectURL(file))
      
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...validFiles],
        images: [...prev.images, ...newImages]
      }))

      // Clean up URLs when component unmounts
      return () => {
        newImages.forEach((url) => URL.revokeObjectURL(url))
      }
    }
  }

  const removeFile = (index: number) => {
    const imageToRemove = formData.images[index]
    URL.revokeObjectURL(imageToRemove)
    
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleAddDetail = () => {
    if (newDetailKey.trim() && newDetailValue.trim()) {
      setFormData((prev) => ({
        ...prev,
        details: {
          ...prev.details,
          [newDetailKey.trim()]: newDetailValue.trim(),
        },
      }))
      setNewDetailKey("")
      setNewDetailValue("")
    }
  }

  const handleRemoveDetail = (keyToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      details: Object.fromEntries(Object.entries(prev.details).filter(([key]) => key !== keyToRemove)),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const formDataToSend = new FormData()
      
      // Add form data
      formDataToSend.append('id', params.id.toString())
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('price', formData.price)
      formDataToSend.append('oldPrice', formData.oldPrice)
      formDataToSend.append('unit', formData.unit)
      formDataToSend.append('quantity', formData.quantity)
      formDataToSend.append('category', formData.category)
      formDataToSend.append('region', formData.region)
      formDataToSend.append('status', formData.status)
      formDataToSend.append('tags', JSON.stringify(formData.tags))
      formDataToSend.append('details', JSON.stringify(formData.details))

        // Add files
        formData.files.forEach((file, index) => {
          formDataToSend.append(`image_${index}`, file)
        })

      // Send the request
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/seller/products/${params.id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response) {
        throw new Error("Failed to update product")
      }

      toast.success("Produit mis à jour avec succès!")
      router.push("/seller/products")
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du produit")
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateImage = async () => {
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('id', params.id.toString())
      
      // Check if there are new files to upload
      if (formData.files.length > 0) {
        // Add new files to form data
        formData.files.forEach((file, index) => {
          formDataToSend.append('image', file)
        })
        
        // Make POST request to upload new files
        const uploadResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/products/${params.id}/images`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!uploadResponse) {
          throw new Error("Failed to upload new images")
        }
        
        // Update the formData with new image URLs if available
        if (uploadResponse.data?.images) {
          setFormData(prev => ({
            ...prev,
            images: uploadResponse.data.images,
            files: [] // Clear the uploaded files
          }))
        }
      }
      
      // If there are no new files but we have existing images to update
      if (formData.images.length > 0 && formData.files.length === 0) {
        formDataToSend.append('images', JSON.stringify(formData.images))
        const updateResponse = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/products/${params.id}/images`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!updateResponse) {
          throw new Error("Failed to update product images")
        }
      }
      
      toast.success("Images mises à jour avec succès!")
    } catch (error) {
      toast.error("Erreur lors de la mise à jour des images")
    }
  } 

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Produit non trouvé</h2>
          <p className="text-gray-600 mb-4">Le produit que vous cherchez n'existe pas.</p>
          <Button onClick={() => router.push("/seller/products")}>Retour aux produits</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
        
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/seller/products")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Modifier le produit</h1>
            <p className="text-gray-600">Modifiez les informations de votre produit</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => router.push(`/products/${params.id}`)}>
            <Eye className="h-4 w-4 mr-2" />
            Aperçu
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informations principales */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations générales</CardTitle>
                <CardDescription>Informations de base sur votre produit</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom du produit *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Ex: Tomates cerises bio"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Décrivez votre produit en détail..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Catégorie *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="region">Région *</Label>
                    <Select value={formData.region} onValueChange={(value) => handleInputChange("region", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une région" />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map((region) => (
                          <SelectItem key={region} value={region}>
                            {region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prix et stock */}
            <Card>
              <CardHeader>
                <CardTitle>Prix et stock</CardTitle>
                <CardDescription>Définissez le prix et la quantité disponible</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">Prix *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <Label htmlFor="oldPrice">Ancien prix</Label>
                    <Input
                      id="oldPrice"
                      type="number"
                      step="0.01"
                      value={formData.oldPrice}
                      onChange={(e) => handleInputChange("oldPrice", e.target.value)}
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <Label htmlFor="unit">Unité *</Label>
                    <Select value={formData.unit} onValueChange={(value) => handleInputChange("unit", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">Kilogramme (kg)</SelectItem>
                        <SelectItem value="g">Gramme (g)</SelectItem>
                        <SelectItem value="l">Litre (l)</SelectItem>
                        <SelectItem value="ml">Millilitre (ml)</SelectItem>
                        <SelectItem value="pièce">Pièce</SelectItem>
                        <SelectItem value="paquet">Paquet</SelectItem>
                        <SelectItem value="sac">Sac</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="quantity">Quantité disponible *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange("quantity", e.target.value)}
                    placeholder="0"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
                <CardDescription>Ajoutez des mots-clés pour améliorer la recherche</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Nouveau tag"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                  />
                  <Button type="button" onClick={handleAddTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Détails supplémentaires */}
            <Card>
              <CardHeader>
                <CardTitle>Détails supplémentaires</CardTitle>
                <CardDescription>Ajoutez des informations spécifiques sur votre produit</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {Object.entries(formData.details).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>
                        <strong>{key}:</strong> {value}
                      </span>
                      <X className="h-4 w-4 cursor-pointer text-red-500" onClick={() => handleRemoveDetail(key)} />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={newDetailKey}
                    onChange={(e) => setNewDetailKey(e.target.value)}
                    placeholder="Clé (ex: Origine)"
                  />
                  <Input
                    value={newDetailValue}
                    onChange={(e) => setNewDetailValue(e.target.value)}
                    placeholder="Valeur (ex: Agriculture biologique)"
                  />
                </div>
                <Button type="button" onClick={handleAddDetail} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un détail
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statut */}
            <Card>
              <CardHeader>
                <CardTitle>Statut du produit</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={formData.status}
                  onValueChange={(value: "active" | "inactive" | "out_of_stock") => handleInputChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                    <SelectItem value="out_of_stock">Rupture de stock</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Images du produit</CardTitle>
                <CardDescription>Ajoutez des images de votre produit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <div className="aspect-square w-24 rounded-lg overflow-hidden">
                          <img
                            src={image}
                            alt="Product image"
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="relative w-full">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('file-upload')?.click()}
                      className="w-full bg-transparent"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Ajouter des images
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button type="button" className="w-full" disabled={saving} onClick={handleUpdateImage}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Enregistrement..." : "Enregistrer l'image"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => router.push("/seller/products")}
                >
                  Annuler
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
