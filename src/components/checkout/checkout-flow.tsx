"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Check,
  CreditCard,
  Landmark,
  Lock,
  MapPin,
  ShoppingBag,
  Smartphone,
  Store,
  Truck,
  Zap,
} from "lucide-react";
import { selectSubtotal, useCartStore } from "@/store/cart";
import {
  ABIDJAN_COMMUNES,
  cn,
  COUNTRIES,
  formatPrice,
  FREE_SHIPPING_THRESHOLD_CENTS,
  MOBILE_MONEY_OPERATORS,
  SHIPPING_METHODS,
  shippingCostFor,
  STORE,
  type MobileMoneyOperatorId,
  type ShippingMethodId,
} from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Coordonnées" },
  { id: 2, label: "Livraison" },
  { id: 3, label: "Paiement" },
];

type PaymentKind = "mobile" | "card" | "cod" | "transfer";

type FormState = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  company: string;
  address1: string;
  address2: string;
  commune: string;
  city: string;
  country: string;
  shippingMethod: ShippingMethodId;
  paymentKind: PaymentKind;
  operator: MobileMoneyOperatorId;
  momoPhone: string;
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
};

const initial: FormState = {
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  company: "",
  address1: "",
  address2: "",
  commune: "Cocody",
  city: "Abidjan",
  country: "Côte d'Ivoire",
  shippingMethod: "abidjan",
  paymentKind: "mobile",
  operator: "orange_money",
  momoPhone: "",
  cardName: "",
  cardNumber: "",
  cardExpiry: "",
  cardCvc: "",
};

const shippingIcons: Record<ShippingMethodId, typeof Truck> = {
  abidjan: Truck,
  express: Zap,
  interieur: MapPin,
  retrait: Store,
};

const paymentKinds: { id: PaymentKind; label: string; sub: string; icon: typeof Truck }[] = [
  { id: "mobile", label: "Mobile Money", sub: "Orange, MTN, Wave, Moov", icon: Smartphone },
  { id: "cod", label: "À la livraison", sub: "Espèces ou Mobile Money", icon: Banknote },
  { id: "transfer", label: "Virement", sub: "Entreprises & administrations", icon: Landmark },
];

const formatIvorianPhone = (value: string) =>
  value
    .replace(/\D/g, "")
    .slice(0, 10)
    .replace(/(\d{2})(?=\d)/g, "$1 ");

export function CheckoutFlow() {
  const router = useRouter();
  const { items, hydrated, clear } = useCartStore();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void useCartStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const subtotal = selectSubtotal(items);
  const shipping = shippingCostFor(form.shippingMethod, subtotal);
  const total = subtotal + shipping;
  const vat = Math.round(total - total / (1 + STORE.vatRate));
  const isAbidjan = form.country === "Côte d'Ivoire" && form.city.trim().toLowerCase() === "abidjan";

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const paymentMethod = form.paymentKind === "mobile" ? form.operator : form.paymentKind;

  const paymentValid = useMemo(() => {
    if (form.paymentKind === "mobile") return form.momoPhone.replace(/\D/g, "").length === 10;
    if (form.paymentKind === "card") {
      return (
        form.cardNumber.replace(/\s/g, "").length >= 15 &&
        /^\d{2}\/\d{2}$/.test(form.cardExpiry) &&
        form.cardCvc.length >= 3 &&
        form.cardName.length >= 2
      );
    }
    return true;
  }, [form]);

  const onSubmitStep = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    void placeOrder();
  };

  const placeOrder = async () => {
    if (!paymentValid) {
      setError(
        form.paymentKind === "mobile"
          ? "Merci d'indiquer le numéro Mobile Money à 10 chiffres qui sera débité."
          : "Merci de vérifier les informations de votre carte.",
      );
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            email: form.email,
            firstName: form.firstName,
            lastName: form.lastName,
            phone: form.phone,
            company: form.company,
          },
          address: {
            address1: form.address1,
            address2: form.address2,
            commune: isAbidjan ? form.commune : "",
            city: form.city,
            country: form.country,
          },
          shippingMethod: form.shippingMethod,
          paymentMethod,
          paymentPhone: form.paymentKind === "mobile" ? form.momoPhone : "",
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const data = (await res.json().catch(() => null)) as { orderNumber?: string; error?: string } | null;
      if (!res.ok || !data?.orderNumber) {
        throw new Error(data?.error ?? "Impossible de finaliser la commande.");
      }
      clear();
      router.push(`/commande/confirmation/${data.orderNumber}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
      setSubmitting(false);
    }
  };

  if (!hydrated) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        <div className="space-y-4">
          <div className="skeleton h-10 w-2/3 rounded-xl" />
          <div className="skeleton h-64 rounded-2xl" />
        </div>
        <div className="skeleton h-80 rounded-2xl" />
      </div>
    );
  }

  if (items.length === 0 && !submitting) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-white shadow-soft">
          <ShoppingBag className="h-8 w-8 text-ink-300" />
        </div>
        <h2 className="display mt-6 text-3xl">Votre panier est vide</h2>
        <p className="mt-3 text-sm text-ink-500">Ajoutez des produits pour passer commande.</p>
        <Link href="/boutique" className="btn-primary mt-7">
          Découvrir la boutique
        </Link>
      </div>
    );
  }

  const selectedOperator = MOBILE_MONEY_OPERATORS.find((o) => o.id === form.operator) ?? MOBILE_MONEY_OPERATORS[0];

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:gap-14">
      <div>
        {/* Stepper */}
        <ol className="flex items-center gap-2 sm:gap-4">
          {STEPS.map((s, i) => {
            const done = step > s.id;
            const active = step === s.id;
            return (
              <li key={s.id} className="flex flex-1 items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  disabled={!done}
                  onClick={() => setStep(s.id)}
                  className={cn("flex items-center gap-2.5 text-left", done ? "cursor-pointer" : "cursor-default")}
                >
                  <span
                    className={cn(
                      "grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold transition-all",
                      done ? "bg-accent-600 text-white" : active ? "bg-ink-950 text-white ring-4 ring-ink-950/10" : "bg-ink-100 text-ink-500",
                    )}
                  >
                    {done ? <Check className="h-4 w-4" strokeWidth={3} /> : s.id}
                  </span>
                  <span className={cn("hidden text-sm font-semibold sm:block", active ? "text-ink-950" : "text-ink-500")}>{s.label}</span>
                </button>
                {i < STEPS.length - 1 && <span className={cn("h-px flex-1 transition-colors", done ? "bg-accent-600" : "bg-ink-200")} />}
              </li>
            );
          })}
        </ol>

        <form onSubmit={onSubmitStep} className="mt-10">
          {step === 1 && (
            <section className="animate-fade-up space-y-6">
              <div>
                <h2 className="display text-3xl">Vos coordonnées</h2>
                <p className="mt-1.5 text-sm text-ink-500">Nous les utilisons uniquement pour le suivi de votre commande.</p>
              </div>
              <div className="card space-y-5 p-6 sm:p-8">
                <Field label="Adresse e-mail" htmlFor="email">
                  <input id="email" type="email" required autoComplete="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="input" placeholder="vous@exemple.ci" />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Prénom" htmlFor="firstName">
                    <input id="firstName" required autoComplete="given-name" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} className="input" />
                  </Field>
                  <Field label="Nom" htmlFor="lastName">
                    <input id="lastName" required autoComplete="family-name" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} className="input" />
                  </Field>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Téléphone / WhatsApp" htmlFor="phone" hint="Le livreur vous appelle">
                    <input
                      id="phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      inputMode="numeric"
                      value={form.phone}
                      onChange={(e) => update("phone", formatIvorianPhone(e.target.value))}
                      className="input tabular"
                      placeholder="07 00 00 00 00"
                    />
                  </Field>
                  <Field label="Société (optionnel)" htmlFor="company" hint="Facture au nom de l'entreprise">
                    <input id="company" autoComplete="organization" value={form.company} onChange={(e) => update("company", e.target.value)} className="input" />
                  </Field>
                </div>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="animate-fade-up space-y-6">
              <div>
                <h2 className="display text-3xl">Livraison</h2>
                <p className="mt-1.5 text-sm text-ink-500">Où souhaitez-vous recevoir votre commande ?</p>
              </div>
              <div className="card space-y-5 p-6 sm:p-8">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Pays" htmlFor="country">
                    <select id="country" value={form.country} onChange={(e) => update("country", e.target.value)} className="input">
                      {COUNTRIES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Ville" htmlFor="city">
                    <input id="city" required autoComplete="address-level2" value={form.city} onChange={(e) => update("city", e.target.value)} className="input" placeholder="Abidjan" />
                  </Field>
                </div>
                {isAbidjan && (
                  <Field label="Commune" htmlFor="commune">
                    <select id="commune" value={form.commune} onChange={(e) => update("commune", e.target.value)} className="input">
                      {ABIDJAN_COMMUNES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </Field>
                )}
                <Field label="Quartier, rue et repère" htmlFor="address1" hint="Ex. Riviera 2, rue des Jardins, face à la pharmacie">
                  <input id="address1" required autoComplete="address-line1" value={form.address1} onChange={(e) => update("address1", e.target.value)} className="input" placeholder="Quartier, rue, immeuble ou point de repère" />
                </Field>
                <Field label="Complément (optionnel)" htmlFor="address2">
                  <input id="address2" autoComplete="address-line2" value={form.address2} onChange={(e) => update("address2", e.target.value)} className="input" placeholder="Étage, porte, consignes pour le livreur…" />
                </Field>
              </div>

              <div>
                <h3 className="text-sm font-semibold">Mode de livraison</h3>
                <div className="mt-3 grid gap-3">
                  {SHIPPING_METHODS.map((m) => {
                    const Icon = shippingIcons[m.id];
                    const price = shippingCostFor(m.id, subtotal);
                    const active = form.shippingMethod === m.id;
                    return (
                      <label
                        key={m.id}
                        className={cn(
                          "flex cursor-pointer items-center gap-4 rounded-2xl border bg-white p-4 transition-all",
                          active ? "border-ink-950 shadow-soft ring-1 ring-ink-950" : "border-ink-900/10 hover:border-ink-900/40",
                        )}
                      >
                        <input type="radio" name="shipping" className="sr-only" checked={active} onChange={() => update("shippingMethod", m.id)} />
                        <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl", active ? "bg-ink-950 text-white" : "bg-paper text-ink-600")}>
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="flex-1">
                          <span className="block text-sm font-semibold">{m.name}</span>
                          <span className="block text-xs text-ink-500">{m.description}</span>
                        </span>
                        <span className="tabular shrink-0 text-sm font-bold">{price === 0 ? "Offerte" : formatPrice(price)}</span>
                      </label>
                    );
                  })}
                </div>
                {subtotal < FREE_SHIPPING_THRESHOLD_CENTS && (
                  <p className="mt-3 text-xs text-ink-500">
                    Ajoutez {formatPrice(FREE_SHIPPING_THRESHOLD_CENTS - subtotal)} d&apos;articles pour bénéficier de la livraison Abidjan offerte.
                  </p>
                )}
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="animate-fade-up space-y-6">
              <div>
                <h2 className="display text-3xl">Paiement</h2>
                <p className="mt-1.5 text-sm text-ink-500">Choisissez votre mode de règlement. Aucun numéro de carte n&apos;est demandé ni conservé.</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {paymentKinds.map((pm) => {
                  const active = form.paymentKind === pm.id;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => update("paymentKind", pm.id)}
                      className={cn(
                        "flex flex-col items-start rounded-2xl border bg-white p-4 text-left transition-all",
                        active ? "border-ink-950 shadow-soft ring-1 ring-ink-950" : "border-ink-900/10 hover:border-ink-900/40",
                      )}
                    >
                      <pm.icon className={cn("h-5 w-5", active ? "text-accent-600" : "text-ink-500")} />
                      <span className="mt-3 text-sm font-semibold">{pm.label}</span>
                      <span className="text-xs text-ink-500">{pm.sub}</span>
                    </button>
                  );
                })}
              </div>

              {form.paymentKind === "mobile" && (
                <div className="card space-y-5 p-6 sm:p-8">
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    <Smartphone className="h-4 w-4 text-accent-600" /> Choisissez votre opérateur
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {MOBILE_MONEY_OPERATORS.map((op) => {
                      const active = form.operator === op.id;
                      return (
                        <button
                          key={op.id}
                          type="button"
                          onClick={() => update("operator", op.id)}
                          className={cn(
                            "flex items-center gap-2.5 rounded-xl border px-3 py-3 text-left text-sm font-semibold transition-all",
                            active ? "border-ink-950 bg-ink-950 text-white" : "border-ink-900/10 bg-white hover:border-ink-900/40",
                          )}
                        >
                          <span className="h-3 w-3 shrink-0 rounded-full ring-2 ring-white/60" style={{ backgroundColor: op.color }} />
                          {op.label}
                        </button>
                      );
                    })}
                  </div>
                  <Field label={`Numéro ${selectedOperator.label} à débiter`} htmlFor="momoPhone" hint="10 chiffres">
                    <input
                      id="momoPhone"
                      type="tel"
                      required
                      inputMode="numeric"
                      value={form.momoPhone}
                      onChange={(e) => update("momoPhone", formatIvorianPhone(e.target.value))}
                      className="input tabular"
                      placeholder="07 00 00 00 00"
                    />
                  </Field>
                  {form.phone && form.momoPhone !== form.phone && (
                    <button type="button" onClick={() => update("momoPhone", form.phone)} className="text-xs font-semibold text-accent-700 underline-offset-4 hover:underline">
                      Utiliser mon numéro {form.phone}
                    </button>
                  )}
                  <p className="rounded-xl bg-paper px-4 py-3 text-xs text-ink-500">
                    Vous recevrez une demande de validation {selectedOperator.label} sur votre téléphone pour {formatPrice(total)}. Boutique de démonstration :
                    aucun débit réel.
                  </p>
                </div>
              )}

              {form.paymentKind === "card" && (
                <div className="card space-y-5 p-6 sm:p-8">
                  <div className="flex items-center justify-between">
                    <p className="flex items-center gap-2 text-sm font-semibold">
                      <Lock className="h-4 w-4 text-accent-600" /> Informations de carte
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          cardName: `${f.firstName} ${f.lastName}`.trim() || "Client Démo",
                          cardNumber: "4242 4242 4242 4242",
                          cardExpiry: "12/28",
                          cardCvc: "123",
                        }))
                      }
                      className="text-xs font-semibold text-accent-700 underline-offset-4 hover:underline"
                    >
                      Utiliser une carte de test
                    </button>
                  </div>
                  <Field label="Nom sur la carte" htmlFor="cardName">
                    <input id="cardName" required autoComplete="cc-name" value={form.cardName} onChange={(e) => update("cardName", e.target.value)} className="input" />
                  </Field>
                  <Field label="Numéro de carte" htmlFor="cardNumber">
                    <input
                      id="cardNumber"
                      required
                      inputMode="numeric"
                      autoComplete="cc-number"
                      value={form.cardNumber}
                      onChange={(e) => update("cardNumber", e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 "))}
                      className="input tabular"
                      placeholder="1234 5678 9012 3456"
                    />
                  </Field>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Expiration" htmlFor="cardExpiry">
                      <input
                        id="cardExpiry"
                        required
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        value={form.cardExpiry}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
                          update("cardExpiry", digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits);
                        }}
                        className="input tabular"
                        placeholder="MM/AA"
                      />
                    </Field>
                    <Field label="Cryptogramme" htmlFor="cardCvc">
                      <input id="cardCvc" required inputMode="numeric" autoComplete="cc-csc" value={form.cardCvc} onChange={(e) => update("cardCvc", e.target.value.replace(/\D/g, "").slice(0, 4))} className="input tabular" placeholder="123" />
                    </Field>
                  </div>
                  <p className="rounded-xl bg-paper px-4 py-3 text-xs text-ink-500">Boutique de démonstration : aucune carte n&apos;est réellement débitée.</p>
                </div>
              )}

              {form.paymentKind === "cod" && (
                <div className="card p-6 text-sm text-ink-700 sm:p-8">
                  <p className="font-semibold text-ink-900">Paiement à la livraison</p>
                  <p className="mt-2">
                    Réglez <span className="tabular font-semibold text-ink-900">{formatPrice(total)}</span> au livreur, en espèces ou par Mobile Money, après
                    vérification du colis. Un acompte peut être demandé par WhatsApp pour les commandes supérieures à 500 000 FCFA.
                  </p>
                </div>
              )}

              {form.paymentKind === "transfer" && (
                <div className="card p-6 text-sm text-ink-700 sm:p-8">
                  <p className="font-semibold text-ink-900">Paiement par virement bancaire</p>
                  <p className="mt-2">
                    Nos coordonnées bancaires vous seront envoyées par e-mail avec la facture pro forma en FCFA. La commande est préparée dès réception du
                    virement (généralement sous 48 h). Bon de commande et facture normalisée pour les entreprises et administrations.
                  </p>
                </div>
              )}

              <div className="card p-6 sm:p-8">
                <h3 className="text-sm font-semibold">Récapitulatif</h3>
                <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-xs text-ink-500">Contact</dt>
                    <dd className="font-medium">
                      {form.firstName} {form.lastName}
                    </dd>
                    <dd className="text-ink-600">{form.email}</dd>
                    <dd className="tabular text-ink-600">{form.phone}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-500">Livraison</dt>
                    <dd className="font-medium">{SHIPPING_METHODS.find((m) => m.id === form.shippingMethod)?.name}</dd>
                    <dd className="text-ink-600">
                      {form.address1}
                      {form.address2 ? `, ${form.address2}` : ""}
                    </dd>
                    <dd className="text-ink-600">
                      {isAbidjan ? `${form.commune}, ` : ""}
                      {form.city}, {form.country}
                    </dd>
                  </div>
                </dl>
                <button type="button" onClick={() => setStep(1)} className="mt-3 text-xs font-semibold text-accent-700 underline-offset-4 hover:underline">
                  Modifier
                </button>
              </div>
            </section>
          )}

          {error && <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            {step > 1 ? (
              <button type="button" onClick={() => setStep(step - 1)} className="btn-ghost">
                <ArrowLeft className="h-4 w-4" /> Retour
              </button>
            ) : (
              <Link href="/boutique" className="btn-ghost">
                <ArrowLeft className="h-4 w-4" /> Continuer mes achats
              </Link>
            )}
            <button type="submit" disabled={submitting} className="btn-primary px-8 py-4 text-base">
              {step < 3 ? (
                <>
                  Continuer <ArrowRight className="h-4 w-4" />
                </>
              ) : submitting ? (
                "Traitement en cours…"
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  {form.paymentKind === "cod" || form.paymentKind === "transfer" ? "Confirmer la commande" : `Payer ${formatPrice(total)}`}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Summary */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="card overflow-hidden">
          <div className="border-b border-ink-900/8 px-6 py-4">
            <h2 className="font-display text-xl">Votre commande</h2>
          </div>
          <ul className="max-h-[380px] divide-y divide-ink-900/8 overflow-y-auto px-6">
            {items.map((item) => (
              <li key={item.productId} className="flex gap-4 py-4">
                <span className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-paper">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt="" className="h-full w-full object-cover" />
                  <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-ink-950 px-1 text-[10px] font-bold text-white">
                    {item.quantity}
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-400">{item.brand}</span>
                  <span className="line-clamp-2 text-sm font-medium leading-snug">{item.name}</span>
                </span>
                <span className="tabular text-sm font-semibold">{formatPrice(item.priceCents * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="space-y-2 border-t border-ink-900/8 px-6 py-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-600">Sous-total</dt>
              <dd className="tabular font-medium">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-600">Livraison</dt>
              <dd className="tabular font-medium">{shipping === 0 ? <span className="text-accent-700">Offerte</span> : formatPrice(shipping)}</dd>
            </div>
            <div className="flex justify-between text-xs text-ink-500">
              <dt>dont TVA (18 %)</dt>
              <dd className="tabular">{formatPrice(vat)}</dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-ink-900/8 pt-3">
              <dt className="font-semibold">Total</dt>
              <dd className="tabular text-2xl font-bold">{formatPrice(total)}</dd>
            </div>
          </dl>
          <div className="flex items-center justify-center gap-2 border-t border-ink-900/8 bg-paper/70 px-6 py-3 text-[11px] text-ink-500">
            <Lock className="h-3.5 w-3.5 text-accent-600" /> Paiement sécurisé · Retours 30 jours · Garantie incluse
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-ink-500">
          Une question ? WhatsApp{" "}
          <a href={STORE.whatsappHref} target="_blank" rel="noreferrer" className="tabular font-semibold text-ink-800 underline-offset-4 hover:underline">
            {STORE.phoneDisplay}
          </a>
        </p>
      </aside>
    </div>
  );
}

function Field({ label, htmlFor, hint, children }: { label: string; htmlFor: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="label flex items-baseline justify-between gap-3">
        {label}
        {hint && <span className="truncate font-normal text-ink-400">{hint}</span>}
      </label>
      {children}
    </div>
  );
}
