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
		const hasValidImage = image && image.size > 0;
		if (hasValidImage) {
			const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
			if (!allowedTypes.includes(image.type)) {
				throw new Error("Invalid image format. Allowed: JPEG, PNG, WEBP.");
			}
			if (image.size > 5 * 1024 * 1024) {
				throw new Error("Image size must be under 5MB");
			}
		}

		return {
			imagePayload: hasValidImage
				? {
						arrayBuffer: await image.arrayBuffer(),
						originalName: image.name,
					}
				: null,
		};
	})
	.handler(async ({ data }) => {
		const { imagePayload } = data;
		let imageUrl: string | null = null;
		// Process and store the image securely if it exists
		if (imagePayload) {
			const buffer = Buffer.from(imagePayload.arrayBuffer);

			// Securely extract the file extension using node:path to prevent injection attacks
			const fileExt =
				extname(imagePayload.originalName).toLowerCase() || ".png";
			const filename = `${Date.now()}-${crypto.randomUUID()}${fileExt}`;

			const uploadDir = join(process.cwd(), "./uploadedImages/products");
			await mkdir(uploadDir, { recursive: true });
			await writeFile(join(uploadDir, filename), buffer);

			imageUrl = `${filename}`;
		}
		return {
			success: true,
			imageUrl,
			message: "Image uploaded successfully!",
		};
	});
