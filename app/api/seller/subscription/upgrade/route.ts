import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { planId } = await request.json()

    // Simuler la mise à niveau
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: `Abonnement mis à niveau vers le plan ${planId}`,
    })
  } catch (error) {
    console.error("Erreur lors de la mise à niveau:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à niveau" }, { status: 500 })
  }
}
