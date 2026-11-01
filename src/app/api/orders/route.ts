import { after, NextResponse } from "next/server";
import { eq, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders, productImages, products } from "@/db/schema";
import { generateOrderNumber, PAYMENT_METHODS, SHIPPING_METHODS, shippingCostFor } from "@/lib/utils";
import { notifyOrderCreated } from "@/lib/notify";

export const dynamic = "force-dynamic";

type Payload = {
  customer?: Record<string, unknown>;
  address?: Record<string, unknown>;
  shippingMethod?: unknown;
  paymentMethod?: unknown;
  paymentPhone?: unknown;
  items?: unknown;
};

function str(value: unknown, max = 200) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let payload: Payload;
  try {
    payload = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const customer = payload.customer ?? {};
  const address = payload.address ?? {};
  const email = str(customer.email, 160);
  const firstName = str(customer.firstName, 80);
  const lastName = str(customer.lastName, 80);
  const phone = str(customer.phone, 40);
  const company = str(customer.company, 120);
  const address1 = str(address.address1, 200);
  const address2 = str(address.address2, 200);
  const commune = str(address.commune, 80);
  const postalCode = str(address.postalCode, 20);
  const city = str(address.city, 120);
  const country = str(address.country, 80) || "Côte d'Ivoire";
  const shippingMethod = str(payload.shippingMethod, 20);
  const paymentMethod = str(payload.paymentMethod, 20) || "orange_money";
  const paymentPhone = str(payload.paymentPhone, 40);

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Adresse e-mail invalide." }, { status: 400 });
  }
  if (!firstName || !lastName || !address1 || !city) {
    return NextResponse.json({ error: "Merci de compléter vos coordonnées et votre adresse." }, { status: 400 });
  }
  if (phone.replace(/\D/g, "").length < 8) {
    return NextResponse.json({ error: "Merci d'indiquer un numéro de téléphone valide." }, { status: 400 });
  }
  if (!SHIPPING_METHODS.some((m) => m.id === shippingMethod)) {
    return NextResponse.json({ error: "Mode de livraison invalide." }, { status: 400 });
  }
  const method = PAYMENT_METHODS.find((m) => m.id === paymentMethod);
  if (!method) {
    return NextResponse.json({ error: "Mode de paiement invalide." }, { status: 400 });
  }
  if (method.kind === "mobile" && paymentPhone.replace(/\D/g, "").length !== 10) {
    return NextResponse.json({ error: "Le numéro Mobile Money doit comporter 10 chiffres." }, { status: 400 });
  }

  const rawItems = Array.isArray(payload.items) ? (payload.items as { productId?: unknown; quantity?: unknown }[]) : [];
  const wanted = new Map<number, number>();
  for (const item of rawItems) {
    const id = Number(item.productId);
    const qty = Number(item.quantity);
    if (!Number.isInteger(id) || id <= 0 || !Number.isInteger(qty) || qty <= 0) continue;
    wanted.set(id, Math.min(99, (wanted.get(id) ?? 0) + qty));
  }
  if (wanted.size === 0) {
    return NextResponse.json({ error: "Votre panier est vide." }, { status: 400 });
  }

  const ids = [...wanted.keys()];
  const catalogue = await db
    .select({
      id: products.id,
      name: products.name,
      brand: products.brand,
      priceCents: products.priceCents,
      stock: products.stock,
      image: sql<string | null>`(select ${productImages.url} from ${productImages} where ${productImages.productId} = ${products.id} order by ${productImages.position} asc limit 1)`,
    })
    .from(products)
    .where(inArray(products.id, ids));

  if (catalogue.length !== ids.length) {
    return NextResponse.json({ error: "Un produit de votre panier n'est plus disponible." }, { status: 409 });
  }

  for (const product of catalogue) {
    const qty = wanted.get(product.id) ?? 0;
    if (product.stock < qty) {
      return NextResponse.json(
        { error: `Stock insuffisant pour « ${product.name} » (${product.stock} disponible${product.stock > 1 ? "s" : ""}).` },
        { status: 409 },
      );
    }
  }

  const subtotalCents = catalogue.reduce((acc, p) => acc + p.priceCents * (wanted.get(p.id) ?? 0), 0);
  const shippingCents = shippingCostFor(shippingMethod, subtotalCents);
  const totalCents = subtotalCents + shippingCents;

  const status =
    method.kind === "transfer" ? "pending_payment" : method.kind === "cod" ? "pay_on_delivery" : "confirmed";

  let orderNumber = generateOrderNumber();
  let orderId = 0;

  try {
    await db.transaction(async (tx) => {
      // Retry order number on the (very unlikely) collision.
      for (let attempt = 0; attempt < 3; attempt++) {
        const existing = await tx.select({ id: orders.id }).from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
        if (existing.length === 0) break;
        orderNumber = generateOrderNumber();
      }

      const [order] = await tx
        .insert(orders)
        .values({
          orderNumber,
          email,
          firstName,
          lastName,
          phone,
          company,
          address1,
          address2,
          commune,
          postalCode,
          city,
          country,
          shippingMethod,
          paymentMethod,
          paymentPhone: method.kind === "mobile" ? paymentPhone : "",
          subtotalCents,
          shippingCents,
          totalCents,
          status,
        })
        .returning({ id: orders.id });
      orderId = order.id;

      await tx.insert(orderItems).values(
        catalogue.map((p) => ({
          orderId: order.id,
          productId: p.id,
          name: p.name,
          brand: p.brand,
          image: p.image ?? "",
          unitPriceCents: p.priceCents,
          quantity: wanted.get(p.id) ?? 0,
        })),
      );

      for (const p of catalogue) {
        await tx
          .update(products)
          .set({ stock: sql`${products.stock} - ${wanted.get(p.id) ?? 0}` })
          .where(eq(products.id, p.id));
      }
    });
  } catch (error) {
    console.error("Order creation failed", error);
    return NextResponse.json({ error: "Impossible d'enregistrer la commande. Merci de réessayer." }, { status: 500 });
  }

  // Notify the team and the customer after the response is sent. Failures never block the order.
  after(() => notifyOrderCreated(orderId));

  return NextResponse.json({ orderNumber, totalCents }, { status: 201 });
}
