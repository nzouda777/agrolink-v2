import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PrivacyPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Politique de confidentialité</h1>
        <p className="text-muted-foreground mb-8">Dernière mise à jour : 1 avril 2023</p>

        <div className="prose dark:prose-invert max-w-none">
          <p>
            Chez AgroLink, nous accordons une grande importance à la protection de vos données personnelles. Cette
            politique de confidentialité explique comment nous collectons, utilisons, partageons et protégeons vos
            informations lorsque vous utilisez notre plateforme.
          </p>

          <h2>1. Informations que nous collectons</h2>
          <p>Nous collectons plusieurs types d'informations vous concernant, notamment :</p>
          <ul>
            <li>
              <strong>Informations d'identification</strong> : nom, adresse e-mail, numéro de téléphone, adresse
              postale, etc.
            </li>
            <li>
              <strong>Informations de profil</strong> : photo de profil, biographie, préférences, etc.
            </li>
            <li>
              <strong>Informations de transaction</strong> : détails des produits achetés ou vendus, méthodes de
              paiement, etc.
            </li>
            <li>
              <strong>Informations d'utilisation</strong> : comment vous interagissez avec notre plateforme, les pages
              que vous visitez, etc.
            </li>
            <li>
              <strong>Informations de localisation</strong> : votre position géographique approximative basée sur votre
              adresse IP ou GPS si vous l'autorisez.
            </li>
          </ul>

          <h2>2. Comment nous utilisons vos informations</h2>
          <p>Nous utilisons vos informations pour :</p>
          <ul>
            <li>Fournir, maintenir et améliorer notre plateforme</li>
            <li>Traiter les transactions et envoyer des notifications connexes</li>
            <li>Personnaliser votre expérience et vous fournir du contenu pertinent</li>
            <li>Communiquer avec vous, notamment pour le service client et les mises à jour</li>
            <li>Assurer la sécurité de notre plateforme et prévenir la fraude</li>
            <li>Respecter nos obligations légales</li>
          </ul>

          <h2>3. Partage de vos informations</h2>
          <p>Nous pouvons partager vos informations avec :</p>
          <ul>
            <li>
              <strong>Autres utilisateurs</strong> : lorsque vous effectuez une transaction, certaines informations sont
              partagées avec l'autre partie.
            </li>
            <li>
              <strong>Prestataires de services</strong> : entreprises qui nous aident à fournir nos services (traitement
              des paiements, hébergement, etc.).
            </li>
            <li>
              <strong>Partenaires commerciaux</strong> : pour des offres conjointes ou des promotions.
            </li>
            <li>
              <strong>Autorités légales</strong> : lorsque nous sommes légalement tenus de le faire ou pour protéger nos
              droits.
            </li>
          </ul>

          <h2>4. Sécurité des données</h2>
          <p>
            Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos
            informations contre tout accès non autorisé, perte ou altération. Cependant, aucune méthode de transmission
            sur Internet ou de stockage électronique n'est totalement sécurisée, et nous ne pouvons garantir une
            sécurité absolue.
          </p>

          <h2>5. Vos droits</h2>
          <p>
            Selon votre lieu de résidence, vous pouvez avoir certains droits concernant vos données personnelles,
            notamment :
          </p>
          <ul>
            <li>Accéder à vos données personnelles</li>
            <li>Corriger des données inexactes</li>
            <li>Supprimer vos données</li>
            <li>Restreindre ou s'opposer au traitement de vos données</li>
            <li>Demander la portabilité de vos données</li>
            <li>Retirer votre consentement à tout moment</li>
          </ul>

          <h2>6. Conservation des données</h2>
          <p>
            Nous conservons vos informations aussi longtemps que nécessaire pour fournir nos services et respecter nos
            obligations légales. Lorsque nous n'avons plus besoin de vos informations, nous les supprimons ou les
            anonymisons.
          </p>

          <h2>7. Cookies et technologies similaires</h2>
          <p>
            Nous utilisons des cookies et des technologies similaires pour collecter des informations sur votre
            activité, votre navigateur et votre appareil. Vous pouvez gérer vos préférences en matière de cookies via
            les paramètres de votre navigateur.
          </p>

          <h2>8. Transferts internationaux</h2>
          <p>
            Vos informations peuvent être transférées et traitées dans des pays autres que celui où vous résidez. Ces
            pays peuvent avoir des lois différentes en matière de protection des données.
          </p>

          <h2>9. Enfants</h2>
          <p>
            Notre service n'est pas destiné aux personnes de moins de 18 ans, et nous ne collectons pas sciemment des
            informations personnelles auprès d'enfants de moins de 18 ans.
          </p>

          <h2>10. Modifications de cette politique</h2>
          <p>
            Nous pouvons modifier cette politique de confidentialité de temps à autre. Nous vous informerons de tout
            changement important par e-mail ou par une notification sur notre plateforme.
          </p>

          <h2>11. Contact</h2>
          <p>Si vous avez des questions concernant cette politique de confidentialité, veuillez nous contacter à :</p>
          <p>
            AgroLink
            <br />
            123 Rue Principale
            <br />
            Yaoundé, Centre
            <br />
            Cameroun
            <br />
            Email : privacy@agrolink.cm
          </p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button asChild>
            <Link href="/terms">Conditions d'utilisation</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/contact">Nous contacter</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
