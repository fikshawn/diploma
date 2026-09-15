import { readFile } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import { createFileRoute } from "@tanstack/react-router";

const MIME_TYPES: Record<string, string> = {
	".jpeg": "image/jpeg",
	".jpg": "image/jpeg",
	".png": "image/png",
	".webp": "image/webp",
	".gif": "image/gif",
	".svg": "image/svg+xml",
};

export const Route = createFileRoute("/uploadedImages/products/$")({
	server: {
		handlers: {
			GET: async ({ params }) => {
				const filename = basename(params._splat);
				const imagePath = join(
					process.cwd(),
					"public",
					"uploadedImages",
					"products",
					filename,
				);

				let image: Buffer;
				try {
					image = await readFile(imagePath);
				} catch {
					return new Response("Not found", { status: 404 });
				}

				const contentType =
					MIME_TYPES[extname(filename).toLowerCase()] ??
					"application/octet-stream";

				return new Response(image, {
					headers: {
						"Content-Type": contentType,
					},
				});
			},
		},
	},
});
