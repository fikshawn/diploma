import fs from "node:fs/promises";
import path from "node:path";

export async function deleteImage({ data }: { data: { oldImage: string } }) {
	try {
		const imageUrl = data.oldImage;
		const sanitizedFilename = path.basename(imageUrl);
		const uploadDir = path.join(process.cwd(), "uploadedImages", "products");
		const imagePath = path.join(uploadDir, sanitizedFilename);

		//	const imagePath = path.join(process.cwd(), "uploadedImages", cleanPath);

		console.log("Attempting to delete:", imagePath); // For debugging

		// Check if file exists before attempting to delete
		try {
			await fs.access(imagePath);
		} catch {
			return {
				success: false,
				error: "File does not exist",
			};
		}

		// Delete the file
		await fs.unlink(imagePath);

		return { success: true };
	} catch (error) {
		console.error("Error deleting image:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to delete image",
		};
	}
}
