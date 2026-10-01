import fs from "node:fs";
import path from "node:path";
import { createServerFn } from "@tanstack/react-start";

/**
 * Resolves a caller-supplied filename to an absolute path inside `assetDir`,
 * rejecting anything that would escape it.
 *
 * `path.basename` collapses traversal attempts ("../../etc/passwd") to a bare
 * name; requiring `basename(filename) === filename` rejects them outright
 * rather than silently serving an unexpected file.
 *
 * Extracted from the server function so the guard is unit-testable.
 */
export function resolveAssetPath(filename: string, assetDir: string): string {
	const sanitizedFilename = path.basename(filename);
	if (!sanitizedFilename || sanitizedFilename !== filename) {
		throw new Error("Invalid filename");
	}

	const filePath = path.join(assetDir, sanitizedFilename);
	if (path.dirname(filePath) !== assetDir) {
		throw new Error("Invalid filename");
	}

	return filePath;
}

export const fetchSmallFile = createServerFn({ method: "GET" })
	.validator((data: { filename: string }) => data)
	.handler(async ({ data }) => {
		const assetDir = path.join(process.cwd(), "public", "assets");
		const filePath = resolveAssetPath(data.filename, assetDir);

		let fileBase64: string;
		try {
			// Read the binary file directly into a base64 string
			fileBase64 = fs.readFileSync(filePath, { encoding: "base64" });
		} catch {
			throw new Error("File not found");
		}

		return {
			filename: path.basename(data.filename),
			payload: fileBase64,
		};
	});
