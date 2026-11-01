export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/* ──────────────────────────────────────────────────────────────────────────
 * Coordonnées UORAHAL — source unique pour tout le site
 * ────────────────────────────────────────────────────────────────────────── */
export const STORE = {
  name: "UORAHAL",
  email: "uorahal@proton.me",
  phoneDisplay: "05 86 71 47 32",
  phoneIntl: "+2250586714732",
  phoneHref: "tel:+2250586714732",
  whatsappHref: "https://wa.me/2250586714732",
  city: "Abidjan",
  country: "Côte d'Ivoire",
  addressLine: "Abidjan, Côte d'Ivoire",
  hours: "Lun–Sam · 9h–19h",
  tiktokHandle: "@uorahal",
  tiktokHref: "https://www.tiktok.com/@uorahal",
  vatRate: 0.18,
} as const;

/* ──────────────────────────────────────────────────────────────────────────
 * Devise : franc CFA (XOF). Le XOF n'a pas de sous-unité : tous les montants
 * sont stockés et manipulés en francs entiers.
 * 849000 -> "849 000 FCFA"
 * ────────────────────────────────────────────────────────────────────────── */
export const CURRENCY_CODE = "XOF";
export const CURRENCY_LABEL = "FCFA";

export function formatPrice(amount: number) {
  const sign = amount < 0 ? "-" : "";
  const abs = Math.abs(Math.round(amount));
  const grouped = abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f");
  return `${sign}${grouped}\u00a0${CURRENCY_LABEL}`;
}

export function formatDate(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  const months = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];
  // UTC getters keep server and client output identical regardless of time zone.
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function discountPercent(price: number, compareAt?: number | null) {
  if (!compareAt || compareAt <= price) return null;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

/* ──────────────────────────────────────────────────────────────────────────
 * Livraison
 * ────────────────────────────────────────────────────────────────────────── */
export const FREE_SHIPPING_THRESHOLD_CENTS = 50_000; // FCFA

export const SHIPPING_METHODS = [
  {
    id: "abidjan",
    name: "Livraison Abidjan",
    description: "24 à 48 h — toutes communes (Cocody, Plateau, Marcory, Yopougon…)",
    priceCents: 2_000,
    freeAbove: FREE_SHIPPING_THRESHOLD_CENTS,
    etaDays: 2,
  },
  {
    id: "express",
    name: "Express Abidjan",
    description: "Le jour même avant 18 h pour toute commande passée avant 12 h",
    priceCents: 5_000,
    freeAbove: null,
    etaDays: 0,
  },
  {
    id: "interieur",
    name: "Intérieur du pays",
    description: "3 à 5 jours — Bouaké, Yamoussoukro, San-Pédro, Korhogo, Daloa…",
    priceCents: 7_500,
    freeAbove: null,
    etaDays: 4,
  },
  {
    id: "retrait",
    name: "Retrait en boutique",
    description: "Prêt en 2 h — UORAHAL Abidjan, sur rendez-vous WhatsApp",
    priceCents: 0,
    freeAbove: null,
    etaDays: 0,
  },
] as const;

export type ShippingMethodId = (typeof SHIPPING_METHODS)[number]["id"];

export function shippingCostFor(methodId: string, subtotal: number) {
  const method = SHIPPING_METHODS.find((m) => m.id === methodId) ?? SHIPPING_METHODS[0];
  if (method.freeAbove !== null && subtotal >= method.freeAbove) return 0;
  return method.priceCents;
}

/* ──────────────────────────────────────────────────────────────────────────
 * Paiement
 * ────────────────────────────────────────────────────────────────────────── */
export const MOBILE_MONEY_OPERATORS = [
  { id: "orange_money", label: "Orange Money", color: "#ff7900" },
  { id: "mtn_momo", label: "MTN MoMo", color: "#ffcc00" },
  { id: "wave", label: "Wave", color: "#1dc3f2" },
  { id: "moov_money", label: "Moov Money", color: "#0a5fd3" },
] as const;

export type MobileMoneyOperatorId = (typeof MOBILE_MONEY_OPERATORS)[number]["id"];

export const PAYMENT_METHODS = [
  ...MOBILE_MONEY_OPERATORS.map((o) => ({ id: o.id, label: o.label, kind: "mobile" as const })),
  { id: "card", label: "Carte bancaire", kind: "card" as const },
  { id: "cod", label: "Paiement à la livraison", kind: "cod" as const },
  { id: "transfer", label: "Virement bancaire", kind: "transfer" as const },
] as const;

export type PaymentMethodId = (typeof PAYMENT_METHODS)[number]["id"];

export function paymentMethodLabel(id: string) {
  return PAYMENT_METHODS.find((m) => m.id === id)?.label ?? id;
}

export const ABIDJAN_COMMUNES = [
  "Abobo",
  "Adjamé",
  "Attécoubé",
  "Cocody",
  "Koumassi",
  "Marcory",
  "Plateau",
  "Port-Bouët",
  "Treichville",
  "Yopougon",
  "Bingerville",
  "Songon",
  "Anyama",
] as const;

export const COUNTRIES = ["Côte d'Ivoire", "Burkina Faso", "Mali", "Sénégal", "Togo", "Bénin", "Niger", "Guinée", "Ghana"] as const;

export function generateOrderNumber() {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = (now.getMonth() + 1).toString().padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `UO-${y}${m}-${rand}`;
}
