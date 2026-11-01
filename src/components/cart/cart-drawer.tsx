"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowRight, Minus, Plus, ShieldCheck, ShoppingBag, Trash2, Truck, X } from "lucide-react";
import { selectCount, selectSubtotal, useCartStore } from "@/store/cart";
import { cn, formatPrice, FREE_SHIPPING_THRESHOLD_CENTS } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, close, updateQuantity, removeItem, lastAdded } = useCartStore();

  useEffect(() => {
    void useCartStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, close]);

  const subtotal = selectSubtotal(items);
  const count = selectCount(items);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD_CENTS - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD_CENTS) * 100);

  return (
    <div className={cn("fixed inset-0 z-[70] print:hidden", isOpen ? "pointer-events-auto" : "pointer-events-none")} aria-hidden={!isOpen}>
      <div
        className={cn(
          "absolute inset-0 bg-ink-950/50 backdrop-blur-[2px] transition-opacity duration-400",
          isOpen ? "opacity-100" : "opacity-0",
        )}
        onClick={close}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Panier"
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-[460px] flex-col bg-paper shadow-lift transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <header className="flex items-center justify-between border-b border-ink-900/8 px-6 py-5">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-5 w-5" />
            <h2 className="font-display text-2xl">Votre panier</h2>
            {count > 0 && (
              <span className="rounded-full bg-ink-950 px-2 py-0.5 text-[11px] font-bold text-white">{count}</span>
            )}
          </div>
          <button type="button" onClick={close} className="rounded-full p-2 transition hover:bg-ink-900/5" aria-label="Fermer le panier">
            <X className="h-5 w-5" />
          </button>
        </header>

        {items.length > 0 && (
          <div className="border-b border-ink-900/8 bg-white px-6 py-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-ink-700">
              <Truck className="h-4 w-4 text-accent-600" />
              {remaining > 0 ? (
                <span>
                  Plus que <strong className="text-ink-950">{formatPrice(remaining)}</strong> pour la livraison offerte
                </span>
              ) : (
                <span className="text-accent-700">Livraison standard offerte 🎉</span>
              )}
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-ink-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent-500 to-accent-700 transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-5 grid h-20 w-20 place-items-center rounded-full bg-white shadow-soft">
                <ShoppingBag className="h-8 w-8 text-ink-300" />
              </div>
              <p className="font-display text-2xl">Votre panier est vide</p>
              <p className="mt-2 max-w-[260px] text-sm text-ink-500">
                Découvrez nos sélections : ordinateurs, écrans, périphériques et plus encore.
              </p>
              <button type="button" onClick={close} className="btn-primary mt-6">
                Explorer la boutique
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-ink-900/8">
              {items.map((item) => (
                <li
                  key={item.productId}
                  className={cn(
                    "flex gap-4 py-5 transition-colors duration-700",
                    lastAdded === item.productId && "animate-fade-in",
                  )}
                >
                  <Link
                    href={`/produit/${item.slug}`}
                    onClick={close}
                    className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-white"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-400">{item.brand}</p>
                        <Link href={`/produit/${item.slug}`} onClick={close} className="line-clamp-2 text-sm font-semibold leading-snug hover:underline">
                          {item.name}
                        </Link>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="rounded-full p-1.5 text-ink-400 transition hover:bg-ink-900/5 hover:text-red-600"
                        aria-label={`Retirer ${item.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="inline-flex items-center rounded-full border border-ink-900/12 bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-ink-900/5"
                          aria-label="Diminuer la quantité"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="tabular w-7 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-ink-900/5 disabled:opacity-30"
                          aria-label="Augmenter la quantité"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="tabular text-sm font-bold">{formatPrice(item.priceCents * item.quantity)}</p>
                        {item.quantity > 1 && (
                          <p className="tabular text-[11px] text-ink-400">{formatPrice(item.priceCents)} / unité</p>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer className="border-t border-ink-900/8 bg-white px-6 py-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-600">Sous-total</span>
              <span className="tabular text-lg font-bold">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-1 text-xs text-ink-500">Taxes incluses. Livraison calculée à l&apos;étape suivante.</p>
            <Link href="/commande" onClick={close} className="btn-primary mt-4 w-full py-4 text-base">
              Passer la commande <ArrowRight className="h-4 w-4" />
            </Link>
            <button type="button" onClick={close} className="btn-ghost mt-2 w-full text-xs">
              Continuer mes achats
            </button>
            <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-ink-500">
              <ShieldCheck className="h-3.5 w-3.5 text-accent-600" /> Paiement sécurisé · Retours 30 jours
            </div>
          </footer>
        )}
      </aside>
    </div>
  );
}
