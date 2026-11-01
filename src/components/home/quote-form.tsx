"use client";

import { useState, type FormEvent } from "react";
import { Check, Send } from "lucide-react";
import { STORE } from "@/lib/utils";

export function QuoteForm() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl bg-paper p-10 text-center animate-scale-in">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-accent-600 text-white">
          <Check className="h-6 w-6" strokeWidth={3} />
        </span>
        <h3 className="font-display mt-5 text-2xl">Demande envoyée</h3>
        <p className="mt-2 max-w-xs text-sm text-ink-600">
          Merci ! Un technicien-conseil vous recontacte sous 24 h ouvrées avec un devis en FCFA. Pour aller plus vite :{" "}
          <a href={STORE.whatsappHref} target="_blank" rel="noreferrer" className="font-semibold text-ink-900 underline-offset-4 hover:underline">
            WhatsApp {STORE.phoneDisplay}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="q-company" className="label">Organisation</label>
        <input id="q-company" required className="input" placeholder="Nom de votre structure" />
      </div>
      <div>
        <label htmlFor="q-name" className="label">Votre nom</label>
        <input id="q-name" required className="input" />
      </div>
      <div>
        <label htmlFor="q-email" className="label">E-mail professionnel</label>
        <input id="q-email" type="email" required className="input" placeholder="prenom@entreprise.fr" />
      </div>
      <div>
        <label htmlFor="q-phone" className="label">Téléphone</label>
        <input id="q-phone" type="tel" className="input" />
      </div>
      <div>
        <label htmlFor="q-size" className="label">Nombre de postes</label>
        <select id="q-size" className="input" defaultValue="5-20">
          <option value="1-4">1 à 4</option>
          <option value="5-20">5 à 20</option>
          <option value="21-100">21 à 100</option>
          <option value="100+">Plus de 100</option>
        </select>
      </div>
      <div>
        <label htmlFor="q-when" className="label">Échéance</label>
        <select id="q-when" className="input" defaultValue="1m">
          <option value="now">Dès que possible</option>
          <option value="1m">Sous 1 mois</option>
          <option value="3m">Sous 3 mois</option>
          <option value="later">Simple étude</option>
        </select>
      </div>
      <div>
        <label htmlFor="q-budget" className="label">Budget estimé (FCFA)</label>
        <select id="q-budget" className="input" defaultValue="1-5m">
          <option value="<1m">Moins de 1 000 000 FCFA</option>
          <option value="1-5m">1 à 5 millions FCFA</option>
          <option value="5-20m">5 à 20 millions FCFA</option>
          <option value=">20m">Plus de 20 millions FCFA</option>
          <option value="na">À définir ensemble</option>
        </select>
      </div>
      <div>
        <label htmlFor="q-city" className="label">Ville</label>
        <input id="q-city" className="input" defaultValue="Abidjan" />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="q-message" className="label">Votre besoin</label>
        <textarea id="q-message" required rows={4} className="input resize-none" placeholder="Postes de travail, écrans, serveurs, renouvellement de parc…" />
      </div>
      <div className="sm:col-span-2">
        <button type="submit" className="btn-primary w-full py-4 sm:w-auto">
          Envoyer ma demande <Send className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
