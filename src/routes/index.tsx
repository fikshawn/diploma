import { createFileRoute, Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { CircleCheck, Star } from "lucide-react";
import { getProducts } from "#/lib/server_functions/product";
import { SITE_URL } from "#/lib/site";

const RATING = 5;
const STAR_SLOTS = Array.from({ length: RATING }, (_, slot) => slot + 1);

/**
 * Static search terms shown at the foot of the page. Deliberately plain text
 * rather than links: there are no per-keyword landing pages to point at, and a
 * link to a missing route would be a broken link, which is worse for crawling
 * than an unlinked term.
 */
const KEYWORD_TAGS = [
	"diploma kopen",
	"MBO diploma kopen",
	"VCA diploma kopen",
	"HAVO diploma replica",
	"certificaat kopen online",
];

/**
 * The five stars are decoration, so the group carries the accessible name and
 * each icon is hidden from assistive tech. Giving every icon its own <title>
 * would announce the rating five times.
 */
function StarRating() {
	return (
		<div
			className="flex items-center mb-4"
			role="img"
			aria-label={`${RATING} van ${RATING} sterren`}
		>
			{STAR_SLOTS.map((slot) => (
				<Star key={slot} className="w-5 h-5 text-yellow-400 fill-current" />
			))}
		</div>
	);
}

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

			<section className="bg-gray-50 py-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold text-slate-800">
							Wat onze klanten zeggen
						</h2>
						<p className="mt-4 text-slate-600 text-lg">
							Echte reviews van tevreden klanten
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
							<StarRating />
							<p className="text-slate-700 mb-6 italic">
								"Snel en professioneel! Mijn diploma werd binnen 24 uur geleverd
								en ziet er perfect uit. Zeer tevreden!"
							</p>
							<div className="font-semibold text-slate-800">- Jan M.</div>
							<div className="text-sm text-slate-500">Amsterdam</div>
						</div>

						<div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
							<StarRating />
							<p className="text-slate-700 mb-6 italic">
								"Uitstekende service! Alles verliep soepel en discreet. Kan ik
								zeker aanraden aan anderen."
							</p>
							<div className="font-semibold text-slate-800">- Sarah V.</div>
							<div className="text-sm text-slate-500">Rotterdam</div>
						</div>

						<div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
							<StarRating />
							<p className="text-slate-700 mb-6 italic">
								"Betrouwbaar en snel. De kwaliteit is top en de communicatie was
								heel duidelijk. 5 sterren!"
							</p>
							<div className="font-semibold text-slate-800">- Mike R.</div>
							<div className="text-sm text-slate-500">Utrecht</div>
						</div>
					</div>
				</div>
			</section>

			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold text-slate-800">
						Overzicht van Diplomas
					</h2>
					<p className="mt-4 text-slate-600 text-lg">
						Informatie over de verschillende diploma's
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<a
						href="https://nl.wikipedia.org/wiki/Voorbereidend_wetenschappelijk_onderwijs"
						target="_blank"
						rel="noopener noreferrer"
						className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow hover:bg-gray-100"
					>
						<h3 className="text-lg font-semibold text-slate-800 mb-2">VWO</h3>
						<p className="text-slate-600 text-sm">
							Voorbereidend Wetenschappelijk Onderwijs
						</p>
					</a>
					<a
						href="https://nl.wikipedia.org/wiki/Hoger_algemeen_voortgezet_onderwijs"
						target="_blank"
						rel="noopener noreferrer"
						className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow hover:bg-gray-100"
					>
						<h3 className="text-lg font-semibold text-slate-800 mb-2">HAVO</h3>
						<p className="text-slate-600 text-sm">
							Hoger Algemeen Voortgezet Onderwijs
						</p>
					</a>
					<a
						href="https://nl.wikipedia.org/wiki/Middelbaar_beroepsonderwijs"
						target="_blank"
						rel="noopener noreferrer"
						className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow hover:bg-gray-100"
					>
						<h3 className="text-lg font-semibold text-slate-800 mb-2">MBO</h3>
						<p className="text-slate-600 text-sm">
							Middelbaar Beroepsonderwijs
						</p>
					</a>
					<a
						href="https://nl.wikipedia.org/wiki/Hoger_beroepsonderwijs"
						target="_blank"
						rel="noopener noreferrer"
						className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow hover:bg-gray-100"
					>
						<h3 className="text-lg font-semibold text-slate-800 mb-2">HBO</h3>
						<p className="text-slate-600 text-sm">Hoger Beroepsonderwijs</p>
					</a>
					<a
						href="https://nl.wikipedia.org/wiki/Wetenschappelijk_onderwijs"
						target="_blank"
						rel="noopener noreferrer"
						className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow hover:bg-gray-100"
					>
						<h3 className="text-lg font-semibold text-slate-800 mb-2">WO</h3>
						<p className="text-slate-600 text-sm">Wetenschappelijk Onderwijs</p>
					</a>
					<a
						href="https://nl.wikipedia.org/wiki/Bachelor"
						target="_blank"
						rel="noopener noreferrer"
						className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow hover:bg-gray-100"
					>
						<h3 className="text-lg font-semibold text-slate-800 mb-2">
							Bachelor
						</h3>
						<p className="text-slate-600 text-sm">Bachelor Diploma</p>
					</a>
					<a
						href="https://nl.wikipedia.org/wiki/Master_(graad)"
						target="_blank"
						rel="noopener noreferrer"
						className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow hover:bg-gray-100"
					>
						<h3 className="text-lg font-semibold text-slate-800 mb-2">
							Master
						</h3>
						<p className="text-slate-600 text-sm">Master Diploma</p>
					</a>
					<a
						href="https://nl.wikipedia.org/wiki/Propedeuse"
						target="_blank"
						rel="noopener noreferrer"
						className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow hover:bg-gray-100"
					>
						<h3 className="text-lg font-semibold text-slate-800 mb-2">
							Propedeuse
						</h3>
						<p className="text-slate-600 text-sm">Propedeuse Diploma</p>
					</a>
					<a
						href="https://nl.wikipedia.org/wiki/VCA"
						target="_blank"
						rel="noopener noreferrer"
						className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow hover:bg-gray-100"
					>
						<h3 className="text-lg font-semibold text-slate-800 mb-2">VCA</h3>
						<p className="text-slate-600 text-sm">
							Veiligheid, Gezondheid en Milieu (VCA)
						</p>
					</a>
				</div>
			</section>

			<section aria-labelledby="zoektermen" className="bg-slate-800 py-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2
						id="zoektermen"
						className="text-center text-sm font-semibold uppercase tracking-wider text-slate-300"
					>
						Zoektermen
					</h2>
					<ul className="mt-5 flex flex-wrap justify-center gap-2.5">
						{KEYWORD_TAGS.map((tag) => (
							<li
								key={tag}
								className="rounded-full border border-slate-600 px-4 py-1.5 text-sm text-slate-200"
							>
								{tag}
							</li>
						))}
					</ul>
				</div>
			</section>
		</div>
	);
}
