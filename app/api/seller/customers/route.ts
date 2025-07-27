import { NextResponse } from "next/server"

const customersData = [
  {
    id: "1",
    name: "Marie Dubois",
    email: "marie.dubois@email.com",
    phone: "+221 77 123 45 67",
    location: "Dakar, Sénégal",
    totalOrders: 12,
    totalSpent: 45600,
    averageOrderValue: 3800,
    lastOrderDate: "2024-01-20T10:30:00Z",
    joinDate: "2023-08-15T09:00:00Z",
    status: "active",
    segment: "regular",
    avatar: "/placeholder.svg?height=40&width=40&text=MD",
  },
  {
    id: "2",
    name: "Amadou Ba",
    email: "amadou.ba@email.com",
    phone: "+221 76 987 65 43",
    location: "Thiès, Sénégal",
    totalOrders: 8,
    totalSpent: 28400,
    averageOrderValue: 3550,
    lastOrderDate: "2024-01-18T14:15:00Z",
    joinDate: "2023-10-22T11:30:00Z",
    status: "active",
    segment: "new",
    avatar: "/placeholder.svg?height=40&width=40&text=AB",
  },
  {
    id: "3",
    name: "Fatou Sall",
    email: "fatou.sall@email.com",
    phone: "+221 78 456 78 90",
    location: "Saint-Louis, Sénégal",
    totalOrders: 25,
    totalSpent: 89200,
    averageOrderValue: 3568,
    lastOrderDate: "2024-01-22T16:45:00Z",
    joinDate: "2023-05-10T08:20:00Z",
    status: "active",
    segment: "vip",
    avatar: "/placeholder.svg?height=40&width=40&text=FS",
  },
  {
    id: "4",
    name: "Ousmane Diop",
    email: "ousmane.diop@email.com",
    phone: "+221 77 234 56 78",
    location: "Kaolack, Sénégal",
    totalOrders: 3,
    totalSpent: 8900,
    averageOrderValue: 2967,
    lastOrderDate: "2024-01-15T12:20:00Z",
    joinDate: "2024-01-05T14:00:00Z",
    status: "active",
    segment: "new",
    avatar: "/placeholder.svg?height=40&width=40&text=OD",
  },
]

export async function GET() {
  try {
    return NextResponse.json(customersData)
  } catch (error) {
    console.error("Erreur lors du chargement des clients:", error)
    return NextResponse.json({ error: "Erreur lors du chargement des clients" }, { status: 500 })
  }
}
