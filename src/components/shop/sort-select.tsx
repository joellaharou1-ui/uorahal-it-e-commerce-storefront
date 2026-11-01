"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown } from "lucide-react";

const options = [
  { value: "pertinence", label: "Pertinence" },
  { value: "nouveautes", label: "Nouveautés" },
  { value: "prix-asc", label: "Prix croissant" },
  { value: "prix-desc", label: "Prix décroissant" },
  { value: "note", label: "Meilleures notes" },
  { value: "populaire", label: "Les plus commentés" },
];

export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("tri") ?? "pertinence";

  return (
    <label className="relative inline-flex items-center">
      <ArrowUpDown className="pointer-events-none absolute left-3.5 h-4 w-4 text-ink-500" />
      <span className="sr-only">Trier par</span>
      <select
        value={current}
        onChange={(e) => {
          const params = new URLSearchParams(searchParams.toString());
          if (e.target.value === "pertinence") params.delete("tri");
          else params.set("tri", e.target.value);
          params.delete("page");
          router.push(`${pathname}${params.size ? `?${params.toString()}` : ""}`, { scroll: false });
        }}
        className="cursor-pointer appearance-none rounded-full border border-ink-900/12 bg-white py-2.5 pl-10 pr-9 text-xs font-semibold text-ink-900 transition hover:border-ink-900/40 focus:border-accent-500 focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <svg className="pointer-events-none absolute right-3.5 h-3.5 w-3.5 text-ink-500" viewBox="0 0 20 20" fill="none">
        <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </label>
  );
}
