import { NextResponse } from "next/server"

const inventoryData = [
  {
    id: "1",
    name: "Tomates Bio",
    category: "Légumes",
    currentStock: 150,
    minStock: 20,
    maxStock: 200,
    unit: "kg",
    price: 2500,
    lastUpdated: "2024-01-22T14:30:00Z",
    status: "in_stock",
    image: "/placeholder.svg?height=100&width=100&text=Tomates",
    recentMovements: [
      { type: "out", quantity: 25, date: "2024-01-22T10:00:00Z", reason: "Vente" },
      { type: "in", quantity: 50, date: "2024-01-21T16:00:00Z", reason: "Récolte" },
    ],
  },
  {
    id: "2",
    name: "Carottes",
    category: "Légumes",
    currentStock: 8,
    minStock: 15,
    maxStock: 100,
    unit: "kg",
    price: 1800,
    lastUpdated: "2024-01-22T12:00:00Z",
    status: "low_stock",
    image: "/placeholder.svg?height=100&width=100&text=Carottes",
    recentMovements: [
      { type: "out", quantity: 12, date: "2024-01-22T09:00:00Z", reason: "Vente" },
      { type: "out", quantity: 8, date: "2024-01-21T14:00:00Z", reason: "Vente" },
    ],
  },
  {
    id: "3",
    name: "Pommes de Terre",
    category: "Légumes",
    currentStock: 0,
    minStock: 25,
    maxStock: 150,
    unit: "kg",
    price: 1200,
    lastUpdated: "2024-01-21T18:00:00Z",
    status: "out_of_stock",
    image: "/placeholder.svg?height=100&width=100&text=Pommes",
    recentMovements: [
      { type: "out", quantity: 15, date: "2024-01-21T16:00:00Z", reason: "Vente" },
      { type: "out", quantity: 10, date: "2024-01-21T11:00:00Z", reason: "Vente" },
    ],
  },
]

export async function GET() {
  try {
    return NextResponse.json(inventoryData)
  } catch (error) {
    console.error("Erreur lors du chargement de l'inventaire:", error)
    return NextResponse.json({ error: "Erreur lors du chargement de l'inventaire" }, { status: 500 })
  }
}
