import { createFileRoute } from "@tanstack/react-router";
import {
	Award,
	ChevronDown,
	CircleQuestionMark,
	Headset,
	MailPlus,
	ShieldCheck,
	ShoppingCart,
	Truck,
} from "lucide-react";
import type { FC, SVGProps } from "react";
import { useState } from "react";

export const Route = createFileRoute("/faq")({
	head: () => ({
		scripts: [
			{
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "FAQPage",
					mainEntity: FAQ_GROUPS.flatMap((group) =>
						group.items.map((item) => ({
							"@type": "Question",
							name: item.question,
							acceptedAnswer: {
								"@type": "Answer",
								text: item.answer,
							},
						})),
					),
				}),
			},
		],
	}),
	component: RouteComponent,
});

type FaqItem = {
	question: string;
	answer: string;
};

const FAQ_GROUPS: {
	title: string;
	icon: FC<SVGProps<SVGSVGElement>>;
	items: FaqItem[];
}[] = [
	{
		title: "Bestellingen",
		icon: ShoppingCart,
		items: [
			{
				question: "Hoe plaats ik een bestelling?",
				answer:
					'Selecteer een product op de homepage en klik op "Lees meer". Download vervolgens het bestelformulier en vul de benodigde gegevens in. Stuur daarna het ingevulde formulier naar ons e-mailadres en wacht op verdere instructies.',
			},
			{
				question: "Hoe lang duurt de levering?",
				answer:
					"Een digitale kopie wordt doorgaans binnen 3 tot 5 werkdagen geleverd. Een fysieke kopie (geprint en verzonden) duurt gemiddeld 7 tot 14 werkdagen, afhankelijk van uw locatie en de verzendmethode.",
			},
			{
				question: "Kan ik mijn bestelling aanpassen?",
				answer:
					"Je kunt je bestelling wijzigen zolang het ontwerp nog niet is goedgekeurd en gedrukt. Neem hiervoor contact met ons op via e-mail of Telegram om je gegevens aan te passen.",
			},
		],
	},
	{
		title: "Betalingen",
		icon: ShieldCheck,
		items: [
			{
				question: "Welke betaalmethoden worden geaccepteerd?",
				answer:
					"Wij accepteren betalingen via bankoverschrijving, contant en diverse digitale betaalmethoden zoals PayPal, Western Union en bitcoin. Na ontvangst van uw aanbetaling van 50% starten wij met het ontwerpproces.",
			},
			{
				question: "Wanneer moet ik betalen?",
				answer:
					"U betaalt 50% als aanbetaling om de bestelling te starten. De resterende 50% betaalt u na uw goedkeuring van het concept, vóór de productie en verzending wordt gestart.",
			},
			{
				question: "Is mijn betaling veilig?",
				answer:
					"Ja. Wij gebruiken beveiligde betaalmethoden en uw gegevens worden vertrouwelijk behandeld en nooit met derden gedeeld.",
			},
		],
	},
	{
		title: "Documenten",
		icon: Award,
		items: [
			{
				question: "Welke diploma's kan ik bestellen?",
				answer:
					"Wij leveren een breed scala aan documenten, waaronder VWO-, HAVO-, MBO-, HBO- en VCA-diploma's, evenals verschillende academische diploma's. Bekijk de productpagina voor het volledige aanbod.",
			},
			{
				question: "Kan ik een preview ontvangen voordat ik betaal?",
				answer:
					"Ja. Na uw aanbetaling ontvangen wij uw gegevens en maken wij een elektronisch concept. Pas nadat u dit concept heeft goedgekeurd, wordt de productie van een fysieke kopie gestart.",
			},
		],
	},
	{
		title: "Verzending",
		icon: Truck,
		items: [
			{
				question: "Wordt mijn bestelling discreet verpakt?",
				answer:
					"Ja. Alle zendingen worden neutraal en discreet verpakt, zonder vermelding van inhoud of afzender op de buitenkant van het pakket.",
			},
			{
				question: "Kan ik de verzending volgen?",
				answer:
					"Zodra uw bestelling is verzonden, ontvangt u een track-and-trace-code waarmee u de levering online kunt volgen.",
			},
			{
				question: "Leveren jullie wereldwijd?",
				answer:
					"Ja, wij verzenden wereldwijd. De levertijd kan variëren afhankelijk van de bestemming en de gekozen verzendmethode.",
			},
		],
	},
];

function RouteComponent() {
	const [openIndex, setOpenIndex] = useState<number | null>(0);

	const toggleItem = (index: number) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	return (
		<div>
			<section className="bg-indigo-900 text-white relative overflow-hidden">
				<div className="absolute inset-0 opacity-10 bg-[url('/netherland-bachelor-degree.png')] bg-cover bg-center mix-blend-overlay"></div>
				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
					<div className="max-w-2xl">
						<span className="inline-flex items-center gap-2 bg-indigo-400/20 text-indigo-200 text-xs font-semibold px-3 py-1 rounded backdrop-blur-sm mb-4">
							<CircleQuestionMark size={14} /> Veelgestelde vragen
						</span>
						<h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
							Antwoorden op uw <br />
							<span className="text-indigo-300">vragen</span>
						</h1>
						<p className="mt-4 text-slate-200 text-lg max-w-lg leading-relaxed">
							Alles wat u moet weten over bestellingen, betalingen, documenten
							en verzending. Staat uw vraag er niet tussen? Neem gerust contact
							met ons op.
						</p>
					</div>
				</div>
			</section>

			<section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-16">
				{FAQ_GROUPS.map((group) => (
					<div
						key={group.title}
						className="bg-white rounded-2xl shadow-sm border border-slate-200/70 p-6 sm:p-8 mb-6"
					>
						<div className="flex items-center gap-3 mb-5">
							<group.icon className="w-6 h-6 text-indigo-600" />
							<h2 className="text-2xl font-bold text-slate-800">
								{group.title}
							</h2>
						</div>

						<div className="space-y-3">
							{group.items.map((item, index) => {
								const isOpen = openIndex === index;
								return (
									<div
										key={item.question}
										className="border border-slate-200/70 rounded-xl overflow-hidden transition-colors"
									>
										<button
											type="button"
											onClick={() => toggleItem(index)}
											className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
											aria-expanded={isOpen}
										>
											<span className="font-semibold text-slate-800 text-sm sm:text-base">
												{item.question}
											</span>
											<ChevronDown
												className={`w-4 h-4 text-indigo-400 transition-transform shrink-0 ${isOpen ? "rotate-180" : ""}`}
											/>
										</button>
										{isOpen && (
											<div className="px-5 pb-4">
												<p className="text-slate-600 text-sm leading-relaxed">
													{item.answer}
												</p>
											</div>
										)}
									</div>
								);
							})}
						</div>
					</div>
				))}

				<div className="text-center bg-white rounded-2xl shadow-sm border border-slate-200/70 p-8">
					<div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 text-xl mx-auto mb-3">
						<Headset />
					</div>
					<h2 className="text-xl font-bold text-slate-800">
						Heeft u nog een vraag?
					</h2>
					<p className="text-slate-500 text-sm mt-1 mb-4">
						Ons team staat klaar om u binnen 24 uur te antwoorden.
					</p>
					<a
						href="mailto:support@certificaatkopen.com"
						className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition shadow-sm shadow-indigo-200/50"
					>
						<MailPlus />
						Neem contact op
					</a>
				</div>
			</section>
		</div>
	);
}
