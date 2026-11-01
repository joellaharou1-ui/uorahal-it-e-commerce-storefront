type WindowState = { count: number; resetAt: number };

type RateLimitStore = typeof globalThis & {
  __uorahalRateLimits?: Map<string, WindowState>;
};

const store = globalThis as RateLimitStore;
const limits = store.__uorahalRateLimits ?? new Map<string, WindowState>();
if (!store.__uorahalRateLimits) store.__uorahalRateLimits = limits;

export function clientAddress(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

export function rateLimit(key: string, max: number, windowMs: number) {
  const now = Date.now();
  if (limits.size > 10_000) {
    for (const [storedKey, state] of limits) {
      if (state.resetAt <= now) limits.delete(storedKey);
    }
  }
  const current = limits.get(key);
  if (!current || current.resetAt <= now) {
    limits.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: Math.ceil(windowMs / 1000) };
  }
  if (current.count >= max) {
    return { allowed: false, retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000) };
  }
  current.count += 1;
  return { allowed: true, retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000) };
}
