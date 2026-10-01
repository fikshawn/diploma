import { z } from "zod";

export const signupSchema = z.object({
	username: z
		.string()
		.min(3, "Name must be at least 3 characters")
		.max(100, "Name must be at most 100 characters"),
	email: z.string().email("Email is invalid").max(255, "Email is too long"),
	// Argon2 makes brute-forcing expensive, but a floor still rules out the
	// trivially guessable values that make that cost irrelevant.
	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.max(200, "Password must be at most 200 characters"),
});
