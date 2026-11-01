import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { ArrowRight, Check, Mail, MapPin, MessageCircle, Package, Printer } from "lucide-react";
import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { formatDate, formatPrice, PAYMENT_METHODS, paymentMethodLabel, SHIPPING_METHODS, STORE } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Commande confirmée" };

export default async function ConfirmationPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  const [order] = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
  if (!order) notFound();
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id)).orderBy(asc(orderItems.id));
  const method = SHIPPING_METHODS.find((m) => m.id === order.shippingMethod);
  const payment = PAYMENT_METHODS.find((m) => m.id === order.paymentMethod);

  const eta = new Date(order.createdAt);
  eta.setUTCDate(eta.getUTCDate() + (method?.etaDays ?? 2));

  const deliveryLabel =
    order.shippingMethod === "retrait"
      ? "Prêt en boutique sous 2 h"
      : order.shippingMethod === "express"
        ? "Aujourd'hui avant 18 h"
        : formatDate(eta);

  const addressLine = [order.address1, order.commune, order.city].filter(Boolean).join(", ");

  const paymentNote =
    payment?.kind === "transfer"
      ? "En attente de votre virement — coordonnées bancaires et facture pro forma envoyées par e-mail."
      : payment?.kind === "cod"
        ? `À régler au livreur : ${formatPrice(order.totalCents)} en espèces ou par Mobile Money.`
        : payment?.kind === "mobile"
          ? `Paiement ${paymentMethodLabel(order.paymentMethod)} validé.`
          : "Paiement par carte accepté.";

  return (
    <div className="container-x pb-10 pt-12 sm:pt-16">
      <div className="mx-auto max-w-3xl">
        <div className="animate-scale-in text-center">
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-accent-600 text-white shadow-glow">
            <Check className="h-9 w-9" strokeWidth={3} />
          </span>
          <p className="eyebrow mt-8">Commande confirmée</p>
          <h1 className="display mt-3 text-4xl sm:text-6xl">Merci, {order.firstName} !</h1>
          <p className="mx-auto mt-4 max-w-md text-ink-600">
            Votre commande <span className="tabular font-semibold text-ink-950">{order.orderNumber}</span> a bien été enregistrée. Un e-mail de
            confirmation est envoyé à <span className="font-medium text-ink-900">{order.email}</span>.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Package, title: order.shippingMethod === "retrait" ? "Retrait" : "Livraison estimée", text: deliveryLabel },
            { icon: MapPin, title: "Adresse", text: order.shippingMethod === "retrait" ? `UORAHAL, ${STORE.addressLine}` : addressLine },
            { icon: Mail, title: "Suivi", text: "Le livreur vous appelle avant de passer. Suivi par WhatsApp et e-mail." },
          ].map((c) => (
            <div key={c.title} className="card p-5">
              <c.icon className="h-5 w-5 text-accent-600" />
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink-400">{c.title}</p>
              <p className="mt-1 text-sm font-medium text-ink-900">{c.text}</p>
            </div>
          ))}
        </div>

        <div className="card mt-6 overflow-hidden">
          <div className="flex items-center justify-between border-b border-ink-900/8 px-6 py-4">
            <h2 className="font-display text-xl">Détail de la commande</h2>
            <span className="text-xs text-ink-500">{formatDate(order.createdAt)}</span>
          </div>
          <ul className="divide-y divide-ink-900/8 px-6">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 py-4">
                <span className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-paper">
                  {item.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt="" className="h-full w-full object-cover" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-400">{item.brand}</span>
                  <span className="block text-sm font-medium">{item.name}</span>
                  <span className="tabular text-xs text-ink-500">
                    {item.quantity} × {formatPrice(item.unitPriceCents)}
                  </span>
                </span>
                <span className="tabular text-sm font-semibold">{formatPrice(item.unitPriceCents * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="space-y-2 border-t border-ink-900/8 bg-paper/50 px-6 py-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-600">Sous-total</dt>
              <dd className="tabular">{formatPrice(order.subtotalCents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-600">{method?.name ?? "Livraison"}</dt>
              <dd className="tabular">{order.shippingCents === 0 ? "Offerte" : formatPrice(order.shippingCents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-600">Paiement</dt>
              <dd className="font-medium">{paymentMethodLabel(order.paymentMethod)}</dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-ink-900/8 pt-3">
              <dt className="font-semibold">{payment?.kind === "cod" || payment?.kind === "transfer" ? "Total à régler" : "Total payé"}</dt>
              <dd className="tabular text-2xl font-bold">{formatPrice(order.totalCents)}</dd>
            </div>
            <p className="text-xs text-ink-500">{paymentNote} TVA 18 % incluse.</p>
          </dl>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/boutique" className="btn-primary">
            Continuer mes achats <ArrowRight className="h-4 w-4" />
          </Link>
          <a href={STORE.whatsappHref} target="_blank" rel="noreferrer" className="btn-secondary">
            <MessageCircle className="h-4 w-4" /> Suivi WhatsApp
          </a>
          <span className="inline-flex items-center gap-1.5 text-xs text-ink-500">
            <Printer className="h-3.5 w-3.5" /> Facture envoyée par e-mail
          </span>
        </div>
      </div>
    </div>
  );
}
