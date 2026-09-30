import { useSession } from "@tanstack/react-start/server";

type SessionData = {
	userId?: string;
	email?: string;
	role?: string;
	username?: string;
};

const SESSION_NAME = "app-session";

function getSessionSecret(): string {
	const secret = process.env.SESSION_SECRET;
	if (!secret || secret.length < 32) {
		throw new Error(
			"SESSION_SECRET must be set and at least 32 characters long",
		);
	}
	return secret;
}

export function useAppSession() {
	return useSession<SessionData>({
		name: SESSION_NAME,
		password: getSessionSecret(),
		cookie: {
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			httpOnly: true,
		},
	});
}
