import { describe, expect, it } from "vitest";
import { buildUniqueSlug, slugify } from "./slugify";

describe("slugify", () => {
	it("lowercases and dash-separates", () => {
		expect(slugify("HAVO Diploma")).toBe("havo-diploma");
	});

	// NFD handles combining marks ("é" -> "e") but not standalone letters
	// like "ø", which is dropped rather than transliterated. Documented as a
	// known limitation; fix is a transliteration table in src/lib/slugify.ts.
	it("strips combining accents", () => {
		expect(slugify("Café Certificaten")).toBe("cafe-certificaten");
	});

	it("drops ø rather than transliterating it to o", () => {
		expect(slugify("Køpen")).toBe("kpen");
	});

	it("collapses whitespace and dashes", () => {
		expect(slugify("  VWO   -   2024  ")).toBe("vwo-2024");
	});

	it("drops punctuation", () => {
		expect(slugify("MBO-diploma (niveau 1 t/m 4)!")).toBe(
			"mbo-diploma-niveau-1-tm-4",
		);
	});
});

describe("buildUniqueSlug", () => {
	it("returns the base slug when free", async () => {
		const slug = await buildUniqueSlug("VCA-diploma", async () => false);
		expect(slug).toBe("vca-diploma");
	});

	it("appends a counter when the base is taken", async () => {
		const slug = await buildUniqueSlug(
			"VCA-diploma",
			async (candidate) => candidate === "vca-diploma",
		);
		expect(slug).toBe("vca-diploma-1");
	});

	it("keeps incrementing past multiple collisions", async () => {
		const taken = new Set(["havo-diploma", "havo-diploma-1"]);
		const slug = await buildUniqueSlug("HAVO-diploma", async (candidate) =>
			taken.has(candidate),
		);
		expect(slug).toBe("havo-diploma-2");
	});

	// This is the regression that produced the existing "havo-diploma-1",
	// "vca-diploma-1" slugs: the caller's own row was never excluded, so an
	// edit bumped the slug and broke the public URL.
	it("keeps the slug stable when the caller excludes its own row", async () => {
		const existing = new Map([
			["id-1", "havo-diploma"],
			["id-2", "mbo-diploma-kopen-1"],
		]);
		const selfId = "id-1";

		const slug = await buildUniqueSlug("HAVO-diploma", async (candidate) =>
			[...existing.entries()].some(
				([id, slugValue]) => id !== selfId && slugValue === candidate,
			),
		);

		expect(slug).toBe("havo-diploma");
	});

	it("throws rather than looping forever", async () => {
		await expect(
			buildUniqueSlug("Always Taken", async () => true),
		).rejects.toThrow(/unique slug/i);
	});
});
