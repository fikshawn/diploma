import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db, users } from "#/db";

export const getUserById = createServerFn({ method: "GET" })
	.validator((id: string) => id)
	.handler(async ({ data }) => {
		const user = await db.query.users.findFirst({
			where: eq(users.id, data),
		});
		return user;
	});
