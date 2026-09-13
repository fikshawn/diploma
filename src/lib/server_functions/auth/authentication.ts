import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db, users } from "#/db";
import { signupSchema } from "#/lib/validators/auth-validator";
import { hashPassword, verifyPassword } from "./passwordHash";
import { useAppSession } from "./session";
import { getUserById } from "./user";
// Signup function
export const signupFn = createServerFn({ method: "POST" })
	.validator(signupSchema)
	.handler(async ({ data }) => {
		const hashedPassword = await hashPassword(data.password);
		const [user] = await db
			.insert(users)
			.values({
				username: data.username,
				email: data.email,
				password: hashedPassword,
			})
			.returning();
		// 1. Log the user in immediately upon successful signup
		// const session = await useAppSession();
		// await session.update({
		// 	userId: user.id,
		// 	email: user.email,
		// 	role: user.role,
		// 	username: user.username,
		// });

		return {
			user,
			success: true,
			message: "User created successfully",
		};
	});

// Login server function
export const loginFn = createServerFn({ method: "POST" })
	.validator((data: { email: string; password: string }) => data)
	.handler(async ({ data }) => {
		const [user] = await db
			.select()
			.from(users)
			.where(eq(users.email, data.email))
			.limit(1);

		if (!user) {
			throw new Error("Invalid credentials"); // Or return structured error object
		}

		const isValidPassword = await verifyPassword(user.password, data.password);

		if (!isValidPassword) {
			throw new Error("Invalid credentials");
		}

		// Create session
		const session = await useAppSession();
		await session.update({
			userId: user.id,
			email: user.email,
			role: user.role ?? undefined,
			username: user.username,
		});

		return {
			success: true,
			message: "Login successful",
			user,
		};
	});

// Logout server function
export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
	const session = await useAppSession();
	await session.clear();
});

// Get current user
export const getCurrentUserFn = createServerFn({ method: "GET" }).handler(
	async () => {
		const session = await useAppSession();
		const userId = session.data.userId;

		if (!userId) {
			return null;
		}

		return await getUserById({ data: userId });
	},
);

export const fetchCurrentSession = createServerFn({ method: "GET" }).handler(
	async () => {
		// This executes securely on the server with direct cookie access
		const session = await useAppSession();

		// If no active session data exists, return null
		if (!session.data.userId) {
			return null;
		}

		// Return the light payload to the client side safely
		return {
			userId: session.data.userId,
			email: session.data.email,
			role: session.data.role,
			username: session.data.username,
		};
	},
);
