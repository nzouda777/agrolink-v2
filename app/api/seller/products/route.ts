import { NextResponse } from "next/server"
import sellerProducts from "@/data/seller-products.json"

export async function GET() {
  try {
    return NextResponse.json(sellerProducts)
  } catch (error) {
    console.error("Erreur lors du chargement des produits vendeur:", error)
    return NextResponse.json({ error: "Erreur lors du chargement des produits" }, { status: 500 })
  }
}
