import { type NextRequest, NextResponse } from "next/server"
import sellerProducts from "@/data/seller-products.json"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = Number.parseInt(params.id)
    const product = sellerProducts.find((p) => p.id === productId)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = params.id
    const updatedData = await request.json()

    // Simuler la mise à jour du produit
    const productIndex = sellerProducts.findIndex((p) => p.id === productId)

    if (productIndex === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // En réalité, vous mettriez à jour la base de données ici
    const updatedProduct = { ...sellerProducts[productIndex], ...updatedData }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}
