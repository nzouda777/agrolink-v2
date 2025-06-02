import { NextResponse } from "next/server"
import productsData from "@/data/products.json"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 700))

  const id = Number.parseInt(params.id)
  const product = productsData.find((product) => product.id === id)

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  return NextResponse.json(product)
}
