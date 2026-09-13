import { z } from "zod";

export const signupSchema = z.object({
	username: z.string().min(1, "Name is required"),
	email: z.string().min(1, "Email is required"),
	password: z.string().min(1, "Password is required"),
});
