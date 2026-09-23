import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { fetchCurrentSession } from "./server_functions/auth/authentication";

export const authMiddleware = createMiddleware().server(async ({ next }) => {
	const user = await fetchCurrentSession();

	if (!user) {
		throw redirect({ to: "/panchak" });
	}
	return next({ context: { user } });
});

export const adminMiddleware = createMiddleware().server(async ({ next }) => {
	const user = await fetchCurrentSession();

	if (!user || user.role !== "admin") {
		throw redirect({ to: "/" });
	}
	return next({ context: { user } });
});
