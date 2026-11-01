import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Cpu,
  Gamepad2,
  GraduationCap,
  Home as HomeIcon,
  Palette,
  Quote,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { RatingStars } from "@/components/product/rating-stars";
import { Reveal } from "@/components/ui/reveal";
import { NewsletterForm } from "@/components/home/newsletter-form";
import { getCategoriesWithCounts, getDealProducts, getFeaturedProducts, getNewProducts } from "@/lib/products";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const audiences = [
  { icon: HomeIcon, title: "Particuliers", text: "Le bon matériel pour la maison, sans jargon.", href: "/boutique" },
  { icon: GraduationCap, title: "Étudiants", text: "Portables légers et endurants, prix justes.", href: "/boutique?categorie=ordinateurs-portables&prix_max=400000" },
  { icon: Palette, title: "Créateurs", text: "Écrans calibrés et stations de montage.", href: "/boutique?q=cr%C3%A9ateur" },
  { icon: Gamepad2, title: "Gamers", text: "Hautes fréquences, faible latence, RGB maîtrisé.", href: "/boutique?marque=Vektor" },
  { icon: Briefcase, title: "Entreprises", text: "Flottes, devis, facturation et déploiement.", href: "/entreprises" },
];

const testimonials = [
  {
    name: "Aminata Koné",
    role: "Consultante indépendante · Cocody",
    rating: 5,
    text: "J'ai équipé tout mon bureau chez UORAHAL : portable, écran, dock. Un conseiller m'a rappelée sur WhatsApp en 10 minutes pour affiner la config et j'ai payé par Orange Money. Je n'achète plus ailleurs.",
  },
  {
    name: "Agence Kôrô Design",
    role: "Studio créatif, 14 postes · Plateau",
    rating: 5,
    text: "Devis en FCFA reçu le lendemain, 14 stations déployées en une semaine, machines pré-configurées et étiquetées. Le suivi pro est irréprochable, la facture normalisée aussi.",
  },
  {
    name: "Yao Kouassi",
    role: "Joueur compétitif · Marcory",
    rating: 5,
    text: "Le Vortex 15 et l'écran 240 Hz conseillés par l'équipe sont exactement ce qu'il me fallait. Livré à Marcory le lendemain, emballage impeccable.",
  },
];

export default async function HomePage() {
  const [categories, featured, newProducts, deals] = await Promise.all([
    getCategoriesWithCounts(),
    getFeaturedProducts(8),
    getNewProducts(4),
    getDealProducts(4),
  ]);

  return (
    <>
      {/* ───────────── Hero ───────────── */}
      <section className="relative -mt-[68px] min-h-[92svh] overflow-hidden bg-ink-950 pt-[68px] text-white">
        <Image
          src="/images/hero.jpg"
          alt="Ordinateur portable, casque et clavier UORAHAL dans une lumière bleutée"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_center] opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/75 to-ink-950/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/40" />
        <div className="absolute inset-0 grid-bg opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

        <div className="container-x relative flex min-h-[calc(92svh-68px)] flex-col justify-center py-20">
          <div className="max-w-2xl">
            <p className="eyebrow animate-fade-up text-accent-300">Informatique · Pour tous les profils</p>
            <h1 className="display mt-5 animate-fade-up text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.98] [animation-delay:120ms]">
              L&apos;informatique
              <br />
              qui vous ressemble,
              <br />
              <em className="font-normal italic text-accent-300">sans compromis.</em>
            </h1>
            <p className="mt-7 max-w-lg animate-fade-up text-base leading-relaxed text-white/70 sm:text-lg [animation-delay:240ms]">
              Portables, PC assemblés en atelier, écrans calibrés et périphériques d&apos;exception. Sélectionnés par
              des techniciens, livrés à Abidjan en 24 h et partout en Côte d&apos;Ivoire, garantis jusqu&apos;à 3 ans.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3 animate-fade-up [animation-delay:360ms]">
              <Link href="/boutique" className="btn-light px-7 py-4 text-base">
                Découvrir la boutique <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/collections/pc-et-composants" className="btn-outline-light px-7 py-4 text-base">
                PC assemblés sur mesure
              </Link>
            </div>

            <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-8 animate-fade-up [animation-delay:480ms]">
              {[
                { value: "12 000+", label: "clients équipés à Abidjan" },
                { value: "4,8 / 5", label: "satisfaction vérifiée" },
                { value: "24 h", label: "livraison Abidjan" },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="font-display text-3xl font-light sm:text-4xl">{stat.value}</dt>
                  <dd className="mt-1 text-xs text-white/55">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {newProducts[0] && (
            <Link
              href={`/produit/${newProducts[0].slug}`}
              className="group absolute bottom-10 right-8 hidden w-[300px] animate-float rounded-2xl border border-white/10 bg-white/8 p-3 backdrop-blur-xl transition hover:bg-white/12 lg:block xl:right-12"
            >
              <div className="flex items-center gap-3">
                <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                  <Image src={newProducts[0].image} alt="" fill sizes="64px" className="object-cover" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-accent-300">
                    <Sparkles className="h-3 w-3" /> Nouveauté
                  </span>
                  <span className="mt-0.5 block truncate text-sm font-semibold">{newProducts[0].name}</span>
                  <span className="block text-xs text-white/60">{newProducts[0].brand}</span>
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-white/60 transition group-hover:text-white" />
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* ───────────── Marquee ───────────── */}
      <div className="overflow-hidden border-b border-ink-900/8 bg-white py-4">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-500">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-10">
              {[
                "Livraison Abidjan offerte dès 50 000 FCFA",
                "Assemblage & tests en atelier",
                "Garantie jusqu'à 3 ans",
                "Orange Money · MTN MoMo · Wave · Carte",
                "Livraison partout en Côte d'Ivoire",
                "Conseil par des techniciens",
                "Devis entreprises en FCFA sous 24 h",
                "Retrait en boutique 2 h",
              ].map((t) => (
                <span key={t} className="flex items-center gap-10">
                  {t} <span className="h-1 w-1 rounded-full bg-accent-500" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ───────────── Collections ───────────── */}
      <section className="container-x pt-20 sm:pt-28">
        <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Collections</p>
            <h2 className="display mt-3 text-4xl sm:text-5xl">Tout l&apos;univers informatique</h2>
          </div>
          <Link href="/boutique" className="link-underline text-sm font-semibold">
            Voir tous les produits →
          </Link>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:grid-rows-2">
          {categories.map((c, i) => {
            const large = i === 0 || i === 1;
            return (
              <Reveal
                key={c.slug}
                delay={i * 60}
                className={cn(large ? "col-span-2 row-span-1 lg:col-span-2" : "col-span-1")}
              >
                <Link
                  href={`/collections/${c.slug}`}
                  className={cn(
                    "group relative block overflow-hidden rounded-2xl bg-ink-900 text-white shadow-soft",
                    large ? "aspect-[16/10] sm:aspect-[2/1]" : "aspect-[4/5] sm:aspect-square",
                  )}
                >
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    sizes={large ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 50vw, 25vw"}
                    className="object-cover opacity-90 transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">
                      {c.productCount} produit{c.productCount > 1 ? "s" : ""}
                    </p>
                    <h3 className={cn("font-display mt-1", large ? "text-2xl sm:text-4xl" : "text-lg sm:text-2xl")}>{c.name}</h3>
                    <p className={cn("mt-1 text-white/70", large ? "text-sm" : "hidden text-xs sm:block")}>{c.tagline}</p>
                  </div>
                  <span className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/10 backdrop-blur transition-all duration-500 group-hover:bg-white group-hover:text-ink-950">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ───────────── Featured products ───────────── */}
      <section className="container-x pt-24 sm:pt-32">
        <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Sélection du moment</p>
            <h2 className="display mt-3 text-4xl sm:text-5xl">Les coups de cœur de l&apos;atelier</h2>
          </div>
          <Link href="/boutique?tri=note" className="link-underline text-sm font-semibold">
            Les mieux notés →
          </Link>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 70}>
              <ProductCard product={p} priority={i < 4} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────── Atelier editorial ───────────── */}
      <section className="container-x pt-24 sm:pt-32">
        <div className="grid overflow-hidden rounded-3xl bg-ink-950 text-white lg:grid-cols-2">
          <div className="relative min-h-[360px] lg:min-h-[560px]">
            <Image
              src="/images/p/7859348.jpg"
              alt="Technicien UORAHAL assemblant un PC dans l'atelier"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent lg:bg-gradient-to-r" />
          </div>
          <div className="relative flex flex-col justify-center p-8 sm:p-12 lg:p-16">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent-600/30 blur-[100px]" />
            <Reveal>
              <p className="eyebrow text-accent-300">L&apos;atelier UORAHAL</p>
              <h2 className="display mt-4 text-4xl sm:text-5xl">
                Assemblé, testé, <em className="italic text-accent-300">garanti.</em>
              </h2>
              <p className="mt-5 max-w-md text-white/70">
                Chaque PC de bureau est monté à la main dans notre atelier d&apos;Abidjan, câblé proprement, puis soumis à 24
                heures de tests de stabilité avant expédition. Vous recevez une machine prête à l&apos;emploi, avec son
                rapport de test.
              </p>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Wrench, title: "Montage à la main", text: "Câblage soigné, BIOS optimisé" },
                  { icon: Cpu, title: "Test 24 h", text: "Burn-in CPU, GPU, mémoire" },
                  { icon: ShieldCheck, title: "Garantie 3 ans", text: "Pièces et main-d'œuvre" },
                  { icon: Sparkles, title: "Sur mesure", text: "Configurez avec un technicien" },
                ].map((f) => (
                  <li key={f.title} className="flex gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/8 ring-1 ring-white/10">
                      <f.icon className="h-4.5 w-4.5 text-accent-300" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">{f.title}</span>
                      <span className="block text-xs text-white/55">{f.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/collections/pc-et-composants" className="btn-light">
                  Voir les PC assemblés <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/entreprises" className="btn-outline-light">
                  Demander un devis
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────────── Deals ───────────── */}
      {deals.length > 0 && (
        <section className="container-x pt-24 sm:pt-32">
          <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Promotions</p>
              <h2 className="display mt-3 text-4xl sm:text-5xl">Les bonnes affaires de la semaine</h2>
            </div>
            <Link href="/boutique?promo=1" className="link-underline text-sm font-semibold">
              Toutes les promotions →
            </Link>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
            {deals.map((p, i) => (
              <Reveal key={p.id} delay={i * 70}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ───────────── Audiences ───────────── */}
      <section className="container-x pt-24 sm:pt-32">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Pour tous les profils</p>
          <h2 className="display mt-3 text-4xl sm:text-5xl">Un conseil adapté à chaque usage</h2>
          <p className="mt-4 text-ink-600">
            Du premier ordinateur familial à la flotte d&apos;entreprise, nos techniciens vous orientent vers le
            matériel juste — ni plus, ni moins.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {audiences.map((a, i) => (
            <Reveal key={a.title} delay={i * 60}>
              <Link
                href={a.href}
                className="group flex h-full flex-col rounded-2xl border border-ink-900/8 bg-white p-6 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:border-accent-200 hover:shadow-lift"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent-50 text-accent-700 transition-colors duration-500 group-hover:bg-ink-950 group-hover:text-white">
                  <a.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{a.title}</h3>
                <p className="mt-1.5 flex-1 text-sm text-ink-500">{a.text}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-accent-700">
                  Explorer <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────── Testimonials ───────────── */}
      <section className="container-x pt-24 sm:pt-32">
        <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Ils nous font confiance</p>
            <h2 className="display mt-3 text-4xl sm:text-5xl">4,8 / 5 sur plus de 2 600 avis</h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-ink-600">
            <RatingStars rating={4.8} size="md" /> Avis vérifiés
          </div>
        </Reveal>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 80}>
              <figure className="relative flex h-full flex-col rounded-2xl border border-ink-900/8 bg-white p-7 shadow-soft">
                <Quote className="absolute right-6 top-6 h-8 w-8 text-accent-100" />
                <RatingStars rating={t.rating} size="sm" />
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink-800">“{t.text}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-ink-900/8 pt-5">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-ink-950 font-display text-sm text-white">
                    {t.name.charAt(0)}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{t.name}</span>
                    <span className="block text-xs text-ink-500">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────── Newsletter ───────────── */}
      <section className="container-x pt-24 sm:pt-32">
        <Reveal>
          <div className="noise relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent-700 via-accent-600 to-ink-900 px-8 py-14 text-white sm:px-14 lg:px-20">
            <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
            <div className="relative grid items-center gap-10 lg:grid-cols-2">
              <div>
                <p className="eyebrow text-white/70">Newsletter</p>
                <h2 className="display mt-3 text-4xl sm:text-5xl">-10 % sur votre première commande</h2>
                <p className="mt-4 max-w-md text-white/75">
                  Nouveautés, bancs d&apos;essai de l&apos;atelier et ventes privées. Un e-mail par mois, pas plus.
                </p>
              </div>
              <div className="lg:justify-self-end">
                <NewsletterForm />
                <p className="mt-3 text-xs text-white/55">Désinscription en un clic. Vos données restent chez nous.</p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
