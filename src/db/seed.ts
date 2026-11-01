import { db } from "./index";
import { categories, productImages, products, reviews } from "./schema";
import { seedCategories, seedProducts } from "./seed-data";

const DAY = 24 * 60 * 60 * 1000;

export async function seedDatabase(options: { force?: boolean } = {}) {
  if (options.force) {
    await db.delete(reviews);
    await db.delete(productImages);
    await db.delete(products);
    await db.delete(categories);
  }

  const existing = await db.select({ id: products.id }).from(products).limit(1);
  if (existing.length > 0) {
    return { seeded: false, products: 0, reviews: 0 };
  }

  let reviewCount = 0;

  await db.transaction(async (tx) => {
    const insertedCategories = await tx
      .insert(categories)
      .values(
        seedCategories.map((c) => ({
          slug: c.slug,
          name: c.name,
          tagline: c.tagline,
          description: c.description,
          image: c.image,
          position: c.position,
        })),
      )
      .onConflictDoUpdate({
        target: categories.slug,
        set: {
          name: categories.name,
          tagline: categories.tagline,
          description: categories.description,
          image: categories.image,
          position: categories.position,
        },
      })
      .returning({ id: categories.id, slug: categories.slug });

    const categoryIdBySlug = new Map(insertedCategories.map((c) => [c.slug, c.id]));
    const now = Date.now();

    for (const [index, p] of seedProducts.entries()) {
      const categoryId = categoryIdBySlug.get(p.category);
      if (!categoryId) throw new Error(`Unknown category "${p.category}" for product "${p.slug}"`);

      const createdAt = new Date(now - (p.isNew ? index : 45 + index * 3) * DAY);

      const [inserted] = await tx
        .insert(products)
        .values({
          slug: p.slug,
          name: p.name,
          brand: p.brand,
          categoryId,
          shortDescription: p.shortDescription,
          description: p.description,
          priceCents: p.price,
          compareAtCents: p.compareAt ?? null,
          stock: p.stock,
          featured: p.featured ?? false,
          isNew: p.isNew ?? false,
          specs: p.specs,
          highlights: p.highlights,
          createdAt,
        })
        .returning({ id: products.id });

      if (p.images.length > 0) {
        await tx.insert(productImages).values(
          p.images.map((image, position) => ({
            productId: inserted.id,
            url: `/images/p/${image.id}.jpg`,
            alt: image.alt,
            position,
          })),
        );
      }

      if (p.reviews.length > 0) {
        await tx.insert(reviews).values(
          p.reviews.map((r) => ({
            productId: inserted.id,
            authorName: r.author,
            rating: r.rating,
            title: r.title,
            body: r.body,
            verified: r.verified ?? false,
            createdAt: new Date(now - r.daysAgo * DAY),
          })),
        );
        reviewCount += p.reviews.length;
      }
    }
  });

  return { seeded: true, products: seedProducts.length, reviews: reviewCount };
}

type SeedGlobal = typeof globalThis & { __uorahalSeedPromise?: Promise<unknown> };

/**
 * Ensures demo data exists. Runs at most once per server process and is a
 * cheap "select ... limit 1" when the catalogue is already populated.
 */
export function ensureSeeded(): Promise<unknown> {
  const g = globalThis as SeedGlobal;
  if (!g.__uorahalSeedPromise) {
    g.__uorahalSeedPromise = seedDatabase().catch((error) => {
      g.__uorahalSeedPromise = undefined;
      throw error;
    });
  }
  return g.__uorahalSeedPromise;
}
