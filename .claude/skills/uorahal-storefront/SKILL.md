---
name: uorahal-storefront
description: Conventions and workflows for the UORAHAL e-commerce storefront (Next.js 16 App Router, Drizzle + PostgreSQL, Abidjan / Côte d'Ivoire, XOF/FCFA pricing, Mobile Money checkout). Use when adding or editing products, collections, prices, shipping or payment options, contact details, checkout, reviews, or seed data for this project.
---

# UORAHAL storefront

UORAHAL is a French-language IT shop based in Abidjan, Côte d'Ivoire. Every
customer-facing string is in French. All money is in FCFA (XOF).

## Golden rules

1. **Contact details come only from `STORE` in `src/lib/utils.ts`.** Never
   hardcode the phone, WhatsApp, e-mail, TikTok, or address. Import `STORE` and
   use `STORE.phoneDisplay`, `STORE.phoneHref`, `STORE.whatsappHref`,
   `STORE.email`, `STORE.tiktokHref`, `STORE.tiktokHandle`, `STORE.addressLine`,
   `STORE.hours`.
   - Current values: e-mail `uorahal@proton.me`, phone `05 86 71 47 32`
     (`+225 05 86 71 47 32`), TikTok `@uorahal`, Abidjan.
2. **Money is an integer in FCFA. Never multiply or divide by 100.** XOF has no
   minor unit. `priceCents` is a misnomer kept for compatibility: a value of
   `849000` means 849 000 FCFA.
   - Format with `formatPrice(amount)`, which gives `849 000 FCFA` with a narrow
     no-break space. Do not use `Intl` or `€` anywhere.
   - VAT is 18 % (`STORE.vatRate`), shown as "TVA incluse" or "dont TVA (18 %)".
3. **Locale is `fr` and `fr_CI`.** No "Paris", "France", "Colissimo", "EUR", "€",
   or "3× sans frais" in new copy. Currency is FCFA, shipping is Abidjan or
   interior, and payment uses Mobile Money.
4. **Schema changes:** edit `src/db/schema.ts`, then run
   `npx drizzle-kit push`. There are no migration files.
5. **Validation before finishing:** follow the project's final validation
   sequence (typegen, tsc, build, then `build_and_start`).

## Where things live

| Concern | File |
| --- | --- |
| Contact details, VAT, currency format, shipping methods, Mobile Money operators, payment methods, Abidjan communes, countries, order numbers | `src/lib/utils.ts` |
| Tables: categories, products, product_images, reviews, orders, order_items | `src/db/schema.ts` |
| Demo catalogue (categories, products, specs, highlights, reviews, image ids) | `src/db/seed-data.ts` |
| Seed logic, `ensureSeeded()` | `src/db/seed.ts` |
| Reseed script | `scripts/seed.ts` (`npx tsx scripts/seed.ts --force` wipes and reseeds) |
| Product queries, filters, sorting, pagination | `src/lib/products.ts` |
| Cart store (Zustand, localStorage key `uorahal-cart-v1`) | `src/store/cart.ts` |
| Checkout UI (3 steps) | `src/components/checkout/checkout-flow.tsx` |
| Order creation (validates prices, stock, payment method) | `src/app/api/orders/route.ts` |
| Review creation | `src/app/api/reviews/route.ts` |
| Header, footer, mobile menu, WhatsApp and TikTok icons | `src/components/layout/*`, `src/components/ui/social-icons.tsx` |
| Product photos (local, downloaded) | `public/images/p/<pexelsId>.jpg`, `public/images/hero.jpg` |
| Order notifications (Telegram, Resend e-mail, WhatsApp Cloud API) and journal | `src/lib/notify.ts`, table `notifications` |
| Order lifecycle labels and allowed transitions | `src/lib/order-status.ts` |
| Admin auth (ADMIN_PASSWORD, session cookie, login rate limit) | `src/lib/admin-auth.ts` |
| Admin dashboard `/admin` (tabs `?vue=a-valider|a-livrer|terminees|toutes`) and its Server Actions | `src/app/admin/page.tsx`, `src/app/admin/actions.ts` |
| Printable delivery slip (admin only, cash-to-collect box for COD) | `src/app/admin/livraison/[orderNumber]/page.tsx` |
| Environment variable template | `.env.example` (never commit real secrets) |

## Notifications and order validation

- Flow: `POST /api/orders` saves the order, then `after(() => notifyOrderCreated(id))`
  sends messages after the response. A failed channel never fails the order.
- Each send is logged in `notifications` (event, channel, recipient, status, error).
  The journal is visible at `/admin`.
- Channels are optional and enabled by environment variables only:
  - Telegram (team alert): `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`
  - E-mail via Resend: `RESEND_API_KEY`, `NOTIFY_FROM_EMAIL` (team copy and customer copy)
  - WhatsApp Cloud API (customer): `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`,
    plus approved templates `WHATSAPP_TEMPLATE_ORDER_CREATED` and
    `WHATSAPP_TEMPLATE_ORDER_VALIDATED`. Each template takes 3 body variables in
    this order: first name, order number, total.
- Business-initiated WhatsApp messages must use an approved template. Free text
  only works inside the 24-hour window after the customer writes first.
- Validation: in `/admin`, "Valider la commande" sets `status = validated` and
  `validated_at`, then calls `notifyOrderValidated` (customer only). This happens
  only on the first validation.
- Allowed transitions are in `NEXT_ACTIONS` (`order-status.ts`) and are enforced
  in the Server Action. Cancelling restores stock once.
- Admin security: every Server Action re-checks the session. The cookie is
  httpOnly, sameSite strict, and derived from `ADMIN_PASSWORD`. `/admin` stays
  locked unless the password is at least 12 characters. Login failures are
  rate-limited (8 per 15 minutes).
- Never import `src/lib/notify.ts` or `src/lib/admin-auth.ts` from a client component.

## Workflows

### Add a product

1. Put the photos in `public/images/p/<id>.jpg`. Use Pexels ids via
   `fetch_media`, download with `curl`, and never hotlink.
2. Append an entry to `seedProducts` in `src/db/seed-data.ts`:
   - `slug` is kebab-case and unique.
   - `category` must match a `slug` in `seedCategories`.
   - `price` and `compareAt` are FCFA integers, for example `250000`.
   - `specs` are French label/value pairs. `highlights` has 3 to 4 items.
   - `images` use `{ id, alt }`, where `alt` is French.
   - `reviews` use `daysAgo`, `rating` 1 to 5, and `verified`.
3. Re-seed: `npx tsx scripts/seed.ts --force` (development data only). For a
   live database, insert with SQL instead of wiping it.

### Change a price or promotion

Edit `price` / `compareAt` in `seed-data.ts`, or run an SQL `UPDATE` on
`products.price_cents` and `products.compare_at_cents`. Remember these are FCFA.

### Change shipping

Edit `SHIPPING_METHODS` in `src/lib/utils.ts`. Each method has `priceCents`
(FCFA), `freeAbove` (threshold or `null`), and `etaDays`. The checkout and
the server validation both read this list, so they stay in sync. Keep the
`id` values stable, because existing orders store them.

### Add or change a payment method

Edit `MOBILE_MONEY_OPERATORS` or `PAYMENT_METHODS` in `src/lib/utils.ts`.
Each method has a `kind`:

- `mobile`: needs a 10-digit `paymentPhone`, validated in `/api/orders`.
- `card`: needs card fields in `checkout-flow.tsx`.
- `cod`: pay on delivery, status `pay_on_delivery`.
- `transfer`: status `pending_payment`.

Keep the `paymentKinds` list in `checkout-flow.tsx` in sync when adding a kind.

### Change contact details

Edit only the `STORE` object in `src/lib/utils.ts`. Keep `phoneHref` and
`whatsappHref` in international format (`+2250586714732`, `2250586714732`).

### Add a collection

Add a `seedCategories` entry with `slug`, `name`, `tagline`, `description`,
`image`, and `position`. Then add the category to the navigation through the
existing `getCategories()` call. The header, footer, and collection pages read
from the database, so no other code change is needed.

## Technical rules (this project)

- **Tailwind v4:** custom classes that use `@apply` must be declared with
  `@utility`. Classes in `@layer components` cannot be applied from other
  classes. See `src/app/globals.css`.
- **Next 16:** `params` and `searchParams` are Promises, so `await` them. Pages
  that read the database use `export const dynamic = "force-dynamic"`.
- **Hydration safety:** keep date formatting in UTC (`formatDate`) and number
  formatting deterministic. The cart store is hydrated on the client only.
- **Server-only data:** `src/lib/products.ts` calls `ensureSeeded()` before
  reads. Do not import `db` into client components.
- **Forms:** validate in the API route, not only in the browser. Return
  French error messages with the right HTTP status (400, 409, 500).
- **Stock:** `/api/orders` checks stock and decrements it inside a transaction.
  Don't bypass this path when creating orders.

## Validation checklist

Run from the project root, in this order:

```bash
bash -lc 'set -o pipefail; npx next typegen 2>&1 | tee /tmp/next-typegen.log'
bash -lc 'set -o pipefail; npm exec tsc -- --noEmit --pretty false 2>&1 | tee /tmp/tsc.log'
bash -lc 'set -o pipefail; npm run build 2>&1 | tee /tmp/build.log'
```

Then call `build_and_start`. If any step fails, read the matching log
(`/tmp/*.log`) before changing code.

Smoke-test a change on a temporary server (`npx next start -p 3779`), then
stop it. Do not leave servers running, and clean up test orders and restore
stock afterwards.

## Things to avoid

- Euro amounts, French-only Paris addresses, or the old placeholder phone
  numbers (`01 84 80 12 34`, `pro@uorahal.fr`, `bonjour@uorahal.fr`).
- Editing `package.json` by hand. Use the install tool instead.
- Changing order status values or payment method ids without a data migration,
  because existing rows reference them.
