"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartItem = {
  productId: number;
  slug: string;
  name: string;
  brand: string;
  priceCents: number;
  compareAtCents: number | null;
  image: string;
  stock: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  hydrated: boolean;
  lastAdded: number | null;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setHydrated: (value: boolean) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      hydrated: false,
      lastAdded: null,
      addItem: (item, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          const max = Math.max(1, item.stock);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, ...item, quantity: Math.min(max, i.quantity + quantity) }
                  : i,
              ),
              isOpen: true,
              lastAdded: item.productId,
            };
          }
          return {
            items: [...state.items, { ...item, quantity: Math.min(max, quantity) }],
            isOpen: true,
            lastAdded: item.productId,
          };
        }),
      removeItem: (productId) => set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.productId === productId ? { ...i, quantity: Math.min(Math.max(1, i.stock), Math.max(0, quantity)) } : i,
            )
            .filter((i) => i.quantity > 0),
        })),
      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false, lastAdded: null }),
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
      setHydrated: (value) => set({ hydrated: value }),
    }),
    {
      name: "uorahal-cart-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

export function selectSubtotal(items: CartItem[]) {
  return items.reduce((acc, item) => acc + item.priceCents * item.quantity, 0);
}

export function selectCount(items: CartItem[]) {
  return items.reduce((acc, item) => acc + item.quantity, 0);
}
