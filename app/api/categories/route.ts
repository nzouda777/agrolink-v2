import { NextResponse } from "next/server"
import categoriesData from "@/data/categories.json"

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Ensure we're returning an array
  if (!Array.isArray(categoriesData)) {
    console.error("Categories data is not an array:", categoriesData)
    return NextResponse.json([])
  }

  return NextResponse.json(categoriesData)
}
