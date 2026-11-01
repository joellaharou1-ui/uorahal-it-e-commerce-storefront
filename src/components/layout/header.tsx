"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { ChevronDown, Menu, Phone, Search, ShoppingBag, X, Sparkles, Tag, Building2 } from "lucide-react";
import { useCartStore, selectCount } from "@/store/cart";
import { TikTokIcon, WhatsAppIcon } from "@/components/ui/social-icons";
import { cn, STORE } from "@/lib/utils";

type NavCategory = { slug: string; name: string; tagline: string; image: string };

export function Header({ categories }: { categories: NavCategory[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const items = useCartStore((s) => s.items);
  const hydrated = useCartStore((s) => s.hydrated);
  const openCart = useCartStore((s) => s.open);
  const count = hydrated ? selectCount(items) : 0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/boutique?q=${encodeURIComponent(q)}` : "/boutique");
    setSearchOpen(false);
    setMobileOpen(false);
  };

  const isDarkHome = pathname === "/" && !scrolled;

  return (
    <>
      <div className="relative z-50 bg-ink-950 text-white print:hidden">
        <div className="container-x flex h-9 items-center justify-center gap-6 overflow-hidden text-[11px] font-medium tracking-wide">
          <span className="hidden sm:inline">Livraison Abidjan offerte dès 50 000 FCFA</span>
          <span className="hidden h-3 w-px bg-white/25 sm:block" />
          <span>Orange Money · MTN MoMo · Wave · Carte</span>
          <span className="hidden h-3 w-px bg-white/25 md:block" />
          <span className="hidden md:inline">Retrait en boutique en 2 h</span>
          <span className="hidden h-3 w-px bg-white/25 lg:block" />
          <a href={STORE.whatsappHref} target="_blank" rel="noreferrer" className="hidden items-center gap-1.5 hover:text-accent-200 lg:inline-flex">
            <WhatsAppIcon className="h-3.5 w-3.5 text-[#25D366]" /> WhatsApp {STORE.phoneDisplay}
          </a>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-40 transition-all duration-500 print:hidden",
          isDarkHome
            ? "border-b border-white/10 bg-ink-950/40 text-white backdrop-blur-xl"
            : "border-b border-ink-900/8 bg-paper/85 text-ink-900 shadow-[0_1px_0_rgba(15,19,34,0.03)] backdrop-blur-xl",
        )}
      >
        <div className="container-x flex h-[68px] items-center justify-between gap-6">
          <div className="flex items-center gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="-ml-2 rounded-full p-2 transition hover:bg-current/10"
              aria-label="Ouvrir le menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          <Link href="/" className="group flex items-center gap-2.5" aria-label="UORAHAL — accueil">
            <span
              className={cn(
                "grid h-9 w-9 place-items-center rounded-xl text-sm font-black tracking-tighter transition-transform duration-500 group-hover:rotate-[-6deg]",
                isDarkHome ? "bg-white text-ink-950" : "bg-ink-950 text-white",
              )}
            >
              U
            </span>
            <span className="font-display text-[22px] font-medium tracking-[0.08em]">UORAHAL</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            <Link
              href="/boutique"
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition hover:bg-current/8",
                pathname === "/boutique" && "bg-current/10",
              )}
            >
              Boutique
            </Link>
            <div className="group relative">
              <button
                type="button"
                className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition hover:bg-current/8"
              >
                Collections <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" />
              </button>
              <div className="invisible absolute left-1/2 top-full z-50 w-[640px] -translate-x-1/2 pt-3 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100">
                <div className="grid grid-cols-3 gap-2 rounded-2xl border border-ink-900/8 bg-white p-3 text-ink-900 shadow-lift">
                  {categories.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/collections/${c.slug}`}
                      className="group/item flex items-center gap-3 rounded-xl p-2 transition hover:bg-paper"
                    >
                      <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-ink-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={c.image}
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-700 group-hover/item:scale-110"
                        />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold">{c.name}</span>
                        <span className="block text-xs text-ink-500">{c.tagline}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link href="/boutique?tri=nouveautes" className="rounded-full px-4 py-2 text-sm font-medium transition hover:bg-current/8">
              Nouveautés
            </Link>
            <Link href="/boutique?promo=1" className="rounded-full px-4 py-2 text-sm font-medium transition hover:bg-current/8">
              Promotions
            </Link>
            <Link href="/entreprises" className="rounded-full px-4 py-2 text-sm font-medium transition hover:bg-current/8">
              Entreprises
            </Link>
          </nav>

          <div className="flex items-center gap-1">
            <form
              onSubmit={onSearch}
              className={cn(
                "hidden items-center overflow-hidden rounded-full border transition-all duration-500 md:flex",
                isDarkHome ? "border-white/15 bg-white/10" : "border-ink-900/10 bg-white",
                searchOpen ? "w-72" : "w-10 border-transparent bg-transparent",
              )}
            >
              <button
                type={searchOpen ? "submit" : "button"}
                onClick={() => !searchOpen && setSearchOpen(true)}
                className="grid h-10 w-10 shrink-0 place-items-center transition hover:opacity-70"
                aria-label="Rechercher"
              >
                <Search className="h-[18px] w-[18px]" />
              </button>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onBlur={() => !query && setSearchOpen(false)}
                placeholder="Rechercher un produit…"
                className={cn(
                  "h-10 w-full bg-transparent pr-4 text-sm outline-none placeholder:text-current/50",
                  !searchOpen && "pointer-events-none",
                )}
                aria-label="Rechercher un produit"
              />
            </form>

            <button
              type="button"
              onClick={openCart}
              className="relative grid h-10 w-10 place-items-center rounded-full transition hover:bg-current/10"
              aria-label={`Panier, ${count} article${count > 1 ? "s" : ""}`}
            >
              <ShoppingBag className="h-[19px] w-[19px]" />
              <span
                className={cn(
                  "absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-accent-600 px-1 text-[10px] font-bold text-white transition-all duration-300",
                  count > 0 ? "scale-100 opacity-100" : "scale-50 opacity-0",
                )}
              >
                {count}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-[60] lg:hidden print:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!mobileOpen}
      >
        <div
          className={cn(
            "absolute inset-0 bg-ink-950/50 backdrop-blur-sm transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={cn(
            "absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col bg-paper text-ink-900 shadow-lift transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-ink-900/8 px-5 py-4">
            <span className="font-display text-xl tracking-[0.08em]">UORAHAL</span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="rounded-full p-2 hover:bg-ink-900/5"
              aria-label="Fermer le menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-5">
            <form onSubmit={onSearch} className="relative mb-6">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher…"
                className="input pl-11"
              />
            </form>
            <p className="eyebrow mb-3">Collections</p>
            <ul className="space-y-1">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/collections/${c.slug}`}
                    className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-white"
                  >
                    <span className="relative h-12 w-12 overflow-hidden rounded-lg bg-ink-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={c.image} alt="" className="h-full w-full object-cover" />
                    </span>
                    <span className="text-sm font-semibold">{c.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-1 border-t border-ink-900/8 pt-5">
              <Link href="/boutique" className="flex items-center gap-3 rounded-xl p-3 text-sm font-semibold hover:bg-white">
                <ShoppingBag className="h-4 w-4 text-accent-600" /> Toute la boutique
              </Link>
              <Link href="/boutique?tri=nouveautes" className="flex items-center gap-3 rounded-xl p-3 text-sm font-semibold hover:bg-white">
                <Sparkles className="h-4 w-4 text-accent-600" /> Nouveautés
              </Link>
              <Link href="/boutique?promo=1" className="flex items-center gap-3 rounded-xl p-3 text-sm font-semibold hover:bg-white">
                <Tag className="h-4 w-4 text-accent-600" /> Promotions
              </Link>
              <Link href="/entreprises" className="flex items-center gap-3 rounded-xl p-3 text-sm font-semibold hover:bg-white">
                <Building2 className="h-4 w-4 text-accent-600" /> Offre entreprises
              </Link>
            </div>
          </div>
          <div className="border-t border-ink-900/8 px-5 py-4">
            <div className="flex items-center gap-2">
              <a href={STORE.whatsappHref} target="_blank" rel="noreferrer" className="btn-secondary flex-1 px-3 py-2 text-xs">
                <WhatsAppIcon className="h-4 w-4 text-[#25D366]" /> WhatsApp
              </a>
              <a href={STORE.phoneHref} className="btn-secondary flex-1 px-3 py-2 text-xs">
                <Phone className="h-4 w-4" /> Appeler
              </a>
              <a href={STORE.tiktokHref} target="_blank" rel="noreferrer" className="btn-secondary px-3 py-2 text-xs" aria-label="TikTok @uorahal">
                <TikTokIcon className="h-4 w-4" />
              </a>
            </div>
            <p className="mt-3 text-xs text-ink-500">
              UORAHAL · {STORE.addressLine} · {STORE.hours}
              <br />
              <span className="tabular">{STORE.phoneDisplay}</span> · {STORE.email}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
