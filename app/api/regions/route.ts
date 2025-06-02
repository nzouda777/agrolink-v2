import { NextResponse } from "next/server"
import regionsData from "@/data/regions.json"

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 400))

  // Ensure we're returning an array
  if (!Array.isArray(regionsData)) {
    console.error("Regions data is not an array:", regionsData)
    return NextResponse.json([])
  }

  return NextResponse.json(regionsData)
}
