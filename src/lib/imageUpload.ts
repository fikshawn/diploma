import { mkdir, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { createServerFn } from "@tanstack/react-start";

export const uploadImage = createServerFn({
	method: "POST",
})
	.validator(async (formData: FormData) => {
		if (!(formData instanceof FormData)) {
			throw new Error("Invalid payload format");
		}
		const image = formData.get("image") as File | null;
		if (!image || image.size === 0) {
			throw new Error("An image file is required");
		}

		const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
		if (!allowedTypes.includes(image.type)) {
			throw new Error("Invalid image format. Allowed: JPEG, PNG, WEBP.");
		}
		if (image.size > 5 * 1024 * 1024) {
			throw new Error("Image size must be under 5MB");
		}

		return {
			arrayBuffer: await image.arrayBuffer(),
			originalName: image.name,
		};
	})
	.handler(async ({ data }) => {
		const buffer = Buffer.from(data.arrayBuffer);

		// Securely extract the file extension using node:path to prevent injection attacks
		const fileExt = extname(data.originalName).toLowerCase() || ".png";
		const filename = `${Date.now()}-${crypto.randomUUID()}${fileExt}`;

		const uploadDir = join(
			process.cwd(),
			"public",
			"uploadedImages",
			"products",
		);
		await mkdir(uploadDir, { recursive: true });
		await writeFile(join(uploadDir, filename), buffer);

		return {
			success: true,
			imageUrl: filename,
			message: "Image uploaded successfully!",
		};
	});
