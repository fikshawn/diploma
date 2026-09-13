import fs from "node:fs/promises";
import path from "node:path";
import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";
import { db, products } from "#/db";
import { deleteImage } from "../imageDelete";
import { slugify } from "../slugify";
import {
	createProductSchema,
	updateProductSchema,
} from "../validators/product";

// create product
export const createProduct = createServerFn({ method: "POST" })
	.validator(createProductSchema)
	.handler(async ({ data }) => {
		const baseSlug = slugify(data.title);
		let finalSlug = baseSlug;
		let counter = 0;
		let isUnique = false;

		// Loop continuously until a completely unique slug is found
		while (!isUnique) {
			const existing = await db.query.products.findFirst({
				where: eq(products.slug, finalSlug),
			});

			if (!existing) {
				isUnique = true;
			} else {
				counter++;
				finalSlug = `${baseSlug}-${counter}`;
			}
		}

		const [product] = await db
			.insert(products)
			.values({
				title: data.title,
				slug: finalSlug,
				metatitle: data.metatitle,
				excerpt: data.excerpt,
				description: data.description,
				image: data.image,
				tags: data.tags,
			})
			.returning();
		return {
			success: true,
			product,
			message: "Product created successfully!",
		};
	});

// get products
export const getProducts = createServerFn({ method: "GET" }).handler(
	async () => {
		const allProducts = await db
			.select()
			.from(products)
			.orderBy(desc(products.createdAt));

		return {
			allProducts,
		};
	},
);

// Delete product
export const deleteProduct = createServerFn({ method: "POST" })
	.validator((data: { id: string }) => data)
	.handler(async ({ data }) => {
		// First, get the product to find its image path
		const product = await db.query.products.findFirst({
			where: eq(products.id, data.id),
		});

		if (!product) {
			return {
				success: false,
				message: "Product not found!",
			};
		}

		// Delete the image file if it exists
		if (product.image) {
			// Adjust this path based on your folder structure
			const imagePath = path.join(
				process.cwd(),
				"./uploadedImages/products/",
				product.image,
			);

			// Check if file exists before deleting
			await fs.access(imagePath);
			await fs.unlink(imagePath);
		}
		// Delete the product from database
		await db.delete(products).where(eq(products.id, data.id));

		return {
			success: true,
			message: "Product deleted successfully!",
		};
	});

export const getProductBySlug = createServerFn({ method: "GET" })
	.validator((data: { slug: string }) => data)
	.handler(async ({ data }) => {
		const product = await db.query.products.findFirst({
			where: eq(products.slug, data.slug),
		});

		return product;
	});

export const updateProductById = createServerFn({ method: "POST" })
	.validator(updateProductSchema)
	.handler(async ({ data }) => {
		const baseSlug = slugify(data.title);
		let finalSlug = baseSlug;
		let counter = 0;
		let isUnique = false;

		// Loop continuously until a completely unique slug is found
		while (!isUnique) {
			const existing = await db.query.products.findFirst({
				where: eq(products.slug, finalSlug),
			});

			if (!existing) {
				isUnique = true;
			} else {
				counter++;
				finalSlug = `${baseSlug}-${counter}`;
			}
		}
		await deleteImage({ data: { oldImage: data.oldImage } });
		const product = await db
			.update(products)
			.set({
				title: data.title,
				slug: finalSlug,
				description: data.description,
				excerpt: data.excerpt,
				metatitle: data.metatitle,
				image: data.image,
				tags: data.tags,
			})
			.where(eq(products.id, data.id))
			.returning();
		return {
			success: true,
			product,
			message: "Product updated successfully",
		};
	});
