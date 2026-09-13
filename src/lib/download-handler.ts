import fs from "node:fs";
import path from "node:path";
import { createServerFn } from "@tanstack/react-start";

export const fetchSmallFile = createServerFn({ method: "GET" })
	.validator((data: { filename: string }) => data)
	.handler(async ({ data }) => {
		const filename = data.filename;
		// Locate the file in your project directories
		const filePath = path.join(process.cwd(), "public/assets", filename);

		// Read the binary file directly into a base64 string
		const fileBase64 = fs.readFileSync(filePath, { encoding: "base64" });

		return {
			filename,
			payload: fileBase64,
		};
	});
