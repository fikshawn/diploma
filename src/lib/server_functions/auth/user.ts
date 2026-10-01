import { createServerFn } from "@tanstack/react-start";
import { count, desc, eq } from "drizzle-orm";
import { db, users } from "#/db";
import { requireAdminMiddleware, requireSelfOrAdmin } from "./guards";

export const getRecentUsers = createServerFn({ method: "GET" })
	.middleware([requireAdminMiddleware])
	.handler(async () => {
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
	});

export const countUsers = createServerFn({ method: "GET" })
	.middleware([requireAdminMiddleware])
	.handler(async () => {
		const [row] = await db.select({ count: count() }).from(users);
		return row?.count ?? 0;
	});

/**
 * Accepts an arbitrary user id, so it is restricted to the caller's own record
 * or to an admin.
 */
export const getUserById = createServerFn({ method: "GET" })
	.validator((id: string) => id)
	.handler(async ({ data }) => {
		await requireSelfOrAdmin(data);

		const user = await db.query.users.findFirst({
			where: eq(users.id, data),
		});
		return user;
	});
