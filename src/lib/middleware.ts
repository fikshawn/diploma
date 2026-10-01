import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { fetchCurrentSession } from "./server_functions/auth/authentication";

/**
 * Route-level guard for `/dashboard/*`. Server functions have their own guards
 * in ./server_functions/auth/guards — this one only covers route rendering.
 */
export const adminMiddleware = createMiddleware().server(async ({ next }) => {
	const user = await fetchCurrentSession();

	if (!user || user.role !== "admin") {
		throw redirect({ to: "/" });
	}
	return next({ context: { user } });
});
