"use client";

import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { useCartStore, type CartItem } from "@/store/cart";
import { cn } from "@/lib/utils";

type Props = {
  product: Omit<CartItem, "quantity">;
  quantity?: number;
  className?: string;
  size?: "sm" | "lg";
  label?: string;
  iconOnly?: boolean;
};

export function AddToCartButton({ product, quantity = 1, className, size = "lg", label, iconOnly }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const outOfStock = product.stock <= 0;

  const onClick = () => {
    if (outOfStock) return;
    addItem(product, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  if (iconOnly) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={outOfStock}
        className={cn(
          "grid h-10 w-10 place-items-center rounded-full bg-ink-950 text-white shadow-lift transition-all duration-300 hover:bg-accent-600 disabled:opacity-40",
          added && "bg-accent-600",
          className,
        )}
        aria-label={`Ajouter ${product.name} au panier`}
      >
        {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={outOfStock}
      className={cn(
        "btn-primary relative overflow-hidden",
        size === "lg" ? "w-full py-4 text-base" : "px-4 py-2.5 text-xs",
        added && "bg-accent-600",
        className,
      )}
    >
      <span className={cn("flex items-center gap-2 transition-all duration-300", added && "-translate-y-8 opacity-0")}>
        <ShoppingBag className={size === "lg" ? "h-5 w-5" : "h-4 w-4"} />
        {outOfStock ? "Rupture de stock" : (label ?? "Ajouter au panier")}
      </span>
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center gap-2 transition-all duration-300",
          added ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
        )}
      >
        <Check className="h-5 w-5" /> Ajouté !
      </span>
    </button>
  );
}
