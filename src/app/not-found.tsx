import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow">Erreur 404</p>
      <h1 className="display mt-4 text-5xl sm:text-7xl">Page introuvable</h1>
      <p className="mt-4 max-w-md text-ink-600">
        Cette page a peut-être été déplacée, ou le produit n&apos;est plus au catalogue. Nos conseillers peuvent vous
        orienter vers une alternative.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/boutique" className="btn-primary">
          Voir la boutique <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/" className="btn-secondary">
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
