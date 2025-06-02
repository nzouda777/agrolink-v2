"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Truck, ShieldCheck, Heart, Share2, MapPin, Phone, Mail, ChevronRight, Minus, Plus } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { productsData, reviewsData } from "@/data"
import type { Product, Review } from "@/types"

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Simuler un délai réseau
        await new Promise((resolve) => setTimeout(resolve, 800))

        const id = Number.parseInt(params.id)
        const foundProduct = productsData.find((p) => p.id === id)

        if (foundProduct) {
          setProduct(foundProduct)

          // Filtrer les avis pour ce produit
          const productReviews = reviewsData.filter((r) => r.productId === id)
          setReviews(productReviews)

          // Trouver des produits similaires (même catégorie)
          const similar = productsData.filter((p) => p.category === foundProduct.category && p.id !== id).slice(0, 4)
          setRelatedProducts(similar)
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [params.id])

  const incrementQuantity = () => {
    if (product && quantity < product.quantity) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  if (isLoading) {
    return (
      <div className="container py-20">
        <LoadingSpinner size={40} />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Produit non trouvé</h2>
          <p className="text-muted-foreground mb-6">Le produit que vous recherchez n'existe pas ou a été supprimé.</p>
          <Button asChild>
            <Link href="/products">Retour aux produits</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col gap-8">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Accueil
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link href="/products" className="hover:text-foreground">
            Produits
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link href={`/products/category/${product.category.toLowerCase()}`} className="hover:text-foreground">
            {product.category}
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="font-medium text-foreground">{product.name}</span>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square relative rounded-lg overflow-hidden border">
              <Image src={product.images[0] || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <div key={index} className="aspect-square relative rounded-md overflow-hidden border">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge>{product.category}</Badge>
                <Badge
                  variant="outline"
                  className="text-amber-500 border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800"
                >
                  <Star className="h-3 w-3 fill-amber-500 text-amber-500 mr-1" />
                  {product.rating} ({product.reviewCount} avis)
                </Badge>
              </div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-2xl font-bold">
                  {product.price.toLocaleString()} FCFA/{product.unit}
                </span>
                {product.oldPrice && (
                  <span className="text-muted-foreground line-through">{product.oldPrice.toLocaleString()} FCFA</span>
                )}
              </div>
            </div>

            <p className="text-muted-foreground">{product.description}</p>

            <div className="flex items-center gap-4 py-2">
              <div className="flex items-center border rounded-md">
                <Button variant="ghost" size="icon" className="rounded-none" onClick={decrementQuantity}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button variant="ghost" size="icon" className="rounded-none" onClick={incrementQuantity}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                {product.quantity} {product.unit} disponibles
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="flex-1">
                Ajouter au panier
              </Button>
              <Button size="lg" variant="outline" className="flex-1">
                Acheter maintenant
              </Button>
            </div>

            <div className="flex gap-4">
              <Button variant="ghost" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Ajouter aux favoris
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Partager
              </Button>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                <span>Livraison disponible dans toute la région</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span>Qualité garantie par AgroLink</span>
              </div>
            </div>

            <Separator />

            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={product.seller.image || "/placeholder.svg"} alt={product.seller.name} />
                <AvatarFallback>{product.seller.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{product.seller.name}</div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Star className="h-3 w-3 fill-amber-500 text-amber-500 mr-1" />
                  {product.seller.rating} · Membre depuis {product.seller.memberSince}
                </div>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                Voir le profil
              </Button>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <Tabs defaultValue="details" className="mt-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="reviews">Avis ({reviews.length})</TabsTrigger>
            <TabsTrigger value="seller">Vendeur</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="p-4 border rounded-md mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Caractéristiques du produit</h3>
                <ul className="space-y-2">
                  {Object.entries(product.details).map(([key, value]) => (
                    <li key={key} className="flex justify-between py-2 border-b last:border-0">
                      <span className="text-muted-foreground capitalize">{key}</span>
                      <span>{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4">Informations supplémentaires</h3>
                <p className="text-muted-foreground mb-4">
                  Ces {product.name.toLowerCase()} sont cultivés selon des méthodes traditionnelles respectueuses de
                  l'environnement. Ils sont récoltés à maturité pour garantir une saveur optimale et une fraîcheur
                  exceptionnelle.
                </p>
                <p className="text-muted-foreground">
                  Nos agriculteurs utilisent des techniques d'agriculture durable pour produire des produits de haute
                  qualité tout en préservant les ressources naturelles et en minimisant l'impact environnemental.
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="p-4 border rounded-md mt-2">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Avis des clients</h3>
                <Button>Laisser un avis</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 bg-muted/50 p-4 rounded-lg">
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold">{product.rating}</div>
                    <div className="flex justify-center my-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < Math.floor(product.rating) ? "fill-amber-500 text-amber-500" : "text-muted-foreground"}`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">Basé sur {product.reviewCount} avis</div>
                  </div>

                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center gap-2">
                        <div className="text-sm w-2">{star}</div>
                        <Star className="h-4 w-4 text-amber-500" />
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-amber-500 h-2 rounded-full"
                            style={{
                              width: `${star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 7 : star === 2 ? 2 : 1}%`,
                            }}
                          ></div>
                        </div>
                        <div className="text-xs text-muted-foreground w-8">
                          {star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 7 : star === 2 ? 2 : 1}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-span-2 space-y-6">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review.id} className="border-b pb-6 last:border-0">
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={review.user.image || "/placeholder.svg"} alt={review.user.name} />
                              <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{review.user.name}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                        <div className="flex mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? "fill-amber-500 text-amber-500" : "text-muted-foreground"}`}
                            />
                          ))}
                        </div>
                        <p className="text-muted-foreground">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-8 text-muted-foreground">Aucun avis pour ce produit</p>
                  )}

                  {reviews.length > 0 && (
                    <Button variant="outline" className="w-full">
                      Voir tous les avis
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="seller" className="p-4 border rounded-md mt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="col-span-1">
                <div className="flex flex-col items-center text-center p-6 border rounded-lg">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarImage src={product.seller.image || "/placeholder.svg"} alt={product.seller.name} />
                    <AvatarFallback>{product.seller.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold mb-1">{product.seller.name}</h3>
                  <div className="flex items-center mb-2">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500 mr-1" />
                    <span>{product.seller.rating}</span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">Membre depuis {product.seller.memberSince}</div>
                  <div className="flex flex-col gap-2 w-full">
                    <Button>Contacter</Button>
                    <Button variant="outline">Voir tous les produits</Button>
                  </div>
                </div>
              </div>

              <div className="col-span-2 space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Informations sur le vendeur</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <div className="font-medium">Localisation</div>
                        <div className="text-muted-foreground">{product.seller.location}</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <div className="font-medium">Téléphone</div>
                        <div className="text-muted-foreground">Visible après achat</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <div className="font-medium">Email</div>
                        <div className="text-muted-foreground">Visible après achat</div>
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Statistiques du vendeur</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg text-center">
                      <div className="text-2xl font-bold text-primary mb-1">{product.seller.responseRate}</div>
                      <div className="text-sm text-muted-foreground">Taux de réponse</div>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <div className="text-2xl font-bold text-primary mb-1">24h</div>
                      <div className="text-sm text-muted-foreground">Temps de réponse</div>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <div className="text-2xl font-bold text-primary mb-1">98%</div>
                      <div className="text-sm text-muted-foreground">Satisfaction client</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Produits similaires</h2>
            <Button variant="ghost" asChild>
              <Link href="/products" className="flex items-center">
                Voir plus
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          {relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden group">
                  <div className="aspect-square relative">
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <Badge className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm">
                      {product.category}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium line-clamp-1">{product.name}</h3>
                      <div className="flex items-center text-amber-500">
                        <Star className="fill-current h-4 w-4 mr-1" />
                        <span className="text-sm">{product.rating}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="font-bold">
                        {product.price.toLocaleString()} FCFA/{product.unit}
                      </p>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/products/${product.id}`}>Détails</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">Aucun produit similaire disponible</p>
          )}
        </div>
      </div>
    </div>
  )
}
