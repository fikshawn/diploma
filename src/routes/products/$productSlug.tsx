import { createFileRoute, Link } from "@tanstack/react-router";
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
import { getExternalLinks } from "#/lib/external-links";
import { getProductBySlug, getProducts } from "#/lib/server_functions/product";

export const Route = createFileRoute("/products/$productSlug")({
	loader: async ({ params }) => {
		const product = await getProductBySlug({
			data: { slug: params.productSlug },
		});
		const { allProducts } = await getProducts();
		const relatedProducts = (allProducts ?? [])
			.filter((item) => item.id !== product?.id)
			.slice(0, 4);
		const externalLinks = product ? getExternalLinks(product) : [];
		return { product, relatedProducts, externalLinks };
	},
	head: ({ loaderData }) => ({
		meta: [
			{
				title: loaderData?.product?.metatitle ?? "Default Title",
			},
			{
				name: "description",
				content: loaderData?.product?.excerpt ?? "Default Description",
			},
			{
				name: "keywords",
				content: loaderData?.product?.tags?.length
					? loaderData.product.tags.join(", ")
					: loaderData?.product?.metatitle,
			},
			// Open Graph
			{ property: "og:title", content: loaderData?.product?.metatitle },
			{
				property: "og:description",
				content: loaderData?.product?.excerpt,
			},
			{
				property: "og:url",
				content: `https://certificaatkopen.com/products/${loaderData?.product?.slug}`,
			},
			{ property: "og:type", content: "website" },
			{ property: "og:site_name", content: "Diploma Kopen" },
			{
				property: "og:image",
				content: loaderData?.product?.image
					? `https://certificaatkopen.com/uploadedImages/products/${loaderData.product.image}`
					: "https://certificaatkopen.com/logo.png",
			},
			// Twitter Card
			{ name: "twitter:card", content: "summary_large_image" },
			{
				name: "twitter:title",
				content: loaderData?.product?.metatitle,
			},
			{
				name: "twitter:description",
				content: loaderData?.product?.excerpt,
			},
			{
				name: "twitter:image",
				content: loaderData?.product?.image
					? `https://certificaatkopen.com/uploadedImages/products/${loaderData.product.image}`
					: "https://certificaatkopen.com/logo.png",
			},
		],
		links: [
			{
				rel: "canonical",
				href: `https://certificaatkopen.com/products/${loaderData?.product?.slug}`,
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
							name: loaderData?.product?.title,
						},
					],
				}),
			},
		],
	}),
	component: RouteComponent,
});

function RouteComponent() {
	const [showMore, setShowMore] = useState(false);

	const { product, relatedProducts, externalLinks } = Route.useLoaderData();

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
					<span className="text-indigo-600 font-medium">{product?.title}</span>
				</div>

				<section className="bg-gray-100 p-6 rounded-2xl">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
						<div className="doc-image rounded-3xl overflow-hidden border border-white/50 flex items-center justify-center relative">
							{product?.image ? (
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
								{product?.title}
								<span className="block text-sm font-normal text-indigo-500 mt-1">
									Realistisch · Compatibel · Premium afwerking
								</span>
							</h1>

							<div className="mt-5">
								<h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
									<TextAlignStart size={16} /> Beschrijving
								</h3>
								<p className="text-slate-600 leading-relaxed mt-1.5">
									{product?.excerpt}
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
											{product?.description}
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
					{/* <div className="bg-white/80 backdrop-blur-sm rounded border border-slate-200/60 p-4 hover:shadow-md transition">
							<h2 className="text-3xl font-semibold text-blue-600 mb-3">
								Betaalmethoden
							</h2>
							<div className="space-y-3">
								<div className="flex items-center gap-3">
									<img
										src="https://upload.wikimedia.org/wikipedia/commons/4/46/Bitcoin.svg"
										alt="Bitcoin"
										className="w-8 h-8"
									/>
									<span>Cryptocurrency</span>
								</div>
								<div className="flex items-center gap-3">
									<img
										src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
										alt="PayPal"
										className="w-8 h-8"
									/>
									<span>PayPal</span>
								</div>
								<div className="flex items-center gap-3">
									<span className="text-2xl">💳</span>
									<span>Zelle</span>
								</div>
								<div className="flex items-center gap-3">
									<span className="text-2xl">🏦</span>
									<span>Western Union</span>
								</div>
							</div>
						</div> */}
					{/* <div className="bg-white/80 backdrop-blur-sm rounded border border-slate-200/60 p-4 hover:shadow-md transition">
							<h2 className="text-3xl font-semibold text-blue-600 mb-3">
								Verzendmethoden
							</h2>
							<div className="space-y-3">
								<div className="flex items-center gap-3">
									<span className="text-2xl">🚚</span>
									<span>DHL</span>
								</div>
								<div className="flex items-center gap-3">
									<span className="text-2xl">📦</span>
									<span>FedEx</span>
								</div>
								<div className="flex items-center gap-3">
									<span className="text-2xl">📮</span>
									<span>USPS</span>
								</div>
								<div className="flex items-center gap-3">
									<span className="text-2xl">📧</span>
									<span>PDF mailing (digitale kopie)</span>
								</div>
							</div>
						</div> */}
				</section>

				{relatedProducts.length > 0 && (
					<section className="mt-16">
						<h2 className="text-3xl font-semibold text-blue-600 mb-3">
							Andere diploma's
						</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
							{relatedProducts.map((related) => (
								<Link
									key={related.id}
									to="/products/$productSlug"
									params={{ productSlug: related.slug }}
									className="bg-white rounded-2xl border border-slate-200/70 p-4 hover:shadow-md transition"
								>
									{related.image ? (
										<Image
											src={`/uploadedImages/products/${related.image}`}
											alt={related.title}
											width={300}
											height={200}
											layout="constrained"
											className="w-full h-36 object-cover rounded-lg"
										/>
									) : null}
									<h3 className="font-bold text-slate-800 mt-3">
										{related.title}
									</h3>
									<p className="text-sm text-indigo-600 mt-1">
										{related.excerpt}
									</p>
								</Link>
							))}
						</div>
					</section>
				)}

				{externalLinks.length > 0 && (
					<section className="mt-16">
						<h2 className="text-3xl font-semibold text-blue-600 mb-3">
							Meer informatie
						</h2>
						<p className="text-slate-600 mb-4">
							Betrouwbare bronnen over {product?.title ?? "dit onderwerp"} voor
							verdere achtergrondinformatie.
						</p>
						<ul className="space-y-3">
							{externalLinks.map((source) => (
								<li
									key={source.url}
									className="bg-white rounded-2xl border border-slate-200/70 p-4 hover:shadow-md transition"
								>
									<a
										href={source.url}
										target="_blank"
										rel="noopener noreferrer"
										className="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
									>
										{source.label}
									</a>
									<p className="text-sm text-slate-600 mt-1">
										{source.description}
									</p>
								</li>
							))}
						</ul>
					</section>
				)}

				<section className="mt-16 bg-slate-800 text-white rounded-2xl p-8">
					<div className="flex flex-col md:flex-row items-center justify-between gap-6">
						<div>
							<h2 className="text-2xl font-bold">Heeft u nog vragen?</h2>
							<p className="text-slate-300 mt-1">
								Bekijk onze{" "}
								<Link
									to="/faq"
									className="text-indigo-300 underline hover:text-white transition"
								>
									veelgestelde vragen
								</Link>{" "}
								of{" "}
								<Link
									to="/contact-us"
									className="text-indigo-300 underline hover:text-white transition"
								>
									neem contact met ons op
								</Link>
								. Bekijk ook{" "}
								<Link
									to="/"
									className="text-indigo-300 underline hover:text-white transition"
								>
									alle beschikbare diploma's
								</Link>
								.
							</p>
						</div>
						<Link
							to="/contact-us"
							className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition"
						>
							Bestelformulier downloaden
						</Link>
					</div>
				</section>
			</main>
		</div>
	);
}
