import Link from "next/link";
import { ArrowUpRight, Headset, Mail, MapPin, Phone, RotateCcw, Smartphone, Truck } from "lucide-react";
import { TikTokIcon, WhatsAppIcon } from "@/components/ui/social-icons";
import { STORE } from "@/lib/utils";

type FooterCategory = { slug: string; name: string };

export function Footer({ categories }: { categories: FooterCategory[] }) {
  return (
    <footer className="relative mt-24 overflow-hidden bg-ink-950 text-white print:hidden">
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-accent-600/20 blur-[140px]" />

      <div className="container-x relative">
        <div className="grid gap-6 border-b border-white/10 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Truck, title: "Livraison Abidjan offerte", text: "Dès 50 000 FCFA d'achat, toutes communes. Expédition partout en Côte d'Ivoire." },
            { icon: RotateCcw, title: "Retours 30 jours", text: "Changement d'avis ? Retour en boutique et remboursement rapide." },
            { icon: Smartphone, title: "Mobile Money & carte", text: "Orange Money, MTN MoMo, Wave, Moov, Visa/Mastercard ou à la livraison." },
            { icon: Headset, title: "Conseillers experts", text: `Des techniciens, pas des scripts : ${STORE.phoneDisplay} (appel & WhatsApp).` },
          ].map((item) => (
            <div key={item.title} className="flex gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/8 ring-1 ring-white/10">
                <item.icon className="h-5 w-5 text-accent-300" />
              </div>
              <div>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-white/55">{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-12 py-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-sm font-black text-ink-950">U</span>
              <span className="font-display text-2xl tracking-[0.08em]">UORAHAL</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
              Spécialiste informatique à Abidjan pour tous : particuliers, étudiants, créateurs, gamers et entreprises.
              Matériel sélectionné, assemblé et testé dans notre atelier, livré partout en Côte d&apos;Ivoire.
            </p>

            <ul className="mt-6 space-y-3 text-sm">
              <li>
                <a href={STORE.phoneHref} className="group flex items-center gap-3 text-white/75 transition hover:text-white">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/8 ring-1 ring-white/10">
                    <Phone className="h-4 w-4 text-accent-300" />
                  </span>
                  <span className="tabular font-semibold text-white">{STORE.phoneDisplay}</span>
                  <span className="text-xs text-white/45">Appel</span>
                </a>
              </li>
              <li>
                <a href={STORE.whatsappHref} target="_blank" rel="noreferrer" className="group flex items-center gap-3 text-white/75 transition hover:text-white">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#25D366]/15 ring-1 ring-[#25D366]/30">
                    <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                  </span>
                  <span className="font-semibold text-white">WhatsApp</span>
                  <span className="text-xs text-white/45">Devis & suivi de commande</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${STORE.email}`} className="group flex items-center gap-3 text-white/75 transition hover:text-white">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/8 ring-1 ring-white/10">
                    <Mail className="h-4 w-4 text-accent-300" />
                  </span>
                  <span className="font-semibold text-white">{STORE.email}</span>
                </a>
              </li>
              <li>
                <a href={STORE.tiktokHref} target="_blank" rel="noreferrer" className="group flex items-center gap-3 text-white/75 transition hover:text-white">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/8 ring-1 ring-white/10">
                    <TikTokIcon className="h-4 w-4 text-white" />
                  </span>
                  <span className="font-semibold text-white">TikTok {STORE.tiktokHandle}</span>
                  <span className="text-xs text-white/45">Unboxings & bons plans</span>
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/75">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/8 ring-1 ring-white/10">
                  <MapPin className="h-4 w-4 text-accent-300" />
                </span>
                <span>
                  <span className="block font-semibold text-white">{STORE.addressLine}</span>
                  <span className="block text-xs text-white/45">{STORE.hours}</span>
                </span>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8">
            <div>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">Collections</p>
              <ul className="space-y-2.5 text-sm">
                {categories.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/collections/${c.slug}`} className="text-white/75 transition hover:text-white">
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">Boutique</p>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/boutique" className="text-white/75 transition hover:text-white">Tous les produits</Link></li>
                <li><Link href="/boutique?tri=nouveautes" className="text-white/75 transition hover:text-white">Nouveautés</Link></li>
                <li><Link href="/boutique?promo=1" className="text-white/75 transition hover:text-white">Promotions</Link></li>
                <li><Link href="/boutique?tri=note" className="text-white/75 transition hover:text-white">Les mieux notés</Link></li>
                <li><Link href="/entreprises" className="text-white/75 transition hover:text-white">Devis entreprises (FCFA)</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">Aide</p>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/entreprises#contact" className="text-white/75 transition hover:text-white">Contact & devis</Link></li>
                <li><a href={STORE.whatsappHref} target="_blank" rel="noreferrer" className="text-white/75 transition hover:text-white">Commander par WhatsApp</a></li>
                <li><span className="text-white/75">Livraison & retours</span></li>
                <li><span className="text-white/75">Garanties & SAV</span></li>
                <li><span className="text-white/75">Atelier & réparation</span></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} UORAHAL — Abidjan, Côte d&apos;Ivoire. Tous droits réservés. Prix TTC en FCFA (TVA 18 %).</p>
          <div className="flex items-center gap-5">
            <span>Mentions légales</span>
            <span>Confidentialité</span>
            <span>CGV</span>
            <a href="https://www.pexels.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 transition hover:text-white">
              Photos Pexels <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
