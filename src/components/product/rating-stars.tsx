import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({
  rating,
  size = "sm",
  className,
}: {
  rating: number;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}) {
  const dims = { xs: "h-3 w-3", sm: "h-3.5 w-3.5", md: "h-4 w-4", lg: "h-5 w-5" }[size];
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`${rating} sur 5`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - (i - 1)));
        return (
          <span key={i} className={cn("relative inline-block", dims)}>
            <Star className={cn("absolute inset-0 text-ink-200", dims)} fill="currentColor" strokeWidth={0} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className={cn("text-amber-400", dims)} fill="currentColor" strokeWidth={0} />
            </span>
          </span>
        );
      })}
    </span>
  );
}
