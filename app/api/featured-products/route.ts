import { NextResponse } from "next/server"
import productsData from "@/data/products.json"

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600))

  // Ensure productsData is an array
  if (!Array.isArray(productsData)) {
    console.error("Products data is not an array:", productsData)
    return NextResponse.json([])
  }

  // Return only the first 4 products as featured
  const featuredProducts = productsData.slice(0, 4)

  return NextResponse.json(featuredProducts)
}
