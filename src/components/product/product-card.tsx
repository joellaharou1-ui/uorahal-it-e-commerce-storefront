import Link from "next/link";
import Image from "next/image";
import type { ProductCardData } from "@/lib/products";
import { cn, discountPercent, formatPrice } from "@/lib/utils";
import { RatingStars } from "./rating-stars";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";

export function ProductCard({
  product,
  priority = false,
  className,
}: {
  product: ProductCardData;
  priority?: boolean;
  className?: string;
}) {
  const discount = discountPercent(product.priceCents, product.compareAtCents);
  const lowStock = product.stock > 0 && product.stock <= 8;

  return (
    <article className={cn("group relative flex flex-col", className)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white shadow-soft">
        <Link href={`/produit/${product.slug}`} className="absolute inset-0" aria-label={product.name}>
          <Image
            src={product.image}
            alt={product.imageAlt}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-ink-950/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">
          {discount && (
            <span className="rounded-full bg-ink-950 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              -{discount}%
            </span>
          )}
          {product.isNew && (
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-950 backdrop-blur">
              Nouveau
            </span>
          )}
          {product.stock <= 0 && (
            <span className="rounded-full bg-ink-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              Épuisé
            </span>
          )}
        </div>

        <div className="absolute bottom-3 right-3 translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 focus-within:translate-y-0 focus-within:opacity-100">
          <AddToCartButton
            iconOnly
            product={{
              productId: product.id,
              slug: product.slug,
              name: product.name,
              brand: product.brand,
              priceCents: product.priceCents,
              compareAtCents: product.compareAtCents,
              image: product.image,
              stock: product.stock,
            }}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-400">{product.brand}</p>
          {product.ratingCount > 0 && (
            <span className="flex items-center gap-1 text-[11px] text-ink-500">
              <RatingStars rating={product.ratingAvg} size="xs" />
              <span className="tabular">({product.ratingCount})</span>
            </span>
          )}
        </div>
        <h3 className="mt-1 text-[15px] font-semibold leading-snug text-ink-950">
          <Link href={`/produit/${product.slug}`} className="transition-colors hover:text-accent-700">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-1 text-xs text-ink-500">{product.shortDescription}</p>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="tabular text-[15px] font-bold">{formatPrice(product.priceCents)}</span>
          {product.compareAtCents && (
            <span className="tabular text-xs text-ink-400 line-through">
              {formatPrice(product.compareAtCents)}
            </span>
          )}
          {lowStock && <span className="ml-auto text-[11px] font-medium text-amber-600">Plus que {product.stock}</span>}
        </div>
      </div>
    </article>
  );
}
