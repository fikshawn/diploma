import { defineEventHandler } from "h3";

const HOST = "certificaatkopen.com";

export default defineEventHandler((event) => {
	const host = (event.node?.req.headers.host as string | undefined) ?? "";
	if (host !== `www.${HOST}` && host !== `www.www.${HOST}`) return;
	const url = new URL(event.path ?? "/", `https://${HOST}`);
	return new Response(null, {
		status: 301,
		headers: {
			location: url.toString(),
			"cache-control": "max-age=3600",
		},
	});
});