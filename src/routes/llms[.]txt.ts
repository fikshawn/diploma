// src/routes/llms[.]txt.ts
import { createFileRoute } from "@tanstack/react-router";
import { getProducts } from "#/lib/server_functions/product";
import { SITE_URL as host } from "#/lib/site";

export const Route = createFileRoute("/llms.txt")({
	server: {
		handlers: {
			GET: async () => {
				const { allProducts } = await getProducts();

				const productList = allProducts
					.map(
						(product) =>
							`- [${product.title}](${host}/products/${product.slug}): ${product.excerpt}`,
					)
					.join("\n");

				const content = `# Certificaat Kopen

> Certificaat Kopen (certificaatkopen.com) is een Nederlandse webshop waar je
> online certificaten en diploma's bestelt, waaronder VWO, HAVO, MBO, HBO, VCA
> en academische diploma's. Bestelproces: download het bestelformulier op de
> productpagina, vul je gegevens in en stuur het op. Levering duurt 3-5 werkdagen
> voor een digitale kopie en 7-14 werkdagen voor een fysieke kopie.

## Pagina's
- Home: ${host}/
- FAQ: ${host}/faq

## Producten
${productList}

## Contact
- Website: ${host}/
- E-mail: support@certificaatkopen.com
- Telegram: https://t.me/Cornelisjansen
`;

				return new Response(content, {
					headers: {
						"Content-Type": "text/plain; charset=utf-8",
					},
				});
			},
		},
	},
});
