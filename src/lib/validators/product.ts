import { z } from "zod";

export const createProductSchema = z.object({
	title: z.string().min(1, "Name is required"),
	metatitle: z.string().min(1, "Meta title is required"),
	excerpt: z.string().min(1, "Excerpt is required"),
	description: z.string().min(1, "Description is required"),
	image: z.string(),
	tags: z.array(z.string()).default([]),
});

export const getProductSchema = z.object({
	slug: z.string(),
});

export const updateProductSchema = z.object({
	id: z.string().min(1, "ID is required"),
	title: z.string().min(1, "Title is required"),
	image: z.string(),
	excerpt: z.string().min(1, "Excerpt is required"),
	metatitle: z.string().min(1, "Meta title is required"),
	description: z.string().min(1, "Description is required"),
	oldImage: z.string(),
	tags: z.array(z.string()).default([]),
});
