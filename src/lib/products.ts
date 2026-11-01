import { db } from "@/db";
import { categories, productImages, products, reviews } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { and, asc, avg, count, desc, eq, gt, gte, ilike, inArray, isNotNull, lte, ne, or, sql, type SQL } from "drizzle-orm";

export const PAGE_SIZE = 12;

export const SORT_OPTIONS = [
  { value: "pertinence", label: "Pertinence" },
  { value: "nouveautes", label: "Nouveautés" },
  { value: "prix-asc", label: "Prix croissant" },
  { value: "prix-desc", label: "Prix décroissant" },
  { value: "note", label: "Meilleures notes" },
  { value: "populaire", label: "Les plus commentés" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export type ProductCardData = {
  id: number;
  slug: string;
  name: string;
  brand: string;
  shortDescription: string;
  priceCents: number;
  compareAtCents: number | null;
  stock: number;
  featured: boolean;
  isNew: boolean;
  image: string;
  imageAlt: string;
  ratingAvg: number;
  ratingCount: number;
  categorySlug: string;
  categoryName: string;
};

export type ProductFilters = {
  category?: string;
  brands?: string[];
  minPrice?: number; // FCFA
  maxPrice?: number; // FCFA
  q?: string;
  inStock?: boolean;
  onSale?: boolean;
  sort?: SortValue;
  page?: number;
};

const ratingSq = db
  .select({
    productId: reviews.productId,
    ratingAvg: avg(reviews.rating).as("rating_avg"),
    ratingCount: count(reviews.id).as("rating_count"),
  })
  .from(reviews)
  .groupBy(reviews.productId)
  .as("ratings");

const firstImageUrl = sql<string | null>`(select ${productImages.url} from ${productImages} where ${productImages.productId} = ${products.id} order by ${productImages.position} asc limit 1)`;
const firstImageAlt = sql<string | null>`(select ${productImages.alt} from ${productImages} where ${productImages.productId} = ${products.id} order by ${productImages.position} asc limit 1)`;

const cardSelection = {
  id: products.id,
  slug: products.slug,
  name: products.name,
  brand: products.brand,
  shortDescription: products.shortDescription,
  priceCents: products.priceCents,
  compareAtCents: products.compareAtCents,
  stock: products.stock,
  featured: products.featured,
  isNew: products.isNew,
  image: firstImageUrl,
  imageAlt: firstImageAlt,
  ratingAvg: ratingSq.ratingAvg,
  ratingCount: ratingSq.ratingCount,
  categorySlug: categories.slug,
  categoryName: categories.name,
};

type RawCard = {
  id: number;
  slug: string;
  name: string;
  brand: string;
  shortDescription: string;
  priceCents: number;
  compareAtCents: number | null;
  stock: number;
  featured: boolean;
  isNew: boolean;
  image: string | null;
  imageAlt: string | null;
  ratingAvg: string | null;
  ratingCount: number | null;
  categorySlug: string;
  categoryName: string;
};

function toCard(row: RawCard): ProductCardData {
  return {
    ...row,
    image: row.image ?? "/images/hero.jpg",
    imageAlt: row.imageAlt ?? row.name,
    ratingAvg: row.ratingAvg ? Math.round(Number(row.ratingAvg) * 10) / 10 : 0,
    ratingCount: Number(row.ratingCount ?? 0),
  };
}

function baseCardQuery() {
  return db
    .select(cardSelection)
    .from(products)
    .innerJoin(categories, eq(categories.id, products.categoryId))
    .leftJoin(ratingSq, eq(ratingSq.productId, products.id));
}

function orderFor(sort: SortValue | undefined) {
  switch (sort) {
    case "prix-asc":
      return [asc(products.priceCents), asc(products.id)];
    case "prix-desc":
      return [desc(products.priceCents), asc(products.id)];
    case "nouveautes":
      return [desc(products.isNew), desc(products.createdAt), asc(products.id)];
    case "note":
      return [desc(sql`coalesce(${ratingSq.ratingAvg}, 0)`), desc(sql`coalesce(${ratingSq.ratingCount}, 0)`), asc(products.id)];
    case "populaire":
      return [desc(sql`coalesce(${ratingSq.ratingCount}, 0)`), desc(sql`coalesce(${ratingSq.ratingAvg}, 0)`), asc(products.id)];
    default:
      return [desc(products.featured), desc(products.isNew), asc(products.id)];
  }
}

export async function getCategories() {
  await ensureSeeded();
  return db.select().from(categories).orderBy(asc(categories.position));
}

export async function getCategoryBySlug(slug: string) {
  await ensureSeeded();
  const rows = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function getCategoriesWithCounts() {
  await ensureSeeded();
  const rows = await db
    .select({
      id: categories.id,
      slug: categories.slug,
      name: categories.name,
      tagline: categories.tagline,
      description: categories.description,
      image: categories.image,
      position: categories.position,
      productCount: count(products.id),
    })
    .from(categories)
    .leftJoin(products, eq(products.categoryId, categories.id))
    .groupBy(categories.id)
    .orderBy(asc(categories.position));
  return rows;
}

export async function getBrands(categorySlug?: string) {
  await ensureSeeded();
  const q = db
    .selectDistinct({ brand: products.brand })
    .from(products)
    .innerJoin(categories, eq(categories.id, products.categoryId))
    .orderBy(asc(products.brand));
  const rows = categorySlug ? await q.where(eq(categories.slug, categorySlug)) : await q;
  return rows.map((r) => r.brand);
}

export async function getProducts(filters: ProductFilters = {}) {
  await ensureSeeded();
  const conditions: SQL[] = [];

  if (filters.category) conditions.push(eq(categories.slug, filters.category));
  if (filters.brands && filters.brands.length > 0) conditions.push(inArray(products.brand, filters.brands));
  if (typeof filters.minPrice === "number" && !Number.isNaN(filters.minPrice))
    conditions.push(gte(products.priceCents, Math.round(filters.minPrice)));
  if (typeof filters.maxPrice === "number" && !Number.isNaN(filters.maxPrice))
    conditions.push(lte(products.priceCents, Math.round(filters.maxPrice)));
  if (filters.inStock) conditions.push(gt(products.stock, 0));
  if (filters.onSale) conditions.push(isNotNull(products.compareAtCents));
  if (filters.q && filters.q.trim()) {
    const term = `%${filters.q.trim()}%`;
    conditions.push(
      or(
        ilike(products.name, term),
        ilike(products.brand, term),
        ilike(products.shortDescription, term),
        ilike(categories.name, term),
      )!,
    );
  }

  const where = conditions.length ? and(...conditions) : undefined;
  const page = Math.max(1, filters.page ?? 1);

  const [rows, totalRows] = await Promise.all([
    baseCardQuery()
      .where(where)
      .orderBy(...orderFor(filters.sort))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db
      .select({ total: count() })
      .from(products)
      .innerJoin(categories, eq(categories.id, products.categoryId))
      .where(where),
  ]);

  const total = Number(totalRows[0]?.total ?? 0);
  return {
    items: rows.map(toCard),
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export async function getFeaturedProducts(limit = 8) {
  await ensureSeeded();
  const rows = await baseCardQuery()
    .where(eq(products.featured, true))
    .orderBy(desc(sql`coalesce(${ratingSq.ratingCount}, 0)`), asc(products.id))
    .limit(limit);
  return rows.map(toCard);
}

export async function getNewProducts(limit = 4) {
  await ensureSeeded();
  const rows = await baseCardQuery()
    .where(eq(products.isNew, true))
    .orderBy(desc(products.createdAt), asc(products.id))
    .limit(limit);
  return rows.map(toCard);
}

export async function getDealProducts(limit = 4) {
  await ensureSeeded();
  const rows = await baseCardQuery()
    .where(isNotNull(products.compareAtCents))
    .orderBy(desc(sql`(${products.compareAtCents} - ${products.priceCents})::float / ${products.compareAtCents}`), asc(products.id))
    .limit(limit);
  return rows.map(toCard);
}

export async function getProductBySlug(slug: string) {
  await ensureSeeded();
  const rows = await db
    .select({
      product: products,
      category: categories,
    })
    .from(products)
    .innerJoin(categories, eq(categories.id, products.categoryId))
    .where(eq(products.slug, slug))
    .limit(1);

  const row = rows[0];
  if (!row) return null;

  const [images, productReviews] = await Promise.all([
    db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, row.product.id))
      .orderBy(asc(productImages.position)),
    db
      .select()
      .from(reviews)
      .where(eq(reviews.productId, row.product.id))
      .orderBy(desc(reviews.createdAt)),
  ]);

  const ratingCount = productReviews.length;
  const ratingAvg = ratingCount
    ? Math.round((productReviews.reduce((acc, r) => acc + r.rating, 0) / ratingCount) * 10) / 10
    : 0;
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: productReviews.filter((r) => r.rating === star).length,
  }));

  return {
    ...row.product,
    category: row.category,
    images,
    reviews: productReviews,
    ratingAvg,
    ratingCount,
    distribution,
  };
}

export type ProductDetail = NonNullable<Awaited<ReturnType<typeof getProductBySlug>>>;

export async function getRelatedProducts(productId: number, categoryId: number, limit = 4) {
  await ensureSeeded();
  const sameCategory = await baseCardQuery()
    .where(and(eq(products.categoryId, categoryId), ne(products.id, productId)))
    .orderBy(desc(products.featured), asc(products.id))
    .limit(limit);
  if (sameCategory.length >= limit) return sameCategory.map(toCard);

  const excluded = [productId, ...sameCategory.map((p) => p.id)];
  const fill = await baseCardQuery()
    .where(and(eq(products.featured, true), sql`${products.id} not in (${sql.join(excluded.map((id) => sql`${id}`), sql`, `)})`))
    .orderBy(asc(products.id))
    .limit(limit - sameCategory.length);
  return [...sameCategory, ...fill].map(toCard);
}

export async function getProductsByIds(ids: number[]) {
  await ensureSeeded();
  if (ids.length === 0) return [];
  const rows = await baseCardQuery().where(inArray(products.id, ids));
  return rows.map(toCard);
}

export async function getAllProductSlugs() {
  await ensureSeeded();
  return db.select({ slug: products.slug }).from(products);
}
