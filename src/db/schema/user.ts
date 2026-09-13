import { sql } from "drizzle-orm";
import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

// 1. Declare the native Postgres enum type
export const roleEnum = pgEnum("user_role", ["admin", "user"]);

export const users = pgTable("users", {
	id: uuid("id").primaryKey().default(sql`gen_random_uuid()`).notNull(),
	username: varchar("username", { length: 100 }).notNull().unique(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	password: varchar("password", { length: 255 }).notNull(),
	role: roleEnum().default("user"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Export types for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
