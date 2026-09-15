import { createFileRoute } from "@tanstack/react-router";
import { getProducts } from "#/lib/server_functions/product";

const host = process.env.SITE_URL ?? "https://certificaatkopen.com";

export const Route = createFileRoute("/sitemap.xml")({
	server: {
		handlers: {
			GET: async () => {
				const products = await getProducts();

				const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${host}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${products.allProducts
		.map(
			(product) => `
  <url>
    <loc>${host}/products/${product.slug}</loc>
    <lastmod>${product.updatedAt}</lastmod>
    <changefreq>weekly</changefreq>
  </url>`,
		)
		.join("")}
</urlset>`;

				return new Response(sitemap, {
					headers: {
						"Content-Type": "application/xml",
					},
				});
			},
		},
	},
});
