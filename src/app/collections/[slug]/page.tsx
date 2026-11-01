import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ShopView, type SearchParams } from "@/components/shop/shop-view";
import { getCategories, getCategoryBySlug } from "@/lib/products";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<SearchParams> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Collection introuvable" };
  return { title: category.name, description: category.description };
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const [category, categories] = await Promise.all([getCategoryBySlug(slug), getCategories()]);
  if (!category) notFound();

  return (
    <>
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <Image src={category.image} alt={category.name} fill priority sizes="100vw" className="object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/70 to-ink-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 to-transparent" />
        <div className="container-x relative py-20 sm:py-28">
          <nav className="flex items-center gap-1.5 text-xs text-white/60" aria-label="Fil d'Ariane">
            <Link href="/" className="hover:text-white">Accueil</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/boutique" className="hover:text-white">Boutique</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white">{category.name}</span>
          </nav>
          <p className="eyebrow mt-8 text-accent-300">{category.tagline}</p>
          <h1 className="display mt-3 max-w-2xl text-5xl sm:text-7xl">{category.name}</h1>
          <p className="mt-5 max-w-xl text-white/70">{category.description}</p>
        </div>
      </section>

      <div className="border-b border-ink-900/8 bg-white">
        <div className="container-x flex gap-2 overflow-x-auto py-3 scrollbar-none">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/collections/${c.slug}`}
              className={cn("chip shrink-0", c.slug === category.slug && "chip-active")}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="container-x pb-10 pt-10 sm:pt-14">
        <ShopView searchParams={sp} forcedCategory={category.slug} basePath={`/collections/${category.slug}`} />
      </div>
    </>
  );
}
