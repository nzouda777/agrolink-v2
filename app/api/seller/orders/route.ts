import { NextResponse } from "next/server"
import sellerOrders from "@/data/seller-orders.json"

export async function GET() {
  try {
    return NextResponse.json(sellerOrders)
  } catch (error) {
    console.error("Erreur lors du chargement des commandes vendeur:", error)
    return NextResponse.json({ error: "Erreur lors du chargement des commandes" }, { status: 500 })
  }
}
