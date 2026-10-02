import { createFileRoute, Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { CircleCheck } from "lucide-react";
import { getProducts } from "#/lib/server_functions/product";
import { SITE_URL } from "#/lib/site";

export const Route = createFileRoute("/")({
	loader: async () => {
		const products = await getProducts();
		return products;
	},
	head: ({ loaderData }) => ({
		links: [
			{
				rel: "canonical",
				href: SITE_URL,
			},
		],
		scripts: [
			{
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "ItemList",
					name: "Beschikbare Diplomas",
					itemListElement: (loaderData?.allProducts ?? []).map(
						(product, index) => ({
							"@type": "ListItem",
							position: index + 1,
							name: product.title,
							image: `${SITE_URL}/uploadedImages/products/${product.image}`,
							url: `${SITE_URL}/products/${product.slug}`,
							description: product.excerpt,
						}),
					),
				}),
			},
		],
	}),
	component: Home,
});

function Home() {
	const products = Route.useLoaderData();
	return (
		<div>
			<section className="relative bg-slate-800 text-white overflow-hidden">
				<div className="absolute inset-0 opacity-20 bg-[url('/netherland-bachelor-degree.png')] bg-cover bg-center md:bg-contain mix-blend-overlay"></div>
				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
					<div className="max-w-2xl">
						<h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
							Koop certificatten <br />
							<span className="text-indigo-300">voor uw toekomst</span>
						</h1>
						<p className="mt-4 text-slate-200 text-lg max-w-lg">
							Blader door onze gecureerde collectie geverifieerde documenten —
							inclusief VWO, HAVO, HBO, VCA, tot academische diploma's.
						</p>
					</div>

					<div className="hidden lg:block absolute bottom-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3 text-sm">
						<div className="flex items-center gap-3">
							<CircleCheck />
							<div>
								<span className="font-bold">100%</span>{" "}
								<span className="text-slate-200">geverifieerd</span>
							</div>
						</div>
					</div>
				</div>
			</section>
			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<div className="flex items-center justify-between mb-3">
					<div>
						<h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-1">
							Beschikbare Diplomas
						</h2>
					</div>
				</div>
				{products.allProducts.map((product) => (
					<div
						key={product.id}
						className="p-4 border border-gray-300 rounded-2xl shadow-lg mb-3"
					>
						<div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
							<div className="rounded bg-gray-300 w-full aspect-square">
								<Image
									src={`/uploadedImages/products/${product.image}`}
									alt={product.title}
									width={400}
									height={300}
									layout="constrained"
									className="w-full h-full object-cover"
								/>
							</div>
							<div className="rounded lg:col-span-2 p-4">
								<Link
									params={{ productSlug: product.slug }}
									to="/products/$productSlug"
									className="text-2xl font-semibold text-red-500 hover:underline mb-3"
								>
									{product.title}
								</Link>
								<p className="mb-4 text-indigo-600"> {product.excerpt} </p>
								<Link
									params={{ productSlug: product.slug }}
									to="/products/$productSlug"
									className="px-3 py-1.5 rounded bg-indigo-600 text-white"
								>
									Lees meer...
								</Link>
							</div>
						</div>
					</div>
				))}
			</section>
		</div>
	);
}
