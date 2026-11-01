"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { cn } from "@/lib/utils";

type GalleryImage = { url: string; alt: string };

export function ImageGallery({ images, badges }: { images: GalleryImage[]; badges?: React.ReactNode }) {
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const [zoom, setZoom] = useState(false);
  const count = images.length;

  const go = useCallback((dir: 1 | -1) => setIndex((i) => (i + dir + count) % count), [count]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [lightbox, go]);

  const current = images[index] ?? images[0];

  return (
    <div className="flex flex-col gap-3 lg:flex-row-reverse lg:gap-4">
      <div className="relative flex-1">
        <div
          className="group relative aspect-[4/5] cursor-zoom-in overflow-hidden rounded-3xl bg-white shadow-soft sm:aspect-square lg:aspect-[4/5]"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setOrigin(`${((e.clientX - rect.left) / rect.width) * 100}% ${((e.clientY - rect.top) / rect.height) * 100}%`);
          }}
          onMouseEnter={() => setZoom(true)}
          onMouseLeave={() => setZoom(false)}
          onClick={() => setLightbox(true)}
        >
          {images.map((img, i) => (
            <Image
              key={img.url}
              src={img.url}
              alt={img.alt}
              fill
              priority={i === 0}
              sizes="(max-width: 1024px) 100vw, 55vw"
              className={cn(
                "object-cover transition-all duration-500",
                i === index ? "opacity-100" : "pointer-events-none opacity-0",
                zoom && i === index ? "scale-[1.6]" : "scale-100",
              )}
              style={{ transformOrigin: origin }}
            />
          ))}
          {badges && <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-1.5">{badges}</div>}
          <button
            type="button"
            className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-ink-900 shadow-soft backdrop-blur transition hover:bg-white"
            aria-label="Agrandir l'image"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(true);
            }}
          >
            <Expand className="h-4 w-4" />
          </button>
          {count > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 opacity-0 shadow-soft backdrop-blur transition hover:bg-white group-hover:opacity-100"
                aria-label="Image précédente"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 opacity-0 shadow-soft backdrop-blur transition hover:bg-white group-hover:opacity-100"
                aria-label="Image suivante"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
          {count > 1 && (
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 lg:hidden">
              {images.map((_, i) => (
                <span key={i} className={cn("h-1.5 rounded-full bg-white transition-all", i === index ? "w-5" : "w-1.5 opacity-60")} />
              ))}
            </div>
          )}
        </div>
      </div>

      {count > 1 && (
        <div className="flex gap-2.5 overflow-x-auto scrollbar-none lg:w-24 lg:flex-col lg:overflow-visible">
          {images.map((img, i) => (
            <button
              key={img.url}
              type="button"
              onMouseEnter={() => setIndex(i)}
              onClick={() => setIndex(i)}
              className={cn(
                "relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl bg-white ring-2 ring-offset-2 ring-offset-paper transition lg:w-full",
                i === index ? "ring-ink-950" : "ring-transparent hover:ring-ink-300",
              )}
              aria-label={`Voir l'image ${i + 1}`}
            >
              <Image src={img.url} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-ink-950/95 p-4 animate-fade-in" onClick={() => setLightbox(false)}>
          <button
            type="button"
            onClick={() => setLightbox(false)}
            className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative h-[80vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image src={current.url} alt={current.alt} fill sizes="100vw" className="object-contain" />
          </div>
          {count > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                className="absolute left-5 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                aria-label="Image précédente"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                className="absolute right-5 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                aria-label="Image suivante"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/60">
                {index + 1} / {count}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
