import { describe, expect, it } from "vitest";
import { signupSchema } from "./auth-validator";

describe("signupSchema", () => {
	it("accepts a well-formed signup", () => {
		const result = signupSchema.safeParse({
			username: "c.jansen",
			email: "support@certificaatkopen.com",
			password: "correct-horse-battery",
		});
		expect(result.success).toBe(true);
	});

	it("rejects a malformed email", () => {
		const result = signupSchema.safeParse({
			username: "c.jansen",
			email: "not-an-email",
			password: "correct-horse-battery",
		});
		expect(result.success).toBe(false);
	});

	// Previously `min(1)`, which let a one-character password through.
	it("rejects a password under 8 characters", () => {
		const result = signupSchema.safeParse({
			username: "c.jansen",
			email: "support@certificaatkopen.com",
			password: "short",
		});
		expect(result.success).toBe(false);
	});

	it("rejects an empty username", () => {
		const result = signupSchema.safeParse({
			username: "",
			email: "support@certificaatkopen.com",
			password: "correct-horse-battery",
		});
		expect(result.success).toBe(false);
	});

	it("rejects an over-long username", () => {
		const result = signupSchema.safeParse({
			username: "a".repeat(101),
			email: "support@certificaatkopen.com",
			password: "correct-horse-battery",
		});
		expect(result.success).toBe(false);
	});
});
