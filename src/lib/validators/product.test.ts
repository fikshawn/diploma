import { describe, expect, it } from "vitest";
import { createProductSchema, updateProductSchema } from "./product";

describe("createProductSchema", () => {
	const valid = {
		title: "HAVO-diploma",
		metatitle: "Koop een HAVO-diploma",
		excerpt: "Een korte samenvatting van het product.",
		description: "Een volledige beschrijving van het product.",
		image: "photo.jpeg",
	};

	it("accepts a complete payload", () => {
		expect(createProductSchema.safeParse(valid).success).toBe(true);
	});

	it("defaults tags to an empty array", () => {
		const result = createProductSchema.parse(valid);
		expect(result.tags).toEqual([]);
	});

	it("rejects a missing title", () => {
		const result = createProductSchema.safeParse({ ...valid, title: "" });
		expect(result.success).toBe(false);
	});

	it("rejects a blank metatitle", () => {
		const result = createProductSchema.safeParse({ ...valid, metatitle: "" });
		expect(result.success).toBe(false);
	});

	it("rejects non-string tags", () => {
		const result = createProductSchema.safeParse({ ...valid, tags: "a,b" });
		expect(result.success).toBe(false);
	});
});

describe("updateProductSchema", () => {
	const valid = {
		id: "af5d7949-def2-46a8-a346-98ef2f0ae972",
		title: "VCA-diploma",
		metatitle: "Koop een VCA-diploma",
		excerpt: "Een korte samenvatting van het product.",
		description: "Een volledige beschrijving van het product.",
		image: "new-photo.jpeg",
		oldImage: "old-photo.jpeg",
	};

	it("accepts a complete payload", () => {
		expect(updateProductSchema.safeParse(valid).success).toBe(true);
	});

	it("requires an id", () => {
		const result = updateProductSchema.safeParse({ ...valid, id: "" });
		expect(result.success).toBe(false);
	});

	// The old image must survive a title-only edit; the handler compares the
	// two fields before deleting anything.
	it("carries oldImage through for the delete guard", () => {
		const result = updateProductSchema.parse(valid);
		expect(result.oldImage).toBe("old-photo.jpeg");
		expect(result.image).toBe("new-photo.jpeg");
	});
});
