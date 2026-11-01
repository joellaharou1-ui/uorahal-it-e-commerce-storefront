"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import type { CartItem } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

export function PurchasePanel({ product }: { product: Omit<CartItem, "quantity"> }) {
  const [quantity, setQuantity] = useState(1);
  const max = Math.max(1, Math.min(10, product.stock));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="inline-flex items-center rounded-full border border-ink-900/12 bg-white">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className="grid h-12 w-12 place-items-center rounded-full transition hover:bg-ink-900/5 disabled:opacity-30"
            aria-label="Diminuer la quantité"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="tabular w-10 text-center text-sm font-semibold">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(max, q + 1))}
            disabled={quantity >= max}
            className="grid h-12 w-12 place-items-center rounded-full transition hover:bg-ink-900/5 disabled:opacity-30"
            aria-label="Augmenter la quantité"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1">
          <AddToCartButton product={product} quantity={quantity} />
        </div>
      </div>
      {quantity > 1 && (
        <p className="text-xs text-ink-500">
          Total : <span className="tabular font-semibold text-ink-900">{formatPrice(product.priceCents * quantity)}</span>
        </p>
      )}
    </div>
  );
}
