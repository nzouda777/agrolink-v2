import { NextResponse } from "next/server"
import productsData from "@/data/products.json"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const id = Number.parseInt(params.id)
  const product = productsData.find((product) => product.id === id)

  if (!product) {
    return NextResponse.json([], { status: 404 })
  }

  // Get products in the same category, excluding the current product
  const relatedProducts = productsData.filter((p) => p.category === product.category && p.id !== id).slice(0, 4)

  return NextResponse.json(relatedProducts)
}
