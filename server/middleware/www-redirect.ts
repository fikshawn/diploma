import { defineEventHandler } from "h3";

const WWW_HOST = "www.certificaatkopen.com";
const BARE_HOST = "certificaatkopen.com";

export default defineEventHandler((event) => {
	const host = event.node.req.headers.host ?? "";
	if (host !== BARE_HOST) return;
	const url = new URL(event.path ?? "/", `https://${WWW_HOST}`);
	return new Response(null, {
		status: 301,
		headers: {
			location: url.toString(),
			"cache-control": "max-age=3600",
		},
	});
});