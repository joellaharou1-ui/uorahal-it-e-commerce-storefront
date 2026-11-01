import type { Metadata } from "next";
import { CheckoutFlow } from "@/components/checkout/checkout-flow";

export const metadata: Metadata = {
  title: "Commande",
  description: "Finalisez votre commande UORAHAL en quelques étapes.",
};

export default function CheckoutPage() {
  return (
    <div className="container-x pb-10 pt-10 sm:pt-14">
      <header className="mb-10">
        <p className="eyebrow">Commande</p>
        <h1 className="display mt-3 text-4xl sm:text-5xl">Finaliser ma commande</h1>
      </header>
      <CheckoutFlow />
    </div>
  );
}
