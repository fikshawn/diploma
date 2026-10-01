import { createFileRoute } from "@tanstack/react-router";
import { getProducts } from "#/lib/server_functions/product";

const host = process.env.SITE_URL ?? "https://certificaatkopen.com";

export const Route = createFileRoute("/sitemap.xml")({
	server: {
		handlers: {
			GET: async () => {
				const { allProducts } = await getProducts();

				// Static routes, newest product first. `/contact-us` was removed in
				// 7d62d59 and is intentionally not listed.
				const staticEntries = [
					{ loc: "/", changefreq: "daily", priority: "1.0" },
					{ loc: "/faq", changefreq: "weekly", priority: "0.8" },
				]
					.map(
						(entry) => `  <url>
    <loc>${host}${entry.loc}</loc>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
					)
					.join("\n");

				const productEntries = allProducts
					.map(
						(product) => `  <url>
    <loc>${host}/products/${product.slug}</loc>
    <lastmod>${new Date(product.updatedAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`,
					)
					.join("\n");

				const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
${productEntries}
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
