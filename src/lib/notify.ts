/**
 * Notifications de commande : Telegram (équipe), e-mail via Resend (équipe + client),
 * WhatsApp Cloud API (client, via modèles approuvés).
 *
 * Règles :
 * - Serveur uniquement (secrets). Ne jamais importer depuis un composant client.
 * - Chaque canal est optionnel : il n'est utilisé que si ses variables d'environnement existent.
 * - Un échec de notification ne fait jamais échouer la commande. Il est journalisé en base.
 */
import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { notifications, orderItems, orders, type Order, type OrderItem } from "@/db/schema";
import { formatDate, formatPrice, paymentMethodLabel, SHIPPING_METHODS, STORE } from "@/lib/utils";

type Channel = "telegram" | "email" | "whatsapp";
type EventName = "order_created" | "order_validated" | "test";

type Loaded = { order: Order; items: OrderItem[] };

function env(name: string) {
  return (process.env[name] ?? "").trim();
}

/* ──────────────────────────────────────────────────────────────────────────
 * Configuration (affichée dans l'admin)
 * ────────────────────────────────────────────────────────────────────────── */
export function getNotificationStatus() {
  return {
    telegram: Boolean(env("TELEGRAM_BOT_TOKEN") && env("TELEGRAM_CHAT_ID")),
    email: Boolean(env("RESEND_API_KEY") && env("NOTIFY_FROM_EMAIL")),
    whatsapp: Boolean(env("WHATSAPP_TOKEN") && env("WHATSAPP_PHONE_NUMBER_ID")),
    whatsappTemplates: {
      created: Boolean(env("WHATSAPP_TEMPLATE_ORDER_CREATED")),
      validated: Boolean(env("WHATSAPP_TEMPLATE_ORDER_VALIDATED")),
    },
  };
}

/* ──────────────────────────────────────────────────────────────────────────
 * Utilitaires
 * ────────────────────────────────────────────────────────────────────────── */
const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Les modèles WhatsApp n'acceptent pas les espaces insécables. */
const plain = (value: string) => value.replace(/[\u202f\u00a0]/g, " ");

/** 0701020304 → 2250701020304 (format international sans +). */
export function toWhatsAppNumber(raw: string) {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.length === 10 && digits.startsWith("0")) digits = `225${digits.slice(1)}`;
  else if (digits.length === 8) digits = `225${digits}`;
  return digits.length >= 8 ? digits : null;
}

function deliveryName(order: Order) {
  return SHIPPING_METHODS.find((m) => m.id === order.shippingMethod)?.name ?? order.shippingMethod;
}

function addressText(order: Order) {
  if (order.shippingMethod === "retrait") return `Retrait en boutique — ${STORE.addressLine}`;
  return [order.address1, order.address2, order.commune, order.city, order.country].filter(Boolean).join(", ");
}

function paymentText(order: Order) {
  const base = paymentMethodLabel(order.paymentMethod);
  return order.paymentPhone ? `${base} — ${order.paymentPhone}` : base;
}

function adminUrl() {
  const site = env("SITE_URL").replace(/\/$/, "");
  return site ? `${site}/admin` : "";
}

/* ──────────────────────────────────────────────────────────────────────────
 * Contenus
 * ────────────────────────────────────────────────────────────────────────── */
function telegramOrderText({ order, items }: Loaded) {
  const lines = items.map(
    (i) => `• ${i.quantity} × ${escapeHtml(i.name)} — ${escapeHtml(formatPrice(i.unitPriceCents * i.quantity))}`,
  );
  const link = adminUrl();
  return [
    `🛒 <b>Nouvelle commande ${escapeHtml(order.orderNumber)}</b>`,
    "",
    `👤 ${escapeHtml(order.firstName)} ${escapeHtml(order.lastName)} — <code>${escapeHtml(order.phone)}</code>`,
    `✉️ ${escapeHtml(order.email)}`,
    `🚚 ${escapeHtml(deliveryName(order))}`,
    `📍 ${escapeHtml(addressText(order))}`,
    `💳 ${escapeHtml(paymentText(order))}`,
    "",
    ...lines,
    "",
    `Sous-total : ${escapeHtml(formatPrice(order.subtotalCents))}`,
    `Livraison : ${order.shippingCents === 0 ? "offerte" : escapeHtml(formatPrice(order.shippingCents))}`,
    `<b>Total : ${escapeHtml(formatPrice(order.totalCents))}</b>`,
    ...(link ? ["", `🔗 ${escapeHtml(link)}`] : []),
  ].join("\n");
}

function emailShell(title: string, intro: string, { order, items }: Loaded, footnote: string) {
  const rows = items
    .map(
      (i) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #eceef4;font-size:14px;color:#1c2134">
            ${escapeHtml(i.name)}<br/><span style="font-size:12px;color:#7a839b">${i.quantity} × ${escapeHtml(formatPrice(i.unitPriceCents))}</span>
          </td>
          <td align="right" style="padding:10px 0;border-bottom:1px solid #eceef4;font-size:14px;font-weight:600;color:#1c2134;white-space:nowrap">
            ${escapeHtml(formatPrice(i.unitPriceCents * i.quantity))}
          </td>
        </tr>`,
    )
    .join("");

  return `<!doctype html><html lang="fr"><body style="margin:0;background:#f6f5f1;font-family:Arial,Helvetica,sans-serif;color:#1c2134">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 12px"><tr><td align="center">
    <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:16px;padding:32px">
      <tr><td>
        <p style="margin:0;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#2f55e8;font-weight:700">UORAHAL</p>
        <h1 style="margin:12px 0 8px;font-size:24px;font-weight:600">${escapeHtml(title)}</h1>
        <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#434a5d">${intro}</p>
        <p style="margin:0 0 16px;font-size:13px;color:#7a839b">Commande <strong style="color:#1c2134">${escapeHtml(order.orderNumber)}</strong> · ${escapeHtml(formatDate(order.createdAt))}</p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${rows}</table>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:16px;font-size:14px">
          <tr><td style="padding:4px 0;color:#5a6379">Sous-total</td><td align="right">${escapeHtml(formatPrice(order.subtotalCents))}</td></tr>
          <tr><td style="padding:4px 0;color:#5a6379">Livraison</td><td align="right">${order.shippingCents === 0 ? "Offerte" : escapeHtml(formatPrice(order.shippingCents))}</td></tr>
          <tr><td style="padding:12px 0 0;font-weight:700">Total TTC</td><td align="right" style="padding-top:12px;font-size:18px;font-weight:700">${escapeHtml(formatPrice(order.totalCents))}</td></tr>
        </table>
        <p style="margin:28px 0 0;font-size:13px;line-height:1.6;color:#5a6379">${escapeHtml(footnote)}</p>
        <p style="margin:24px 0 0;font-size:12px;color:#7a839b">${escapeHtml(STORE.addressLine)} · ${escapeHtml(STORE.phoneDisplay)} · ${escapeHtml(STORE.email)}</p>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

function ownerEmailHtml(loaded: Loaded) {
  const { order } = loaded;
  return emailShell(
    `Nouvelle commande de ${order.firstName} ${order.lastName}`,
    `${escapeHtml(deliveryName(order))} — ${escapeHtml(addressText(order))}<br/>Paiement : ${escapeHtml(paymentText(order))}<br/>Téléphone : ${escapeHtml(order.phone)} · ${escapeHtml(order.email)}`,
    loaded,
    adminUrl() ? `Valider la commande : ${adminUrl()}` : "Validez la commande depuis le tableau de bord /admin.",
  );
}

function customerEmailHtml(loaded: Loaded, event: "created" | "validated") {
  const { order } = loaded;
  if (event === "created") {
    return emailShell(
      `Merci ${order.firstName}, votre commande est bien reçue`,
      `Nous vérifions votre commande et vous confirmons la préparation très prochainement. ${
        order.shippingMethod === "retrait" ? "Vous recevrez un message dès qu'elle sera prête au retrait." : "Le livreur vous appellera avant de passer."
      }`,
      loaded,
      `Livraison : ${deliveryName(order)} — ${addressText(order)}. Une question ? WhatsApp ${STORE.phoneDisplay}.`,
    );
  }
  return emailShell(
    `Votre commande ${order.orderNumber} est validée`,
    "Bonne nouvelle : votre paiement est confirmé et votre commande est en cours de préparation.",
    loaded,
    `Livraison : ${deliveryName(order)} — ${addressText(order)}. Une question ? WhatsApp ${STORE.phoneDisplay}.`,
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * Transports
 * ────────────────────────────────────────────────────────────────────────── */
async function sendTelegram(text: string) {
  const res = await fetch(`https://api.telegram.org/bot${env("TELEGRAM_BOT_TOKEN")}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: env("TELEGRAM_CHAT_ID"),
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Telegram ${res.status}: ${(await res.text()).slice(0, 200)}`);
}

async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env("RESEND_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env("NOTIFY_FROM_EMAIL"),
      to: [to],
      reply_to: STORE.email,
      subject,
      html,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 200)}`);
}

async function sendWhatsAppTemplate({ to, template, params }: { to: string; template: string; params: string[] }) {
  const version = env("WHATSAPP_API_VERSION") || "v22.0";
  const res = await fetch(`https://graph.facebook.com/${version}/${env("WHATSAPP_PHONE_NUMBER_ID")}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env("WHATSAPP_TOKEN")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "template",
      template: {
        name: template,
        language: { code: env("WHATSAPP_TEMPLATE_LANG") || "fr" },
        components: [
          {
            type: "body",
            parameters: params.map((text) => ({ type: "text", text: plain(text) })),
          },
        ],
      },
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`WhatsApp ${res.status}: ${(await res.text()).slice(0, 200)}`);
}

/* ──────────────────────────────────────────────────────────────────────────
 * Dispatch + journal
 * ────────────────────────────────────────────────────────────────────────── */
type Job = { channel: Channel; recipient: string; run: () => Promise<void> };
export type NotificationResult = { channel: Channel; recipient: string; status: "sent" | "failed"; error: string | null };

async function dispatch(orderId: number | null, event: EventName, jobs: Job[]): Promise<NotificationResult[]> {
  return Promise.all(
    jobs.map(async (job) => {
      let status: "sent" | "failed" = "sent";
      let error: string | null = null;
      try {
        await job.run();
      } catch (err) {
        status = "failed";
        error = err instanceof Error ? err.message : String(err);
        console.error(`[notify] ${event} via ${job.channel} failed:`, error);
      }
      try {
        await db.insert(notifications).values({
          orderId,
          event,
          channel: job.channel,
          recipient: job.recipient,
          status,
          error: error ? error.slice(0, 500) : null,
        });
      } catch (logError) {
        console.error("[notify] could not write notification log", logError);
      }
      return { channel: job.channel, recipient: job.recipient, status, error };
    }),
  );
}

async function loadOrder(orderId: number): Promise<Loaded | null> {
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId)).orderBy(asc(orderItems.id));
  return { order, items };
}

/* ──────────────────────────────────────────────────────────────────────────
 * Événements publics
 * ────────────────────────────────────────────────────────────────────────── */

/** Appelé juste après la création d'une commande. Ne lève jamais d'exception. */
export async function notifyOrderCreated(orderId: number): Promise<NotificationResult[]> {
  try {
    const loaded = await loadOrder(orderId);
    if (!loaded) return [];
    const { order } = loaded;
    const cfg = getNotificationStatus();
    const jobs: Job[] = [];

    if (cfg.telegram) {
      jobs.push({
        channel: "telegram",
        recipient: `chat ${env("TELEGRAM_CHAT_ID")}`,
        run: () => sendTelegram(telegramOrderText(loaded)),
      });
    }
    if (cfg.email) {
      jobs.push({
        channel: "email",
        recipient: STORE.email,
        run: () =>
          sendEmail({
            to: STORE.email,
            subject: `Nouvelle commande ${order.orderNumber} — ${plain(formatPrice(order.totalCents))}`,
            html: ownerEmailHtml(loaded),
          }),
      });
      jobs.push({
        channel: "email",
        recipient: order.email,
        run: () =>
          sendEmail({
            to: order.email,
            subject: `Commande ${order.orderNumber} bien reçue`,
            html: customerEmailHtml(loaded, "created"),
          }),
      });
    }
    if (cfg.whatsapp && cfg.whatsappTemplates.created) {
      jobs.push({
        channel: "whatsapp",
        recipient: order.phone,
        run: async () => {
          const to = toWhatsAppNumber(order.phone);
          if (!to) throw new Error("Numéro WhatsApp du client invalide");
          await sendWhatsAppTemplate({
            to,
            template: env("WHATSAPP_TEMPLATE_ORDER_CREATED"),
            params: [order.firstName, order.orderNumber, formatPrice(order.totalCents)],
          });
        },
      });
    }

    return await dispatch(orderId, "order_created", jobs);
  } catch (err) {
    console.error("[notify] notifyOrderCreated failed", err);
    return [];
  }
}

/** Appelé quand l'équipe valide la commande. Prévient le client. Ne lève jamais d'exception. */
export async function notifyOrderValidated(orderId: number): Promise<NotificationResult[]> {
  try {
    const loaded = await loadOrder(orderId);
    if (!loaded) return [];
    const { order } = loaded;
    const cfg = getNotificationStatus();
    const jobs: Job[] = [];

    if (cfg.email) {
      jobs.push({
        channel: "email",
        recipient: order.email,
        run: () =>
          sendEmail({
            to: order.email,
            subject: `Commande ${order.orderNumber} validée`,
            html: customerEmailHtml(loaded, "validated"),
          }),
      });
    }
    if (cfg.whatsapp && cfg.whatsappTemplates.validated) {
      jobs.push({
        channel: "whatsapp",
        recipient: order.phone,
        run: async () => {
          const to = toWhatsAppNumber(order.phone);
          if (!to) throw new Error("Numéro WhatsApp du client invalide");
          await sendWhatsAppTemplate({
            to,
            template: env("WHATSAPP_TEMPLATE_ORDER_VALIDATED"),
            params: [order.firstName, order.orderNumber, formatPrice(order.totalCents)],
          });
        },
      });
    }

    return await dispatch(orderId, "order_validated", jobs);
  } catch (err) {
    console.error("[notify] notifyOrderValidated failed", err);
    return [];
  }
}

/** Envoie un message de test à l'équipe (bouton dans l'admin). */
export async function sendTestNotifications(): Promise<NotificationResult[]> {
  const cfg = getNotificationStatus();
  const jobs: Job[] = [];
  const stamp = formatDate(new Date());
  if (cfg.telegram) {
    jobs.push({
      channel: "telegram",
      recipient: `chat ${env("TELEGRAM_CHAT_ID")}`,
      run: () => sendTelegram(`✅ <b>UORAHAL</b> — test de notification réussi (${escapeHtml(stamp)}).`),
    });
  }
  if (cfg.email) {
    jobs.push({
      channel: "email",
      recipient: STORE.email,
      run: () =>
        sendEmail({
          to: STORE.email,
          subject: "Test de notification UORAHAL",
          html: `<p style="font-family:Arial,sans-serif">Les notifications par e-mail fonctionnent (${escapeHtml(stamp)}).</p>`,
        }),
    });
  }
  return dispatch(null, "test", jobs);
}

/** Dernières notifications, pour le tableau de bord. */
export async function recentNotifications(limit = 30) {
  return db.select().from(notifications).orderBy(desc(notifications.createdAt)).limit(limit);
}
