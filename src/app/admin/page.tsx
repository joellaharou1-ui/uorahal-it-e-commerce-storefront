import type { Metadata } from "next";
import { desc, inArray } from "drizzle-orm";
import Link from "next/link";
import { Check, Mail, MessageCircle, Printer, Send, X } from "lucide-react";
import { db } from "@/db";
import { notifications, orderItems, orders } from "@/db/schema";
import { adminConfigured, isAdmin } from "@/lib/admin-auth";
import { getNotificationStatus, recentNotifications } from "@/lib/notify";
import { NEXT_ACTIONS, statusLabel, statusToneClass, type OrderStatus } from "@/lib/order-status";
import { cn, formatDate, formatPrice, paymentMethodLabel, SHIPPING_METHODS } from "@/lib/utils";
import { loginAction, logoutAction, sendTestAction, setOrderStatusAction } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Administration des commandes",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const VIEWS = {
  "a-valider": { label: "À valider", statuses: ["confirmed", "pending_payment", "pay_on_delivery"] },
  "a-livrer": { label: "À livrer", statuses: ["validated", "shipped"] },
  terminees: { label: "Terminées", statuses: ["delivered", "cancelled"] },
  toutes: { label: "Toutes", statuses: null },
} as const;
type ViewKey = keyof typeof VIEWS;

const ERRORS: Record<string, string> = {
  "bad-password": "Mot de passe incorrect.",
  "too-many": "Trop de tentatives. Réessayez dans 15 minutes.",
  "not-configured": "Le tableau de bord est verrouillé : définissez ADMIN_PASSWORD (12 caractères minimum).",
  forbidden: "Votre session a expiré. Reconnectez-vous.",
  "not-found": "Commande introuvable.",
  "invalid-transition": "Cette action n'est pas possible pour le statut actuel.",
  "invalid-status": "Statut invalide.",
};

export default async function AdminPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const error = typeof sp.error === "string" ? ERRORS[sp.error] ?? "Une erreur est survenue." : null;

  if (!(await isAdmin())) {
    return <LoginView configured={adminConfigured()} error={error} />;
  }

  const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(200);
  const view: ViewKey = typeof sp.vue === "string" && sp.vue in VIEWS ? (sp.vue as ViewKey) : "a-valider";
  const inView = (key: ViewKey, status: string) => {
    const statuses = VIEWS[key].statuses as readonly string[] | null;
    return statuses === null || statuses.includes(status);
  };
  const viewCounts = Object.fromEntries(
    (Object.keys(VIEWS) as ViewKey[]).map((key) => [key, allOrders.filter((o) => inView(key, o.status)).length]),
  ) as Record<ViewKey, number>;
  const orderRows = allOrders.filter((o) => inView(view, o.status));
  const orderIds = orderRows.map((o) => o.id);
  const lines = orderIds.length
    ? await db.select().from(orderItems).where(inArray(orderItems.orderId, orderIds))
    : [];
  const linesByOrder = new Map<number, typeof lines>();
  for (const line of lines) {
    const list = linesByOrder.get(line.orderId) ?? [];
    list.push(line);
    linesByOrder.set(line.orderId, list);
  }

  const config = getNotificationStatus();
  const journal = await recentNotifications(40);

  const pending = allOrders.filter((o) => o.status === "confirmed" || o.status === "pending_payment" || o.status === "pay_on_delivery").length;
  const revenue = allOrders.filter((o) => o.status !== "cancelled").reduce((sum, o) => sum + o.totalCents, 0);

  const notice = typeof sp.notice === "string" ? sp.notice : null;
  const noticeText =
    notice === "status-updated"
      ? { tone: "ok", text: "Statut mis à jour." }
      : notice === "test"
        ? {
            tone: sp.ok === "0" && sp.failed === "0" ? "warn" : Number(sp.failed) > 0 ? "warn" : "ok",
            text:
              sp.ok === "0" && sp.failed === "0"
                ? "Aucun canal de test configuré (Telegram ou e-mail)."
                : `Test envoyé : ${sp.ok ?? 0} réussi(s), ${sp.failed ?? 0} échec(s). Voir le journal ci-dessous.`,
          }
        : null;

  return (
    <div className="container-x py-10 sm:py-14">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Administration</p>
          <h1 className="display mt-2 text-4xl sm:text-5xl">Commandes</h1>
          <p className="mt-2 text-sm text-ink-500">
            {pending} en attente de validation · {formatPrice(revenue)} de chiffre d&apos;affaires (hors annulations)
          </p>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="btn-secondary px-4 py-2.5 text-xs">
            Se déconnecter
          </button>
        </form>
      </header>

      {noticeText && (
        <p
          className={cn(
            "mt-6 rounded-xl px-4 py-3 text-sm",
            noticeText.tone === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800",
          )}
        >
          {noticeText.text}
        </p>
      )}

      {/* Canaux de notification */}
      <section className="mt-8 grid gap-4 lg:grid-cols-[1fr_auto]">
        <div className="card grid gap-3 p-5 sm:grid-cols-3">
          <ChannelPill icon={<Send className="h-4 w-4" />} label="Telegram (équipe)" ok={config.telegram} hint="TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID" />
          <ChannelPill icon={<Mail className="h-4 w-4" />} label="E-mail (Resend)" ok={config.email} hint="RESEND_API_KEY + NOTIFY_FROM_EMAIL" />
          <ChannelPill
            icon={<MessageCircle className="h-4 w-4" />}
            label="WhatsApp (client)"
            ok={config.whatsapp && (config.whatsappTemplates.created || config.whatsappTemplates.validated)}
            hint={`Modèles : confirmation ${config.whatsappTemplates.created ? "✓" : "—"} · validation ${config.whatsappTemplates.validated ? "✓" : "—"}`}
          />
        </div>
        <form action={sendTestAction} className="card flex items-center p-5">
          <button type="submit" className="btn-primary w-full whitespace-nowrap px-5 py-3 text-xs lg:w-auto">
            <Send className="h-4 w-4" /> Envoyer un test
          </button>
        </form>
      </section>

      {/* Onglets */}
      <nav className="mt-10 flex gap-2 overflow-x-auto scrollbar-none" aria-label="Filtrer les commandes">
        {(Object.keys(VIEWS) as ViewKey[]).map((key) => (
          <Link
            key={key}
            href={`/admin?vue=${key}`}
            className={cn("chip shrink-0", view === key && "chip-active")}
            aria-current={view === key ? "page" : undefined}
          >
            {VIEWS[key].label}
            <span className={cn("tabular rounded-full px-1.5 text-[10px] font-bold", view === key ? "bg-white/20" : "bg-ink-100")}>
              {viewCounts[key]}
            </span>
          </Link>
        ))}
      </nav>

      {/* Commandes */}
      <section className="mt-5 space-y-4">
        {orderRows.length === 0 && (
          <div className="card p-10 text-center text-sm text-ink-500">
            {allOrders.length === 0 ? "Aucune commande pour le moment." : `Aucune commande dans « ${VIEWS[view].label} ».`}
          </div>
        )}
        {orderRows.map((order) => {
          const status = order.status as OrderStatus;
          const actions = NEXT_ACTIONS[status] ?? [];
          const orderLines = linesByOrder.get(order.id) ?? [];
          const shipping = SHIPPING_METHODS.find((m) => m.id === order.shippingMethod)?.name ?? order.shippingMethod;
          const waNumber = order.phone.replace(/\D/g, "");
          return (
            <article key={order.id} className="card overflow-hidden">
              <div className="flex flex-col gap-3 border-b border-ink-900/8 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="tabular font-bold">{order.orderNumber}</span>
                  <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold", statusToneClass(order.status))}>
                    {statusLabel(order.status)}
                  </span>
                  <span className="text-xs text-ink-500">{formatDate(order.createdAt)}</span>
                </div>
                <span className="tabular text-lg font-bold">{formatPrice(order.totalCents)}</span>
              </div>

              <div className="grid gap-6 px-5 py-5 lg:grid-cols-[1fr_1fr]">
                <dl className="space-y-2.5 text-sm">
                  <Row label="Client">
                    <span className="font-semibold">
                      {order.firstName} {order.lastName}
                    </span>
                    {order.company && <span className="text-ink-500"> · {order.company}</span>}
                  </Row>
                  <Row label="Téléphone">
                    <span className="tabular">{order.phone}</span>{" "}
                    {waNumber && (
                      <a
                        href={`https://wa.me/${waNumber.length === 10 && waNumber.startsWith("0") ? `225${waNumber.slice(1)}` : waNumber}`}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-2 text-xs font-semibold text-accent-700 underline-offset-4 hover:underline"
                      >
                        Ouvrir WhatsApp
                      </a>
                    )}
                  </Row>
                  <Row label="E-mail">{order.email}</Row>
                  <Row label="Livraison">
                    {shipping} — {order.shippingMethod === "retrait" ? "Retrait boutique" : [order.address1, order.address2, order.commune, order.city].filter(Boolean).join(", ")}
                  </Row>
                  <Row label="Paiement">
                    {paymentMethodLabel(order.paymentMethod)}
                    {order.paymentPhone && <span className="tabular font-semibold"> · payé depuis {order.paymentPhone}</span>}
                  </Row>
                </dl>

                <ul className="divide-y divide-ink-900/8 rounded-xl bg-paper/60 px-4">
                  {orderLines.map((line) => (
                    <li key={line.id} className="flex justify-between gap-4 py-2.5 text-sm">
                      <span>
                        {line.quantity} × {line.name}
                      </span>
                      <span className="tabular shrink-0 font-medium">{formatPrice(line.unitPriceCents * line.quantity)}</span>
                    </li>
                  ))}
                  <li className="flex justify-between py-2.5 text-xs text-ink-500">
                    <span>Livraison</span>
                    <span className="tabular">{order.shippingCents === 0 ? "Offerte" : formatPrice(order.shippingCents)}</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-wrap items-center gap-2 border-t border-ink-900/8 bg-paper/40 px-5 py-4">
                  {actions.map((action) => (
                    <form key={action.to} action={setOrderStatusAction}>
                      <input type="hidden" name="orderNumber" value={order.orderNumber} />
                      <input type="hidden" name="status" value={action.to} />
                      <input type="hidden" name="vue" value={view} />
                      <button
                        type="submit"
                        className={cn(
                          "rounded-full px-4 py-2 text-xs font-semibold transition",
                          action.tone === "primary" ? "bg-ink-950 text-white hover:bg-accent-600" : "border border-red-200 bg-white text-red-700 hover:bg-red-50",
                        )}
                      >
                        {action.label}
                      </button>
                    </form>
                  ))}
                  <Link
                    href={`/admin/livraison/${order.orderNumber}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 rounded-full border border-ink-900/12 bg-white px-4 py-2 text-xs font-semibold text-ink-800 transition hover:border-ink-900"
                  >
                    <Printer className="h-3.5 w-3.5" /> Bon de livraison
                  </Link>
                  {order.validatedAt && (
                    <span className="ml-auto text-xs text-ink-500">Validée le {formatDate(order.validatedAt)}</span>
                  )}
                </div>
            </article>
          );
        })}
      </section>

      {/* Journal */}
      <section className="mt-12">
        <p className="eyebrow">Journal des notifications</p>
        <div className="card mt-4 overflow-x-auto">
          {journal.length === 0 ? (
            <p className="p-6 text-sm text-ink-500">Aucun message envoyé pour le moment.</p>
          ) : (
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-ink-900/8 text-[11px] uppercase tracking-[0.14em] text-ink-400">
                <tr>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Événement</th>
                  <th className="px-5 py-3 font-semibold">Canal</th>
                  <th className="px-5 py-3 font-semibold">Destinataire</th>
                  <th className="px-5 py-3 font-semibold">Résultat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-900/8">
                {journal.map((entry) => (
                  <JournalRow key={entry.id} entry={entry} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[96px_1fr] gap-3">
      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-400 pt-0.5">{label}</dt>
      <dd className="min-w-0 text-ink-800">{children}</dd>
    </div>
  );
}

function ChannelPill({ icon, label, ok, hint }: { icon: React.ReactNode; label: string; ok: boolean; hint: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg", ok ? "bg-emerald-100 text-emerald-700" : "bg-ink-100 text-ink-400")}>
        {icon}
      </span>
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 text-sm font-semibold">
          {label}
          {ok ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <X className="h-3.5 w-3.5 text-ink-400" />}
        </p>
        <p className="mt-0.5 text-[11px] leading-snug text-ink-500">{ok ? "Actif" : hint}</p>
      </div>
    </div>
  );
}

function JournalRow({ entry }: { entry: typeof notifications.$inferSelect }) {
  const events: Record<string, string> = {
    order_created: "Commande reçue",
    order_validated: "Commande validée",
    test: "Test",
  };
  const channels: Record<string, string> = { telegram: "Telegram", email: "E-mail", whatsapp: "WhatsApp" };
  return (
    <tr className="align-top">
      <td className="whitespace-nowrap px-5 py-3 text-xs text-ink-500">
        {entry.createdAt.toISOString().slice(0, 16).replace("T", " ")}
      </td>
      <td className="px-5 py-3">{events[entry.event] ?? entry.event}</td>
      <td className="px-5 py-3">{channels[entry.channel] ?? entry.channel}</td>
      <td className="max-w-[220px] truncate px-5 py-3 text-ink-600">{entry.recipient}</td>
      <td className="px-5 py-3">
        {entry.status === "sent" ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
            <Check className="h-3 w-3" /> Envoyé
          </span>
        ) : (
          <span className="block">
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-semibold text-red-700">
              <X className="h-3 w-3" /> Échec
            </span>
            {entry.error && <span className="mt-1 block max-w-[320px] text-[11px] leading-snug text-red-700/80">{entry.error}</span>}
          </span>
        )}
      </td>
    </tr>
  );
}

function LoginView({ configured, error }: { configured: boolean; error: string | null }) {
  return (
    <div className="container-x flex min-h-[70vh] items-center justify-center py-16">
      <div className="card w-full max-w-sm p-8">
        <p className="eyebrow">Administration</p>
        <h1 className="display mt-2 text-3xl">Connexion</h1>
        <p className="mt-2 text-sm text-ink-500">Accès réservé à l&apos;équipe UORAHAL.</p>
        {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {configured ? (
          <form action={loginAction} className="mt-6 space-y-4">
            <div>
              <label htmlFor="password" className="label">
                Mot de passe
              </label>
              <input id="password" name="password" type="password" required autoComplete="current-password" className="input" />
            </div>
            <button type="submit" className="btn-primary w-full">
              Se connecter
            </button>
          </form>
        ) : (
          <p className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-800">
            Définissez <code>ADMIN_PASSWORD</code> (12 caractères minimum) dans l&apos;environnement pour activer le tableau de bord.
          </p>
        )}
      </div>
    </div>
  );
}
