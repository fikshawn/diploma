import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import {
	ChevronRight,
	CircleCheck,
	Download,
	TextAlignStart,
	Truck,
} from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import { fetchSmallFile } from "#/lib/download-handler";
import { getProductBySlug } from "#/lib/server_functions/product";

export const Route = createFileRoute("/products/$productSlug")({
	loader: async ({ params }) => {
		const product = await getProductBySlug({
			data: { slug: params.productSlug },
		});

		// An unknown slug must 404. Falling through rendered an empty page with
		// "Default Title" meta, giving crawlers an unlimited pool of thin URLs.
		if (!product) {
			throw notFound();
		}

		return product;
	},
	head: ({ loaderData }) => {
		// Absent only while the loader is pending or after it threw notFound(),
		// so these fallbacks are never what a crawler sees.
		if (!loaderData) {
			return {};
		}

		return {
			meta: [
				{ title: loaderData.metatitle },
				{
					name: "description",
					content: loaderData.excerpt,
				},
				{
					name: "keywords",
					content: loaderData.tags.length
						? loaderData.tags.join(", ")
						: loaderData.metatitle,
				},
				// Open Graph
				{ property: "og:title", content: loaderData.metatitle },
				{ property: "og:description", content: loaderData.excerpt },
				{
					property: "og:url",
					content: `https://certificaatkopen.com/products/${loaderData.slug}`,
				},
				{ property: "og:type", content: "website" },
				{ property: "og:site_name", content: "Diploma Kopen" },
				{
					property: "og:image",
					content: loaderData.image
						? `https://certificaatkopen.com/uploadedImages/products/${loaderData.image}`
						: "https://certificaatkopen.com/logo.png",
				},
				// Twitter Card
				{ name: "twitter:card", content: "summary_large_image" },
				{ name: "twitter:title", content: loaderData.metatitle },
				{ name: "twitter:description", content: loaderData.excerpt },
				{
					name: "twitter:image",
					content: loaderData.image
						? `https://certificaatkopen.com/uploadedImages/products/${loaderData.image}`
						: "https://certificaatkopen.com/logo.png",
				},
			],
			links: [
				{
					rel: "canonical",
					href: `https://certificaatkopen.com/products/${loaderData.slug}`,
				},
			],
			scripts: [
				{
					type: "application/ld+json",
					children: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "BreadcrumbList",
						itemListElement: [
							{
								"@type": "ListItem",
								position: 1,
								name: "Home",
								item: "/",
							},
							{
								"@type": "ListItem",
								position: 2,
								name: loaderData.title,
							},
						],
					}),
				},
			],
		};
	},
	component: RouteComponent,
});

function RouteComponent() {
	const [showMore, setShowMore] = useState(false);

	const product = Route.useLoaderData();

	const toggleShowMore = () => {
		setShowMore(!showMore);
	};

	const triggerDownload = async ({ filename }: { filename: string }) => {
		try {
			// 1. Pull the small payload directly from the server function
			const fileData = await fetchSmallFile({ data: { filename } });

			// 2. Synthesize a direct download URI
			const downloadUri = `data:application/octet-stream;base64,${fileData.payload}`;

			// 3. Programmatically force the browser to trigger a download window
			const dummyAnchor = document.createElement("a");
			dummyAnchor.href = downloadUri;
			dummyAnchor.download = fileData.filename;

			document.body.appendChild(dummyAnchor);
			dummyAnchor.click();

			// 4. Clean up the DOM
			document.body.removeChild(dummyAnchor);
		} catch (err) {
			console.error("KB file download failure:", err);
		}
	};
	return (
		<div>
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
				<div className="flex items-center gap-2 text-gray-500 mb-6">
					<Link to="/" className="hover:text-indigo-500 transition">
						Home
					</Link>
					<ChevronRight size={16} />
					<span className="text-indigo-600 font-medium">{product.title}</span>
				</div>

				<section className="bg-gray-100 p-6 rounded-2xl">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
						<div className="doc-image rounded-3xl overflow-hidden border border-white/50 flex items-center justify-center relative">
							{product.image ? (
								<Image
									src={`/uploadedImages/products/${product.image}`}
									alt="Gebruikersavatar"
									width={600}
									height={400}
									layout="constrained"
									className="max-w-lg"
								/>
							) : (
								<div className="w-full h-full bg-gray-200 flex items-center justify-center">
									Geen afbeelding beschikbaar
								</div>
							)}
						</div>

						<div className="product-card rounded-3xl px-6 sm:px-8">
							<h1 className="text-2xl sm:text-3xl font-bold text-slate-800 leading-tight">
								{product.title}
								<span className="block text-sm font-normal text-indigo-500 mt-1">
									Realistisch · Compatibel · Premium afwerking
								</span>
							</h1>

							<div className="mt-5">
								<h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
									<TextAlignStart size={16} /> Beschrijving
								</h3>
								<p className="text-slate-600 leading-relaxed mt-1.5">
									{product.excerpt}
								</p>
								<Button onClick={toggleShowMore} className="cursor-pointer">
									{showMore === true ? (
										<span className="text-slate-600 italic">
											Minder informatie
										</span>
									) : (
										<span className="text-slate-600 italic">
											Meer weergeven...
										</span>
									)}
								</Button>
								{showMore && (
									<div>
										<p className="text-slate-600 leading-relaxed mt-1.5">
											{product.description}
										</p>
									</div>
								)}
							</div>

							<div className="mt-5 grid grid-cols-2 gap-y-2 text-sm">
								<div className="flex items-center gap-2 text-slate-600">
									<CircleCheck className="text-green-500" />{" "}
									<span>Scanbaar</span>
								</div>
								<div className="flex items-center gap-2 text-slate-600">
									<CircleCheck className="text-green-500" />{" "}
									<span>UV hologram</span>
								</div>
								<div className="flex items-center gap-2 text-slate-600">
									<CircleCheck className="text-green-500" />{" "}
									<span>Premium laminaat</span>
								</div>
								<div className="flex items-center gap-2 text-slate-600">
									<CircleCheck className="text-green-500" />{" "}
									<span>Aangepaste handtekening</span>
								</div>
							</div>

							<div className="divider h-px my-5"></div>

							<div className="mt-5 mb-4 flex flex-wrap items-center justify-between text-sm text-slate-500 gap-2">
								<span className="flex items-center gap-1.5">
									<CircleCheck /> Op voorraad · klaar om te verzenden
								</span>
								<span className="flex items-center gap-1.5">
									<Truck /> Levering · 3–5 dagen
								</span>
							</div>
							<section className="border border-gray-300 rounded-2xl p-4 mt-10">
								<h1 className="text-blue-500 mb-4 font-semibold text-2xl">
									Bestelformulier Download
								</h1>
								<div className="">
									<Button
										type="button"
										onClick={() =>
											triggerDownload({
												filename: "Diploma-bestelformulier.xlsx",
											})
										}
										className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
									>
										<Download size={16} /> "Diploma-bestelformulier.xlsx"
									</Button>
								</div>
							</section>
						</div>
					</div>
				</section>

				<section className="mt-16">
					<h2 className="text-3xl font-semibold text-blue-600 mb-3">
						Bestelproces
					</h2>

					<div className="bg-white/80 backdrop-blur-sm rounded border border-slate-200/60 p-4 hover:shadow-md transition">
						<div className="grid grid-cols-2 md:grid-cols-3 gap-4"></div>
						<ol className="list-decimal list-inside space-y-3">
							<li className="px-3 py-1 bg-gray-200">
								Download het vereiste bestelformulier, vul uw gegevens in en
								stuur het naar ons.
							</li>
							<li className="px-3 py-1 bg-gray-200">
								Betaal 50% als aanbetaling
							</li>
							<li className="px-3 py-1 bg-gray-200">
								Ontwerp elektronische concepten (digitale kopie).
							</li>
							<li className="px-3 py-1 bg-gray-200">
								Bevestig inhoudsinformatie.
							</li>
							<li className="px-3 py-1 bg-gray-200">
								Betaal de resterende 50% saldo.
							</li>
							<li className="px-3 py-1 bg-gray-200">
								{" "}
								Productie printen van producten (fysieke kopie).
							</li>
							<li className="px-3 py-1 bg-gray-200">
								Verpakken en expres verzenden.
							</li>
						</ol>
					</div>
				</section>
			</main>
		</div>
	);
}
