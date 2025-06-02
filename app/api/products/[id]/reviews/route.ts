import { NextResponse } from "next/server"
import reviewsData from "@/data/reviews.json"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600))

  const productId = Number.parseInt(params.id)
  const reviews = reviewsData.filter((review) => review.productId === productId)

  return NextResponse.json(reviews)
}
