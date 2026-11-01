import Link from "next/link";
import { Suspense } from "react";
import { ChevronLeft, ChevronRight, SearchX, X } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { ShopFilters } from "@/components/shop/filters";
import { SortSelect } from "@/components/shop/sort-select";
import { getBrands, getCategoriesWithCounts, getProducts, type SortValue } from "@/lib/products";
import { cn, formatPrice } from "@/lib/utils";

export type SearchParams = Record<string, string | string[] | undefined>;

const SORT_VALUES: SortValue[] = ["pertinence", "nouveautes", "prix-asc", "prix-desc", "note", "populaire"];

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function all(value: string | string[] | undefined) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function toNumber(value: string | undefined) {
  if (value === undefined || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

export function parseShopParams(searchParams: SearchParams, forcedCategory?: string) {
  const sortRaw = first(searchParams.tri);
  const sort = SORT_VALUES.includes(sortRaw as SortValue) ? (sortRaw as SortValue) : "pertinence";
  return {
    category: forcedCategory ?? first(searchParams.categorie) ?? undefined,
    brands: all(searchParams.marque),
    minPrice: toNumber(first(searchParams.prix_min)),
    maxPrice: toNumber(first(searchParams.prix_max)),
    q: first(searchParams.q) ?? undefined,
    inStock: first(searchParams.stock) === "1",
    onSale: first(searchParams.promo) === "1",
    sort,
    page: Math.max(1, Number(first(searchParams.page) ?? 1) || 1),
  };
}

export async function ShopView({
  searchParams,
  forcedCategory,
  basePath,
}: {
  searchParams: SearchParams;
  forcedCategory?: string;
  basePath: string;
}) {
  const filters = parseShopParams(searchParams, forcedCategory);
  const [result, categories, brands] = await Promise.all([
    getProducts(filters),
    getCategoriesWithCounts(),
    getBrands(filters.category),
  ]);

  const activeChips: { label: string; param: string; value?: string }[] = [];
  if (filters.q) activeChips.push({ label: `« ${filters.q} »`, param: "q" });
  if (!forcedCategory && filters.category) {
    const cat = categories.find((c) => c.slug === filters.category);
    activeChips.push({ label: cat?.name ?? filters.category, param: "categorie" });
  }
  filters.brands.forEach((b) => activeChips.push({ label: b, param: "marque", value: b }));
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    const label =
      filters.minPrice !== undefined && filters.maxPrice !== undefined
        ? `${formatPrice(filters.minPrice)} – ${formatPrice(filters.maxPrice)}`
        : filters.minPrice !== undefined
          ? `Plus de ${formatPrice(filters.minPrice)}`
          : `Moins de ${formatPrice(filters.maxPrice ?? 0)}`;
    activeChips.push({ label, param: "prix" });
  }
  if (filters.inStock) activeChips.push({ label: "En stock", param: "stock" });
  if (filters.onSale) activeChips.push({ label: "En promotion", param: "promo" });

  const buildHref = (mutate: (p: URLSearchParams) => void) => {
    const p = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v === undefined) return;
      (Array.isArray(v) ? v : [v]).forEach((val) => p.append(k, val));
    });
    mutate(p);
    const qs = p.toString();
    return `${basePath}${qs ? `?${qs}` : ""}`;
  };

  const removeChipHref = (chip: { param: string; value?: string }) =>
    buildHref((p) => {
      p.delete("page");
      if (chip.param === "prix") {
        p.delete("prix_min");
        p.delete("prix_max");
      } else if (chip.param === "marque" && chip.value) {
        const rest = p.getAll("marque").filter((b) => b !== chip.value);
        p.delete("marque");
        rest.forEach((b) => p.append("marque", b));
      } else {
        p.delete(chip.param);
      }
    });

  const pageHref = (page: number) =>
    buildHref((p) => {
      if (page <= 1) p.delete("page");
      else p.set("page", String(page));
    });

  const from = result.total === 0 ? 0 : (result.page - 1) * 12 + 1;
  const to = Math.min(result.total, result.page * 12);

  return (
    <div className="grid gap-10 lg:grid-cols-[250px_1fr] lg:gap-14">
      <Suspense fallback={null}>
        <ShopFilters
          categories={categories.map((c) => ({ slug: c.slug, name: c.name, productCount: Number(c.productCount) }))}
          brands={brands}
          activeCount={activeChips.length}
          total={result.total}
          forcedCategory={forcedCategory}
        />
      </Suspense>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-900/8 pb-4">
          <p className="text-sm text-ink-600">
            {result.total === 0 ? (
              "Aucun produit"
            ) : (
              <>
                <span className="tabular font-semibold text-ink-950">
                  {from}–{to}
                </span>{" "}
                sur <span className="tabular font-semibold text-ink-950">{result.total}</span> produit
                {result.total > 1 ? "s" : ""}
              </>
            )}
          </p>
          <div className="flex items-center gap-2">
            <div className="lg:hidden">
              <Suspense fallback={null}>
                <ShopFilters
                  variant="mobile"
                  categories={categories.map((c) => ({ slug: c.slug, name: c.name, productCount: Number(c.productCount) }))}
                  brands={brands}
                  activeCount={activeChips.length}
                  total={result.total}
                  forcedCategory={forcedCategory}
                />
              </Suspense>
            </div>
            <Suspense fallback={null}>
              <SortSelect />
            </Suspense>
          </div>
        </div>

        {activeChips.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {activeChips.map((chip) => (
              <Link key={`${chip.param}-${chip.value ?? chip.label}`} href={removeChipHref(chip)} className="chip chip-active" scroll={false}>
                {chip.label} <X className="h-3 w-3" />
              </Link>
            ))}
            <Link href={basePath} className="text-xs font-semibold text-ink-500 underline-offset-4 hover:underline" scroll={false}>
              Tout effacer
            </Link>
          </div>
        )}

        {result.items.length === 0 ? (
          <div className="mt-16 flex flex-col items-center rounded-2xl border border-dashed border-ink-900/15 bg-white/60 px-6 py-20 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-paper">
              <SearchX className="h-7 w-7 text-ink-400" />
            </div>
            <h3 className="font-display mt-5 text-2xl">Aucun produit ne correspond</h3>
            <p className="mt-2 max-w-sm text-sm text-ink-500">
              Essayez d&apos;élargir la fourchette de prix, de retirer une marque ou de modifier votre recherche.
            </p>
            <Link href={basePath} className="btn-primary mt-6">
              Réinitialiser les filtres
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:gap-x-6 xl:grid-cols-3 2xl:grid-cols-4">
            {result.items.map((p, i) => (
              <div key={p.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}>
                <ProductCard product={p} priority={i < 3} />
              </div>
            ))}
          </div>
        )}

        {result.pageCount > 1 && (
          <nav className="mt-14 flex items-center justify-center gap-1.5" aria-label="Pagination">
            <PageLink href={pageHref(result.page - 1)} disabled={result.page <= 1} aria-label="Page précédente">
              <ChevronLeft className="h-4 w-4" />
            </PageLink>
            {Array.from({ length: result.pageCount }, (_, i) => i + 1).map((n) => (
              <PageLink key={n} href={pageHref(n)} active={n === result.page}>
                {n}
              </PageLink>
            ))}
            <PageLink href={pageHref(result.page + 1)} disabled={result.page >= result.pageCount} aria-label="Page suivante">
              <ChevronRight className="h-4 w-4" />
            </PageLink>
          </nav>
        )}
      </div>
    </div>
  );
}

function PageLink({
  href,
  children,
  active,
  disabled,
  ...rest
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  "aria-label"?: string;
}) {
  const className = cn(
    "grid h-10 min-w-10 place-items-center rounded-full border px-3 text-sm font-semibold transition",
    active ? "border-ink-950 bg-ink-950 text-white" : "border-ink-900/12 bg-white text-ink-700 hover:border-ink-900",
    disabled && "pointer-events-none opacity-40",
  );
  if (disabled) {
    return (
      <span className={className} {...rest}>
        {children}
      </span>
    );
  }
  return (
    <Link href={href} className={className} {...rest}>
      {children}
    </Link>
  );
}
