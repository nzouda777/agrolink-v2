import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { CartProvider } from "@/contexts/cart-context"
import { FavoritesProvider } from "@/contexts/favorites-context"
import { SearchProvider } from "@/contexts/search-context"
import CartDrawer from "@/components/cart-drawer"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "AgroLink - Connecting Farmers and Buyers",
  description: "A marketplace for agricultural products connecting farmers directly with buyers",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SearchProvider>
            <FavoritesProvider>
              <CartProvider>
                <div className="flex min-h-screen flex-col">
                  <Header />
                  <Suspense>
                    <main className="flex-1">{children}</main>
                  </Suspense>
                  <Footer />
                  <CartDrawer />
                </div>
              </CartProvider>
            </FavoritesProvider>
          </SearchProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
