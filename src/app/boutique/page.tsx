import type { Metadata } from "next";
import { ShopView, parseShopParams, type SearchParams } from "@/components/shop/shop-view";
import { getCategoryBySlug } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Boutique",
  description: "Tous les produits UORAHAL : ordinateurs portables, PC, écrans, périphériques, stockage et accessoires.",
};

export default async function BoutiquePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const filters = parseShopParams(params);
  const category = filters.category ? await getCategoryBySlug(filters.category) : null;

  const title = filters.q
    ? `Résultats pour « ${filters.q} »`
    : filters.onSale && !category
      ? "Promotions"
      : filters.sort === "nouveautes" && !category
        ? "Nouveautés"
        : (category?.name ?? "Toute la boutique");

  const subtitle = filters.q
    ? "Produits, marques et catégories correspondant à votre recherche."
    : (category?.description ??
      "Ordinateurs, écrans, périphériques et accessoires sélectionnés et testés par nos techniciens, pour tous les profils et tous les budgets.");

  return (
    <div className="container-x pb-10 pt-10 sm:pt-14">
      <header className="mb-10 max-w-3xl">
        <p className="eyebrow">Boutique</p>
        <h1 className="display mt-3 text-4xl sm:text-6xl">{title}</h1>
        <p className="mt-4 text-ink-600">{subtitle}</p>
      </header>
      <ShopView searchParams={params} basePath="/boutique" />
    </div>
  );
}
