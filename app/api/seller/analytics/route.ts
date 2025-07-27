import { NextResponse } from "next/server"
import sellerSales from "@/data/seller-sales.json"

export async function GET() {
  try {
    return NextResponse.json(sellerSales)
  } catch (error) {
    console.error("Erreur lors du chargement des analytics vendeur:", error)
    return NextResponse.json({ error: "Erreur lors du chargement des analytics" }, { status: 500 })
  }
}
