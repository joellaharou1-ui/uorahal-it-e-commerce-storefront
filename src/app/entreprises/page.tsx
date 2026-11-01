import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeEuro, Boxes, FileText, Headset, Laptop, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { QuoteForm } from "@/components/home/quote-form";
import { TikTokIcon, WhatsAppIcon } from "@/components/ui/social-icons";
import { STORE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Offre entreprises",
  description: "Équipez vos équipes : devis en 24 h, facturation, déploiement, leasing et support prioritaire.",
};

const benefits = [
  { icon: BadgeEuro, title: "Tarifs dégressifs", text: "Remises par volume dès 5 unités et conditions négociées pour les flottes." },
  { icon: FileText, title: "Devis en FCFA sous 24 h", text: "Un interlocuteur dédié, devis détaillé en francs CFA et facturation à 30 jours." },
  { icon: Boxes, title: "Déploiement clé en main", text: "Machines pré-configurées, étiquetées et livrées poste par poste." },
  { icon: ShieldCheck, title: "Garantie sur site", text: "Intervention J+1 et prêt de matériel pendant la réparation." },
  { icon: Headset, title: "Support prioritaire", text: "Ligne directe technicien, du lundi au samedi." },
  { icon: Laptop, title: "Leasing & reprise", text: "Location évolutive 24 ou 36 mois et reprise de votre ancien parc." },
];

export default function EntreprisesPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <Image src="/images/p/8353774.jpg" alt="Bureau équipé par UORAHAL" fill priority sizes="100vw" className="object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/80 to-ink-950/30" />
        <div className="container-x relative py-24 sm:py-32">
          <p className="eyebrow text-accent-300">Entreprises · Collectivités · Associations</p>
          <h1 className="display mt-4 max-w-3xl text-5xl sm:text-7xl">
            Équipez vos équipes, <em className="italic text-accent-300">sans friction.</em>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/70">
            De 1 à 500 postes à Abidjan et dans tout le pays : conseil, devis en FCFA, déploiement et support par une équipe technique dédiée. Plus de 400
            organisations nous font confiance.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#contact" className="btn-light px-7 py-4 text-base">
              Demander un devis <ArrowRight className="h-4 w-4" />
            </a>
            <Link href="/boutique" className="btn-outline-light px-7 py-4 text-base">
              Parcourir le catalogue
            </Link>
          </div>
        </div>
      </section>

      <section className="container-x pt-20 sm:pt-28">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Pourquoi UORAHAL Pro</p>
          <h2 className="display mt-3 text-4xl sm:text-5xl">Tout ce qu&apos;un service achat attend</h2>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => (
            <Reveal key={b.title} delay={i * 60}>
              <div className="card h-full p-7">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent-50 text-accent-700">
                  <b.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{b.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="contact" className="container-x scroll-mt-24 pt-20 sm:pt-28">
        <div className="grid gap-10 rounded-3xl bg-white p-8 shadow-soft ring-1 ring-ink-900/8 sm:p-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <Reveal>
            <p className="eyebrow">Demande de devis</p>
            <h2 className="display mt-3 text-4xl">Parlons de votre projet</h2>
            <p className="mt-4 text-ink-600">
              Décrivez vos besoins en quelques lignes : un technicien-conseil vous rappelle sous 24 h ouvrées avec une
              proposition chiffrée en FCFA.
            </p>
            <dl className="mt-8 space-y-4 text-sm">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-400">Téléphone & WhatsApp</dt>
                <dd className="mt-1 flex flex-wrap items-center gap-2 font-medium">
                  <a href={STORE.phoneHref} className="tabular underline-offset-4 hover:underline">
                    {STORE.phoneDisplay}
                  </a>
                  <a
                    href={STORE.whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366]/12 px-2.5 py-1 text-xs font-semibold text-[#128C7E] transition hover:bg-[#25D366]/20"
                  >
                    <WhatsAppIcon className="h-3.5 w-3.5" /> Écrire sur WhatsApp
                  </a>
                </dd>
                <dd className="text-xs text-ink-500">{STORE.hours}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-400">E-mail</dt>
                <dd className="mt-1 font-medium">
                  <a href={`mailto:${STORE.email}`} className="underline-offset-4 hover:underline">
                    {STORE.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-400">TikTok</dt>
                <dd className="mt-1 font-medium">
                  <a href={STORE.tiktokHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 underline-offset-4 hover:underline">
                    <TikTokIcon className="h-4 w-4" /> {STORE.tiktokHandle}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-400">Showroom & atelier</dt>
                <dd className="mt-1 font-medium">{STORE.addressLine} — sur rendez-vous</dd>
              </div>
              <div className="rounded-xl bg-accent-50/70 px-4 py-3 text-xs text-ink-700">
                Devis établis en <strong className="font-semibold text-ink-900">FCFA</strong>, TVA 18 % incluse. Facture normalisée, bon de commande et
                paiement par virement, Mobile Money ou carte.
              </div>
            </dl>
          </Reveal>
          <Reveal delay={100}>
            <QuoteForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
