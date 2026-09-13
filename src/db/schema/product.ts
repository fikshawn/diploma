import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
	id: uuid("id").primaryKey().default(sql`gen_random_uuid()`).notNull(),
	title: text("name").notNull(),
	slug: varchar("slug", { length: 255 }).notNull().unique(),
	description: text("description").notNull(),
	excerpt: text("excerpt").notNull(),
	metatitle: text("meta_title").notNull(),
	tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`),
	image: varchar("image", { length: 255 }).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
