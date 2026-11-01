import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products, reviews } from "@/db/schema";
import { clientAddress, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

type Payload = {
  productId?: unknown;
  authorName?: unknown;
  rating?: unknown;
  title?: unknown;
  body?: unknown;
};

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  const limit = rateLimit(`reviews:${clientAddress(request)}`, 5, 60 * 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Trop d’avis envoyés. Réessayez plus tard." }, { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } });
  }
  let payload: Payload;
  try {
    payload = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const productId = Number(payload.productId);
  const rating = Number(payload.rating);
  const authorName = clean(payload.authorName, 60);
  const title = clean(payload.title, 120);
  const body = clean(payload.body, 2000);

  if (!Number.isInteger(productId) || productId <= 0) {
    return NextResponse.json({ error: "Produit invalide." }, { status: 400 });
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "La note doit être comprise entre 1 et 5." }, { status: 400 });
  }
  if (authorName.length < 2) {
    return NextResponse.json({ error: "Merci d'indiquer votre nom." }, { status: 400 });
  }
  if (title.length < 3) {
    return NextResponse.json({ error: "Le titre est trop court." }, { status: 400 });
  }
  if (body.length < 10) {
    return NextResponse.json({ error: "Votre avis est trop court (10 caractères minimum)." }, { status: 400 });
  }

  const [product] = await db.select({ id: products.id }).from(products).where(eq(products.id, productId)).limit(1);
  if (!product) {
    return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
  }

  const [review] = await db
    .insert(reviews)
    .values({ productId, authorName, rating, title, body, verified: false })
    .returning();

  return NextResponse.json({ review }, { status: 201 });
}
