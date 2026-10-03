import { defineMiddleware } from "h3";
import { Readable } from "node:stream";
import { constants, createBrotliCompress, createGzip } from "node:zlib";

/**
 * Text-ish payloads only. Images, video and woff2 are already compressed, so
 * running them through zlib costs CPU and returns a larger body.
 */
const COMPRESSIBLE_TYPE =
	/^(?:text\/|application\/(?:json|javascript|ecmascript|xml|xhtml\+xml|rss\+xml|atom\+xml|manifest\+json|ld\+json|graphql)|image\/svg\+xml)/i;

/** Statuses that must not carry a body, so there is nothing to compress. */
const BODYLESS_STATUS = new Set([204, 205, 304]);

type Encoding = "br" | "gzip";

/** The encodings the client accepts at q > 0. */
function acceptedEncodings(header: string | null): Set<Encoding> {
	const accepted = new Set<Encoding>();
	if (!header) return accepted;

	for (const part of header.split(",")) {
		const [rawName, ...params] = part.split(";");
		const name = rawName?.trim().toLowerCase();
		if (name !== "br" && name !== "gzip") continue;

		// An absent or unparsable q means q=1; only an explicit q=0 rejects.
		let q = 1;
		for (const param of params) {
			const match = /^\s*q\s*=\s*([\d.]+)\s*$/i.exec(param);
			if (!match) continue;
			const parsed = Number.parseFloat(match[1] ?? "");
			if (!Number.isNaN(parsed)) q = parsed;
		}
		if (q > 0) accepted.add(name);
	}

	return accepted;
}

/**
 * Compresses through the zlib streams rather than `CompressionStream`, which
 * has no Brotli format — only the Node streams do.
 */
function compress(
	body: ReadableStream<Uint8Array>,
	encoding: Encoding,
): ReadableStream<Uint8Array> {
	const source = Readable.fromWeb(body as Parameters<typeof Readable.fromWeb>[0]);

	const sink =
		encoding === "br"
			? createBrotliCompress({
					params: {
						[constants.BROTLI_PARAM_MODE]: constants.BROTLI_MODE_TEXT,
						// 4 is the usual speed/ratio knee. Higher buys a few percent
						// of transfer for real TTFB on every server-rendered page.
						[constants.BROTLI_PARAM_QUALITY]: 4,
					},
				})
			: createGzip({ level: 6 });

	return Readable.toWeb(source.pipe(sink)) as ReadableStream<Uint8Array>;
}

function appendVary(headers: Headers, value: string) {
	const current = headers.get("Vary");
	if (!current) {
		headers.set("Vary", value);
		return;
	}
	const tokens = current.split(",").map((token) => token.trim().toLowerCase());
	if (!tokens.includes(value.toLowerCase())) {
		headers.set("Vary", `${current}, ${value}`);
	}
}

/**
 * Compresses server-rendered responses.
 *
 * Nitro precompresses static assets and prerendered routes via the
 * `compressPublicAssets` build option, so those already carry a
 * `Content-Encoding` and are skipped here. What is left is the HTML produced
 * per request from the database — `/`, `/products/*` — which is the bulk of the
 * HTML a crawler downloads and was going out uncompressed.
 */
export default defineMiddleware(async (event, next) => {
	const result = await next();

	// Nitro's asset handler returns raw bytes and writes its own headers, so
	// anything that is not a Response has already been dealt with.
	if (!(result instanceof Response)) return result;

	const accepted = acceptedEncodings(
		event.req.headers.get("accept-encoding"),
	);
	const type = result.headers.get("Content-Type") ?? "";

	if (
		accepted.size === 0 ||
		result.headers.has("Content-Encoding") ||
		result.headers.has("Content-Range") ||
		!COMPRESSIBLE_TYPE.test(type)
	) {
		return result;
	}

	// Copied rather than mutated: a Response that came from `fetch()` has
	// immutable headers and `set` would throw.
	const headers = new Headers(result.headers);

	// `Vary` has to be set whether or not this response ends up compressed, or
	// a shared cache will hand a brotli body to a client that only accepts gzip.
	appendVary(headers, "Accept-Encoding");

	if (
		!result.body ||
		BODYLESS_STATUS.has(result.status) ||
		event.req.method === "HEAD"
	) {
		return new Response(result.body, {
			status: result.status,
			statusText: result.statusText,
			headers,
		});
	}

	const encoding: Encoding = accepted.has("br") ? "br" : "gzip";

	// The compressed length is unknown until the last byte is written, so any
	// advertised length would be wrong.
	headers.delete("Content-Length");
	headers.set("Content-Encoding", encoding);

	return new Response(compress(result.body, encoding), {
		status: result.status,
		statusText: result.statusText,
		headers,
	});
});
