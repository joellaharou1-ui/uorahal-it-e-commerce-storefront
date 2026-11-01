import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { isAdmin } from "@/lib/admin-auth";
import { statusLabel } from "@/lib/order-status";
import { formatDate, formatPrice, PAYMENT_METHODS, paymentMethodLabel, SHIPPING_METHODS, STORE } from "@/lib/utils";
import { PrintButton } from "./print-button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bon de livraison",
  robots: { index: false, follow: false },
};

export default async function DeliverySlipPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  if (!(await isAdmin())) redirect("/admin?error=forbidden");

  const { orderNumber } = await params;
  const [order] = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
  if (!order) notFound();
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id)).orderBy(asc(orderItems.id));

  const shipping = SHIPPING_METHODS.find((m) => m.id === order.shippingMethod)?.name ?? order.shippingMethod;
  const payment = PAYMENT_METHODS.find((m) => m.id === order.paymentMethod);
  const toCollect = payment?.kind === "cod";
  const waDigits = order.phone.replace(/\D/g, "");
  const waNumber = waDigits.length === 10 && waDigits.startsWith("0") ? `225${waDigits.slice(1)}` : waDigits;
  const isPickup = order.shippingMethod === "retrait";
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="container-x py-8 print:max-w-none print:p-0">
      <div className="mb-6 flex items-center justify-between gap-3 print:hidden">
        <Link href="/admin?vue=a-livrer" className="btn-ghost px-3 text-xs">
          <ArrowLeft className="h-4 w-4" /> Retour aux commandes
        </Link>
        <PrintButton />
      </div>

      <article className="mx-auto max-w-2xl rounded-2xl border border-ink-900/10 bg-white p-8 shadow-soft print:max-w-none print:rounded-none print:border-0 print:p-0 print:shadow-none">
        <header className="flex items-start justify-between gap-6 border-b border-ink-900/10 pb-6">
          <div>
            <p className="font-display text-2xl tracking-[0.08em]">UORAHAL</p>
            <p className="mt-1 text-xs text-ink-500">
              {STORE.addressLine} · {STORE.phoneDisplay}
              <br />
              {STORE.email}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-400">Bon de livraison</p>
            <p className="tabular mt-1 text-xl font-bold">{order.orderNumber}</p>
            <p className="text-xs text-ink-500">
              {formatDate(order.createdAt)} · {statusLabel(order.status)}
            </p>
          </div>
        </header>

        {toCollect ? (
          <div className="mt-6 rounded-xl border-2 border-ink-950 p-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em]">Montant à encaisser à la livraison</p>
            <p className="tabular mt-1 text-3xl font-bold">{formatPrice(order.totalCents)}</p>
            <p className="mt-1 text-xs text-ink-600">Espèces ou Mobile Money</p>
          </div>
        ) : (
          <div className="mt-6 rounded-xl bg-paper p-4 text-center text-sm">
            <span className="font-semibold">Rien à encaisser</span> — {paymentMethodLabel(order.paymentMethod)}
            {payment?.kind === "transfer" && order.status === "pending_payment" && (
              <span className="block text-xs text-red-700">Attention : virement non encore reçu.</span>
            )}
          </div>
        )}

        <section className="mt-6 grid gap-6 sm:grid-cols-2 print:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-400">Client</p>
            <p className="mt-1.5 text-lg font-semibold">
              {order.firstName} {order.lastName}
            </p>
            {order.company && <p className="text-sm text-ink-600">{order.company}</p>}
            <p className="tabular mt-1 text-lg font-bold">{order.phone}</p>
            <p className="text-sm text-ink-600">{order.email}</p>
            {waNumber && (
              <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs font-semibold text-accent-700 print:hidden">
                Contacter sur WhatsApp
              </a>
            )}
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-400">{isPickup ? "Retrait" : "Adresse de livraison"}</p>
            {isPickup ? (
              <p className="mt-1.5 text-sm">Retrait en boutique — {STORE.addressLine}</p>
            ) : (
              <>
                {order.commune && <p className="mt-1.5 text-lg font-semibold">{order.commune}</p>}
                <p className="text-sm">{order.address1}</p>
                {order.address2 && <p className="text-sm text-ink-600">{order.address2}</p>}
                <p className="text-sm text-ink-600">
                  {order.city}, {order.country}
                </p>
              </>
            )}
            <p className="mt-2 text-xs text-ink-500">Mode : {shipping}</p>
          </div>
        </section>

        <table className="mt-8 w-full text-sm">
          <thead className="border-b border-ink-900/15 text-left text-[11px] uppercase tracking-[0.14em] text-ink-400">
            <tr>
              <th className="w-12 py-2 font-semibold">Qté</th>
              <th className="py-2 font-semibold">Article</th>
              <th className="w-10 py-2 text-center font-semibold">✓</th>
              <th className="py-2 text-right font-semibold">Montant</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-900/10">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="tabular py-3 text-base font-bold">{item.quantity}</td>
                <td className="py-3">
                  <span className="font-medium">{item.name}</span>
                  <span className="block text-xs text-ink-500">{item.brand}</span>
                </td>
                <td className="py-3 text-center">
                  <span className="inline-block h-4 w-4 rounded border border-ink-400" />
                </td>
                <td className="tabular py-3 text-right">{formatPrice(item.unitPriceCents * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="text-sm">
            <tr className="border-t border-ink-900/15">
              <td colSpan={3} className="pt-3 text-ink-600">
                {itemCount} article{itemCount > 1 ? "s" : ""} · Livraison
              </td>
              <td className="tabular pt-3 text-right">{order.shippingCents === 0 ? "Offerte" : formatPrice(order.shippingCents)}</td>
            </tr>
            <tr>
              <td colSpan={3} className="pt-2 font-semibold">
                Total TTC (TVA 18 % incluse)
              </td>
              <td className="tabular pt-2 text-right text-lg font-bold">{formatPrice(order.totalCents)}</td>
            </tr>
          </tfoot>
        </table>

        <section className="mt-12 grid grid-cols-2 gap-8 text-xs text-ink-600">
          <div>
            <p className="font-semibold text-ink-800">Livreur</p>
            <p className="mt-1">Nom : ______________________</p>
            <p className="mt-8 border-t border-ink-400 pt-1">Signature</p>
          </div>
          <div>
            <p className="font-semibold text-ink-800">Client — reçu en bon état</p>
            <p className="mt-1">Date : ____ / ____ / ________</p>
            <p className="mt-8 border-t border-ink-400 pt-1">Signature</p>
          </div>
        </section>
      </article>
    </div>
  );
}
