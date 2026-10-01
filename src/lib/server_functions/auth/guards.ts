import { createMiddleware, createServerOnlyFn } from "@tanstack/react-start";
import { useAppSession } from "./session";

export type SessionUser = {
	userId: string;
	email?: string;
	role?: string;
	username?: string;
};

/**
 * Thrown when a server function is reached without a valid session. Kept as a
 * distinct type so route code can translate it into a redirect while server
 * functions simply reject with it.
 */
export class UnauthorizedError extends Error {
	constructor(message = "Unauthorized") {
		super(message);
		this.name = "UnauthorizedError";
	}
}

export class ForbiddenError extends Error {
	constructor(message = "Forbidden") {
		super(message);
		this.name = "ForbiddenError";
	}
}

/**
 * Server functions are exposed as their own HTTP endpoints, so route-level
 * middleware does not protect them. Every privileged handler must call this
 * before touching the database.
 */
export const requireAuth = createServerOnlyFn(
	async (): Promise<SessionUser> => {
		const session = await useAppSession();
		const userId = session.data.userId;

		if (!userId) {
			throw new UnauthorizedError("Authentication required");
		}

		return {
			userId,
			email: session.data.email,
			role: session.data.role,
			username: session.data.username,
		};
	},
);

export const requireAdmin = createServerOnlyFn(
	async (): Promise<SessionUser> => {
		const user = await requireAuth();

		if (user.role !== "admin") {
			throw new ForbiddenError("Admin access required");
		}

		return user;
	},
);

/**
 * Self-or-admin check. Guards handlers that accept an arbitrary user id so a
 * signed-in non-admin cannot read another account's record.
 */
export const requireSelfOrAdmin = createServerOnlyFn(
	async (targetUserId: string): Promise<SessionUser> => {
		const user = await requireAuth();

		if (user.role !== "admin" && user.userId !== targetUserId) {
			throw new ForbiddenError("Admin access required");
		}

		return user;
	},
);

/**
 * Function middleware variants, for attaching the check declaratively:
 *
 *   export const deleteProduct = createServerFn({ method: "POST" })
 *     .middleware([requireAdminMiddleware])
 *
 * These intentionally throw rather than redirect — a redirect is meaningless
 * when the caller is a `fetch` against a server function endpoint.
 */
export const requireAuthMiddleware = createMiddleware().server(
	async ({ next }) => {
		await requireAuth();
		return next();
	},
);

export const requireAdminMiddleware = createMiddleware().server(
	async ({ next }) => {
		await requireAdmin();
		return next();
	},
);
