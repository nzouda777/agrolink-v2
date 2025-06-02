import Link from "next/link"
import { ArrowLeft, Truck, CreditCard, MapPin, Package, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Placeholder data
const orderDetails = {
  id: "ORD-001",
  date: "2023-05-01",
  status: "Livré",
  total: 125.5,
  items: [
    { id: 1, name: "Tomates Bio", quantity: 2, price: 4.5, total: 9.0, image: "/placeholder.svg?height=80&width=80" },
    {
      id: 2,
      name: "Pommes de terre",
      quantity: 5,
      price: 2.3,
      total: 11.5,
      image: "/placeholder.svg?height=80&width=80",
    },
    { id: 3, name: "Carottes", quantity: 3, price: 3.0, total: 9.0, image: "/placeholder.svg?height=80&width=80" },
  ],
  subtotal: 105.5,
  shipping: 10.0,
  tax: 10.0,
  seller: {
    name: "Ferme Durand",
    address: "123 Rue de la Ferme, 75001 Paris",
    phone: "01 23 45 67 89",
    email: "contact@fermedurand.fr",
  },
  shipping_address: {
    name: "Jean Dupont",
    address: "456 Avenue des Champs, 75008 Paris",
    phone: "06 12 34 56 78",
  },
  payment: {
    method: "Carte bancaire",
    card: "**** **** **** 1234",
    status: "Payé",
  },
  tracking: {
    number: "TRK12345678",
    url: "#",
    status: "Livré",
    steps: [
      { id: 1, name: "Commande reçue", date: "2023-05-01", completed: true },
      { id: 2, name: "Paiement confirmé", date: "2023-05-01", completed: true },
      { id: 3, name: "En préparation", date: "2023-05-02", completed: true },
      { id: 4, name: "Expédiée", date: "2023-05-03", completed: true },
      { id: 5, name: "Livrée", date: "2023-05-05", completed: true },
    ],
  },
}

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params
  // In a real app, fetch order details based on ID
  const order = orderDetails

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/buyer/orders">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Commande {order.id}</h1>
            <p className="text-muted-foreground">Passée le {new Date(order.date).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/buyer/messages?seller=${order.seller.name}`}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Contacter le vendeur
            </Link>
          </Button>
          <Button>Acheter à nouveau</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Statut de la commande</span>
                <Badge>{order.status}</Badge>
              </CardTitle>
              <CardDescription>Suivi de votre commande</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={100} className="h-2" />

                <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                  {order.tracking.steps.map((step, index) => (
                    <div key={step.id} className="flex flex-col items-center text-center">
                      <div
                        className={`rounded-full p-2 ${
                          step.completed ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        {index === 0 ? (
                          <Package className="h-4 w-4" />
                        ) : index === order.tracking.steps.length - 1 ? (
                          <MapPin className="h-4 w-4" />
                        ) : (
                          <Truck className="h-4 w-4" />
                        )}
                      </div>
                      <p className="text-xs font-medium mt-1">{step.name}</p>
                      <p className="text-xs text-muted-foreground">{new Date(step.date).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>

                {order.tracking.number && (
                  <div className="flex justify-between items-center pt-4 text-sm">
                    <span>Numéro de suivi: {order.tracking.number}</span>
                    <Button variant="link" size="sm" className="h-auto p-0" asChild>
                      <Link href={order.tracking.url}>Suivre le colis</Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Articles commandés</CardTitle>
              <CardDescription>
                {order.items.length} article(s) de {order.seller.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-start gap-4">
                    <div className="h-20 w-20 rounded-md overflow-hidden bg-muted">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">Quantité: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{item.total.toFixed(2)} FCFA</p>
                      <p className="text-sm text-muted-foreground">{item.price.toFixed(2)} FCFA / unité</p>
                    </div>
                  </div>
                ))}

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sous-total</span>
                    <span>{order.subtotal.toFixed(2)} FCFA</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Frais de livraison</span>
                    <span>{order.shipping.toFixed(2)} FCFA</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>TVA</span>
                    <span>{order.tax.toFixed(2)} FCFA</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>{order.total.toFixed(2)} FCFA</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations de livraison</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium">{order.shipping_address.name}</h4>
                  <p className="text-sm text-muted-foreground">{order.shipping_address.address}</p>
                  <p className="text-sm text-muted-foreground">{order.shipping_address.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Paiement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium">{order.payment.method}</h4>
                  {order.payment.card && <p className="text-sm text-muted-foreground">{order.payment.card}</p>}
                  <p className="text-sm text-muted-foreground">Statut: {order.payment.status}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informations vendeur</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">{order.seller.name}</h4>
                <p className="text-sm text-muted-foreground">{order.seller.address}</p>
                <p className="text-sm text-muted-foreground">{order.seller.phone}</p>
                <p className="text-sm text-muted-foreground">{order.seller.email}</p>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href={`/buyer/messages?seller=${order.seller.name}`}>Contacter le vendeur</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
