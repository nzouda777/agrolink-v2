import type React from "react"
import { BuyerSidebar } from "@/components/buyer-sidebar"

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <BuyerSidebar />
      <div className="flex-1 p-4 md:p-8">{children}</div>
    </div>
  )
}
