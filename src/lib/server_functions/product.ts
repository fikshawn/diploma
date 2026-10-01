import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq, ne } from "drizzle-orm";
import { db, products } from "#/db";
import { deleteImage } from "../imageDelete";
import { buildUniqueSlug } from "../slugify";
import {
	createProductSchema,
	updateProductSchema,
} from "../validators/product";
import { requireAdminMiddleware } from "./auth/guards";

/** Resolves a unique slug, ignoring the row identified by `excludeId`. */
async function uniqueSlugFor(
	title: string,
	excludeId?: string,
): Promise<string> {
	return buildUniqueSlug(title, async (slug) => {
		const conditions = [eq(products.slug, slug)];
		if (excludeId) {
			conditions.push(ne(products.id, excludeId));
		}

		const existing = await db.query.products.findFirst({
			where: and(...conditions),
		});

		return Boolean(existing);
	});
}

// create product
export const createProduct = createServerFn({ method: "POST" })
	.middleware([requireAdminMiddleware])
	.validator(createProductSchema)
	.handler(async ({ data }) => {
		const finalSlug = await uniqueSlugFor(data.title);

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
	.middleware([requireAdminMiddleware])
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

		// Remove the image file if it exists. A missing file must not block the
		// row deletion — the orphan cleanup is best-effort, the delete is not.
		if (product.image) {
			await deleteImage({ data: { oldImage: product.image } });
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
	.middleware([requireAdminMiddleware])
	.validator(updateProductSchema)
	.handler(async ({ data }) => {
		const finalSlug = await uniqueSlugFor(data.title, data.id);

		const existing = await db.query.products.findFirst({
			where: eq(products.id, data.id),
		});

		if (!existing) {
			return {
				success: false,
				product: undefined,
				message: "Product not found!",
			};
		}

		// Only discard the previous file when the image actually changes.
		// Deleting unconditionally wiped the file a title-only edit still points at.
		if (data.oldImage && data.oldImage !== data.image) {
			await deleteImage({ data: { oldImage: data.oldImage } });
		}

		const [product] = await db
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
