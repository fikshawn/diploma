export function slugify(text: string): string {
	return text
		.toString()
		.toLowerCase()
		.trim()
		.normalize("NFD") // Separate accents from letters
		.replace(/[\u0300-\u036f]/g, "") // Remove accents
		.replace(/[^a-z0-9 -]/g, "") // Remove invalid chars
		.replace(/\s+/g, "-") // Collapse whitespace to a dash
		.replace(/-+/g, "-"); // Collapse multiple dashes
}

/**
 * Builds a slug from `title` that no other row already occupies, appending
 * `-1`, `-2`, ... until `isTaken` reports a free slug.
 *
 * `isTaken` is injected so the collision loop can be tested without a
 * database, and so callers can exclude the row they are updating — without
 * that exclusion every edit renames its own slug and breaks the public URL.
 */
export async function buildUniqueSlug(
	title: string,
	isTaken: (slug: string) => Promise<boolean>,
): Promise<string> {
	const baseSlug = slugify(title);
	let candidate = baseSlug;
	let counter = 0;

	// Bounded so a pathological slug collision set cannot spin forever.
	while (await isTaken(candidate)) {
		counter++;
		if (counter > 1000) {
			throw new Error("Could not generate a unique slug");
		}
		candidate = `${baseSlug}-${counter}`;
	}

	return candidate;
}
