"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders, products } from "@/db/schema";
import {
  ADMIN_COOKIE,
  adminConfigured,
  clearFailedLogins,
  isAdmin,
  loginAllowed,
  recordFailedLogin,
  sessionToken,
  verifyPassword,
} from "@/lib/admin-auth";
import { notifyOrderValidated, sendTestNotifications } from "@/lib/notify";
import { NEXT_ACTIONS, ORDER_STATUSES, type OrderStatus } from "@/lib/order-status";

/** Chaque action est protégée individuellement : les Server Actions sont appelables directement. */
async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin?error=forbidden");
}

export async function loginAction(formData: FormData) {
  if (!adminConfigured()) redirect("/admin?error=not-configured");
  if (!loginAllowed()) redirect("/admin?error=too-many");
  const password = String(formData.get("password") ?? "");
  if (!verifyPassword(password)) {
    recordFailedLogin();
    redirect("/admin?error=bad-password");
  }
  clearFailedLogins();

  const jar = await cookies();
  jar.set(ADMIN_COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  redirect("/admin");
}

export async function logoutAction() {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
  redirect("/admin");
}

export async function setOrderStatusAction(formData: FormData) {
  await requireAdmin();

  const orderNumber = String(formData.get("orderNumber") ?? "");
  const vue = String(formData.get("vue") ?? "");
  const viewQuery = ["a-valider", "a-livrer", "terminees", "toutes"].includes(vue) ? `&vue=${vue}` : "";
  const target = String(formData.get("status") ?? "");
  if (!(target in ORDER_STATUSES)) redirect("/admin?error=invalid-status");
  const to = target as OrderStatus;

  const [current] = await db
    .select({ id: orders.id, status: orders.status, validatedAt: orders.validatedAt })
    .from(orders)
    .where(eq(orders.orderNumber, orderNumber))
    .limit(1);
  if (!current) redirect("/admin?error=not-found");

  const from = current.status as OrderStatus;
  if (!NEXT_ACTIONS[from]?.some((action) => action.to === to)) redirect("/admin?error=invalid-transition");

  const firstValidation = to === "validated" && !current.validatedAt;

  let transitionApplied = false;
  await db.transaction(async (tx) => {
    const updated = await tx
      .update(orders)
      .set({
        status: to,
        ...(firstValidation ? { validatedAt: new Date() } : {}),
      })
      .where(and(eq(orders.id, current.id), eq(orders.status, from)))
      .returning({ id: orders.id });
    if (updated.length === 0) return;
    transitionApplied = true;

    // Annulation : remettre les articles en stock une seule fois, après une
    // transition conditionnelle réussie.
    if (to === "cancelled") {
      const lines = await tx
        .select({ productId: orderItems.productId, quantity: orderItems.quantity })
        .from(orderItems)
        .where(eq(orderItems.orderId, current.id));
      for (const line of lines) {
        if (!line.productId) continue;
        await tx
          .update(products)
          .set({ stock: sql`${products.stock} + ${line.quantity}` })
          .where(eq(products.id, line.productId));
      }
    }
  });

  if (!transitionApplied) redirect("/admin?error=invalid-transition");

  // Première validation : prévenir le client (e-mail et WhatsApp). Ne bloque jamais la mise à jour.
  if (firstValidation) await notifyOrderValidated(current.id);

  revalidatePath("/admin");
  redirect(`/admin?notice=status-updated${viewQuery}`);
}

export async function sendTestAction() {
  await requireAdmin();
  const results = await sendTestNotifications();
  const ok = results.filter((r) => r.status === "sent").length;
  const failed = results.length - ok;
  revalidatePath("/admin");
  redirect(`/admin?notice=test&ok=${ok}&failed=${failed}`);
}
