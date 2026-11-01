import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ChevronRight, Package, RotateCcw, ShieldCheck, Smartphone, Truck } from "lucide-react";
import { ImageGallery } from "@/components/product/image-gallery";
import { PurchasePanel } from "@/components/product/purchase-panel";
import { ProductCard } from "@/components/product/product-card";
import { RatingStars } from "@/components/product/rating-stars";
import { ReviewsSection } from "@/components/product/reviews-section";
import { Reveal } from "@/components/ui/reveal";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import { discountPercent, formatPrice, STORE } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Produit introuvable" };
  return {
    title: `${product.name} — ${product.brand}`,
    description: product.shortDescription,
    openGraph: { images: product.images[0] ? [{ url: product.images[0].url }] : [] },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.id, product.categoryId, 4);
  const discount = discountPercent(product.priceCents, product.compareAtCents);
  const inStock = product.stock > 0;
  const lowStock = inStock && product.stock <= 8;
  const mainImage = product.images[0]?.url ?? "/images/hero.jpg";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: { "@type": "Brand", name: product.brand },
    description: product.shortDescription,
    image: product.images.map((i) => i.url),
    offers: {
      "@type": "Offer",
      priceCurrency: "XOF",
      price: String(product.priceCents),
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    ...(product.ratingCount > 0
      ? { aggregateRating: { "@type": "AggregateRating", ratingValue: product.ratingAvg, reviewCount: product.ratingCount } }
      : {}),
  };

  return (
    <div className="container-x pb-10 pt-6 sm:pt-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="flex flex-wrap items-center gap-1.5 text-xs text-ink-500" aria-label="Fil d'Ariane">
        <Link href="/" className="hover:text-ink-950">Accueil</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/boutique" className="hover:text-ink-950">Boutique</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/collections/${product.category.slug}`} className="hover:text-ink-950">{product.category.name}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-ink-900">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="animate-fade-in">
          <ImageGallery
            images={product.images.map((i) => ({ url: i.url, alt: i.alt || product.name }))}
            badges={
              <>
                {discount && (
                  <span className="rounded-full bg-ink-950 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">-{discount}%</span>
                )}
                {product.isNew && (
                  <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ink-950 backdrop-blur">Nouveau</span>
                )}
              </>
            }
          />
        </div>

        <div className="animate-fade-up lg:py-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-600">{product.brand}</p>
            {product.ratingCount > 0 && (
              <a href="#avis" className="flex items-center gap-2 text-xs text-ink-600 hover:text-ink-950">
                <RatingStars rating={product.ratingAvg} size="sm" />
                <span className="tabular font-semibold">{product.ratingAvg.toFixed(1).replace(".", ",")}</span>
                <span className="text-ink-400">({product.ratingCount} avis)</span>
              </a>
            )}
          </div>
          <h1 className="display mt-3 text-4xl leading-[1.05] sm:text-5xl">{product.name}</h1>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-600">{product.shortDescription}</p>

          <div className="mt-7 flex flex-wrap items-end gap-3">
            <span className="tabular text-4xl font-bold tracking-tight">{formatPrice(product.priceCents)}</span>
            {product.compareAtCents && (
              <span className="tabular pb-1.5 text-lg text-ink-400 line-through">{formatPrice(product.compareAtCents)}</span>
            )}
            {discount && (
              <span className="mb-1.5 rounded-full bg-accent-50 px-2.5 py-1 text-xs font-bold text-accent-700">
                Économisez {formatPrice(product.compareAtCents! - product.priceCents)}
              </span>
            )}
          </div>
          <p className="mt-1.5 text-xs text-ink-500">
            Prix TTC en FCFA · Payez par Orange Money, MTN MoMo, Wave, carte ou à la livraison
          </p>

          {product.highlights.length > 0 && (
            <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
              {product.highlights.map((h) => (
                <li key={h} className="flex items-center gap-2.5 text-sm text-ink-800">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-ink-950 text-white">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {h}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-7 flex items-center gap-2 text-sm">
            <span className={`h-2 w-2 rounded-full ${inStock ? (lowStock ? "bg-amber-500" : "bg-emerald-500") : "bg-red-500"}`} />
            {inStock ? (
              lowStock ? (
                <span className="font-medium text-amber-700">Plus que {product.stock} en stock — expédié sous 24 h</span>
              ) : (
                <span className="font-medium text-emerald-700">En stock — expédié sous 24 h</span>
              )
            ) : (
              <span className="font-medium text-red-600">Momentanément indisponible</span>
            )}
          </div>

          <div className="mt-5">
            <PurchasePanel
              product={{
                productId: product.id,
                slug: product.slug,
                name: product.name,
                brand: product.brand,
                priceCents: product.priceCents,
                compareAtCents: product.compareAtCents,
                image: mainImage,
                stock: product.stock,
              }}
            />
          </div>

          <ul className="mt-8 grid grid-cols-2 gap-3 text-xs text-ink-700 sm:grid-cols-4">
            {[
              { icon: Truck, text: "Livraison Abidjan offerte dès 50 000 FCFA" },
              { icon: RotateCcw, text: "Retours gratuits 30 jours" },
              { icon: ShieldCheck, text: "Garantie étendue incluse" },
              { icon: Smartphone, text: "Orange Money, MTN, Wave, carte" },
            ].map((item) => (
              <li key={item.text} className="flex flex-col items-start gap-2 rounded-xl border border-ink-900/8 bg-white p-3">
                <item.icon className="h-4 w-4 text-accent-600" />
                <span className="leading-snug">{item.text}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-start gap-3 rounded-xl bg-accent-50/70 p-4 text-xs text-ink-700">
            <Package className="mt-0.5 h-4 w-4 shrink-0 text-accent-700" />
            <p>
              <strong className="font-semibold text-ink-900">Retrait en boutique en 2 h</strong> — UORAHAL {STORE.addressLine}. Nos techniciens configurent votre
              matériel sur place si vous le souhaitez. Questions ? WhatsApp{" "}
              <a href={STORE.whatsappHref} target="_blank" rel="noreferrer" className="tabular font-semibold text-ink-900 underline-offset-4 hover:underline">
                {STORE.phoneDisplay}
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Description & specs */}
      <div className="mt-20 grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <Reveal>
          <p className="eyebrow">Présentation</p>
          <h2 className="display mt-3 text-3xl sm:text-4xl">Conçu pour durer, pensé pour vous</h2>
          <p className="mt-5 text-[15px] leading-[1.8] text-ink-700">{product.description}</p>
        </Reveal>
        <Reveal delay={100}>
          <p className="eyebrow">Caractéristiques techniques</p>
          <dl className="mt-5 overflow-hidden rounded-2xl border border-ink-900/8 bg-white">
            {product.specs.map((spec, i) => (
              <div key={spec.label} className={`grid grid-cols-[130px_1fr] gap-4 px-5 py-3.5 text-sm sm:grid-cols-[180px_1fr] ${i % 2 ? "bg-paper/60" : ""}`}>
                <dt className="font-medium text-ink-500">{spec.label}</dt>
                <dd className="text-ink-900">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      {/* Reviews */}
      <div className="mt-24">
        <ReviewsSection
          productId={product.id}
          reviews={product.reviews.map((r) => ({
            id: r.id,
            authorName: r.authorName,
            rating: r.rating,
            title: r.title,
            body: r.body,
            verified: r.verified,
            createdAt: r.createdAt.toISOString(),
          }))}
          ratingAvg={product.ratingAvg}
          ratingCount={product.ratingCount}
          distribution={product.distribution}
        />
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-24">
          <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Vous aimerez aussi</p>
              <h2 className="display mt-3 text-3xl sm:text-4xl">Complétez votre installation</h2>
            </div>
            <Link href={`/collections/${product.category.slug}`} className="link-underline text-sm font-semibold">
              Toute la collection {product.category.name} →
            </Link>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 70}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
