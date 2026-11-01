import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Manrope } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { getCategories } from "@/lib/products";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "UORAHAL — Informatique pour tous : ordinateurs, écrans, périphériques",
    template: "%s · UORAHAL",
  },
  description:
    "UORAHAL, spécialiste informatique à Abidjan (Côte d'Ivoire) pour particuliers, étudiants, créateurs, gamers et entreprises. Ordinateurs portables, PC assemblés, écrans, périphériques et accessoires. Prix en FCFA, paiement Mobile Money, livraison partout en Côte d'Ivoire.",
  keywords: ["informatique Abidjan", "ordinateur portable Côte d'Ivoire", "PC gamer Abidjan", "écran", "clavier mécanique", "UORAHAL", "FCFA"],
  openGraph: {
    title: "UORAHAL — Informatique pour tous, Abidjan",
    description: "Matériel informatique sélectionné, assemblé et testé dans notre atelier d'Abidjan. Prix en FCFA, paiement Mobile Money.",
    type: "website",
    locale: "fr_CI",
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const categories = await getCategories();
  const navCategories = categories.map((c) => ({ slug: c.slug, name: c.name, tagline: c.tagline, image: c.image }));

  return (
    <html lang="fr" className={`${manrope.variable} ${fraunces.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Header categories={navCategories} />
        <main className="flex-1">{children}</main>
        <Footer categories={navCategories} />
        <CartDrawer />
      </body>
    </html>
  );
}
