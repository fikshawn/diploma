import path from "node:path";
import { describe, expect, it } from "vitest";
import { resolveAssetPath } from "./download-handler";

const ASSET_DIR = path.join("/srv", "app", "public", "assets");

describe("resolveAssetPath", () => {
	it("resolves a plain filename inside the asset dir", () => {
		expect(resolveAssetPath("Diploma-bestelformulier.xlsx", ASSET_DIR)).toBe(
			path.join(ASSET_DIR, "Diploma-bestelformulier.xlsx"),
		);
	});

	// These are the attempts the guard exists to stop.
	const traversals = [
		"../../etc/passwd",
		"../secret.txt",
		"nested/child.xlsx",
		"/etc/passwd",
		"..",
		".",
		"",
	];

	for (const attempt of traversals) {
		it(`rejects ${JSON.stringify(attempt)}`, () => {
			expect(() => resolveAssetPath(attempt, ASSET_DIR)).toThrow(
				/Invalid filename/,
			);
		});
	}

	// A null byte survives `basename` unchanged, so it passes the path guard —
	// but it cannot escape `assetDir`, and `fs.readFileSync` rejects the path
	// with ERR_INVALID_ARG_VALUE, which the handler reports as "File not found".
	it("cannot use a null byte to escape the asset dir", () => {
		const attempt = "ok.xlsx\u0000.png";
		let resolved: string | undefined;

		try {
			resolved = resolveAssetPath(attempt, ASSET_DIR);
		} catch {
			// Rejected by the guard outright, which is also fine.
			return;
		}

		expect(path.dirname(resolved as string)).toBe(ASSET_DIR);
	});
});
