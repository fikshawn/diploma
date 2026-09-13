import { createServerFn } from "@tanstack/react-start";
import { prisma } from "#/db";

export const getUserById = createServerFn({ method: "GET" })
	.validator((id: string) => id)
	.handler(async ({ data }) => {
		const user = await prisma.user.findUnique({
			where: { id: data },
		});
		return user;
	});
