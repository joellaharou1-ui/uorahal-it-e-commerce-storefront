import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Authentification minimale du tableau de bord : un mot de passe (ADMIN_PASSWORD)
 * et un cookie de session httpOnly. Le cookie est dérivé du mot de passe, donc
 * changer le mot de passe invalide immédiatement toutes les sessions.
 */
export const ADMIN_COOKIE = "uorahal_admin";
const MIN_PASSWORD_LENGTH = 12;

function configuredPassword() {
  return (process.env.ADMIN_PASSWORD ?? "").trim();
}

export function adminConfigured() {
  return configuredPassword().length >= MIN_PASSWORD_LENGTH;
}

const digest = (value: string) => createHash("sha256").update(value).digest();

export function verifyPassword(input: string) {
  if (!adminConfigured()) return false;
  // Comparaison à temps constant.
  return timingSafeEqual(digest(input), digest(configuredPassword()));
}

/** Limiteur global des tentatives de connexion : 8 échecs max par fenêtre de 15 minutes. */
const LOGIN_WINDOW_MS = 15 * 60_000;
const MAX_FAILED_LOGINS = 8;
const loginState = globalThis as typeof globalThis & { __uorahalLoginFailures?: { count: number; resetAt: number } };

export function loginAllowed() {
  const state = loginState.__uorahalLoginFailures;
  if (!state || state.resetAt < Date.now()) return true;
  return state.count < MAX_FAILED_LOGINS;
}

export function recordFailedLogin() {
  const now = Date.now();
  const state = loginState.__uorahalLoginFailures;
  if (!state || state.resetAt < now) {
    loginState.__uorahalLoginFailures = { count: 1, resetAt: now + LOGIN_WINDOW_MS };
  } else {
    state.count += 1;
  }
}

export function clearFailedLogins() {
  loginState.__uorahalLoginFailures = undefined;
}

export function sessionToken() {
  return createHash("sha256").update(`uorahal-admin-session:${configuredPassword()}`).digest("hex");
}

export async function isAdmin() {
  if (!adminConfigured()) return false;
  const jar = await cookies();
  const value = jar.get(ADMIN_COOKIE)?.value ?? "";
  const expected = sessionToken();
  if (value.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(value), Buffer.from(expected));
}
