"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { BadgeCheck, PenLine, Star } from "lucide-react";
import { RatingStars } from "./rating-stars";
import { cn, formatDate } from "@/lib/utils";

type ReviewItem = {
  id: number;
  authorName: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  createdAt: string;
};

export function ReviewsSection({
  productId,
  reviews,
  ratingAvg,
  ratingCount,
  distribution,
}: {
  productId: number;
  reviews: ReviewItem[];
  ratingAvg: number;
  ratingCount: number;
  distribution: { star: number; count: number }[];
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [visible, setVisible] = useState(4);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, authorName: author, rating, title, body }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Impossible d'enregistrer votre avis.");
      }
      setSuccess(true);
      setShowForm(false);
      setAuthor("");
      setTitle("");
      setBody("");
      setRating(5);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="avis" className="scroll-mt-28">
      <div className="grid gap-10 lg:grid-cols-[320px_1fr] lg:gap-16">
        <div>
          <p className="eyebrow">Avis clients</p>
          <h2 className="display mt-3 text-4xl">Ce qu&apos;en pensent nos clients</h2>
          <div className="mt-6 flex items-end gap-4">
            <span className="font-display text-6xl leading-none">{ratingCount ? ratingAvg.toFixed(1).replace(".", ",") : "–"}</span>
            <div className="pb-1.5">
              <RatingStars rating={ratingAvg} size="md" />
              <p className="mt-1 text-xs text-ink-500">
                {ratingCount} avis vérifié{ratingCount > 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <ul className="mt-6 space-y-2">
            {distribution.map((d) => {
              const pct = ratingCount ? (d.count / ratingCount) * 100 : 0;
              return (
                <li key={d.star} className="flex items-center gap-3 text-xs">
                  <span className="tabular w-8 text-ink-600">{d.star} ★</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink-100">
                    <div className="h-full rounded-full bg-amber-400 transition-all duration-700" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="tabular w-6 text-right text-ink-500">{d.count}</span>
                </li>
              );
            })}
          </ul>
          <button type="button" onClick={() => setShowForm((s) => !s)} className="btn-secondary mt-8 w-full">
            <PenLine className="h-4 w-4" /> Rédiger un avis
          </button>
          {success && (
            <p className="mt-3 rounded-xl bg-accent-50 px-4 py-3 text-xs text-accent-800">
              Merci ! Votre avis a été publié.
            </p>
          )}
        </div>

        <div>
          {showForm && (
            <form onSubmit={onSubmit} className="card mb-8 animate-scale-in p-6 sm:p-8">
              <h3 className="font-display text-2xl">Votre avis</h3>
              <div className="mt-5">
                <span className="label">Note</span>
                <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onMouseEnter={() => setHover(n)}
                      onClick={() => setRating(n)}
                      className="p-0.5"
                      aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
                    >
                      <Star
                        className={cn("h-7 w-7 transition-colors", (hover || rating) >= n ? "text-amber-400" : "text-ink-200")}
                        fill="currentColor"
                        strokeWidth={0}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs text-ink-500">
                    {["", "Décevant", "Moyen", "Bien", "Très bien", "Excellent"][hover || rating]}
                  </span>
                </div>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="review-author" className="label">Votre nom</label>
                  <input id="review-author" required minLength={2} maxLength={60} value={author} onChange={(e) => setAuthor(e.target.value)} className="input" placeholder="Prénom N." />
                </div>
                <div>
                  <label htmlFor="review-title" className="label">Titre</label>
                  <input id="review-title" required minLength={3} maxLength={120} value={title} onChange={(e) => setTitle(e.target.value)} className="input" placeholder="En quelques mots" />
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="review-body" className="label">Votre expérience</label>
                <textarea id="review-body" required minLength={10} maxLength={2000} rows={4} value={body} onChange={(e) => setBody(e.target.value)} className="input resize-none" placeholder="Qu'avez-vous aimé ? Que pourrait-on améliorer ?" />
              </div>
              {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
              <div className="mt-5 flex gap-2">
                <button type="submit" disabled={submitting} className="btn-primary">
                  {submitting ? "Publication…" : "Publier mon avis"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">
                  Annuler
                </button>
              </div>
            </form>
          )}

          {reviews.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink-900/15 p-10 text-center text-sm text-ink-500">
              Aucun avis pour le moment. Soyez le premier à partager votre expérience.
            </div>
          ) : (
            <ul className="divide-y divide-ink-900/8">
              {reviews.slice(0, visible).map((r) => (
                <li key={r.id} className="py-7 first:pt-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-ink-950 font-display text-sm text-white">
                        {r.authorName.charAt(0)}
                      </span>
                      <div>
                        <p className="flex items-center gap-1.5 text-sm font-semibold">
                          {r.authorName}
                          {r.verified && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-accent-50 px-2 py-0.5 text-[10px] font-semibold text-accent-700">
                              <BadgeCheck className="h-3 w-3" /> Achat vérifié
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-ink-500">{formatDate(r.createdAt)}</p>
                      </div>
                    </div>
                    <RatingStars rating={r.rating} size="sm" />
                  </div>
                  <h4 className="mt-4 font-semibold">{r.title}</h4>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-ink-700">{r.body}</p>
                </li>
              ))}
            </ul>
          )}
          {visible < reviews.length && (
            <button type="button" onClick={() => setVisible((v) => v + 4)} className="btn-secondary mt-4">
              Voir plus d&apos;avis ({reviews.length - visible})
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
