import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-background z-10">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-1 font-bold text-xl mb-4">
              <span className="text-primary">Agro</span>Link
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Connecter les agriculteurs directement aux acheteurs pour des produits frais et de qualité.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-4">Catégories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products/category/legumes" className="text-muted-foreground hover:text-foreground">
                  Légumes
                </Link>
              </li>
              <li>
                <Link href="/products/category/fruits" className="text-muted-foreground hover:text-foreground">
                  Fruits
                </Link>
              </li>
              <li>
                <Link href="/products/category/cereales" className="text-muted-foreground hover:text-foreground">
                  Céréales
                </Link>
              </li>
              <li>
                <Link href="/products/category/tubercules" className="text-muted-foreground hover:text-foreground">
                  Tubercules
                </Link>
              </li>
              <li>
                <Link href="/products/category/epices" className="text-muted-foreground hover:text-foreground">
                  Épices
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-4">Liens utiles</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/become-seller" className="text-muted-foreground hover:text-foreground">
                  Devenir vendeur
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-4">Légal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:text-foreground">
                  Politique de cookies
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-muted-foreground hover:text-foreground">
                  Livraison et retours
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} AgroLink. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
