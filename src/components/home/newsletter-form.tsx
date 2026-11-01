"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setDone(true);
  };

  if (done) {
    return (
      <div className="flex items-center gap-3 rounded-full bg-white/10 px-5 py-3 text-sm text-white ring-1 ring-white/15">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-accent-500">
          <Check className="h-4 w-4" />
        </span>
        Merci ! Votre code de bienvenue arrive par e-mail.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="votre@email.fr"
        className="h-12 flex-1 rounded-full border border-white/15 bg-white/10 px-5 text-sm text-white placeholder:text-white/50 outline-none transition focus:border-white/40 focus:bg-white/15"
        aria-label="Adresse e-mail"
      />
      <button type="submit" className="btn-light h-12 shrink-0">
        Recevoir -10 % <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
