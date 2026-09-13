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
