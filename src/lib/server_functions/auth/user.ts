import { createServerFn } from "@tanstack/react-start";
import { count, desc, eq } from "drizzle-orm";
import { db, users } from "#/db";

export const getRecentUsers = createServerFn({ method: "GET" }).handler(
	async () => {
		return await db
			.select({
				id: users.id,
				username: users.username,
				email: users.email,
				role: users.role,
				createdAt: users.createdAt,
			})
			.from(users)
			.orderBy(desc(users.createdAt))
			.limit(10);
	},
);

export const countUsers = createServerFn({ method: "GET" }).handler(
	async () => {
		const [row] = await db.select({ count: count() }).from(users);
		return row?.count ?? 0;
	},
);

export const getUserById = createServerFn({ method: "GET" })
	.validator((id: string) => id)
	.handler(async ({ data }) => {
		const user = await db.query.users.findFirst({
			where: eq(users.id, data),
		});
		return user;
	});
