import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export type ProductSpec = { label: string; value: string };

/**
 * Monetary amounts are stored as integers in the currency's minor unit.
 * The shop operates in XOF (franc CFA), which has no minor unit: 1 = 1 FCFA.
 */

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull().default(""),
  description: text("description").notNull().default(""),
  image: text("image").notNull(),
  position: integer("position").notNull().default(0),
});

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    brand: text("brand").notNull(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    shortDescription: text("short_description").notNull().default(""),
    description: text("description").notNull().default(""),
    priceCents: integer("price_cents").notNull(),
    compareAtCents: integer("compare_at_cents"),
    stock: integer("stock").notNull().default(0),
    featured: boolean("featured").notNull().default(false),
    isNew: boolean("is_new").notNull().default(false),
    specs: jsonb("specs").$type<ProductSpec[]>().notNull().default([]),
    highlights: jsonb("highlights").$type<string[]>().notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("products_category_idx").on(table.categoryId),
    index("products_brand_idx").on(table.brand),
    index("products_price_idx").on(table.priceCents),
  ],
);

export const productImages = pgTable(
  "product_images",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    alt: text("alt").notNull().default(""),
    position: integer("position").notNull().default(0),
  },
  (table) => [index("product_images_product_idx").on(table.productId)],
);

export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    authorName: text("author_name").notNull(),
    rating: integer("rating").notNull(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    verified: boolean("verified").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("reviews_product_idx").on(table.productId)],
);

export const orders = pgTable(
  "orders",
  {
    id: serial("id").primaryKey(),
    orderNumber: text("order_number").notNull(),
    email: text("email").notNull(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    phone: text("phone").notNull().default(""),
    company: text("company").notNull().default(""),
    address1: text("address1").notNull(),
    address2: text("address2").notNull().default(""),
    commune: text("commune").notNull().default(""),
    postalCode: text("postal_code").notNull().default(""),
    city: text("city").notNull().default("Abidjan"),
    country: text("country").notNull().default("Côte d'Ivoire"),
    shippingMethod: text("shipping_method").notNull(),
    paymentMethod: text("payment_method").notNull().default("card"),
    paymentPhone: text("payment_phone").notNull().default(""),
    subtotalCents: integer("subtotal_cents").notNull(),
    shippingCents: integer("shipping_cents").notNull(),
    totalCents: integer("total_cents").notNull(),
    /** confirmed → validated → shipped → delivered | cancelled. pending_payment / pay_on_delivery for offline methods. */
    status: text("status").notNull().default("confirmed"),
    validatedAt: timestamp("validated_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("orders_number_idx").on(table.orderNumber)],
);

/** Journal of every outbound message (Telegram, e-mail, WhatsApp) so nothing is silently lost. */
export const notifications = pgTable(
  "notifications",
  {
    id: serial("id").primaryKey(),
    orderId: integer("order_id").references(() => orders.id, { onDelete: "cascade" }),
    event: text("event").notNull(), // order_created | order_validated | test
    channel: text("channel").notNull(), // telegram | email | whatsapp
    recipient: text("recipient").notNull(),
    status: text("status").notNull(), // sent | failed | skipped
    error: text("error"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("notifications_order_idx").on(table.orderId)],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: serial("id").primaryKey(),
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: integer("product_id").references(() => products.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    brand: text("brand").notNull().default(""),
    image: text("image").notNull().default(""),
    unitPriceCents: integer("unit_price_cents").notNull(),
    quantity: integer("quantity").notNull(),
  },
  (table) => [index("order_items_order_idx").on(table.orderId)],
);

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
  images: many(productImages),
  reviews: many(reviews),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, { fields: [productImages.productId], references: [products.id] }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, { fields: [reviews.productId], references: [products.id] }),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
}));

export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type ProductImage = typeof productImages.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
