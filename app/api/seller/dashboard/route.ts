import { NextResponse } from "next/server"
import sellerAnalytics from "@/data/seller-analytics.json"

export async function GET() {
  try {
    return NextResponse.json(sellerAnalytics.dashboard)
  } catch (error) {
    console.error("Erreur lors du chargement des données dashboard vendeur:", error)
    return NextResponse.json({ error: "Erreur lors du chargement des données" }, { status: 500 })
  }
}
