import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TermsPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Conditions d'utilisation</h1>
        <p className="text-muted-foreground mb-8">Dernière mise à jour : 1 avril 2023</p>

        <div className="prose dark:prose-invert max-w-none">
          <p>
            Bienvenue sur AgroLink, une plateforme qui connecte les agriculteurs directement aux acheteurs. Veuillez
            lire attentivement ces conditions d'utilisation avant d'utiliser notre site web et nos services.
          </p>

          <h2>1. Acceptation des conditions</h2>
          <p>
            En accédant à ou en utilisant AgroLink, vous acceptez d'être lié par ces Conditions d'Utilisation et toutes
            les lois et réglementations applicables. Si vous n'acceptez pas ces conditions, vous n'êtes pas autorisé à
            utiliser ou à accéder à ce site.
          </p>

          <h2>2. Modifications des conditions</h2>
          <p>
            AgroLink se réserve le droit de modifier ces conditions à tout moment. Votre utilisation continue du site
            après la publication de modifications constitue votre acceptation de ces modifications.
          </p>

          <h2>3. Utilisation du compte</h2>
          <p>
            Pour utiliser certaines fonctionnalités de notre site, vous devrez créer un compte. Vous êtes responsable du
            maintien de la confidentialité de votre compte et mot de passe et de la restriction de l'accès à votre
            ordinateur, et vous acceptez d'assumer la responsabilité de toutes les activités qui se produisent sous
            votre compte ou mot de passe.
          </p>

          <h2>4. Règles de conduite</h2>
          <p>En utilisant AgroLink, vous acceptez de ne pas :</p>
          <ul>
            <li>Utiliser le service à des fins illégales ou non autorisées</li>
            <li>
              Violer les lois de votre juridiction (y compris, mais sans s'y limiter, les lois sur le droit d'auteur)
            </li>
            <li>
              Publier ou transmettre tout contenu illégal, menaçant, abusif, diffamatoire, obscène ou autrement
              répréhensible
            </li>
            <li>
              Usurper l'identité d'une personne ou d'une entité, ou déformer votre affiliation avec une personne ou une
              entité
            </li>
            <li>Interférer avec ou perturber le service ou les serveurs ou réseaux connectés au service</li>
            <li>Recueillir ou stocker des données personnelles sur d'autres utilisateurs sans leur consentement</li>
          </ul>

          <h2>5. Produits et transactions</h2>
          <p>
            AgroLink facilite les transactions entre acheteurs et vendeurs mais n'est pas partie à ces transactions.
            Nous ne garantissons pas la qualité, la sécurité ou la légalité des articles annoncés, la véracité ou
            l'exactitude des contenus des utilisateurs, la capacité des vendeurs à vendre des articles ou la capacité
            des acheteurs à payer pour les articles.
          </p>

          <h2>6. Frais et paiements</h2>
          <p>
            L'utilisation de certains services sur AgroLink peut être soumise à des frais. Tous les frais sont indiqués
            en FCFA et sont non remboursables sauf indication contraire. Nous nous réservons le droit de modifier nos
            frais à tout moment.
          </p>

          <h2>7. Propriété intellectuelle</h2>
          <p>
            Le contenu, les fonctionnalités et la fonctionnalité du site AgroLink, y compris, mais sans s'y limiter, le
            texte, les graphiques, les logos, les icônes, les images, les clips audio, les téléchargements numériques,
            les compilations de données et les logiciels, sont la propriété d'AgroLink ou de ses fournisseurs de contenu
            et sont protégés par les lois camerounaises et internationales sur le droit d'auteur, les marques de
            commerce, les brevets, les secrets commerciaux et autres lois sur la propriété intellectuelle ou les droits
            de propriété.
          </p>

          <h2>8. Limitation de responsabilité</h2>
          <p>
            En aucun cas, AgroLink, ses dirigeants, administrateurs, employés ou agents ne seront responsables de tout
            dommage direct, indirect, accessoire, spécial, consécutif ou punitif, y compris, sans limitation, la perte
            de profits, de données, d'utilisation, de bonne volonté, ou d'autres pertes intangibles, résultant de (i)
            votre accès ou utilisation ou incapacité d'accéder ou d'utiliser le service; (ii) toute conduite ou contenu
            d'un tiers sur le service; (iii) tout contenu obtenu à partir du service; et (iv) l'accès non autorisé,
            l'utilisation ou la modification de vos transmissions ou contenu, que ce soit basé sur une garantie, un
            contrat, un délit (y compris la négligence) ou toute autre théorie juridique, que nous ayons été informés ou
            non de la possibilité de tels dommages.
          </p>

          <h2>9. Indemnisation</h2>
          <p>
            Vous acceptez de défendre, d'indemniser et de tenir AgroLink et ses filiales, affiliés, dirigeants, agents,
            co-branders, partenaires et employés indemnes de toute réclamation ou demande, y compris les honoraires
            raisonnables d'avocat, faite par un tiers en raison de ou découlant de votre violation de ces Conditions
            d'Utilisation ou des documents qu'ils incorporent par référence, ou votre violation de toute loi ou des
            droits d'un tiers.
          </p>

          <h2>10. Loi applicable</h2>
          <p>
            Ces Conditions d'Utilisation et toute dispute ou réclamation en découlant ou s'y rapportant ou leur objet ou
            formation (y compris les disputes ou réclamations non contractuelles) seront régies et interprétées
            conformément aux lois du Cameroun.
          </p>

          <h2>11. Contact</h2>
          <p>Si vous avez des questions concernant ces Conditions d'Utilisation, veuillez nous contacter à :</p>
          <p>
            AgroLink
            <br />
            123 Rue Principale
            <br />
            Yaoundé, Centre
            <br />
            Cameroun
            <br />
            Email : legal@agrolink.cm
          </p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button asChild>
            <Link href="/privacy">Politique de confidentialité</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/contact">Nous contacter</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
