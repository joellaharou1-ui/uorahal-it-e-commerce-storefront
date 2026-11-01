/** Cycle de vie des commandes. Client-safe : aucune dépendance serveur. */
export const ORDER_STATUSES = {
  confirmed: { label: "Reçue", tone: "amber" },
  pending_payment: { label: "Virement en attente", tone: "amber" },
  pay_on_delivery: { label: "Paiement à la livraison", tone: "violet" },
  validated: { label: "Validée", tone: "blue" },
  shipped: { label: "Expédiée", tone: "violet" },
  delivered: { label: "Livrée", tone: "green" },
  cancelled: { label: "Annulée", tone: "red" },
} as const;

export type OrderStatus = keyof typeof ORDER_STATUSES;

/** Transitions autorisées depuis chaque statut (vérifiées côté serveur). */
export const NEXT_ACTIONS: Record<OrderStatus, { to: OrderStatus; label: string; tone: "primary" | "danger" }[]> = {
  confirmed: [
    { to: "validated", label: "Valider la commande", tone: "primary" },
    { to: "cancelled", label: "Annuler", tone: "danger" },
  ],
  pending_payment: [
    { to: "validated", label: "Virement reçu · valider", tone: "primary" },
    { to: "cancelled", label: "Annuler", tone: "danger" },
  ],
  pay_on_delivery: [
    { to: "validated", label: "Valider la commande", tone: "primary" },
    { to: "cancelled", label: "Annuler", tone: "danger" },
  ],
  validated: [
    { to: "shipped", label: "Marquer expédiée", tone: "primary" },
    { to: "cancelled", label: "Annuler", tone: "danger" },
  ],
  shipped: [{ to: "delivered", label: "Marquer livrée", tone: "primary" }],
  delivered: [],
  cancelled: [],
};

export const TONE_CLASSES: Record<string, string> = {
  amber: "bg-amber-100 text-amber-800",
  blue: "bg-accent-50 text-accent-800",
  green: "bg-emerald-100 text-emerald-800",
  violet: "bg-violet-100 text-violet-800",
  red: "bg-red-100 text-red-700",
};

export function statusLabel(status: string) {
  return (ORDER_STATUSES as Record<string, { label: string }>)[status]?.label ?? status;
}

export function statusToneClass(status: string) {
  const tone = (ORDER_STATUSES as Record<string, { tone: string }>)[status]?.tone ?? "amber";
  return TONE_CLASSES[tone];
}
