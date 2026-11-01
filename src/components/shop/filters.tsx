"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { Check, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

type CategoryOption = { slug: string; name: string; productCount: number };

const PRICE_PRESETS = [
  { label: "Moins de 50 000 F", min: undefined, max: 50000 },
  { label: "50 000 – 250 000 F", min: 50000, max: 250000 },
  { label: "250 000 – 1 000 000 F", min: 250000, max: 1000000 },
  { label: "Plus de 1 000 000 F", min: 1000000, max: undefined },
];

export function ShopFilters({
  categories,
  brands,
  activeCount,
  total,
  forcedCategory,
  variant = "sidebar",
}: {
  categories: CategoryOption[];
  brands: string[];
  activeCount: number;
  total: number;
  /** When rendered on /collections/[slug], category changes navigate between collection routes. */
  forcedCategory?: string;
  /** "sidebar" renders the desktop panel; "mobile" renders the trigger button + drawer. */
  variant?: "sidebar" | "mobile";
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();

  const currentCategory = forcedCategory ?? searchParams.get("categorie") ?? "";
  const currentBrands = searchParams.getAll("marque");
  const minPrice = searchParams.get("prix_min") ?? "";
  const maxPrice = searchParams.get("prix_max") ?? "";
  const inStock = searchParams.get("stock") === "1";
  const onSale = searchParams.get("promo") === "1";

  const [minInput, setMinInput] = useState(minPrice);
  const [maxInput, setMaxInput] = useState(maxPrice);
  useEffect(() => {
    // Les champs éditables doivent refléter les paramètres de l’URL après une navigation.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMinInput(minPrice);
    setMaxInput(maxPrice);
  }, [minPrice, maxPrice]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const navigate = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      params.delete("page");
      startTransition(() => {
        router.push(`${pathname}${params.size ? `?${params.toString()}` : ""}`, { scroll: false });
      });
    },
    [pathname, router, searchParams],
  );

  const setCategory = (slug: string) => {
    if (forcedCategory !== undefined) {
      const params = new URLSearchParams(searchParams.toString());
      ["marque", "page", "categorie"].forEach((k) => params.delete(k));
      const qs = params.size ? `?${params.toString()}` : "";
      startTransition(() => {
        router.push(slug ? `/collections/${slug}${qs}` : `/boutique${qs}`, { scroll: false });
      });
      setOpen(false);
      return;
    }
    navigate((p) => {
      if (slug) p.set("categorie", slug);
      else p.delete("categorie");
      p.delete("marque");
    });
  };

  const toggleBrand = (brand: string) =>
    navigate((p) => {
      const all = p.getAll("marque");
      p.delete("marque");
      const next = all.includes(brand) ? all.filter((b) => b !== brand) : [...all, brand];
      next.forEach((b) => p.append("marque", b));
    });

  const setPrice = (min?: number | string, max?: number | string) =>
    navigate((p) => {
      if (min !== undefined && min !== "") p.set("prix_min", String(min));
      else p.delete("prix_min");
      if (max !== undefined && max !== "") p.set("prix_max", String(max));
      else p.delete("prix_max");
    });

  const toggleFlag = (key: "stock" | "promo", value: boolean) =>
    navigate((p) => {
      if (value) p.set(key, "1");
      else p.delete(key);
    });

  const reset = () =>
    navigate((p) => {
      ["categorie", "marque", "prix_min", "prix_max", "stock", "promo", "q"].forEach((k) => p.delete(k));
    });

  const panel = (
    <div className="space-y-8">
      <FilterGroup title="Catégories">
        <ul className="space-y-1">
          <li>
            <button
              type="button"
              onClick={() => setCategory("")}
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm transition hover:bg-white",
                !currentCategory ? "bg-white font-semibold text-ink-950 shadow-soft" : "text-ink-600",
              )}
            >
              Tout voir
            </button>
          </li>
          {categories.map((c) => (
            <li key={c.slug}>
              <button
                type="button"
                onClick={() => setCategory(c.slug)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm transition hover:bg-white",
                  currentCategory === c.slug ? "bg-white font-semibold text-ink-950 shadow-soft" : "text-ink-600",
                )}
              >
                <span>{c.name}</span>
                <span className="tabular text-xs text-ink-400">{c.productCount}</span>
              </button>
            </li>
          ))}
        </ul>
      </FilterGroup>

      <FilterGroup title="Marques">
        <ul className="grid grid-cols-2 gap-1.5 lg:grid-cols-1">
          {brands.map((b) => {
            const checked = currentBrands.includes(b);
            return (
              <li key={b}>
                <button
                  type="button"
                  onClick={() => toggleBrand(b)}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm text-ink-700 transition hover:bg-white"
                >
                  <span
                    className={cn(
                      "grid h-4.5 w-4.5 shrink-0 place-items-center rounded-[5px] border transition",
                      checked ? "border-ink-950 bg-ink-950 text-white" : "border-ink-300 bg-white",
                    )}
                  >
                    {checked && <Check className="h-3 w-3" strokeWidth={3} />}
                  </span>
                  {b}
                </button>
              </li>
            );
          })}
        </ul>
      </FilterGroup>

      <FilterGroup title="Prix">
        <div className="flex flex-wrap gap-1.5">
          {PRICE_PRESETS.map((preset) => {
            const active = String(preset.min ?? "") === minPrice && String(preset.max ?? "") === maxPrice;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => (active ? setPrice(undefined, undefined) : setPrice(preset.min, preset.max))}
                className={cn("chip", active && "chip-active")}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
        <form
          className="mt-3 flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setPrice(minInput, maxInput);
          }}
        >
          <div className="relative flex-1">
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={minInput}
              onChange={(e) => setMinInput(e.target.value)}
              placeholder="Min"
              className="input py-2 pr-7 text-sm"
              aria-label="Prix minimum"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-400">F</span>
          </div>
          <span className="text-ink-300">—</span>
          <div className="relative flex-1">
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={maxInput}
              onChange={(e) => setMaxInput(e.target.value)}
              placeholder="Max"
              className="input py-2 pr-7 text-sm"
              aria-label="Prix maximum"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-400">F</span>
          </div>
          <button type="submit" className="btn-secondary px-3 py-2 text-xs">
            OK
          </button>
        </form>
      </FilterGroup>

      <FilterGroup title="Disponibilité">
        <div className="space-y-2">
          <Toggle label="En stock uniquement" checked={inStock} onChange={(v) => toggleFlag("stock", v)} />
          <Toggle label="En promotion" checked={onSale} onChange={(v) => toggleFlag("promo", v)} />
        </div>
      </FilterGroup>

      {activeCount > 0 && (
        <button type="button" onClick={reset} className="btn-secondary w-full text-xs">
          <X className="h-3.5 w-3.5" /> Réinitialiser les filtres
        </button>
      )}
    </div>
  );

  if (variant === "sidebar") {
    return (
      <aside className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2 scrollbar-none">{panel}</div>
      </aside>
    );
  }

  return (
    <>
      {/* Mobile trigger */}
      <button type="button" onClick={() => setOpen(true)} className="btn-secondary px-4 py-2.5 text-xs lg:hidden">
        <SlidersHorizontal className="h-4 w-4" /> Filtres
        {activeCount > 0 && (
          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-ink-950 px-1 text-[10px] font-bold text-white">
            {activeCount}
          </span>
        )}
      </button>

      {/* Mobile drawer */}
      <div className={cn("fixed inset-0 z-[65] lg:hidden", open ? "pointer-events-auto" : "pointer-events-none")}>
        <div
          className={cn("absolute inset-0 bg-ink-950/50 backdrop-blur-sm transition-opacity", open ? "opacity-100" : "opacity-0")}
          onClick={() => setOpen(false)}
        />
        <div
          className={cn(
            "absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col bg-paper shadow-lift transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-ink-900/8 px-5 py-4">
            <p className="font-display text-xl">Filtres</p>
            <button type="button" onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-ink-900/5" aria-label="Fermer">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-6">{panel}</div>
          <div className="border-t border-ink-900/8 p-4">
            <button type="button" onClick={() => setOpen(false)} className="btn-primary w-full">
              Voir {total} produit{total > 1 ? "s" : ""}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        className="mb-3 flex w-full items-center justify-between text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-500"
      >
        {title}
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", collapsed && "-rotate-90")} />
      </button>
      {!collapsed && children}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm text-ink-700 transition hover:bg-white"
    >
      {label}
      <span className={cn("relative h-5 w-9 rounded-full transition-colors", checked ? "bg-ink-950" : "bg-ink-200")}>
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-[18px]" : "translate-x-0.5",
          )}
        />
      </span>
    </button>
  );
}
