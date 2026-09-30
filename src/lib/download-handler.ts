import fs from "node:fs";
import path from "node:path";
import { createServerFn } from "@tanstack/react-start";

export const fetchSmallFile = createServerFn({ method: "GET" })
	.validator((data: { filename: string }) => data)
	.handler(async ({ data }) => {
		const filename = data.filename;

		// Strip any directory components so traversal attempts ("../../etc/passwd")
		// collapse to a bare filename inside public/assets.
		const sanitizedFilename = path.basename(filename);
		if (!sanitizedFilename || sanitizedFilename !== filename) {
			throw new Error("Invalid filename");
		}

		const assetDir = path.join(process.cwd(), "public", "assets");
		const filePath = path.join(assetDir, sanitizedFilename);
		if (path.dirname(filePath) !== assetDir) {
			throw new Error("Invalid filename");
		}

		let fileBase64: string;
		try {
			// Read the binary file directly into a base64 string
			fileBase64 = fs.readFileSync(filePath, { encoding: "base64" });
		} catch {
			throw new Error("File not found");
		}

		return {
			filename: sanitizedFilename,
			payload: fileBase64,
		};
	});
