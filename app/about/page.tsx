import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, TrendingUp, ShieldCheck, Leaf, MapPin, Phone, Mail } from "lucide-react"

// Mock data for team members
const teamMembers = [
  {
    name: "Jean Kouassi",
    role: "Fondateur & CEO",
    image: "/placeholder.svg?height=300&width=300",
    bio: "Expert en agriculture avec plus de 15 ans d'expérience dans le secteur agricole camerounais.",
  },
  {
    name: "Marie Ndongo",
    role: "Directrice des Opérations",
    image: "/placeholder.svg?height=300&width=300",
    bio: "Spécialiste en logistique et chaîne d'approvisionnement avec une passion pour l'agriculture durable.",
  },
  {
    name: "Paul Mbarga",
    role: "Responsable Technique",
    image: "/placeholder.svg?height=300&width=300",
    bio: "Ingénieur en informatique avec une expertise en développement de plateformes e-commerce.",
  },
  {
    name: "Sophie Kamga",
    role: "Responsable Marketing",
    image: "/placeholder.svg?height=300&width=300",
    bio: "Experte en marketing digital avec une spécialisation dans le secteur agroalimentaire.",
  },
]

// Mock data for stats
const stats = [
  { value: "10K+", label: "Agriculteurs", icon: Users },
  { value: "50K+", label: "Clients", icon: Users },
  { value: "100K+", label: "Produits", icon: Leaf },
  { value: "10+", label: "Régions", icon: MapPin },
]

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 py-16 md:py-24">
        <div className="container grid gap-8 md:grid-cols-2 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              À propos d'<span className="text-primary">AgroLink</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Nous connectons les agriculteurs directement aux consommateurs pour créer un système alimentaire plus
              équitable et durable au Cameroun.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/contact">Nous contacter</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/products">Explorer les produits</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="L'équipe AgroLink"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Notre histoire</h2>
            <p className="text-lg text-muted-foreground">
              Comment AgroLink est né d'une vision pour transformer l'agriculture au Cameroun
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Histoire d'AgroLink"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-6">
              <p className="text-muted-foreground">
                AgroLink a été fondé en 2022 avec une mission claire : révolutionner la façon dont les produits
                agricoles sont achetés et vendus au Cameroun. Notre fondateur, Jean Kouassi, a grandi dans une famille
                d'agriculteurs et a été témoin des défis auxquels sont confrontés les petits exploitants pour accéder
                aux marchés et obtenir des prix équitables pour leurs produits.
              </p>
              <p className="text-muted-foreground">
                Après avoir travaillé dans le secteur agricole pendant plus d'une décennie, Jean a réuni une équipe de
                professionnels partageant la même vision pour créer une plateforme qui éliminerait les intermédiaires et
                permettrait aux agriculteurs de vendre directement aux consommateurs, restaurants et détaillants.
              </p>
              <p className="text-muted-foreground">
                Aujourd'hui, AgroLink est devenu la principale marketplace agricole au Cameroun, connectant des milliers
                d'agriculteurs à des acheteurs dans tout le pays. Notre plateforme offre non seulement un marché
                équitable, mais aussi des outils et des ressources pour aider les agriculteurs à développer leurs
                activités et à adopter des pratiques agricoles durables.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Notre mission et nos valeurs</h2>
            <p className="text-lg text-muted-foreground">
              Les principes qui guident nos actions et notre vision pour l'avenir
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-lg">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Notre mission</h3>
              <p className="text-muted-foreground">
                Transformer le système alimentaire camerounais en créant une plateforme qui connecte directement les
                agriculteurs aux consommateurs, favorisant ainsi un commerce équitable, une agriculture durable et la
                sécurité alimentaire pour tous.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/10 p-1 mt-1">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                  </div>
                  <span>Promouvoir l'accès à des aliments frais et de qualité</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/10 p-1 mt-1">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                  </div>
                  <span>Garantir des prix équitables pour les agriculteurs</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/10 p-1 mt-1">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                  </div>
                  <span>Réduire le gaspillage alimentaire dans la chaîne d'approvisionnement</span>
                </li>
              </ul>
            </div>
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Nos valeurs</h3>
              <p className="text-muted-foreground">
                Nos valeurs fondamentales guident chaque décision que nous prenons et chaque fonctionnalité que nous
                développons pour notre plateforme.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/10 p-1 mt-1">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                  </div>
                  <span>Transparence dans toutes nos opérations et transactions</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/10 p-1 mt-1">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                  </div>
                  <span>Durabilité environnementale et pratiques agricoles responsables</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/10 p-1 mt-1">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                  </div>
                  <span>Innovation technologique au service de l'agriculture</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/10 p-1 mt-1">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                  </div>
                  <span>Communauté et soutien aux économies locales</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Notre impact</h2>
            <p className="text-lg text-muted-foreground">
              Des chiffres qui témoignent de notre croissance et de notre impact
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-3xl font-bold mb-2">{stat.value}</div>
                    <p className="text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Notre équipe</h2>
            <p className="text-lg text-muted-foreground">Les personnes passionnées qui font d'AgroLink une réalité</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-square relative">
                  <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                </div>
                <CardContent className="p-4 text-center">
                  <h3 className="font-bold text-lg">{member.name}</h3>
                  <p className="text-primary text-sm mb-2">{member.role}</p>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Contactez-nous</h2>
              <p className="text-muted-foreground">
                Vous avez des questions ou des suggestions ? N'hésitez pas à nous contacter. Notre équipe est toujours
                prête à vous aider.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium">Adresse</div>
                    <div className="text-muted-foreground">123 Rue Principale, Yaoundé, Cameroun</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium">Téléphone</div>
                    <div className="text-muted-foreground">+237 6XX XXX XXX</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-muted-foreground">contact@agrolink.cm</div>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <Button size="lg" asChild>
                  <Link href="/contact">Nous contacter</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Contactez AgroLink"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Rejoignez la révolution agricole</h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Que vous soyez agriculteur ou acheteur, AgroLink vous offre une plateforme simple et efficace pour vendre ou
            acheter des produits agricoles frais et de qualité.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/auth">Créer un compte</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10"
              asChild
            >
              <Link href="/products">Explorer les produits</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
