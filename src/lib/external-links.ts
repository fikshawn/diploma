import type { Product } from "#/db";

export type ExternalSource = {
	label: string;
	url: string;
	description: string;
};

type ExternalGroup = {
	keywords: string[];
	sources: ExternalSource[];
};

const GROUPS: ExternalGroup[] = [
	{
		keywords: ["havo"],
		sources: [
			{
				label: "Veelgestelde vragen over HAVO",
				url: "https://nl.wikipedia.org/wiki/Hoger_algemeen_voorgezet_onderwijs",
				description:
					"Wat een HAVO-diploma is, welke vakken en niveaus er zijn en hoe het eindexamen werkt.",
			},
			{
				label: "Voortgezet onderwijs — Rijksoverheid",
				url: "https://www.rijksoverheid.nl/onderwerpen/voortgezet-onderwijs",
				description:
					"Officiële informatie van de Rijksoverheid over het voortgezet onderwijs in Nederland.",
			},
		],
	},
	{
		keywords: ["vwo"],
		sources: [
			{
				label: "Veelgestelde vragen over VWO",
				url: "https://nl.wikipedia.org/wiki/Voorbereidend_wetenschappelijk_onderwijs",
				description:
					"Informatie over het VWO: profielen, vakken en het eindexamen voor dit diploma.",
			},
			{
				label: "Voortgezet onderwijs — Rijksoverheid",
				url: "https://www.rijksoverheid.nl/onderwerpen/voortgezet-onderwijs",
				description:
					"Officiële informatie van de Rijksoverheid over het voortgezet onderwijs in Nederland.",
			},
		],
	},
	{
		keywords: ["vmbo"],
		sources: [
			{
				label: "VMBO uitgelegd",
				url: "https://nl.wikipedia.org/wiki/Voorbereidend_middelbaar_beroepsonderwijs",
				description:
					"Wat het VMBO inhoudt, welke leerwegen er zijn en hoe het examen verloopt.",
			},
			{
				label: "Voortgezet onderwijs — Rijksoverheid",
				url: "https://www.rijksoverheid.nl/onderwerpen/voortgezet-onderwijs",
				description:
					"Officiële informatie van de Rijksoverheid over het voortgezet onderwijs in Nederland.",
			},
		],
	},
	{
		keywords: ["hbo"],
		sources: [
			{
				label: "HBO uitgelegd",
				url: "https://nl.wikipedia.org/wiki/Hoger_beroepsonderwijs",
				description:
					"Informatie over het hoger beroepsonderwijs: opleidingen, niveaus en toelating.",
			},
			{
				label: "Hoger onderwijs — Rijksoverheid",
				url: "https://www.rijksoverheid.nl/onderwerpen/hoger-onderwijs",
				description:
					"Officiële informatie van de Rijksoverheid over hoger onderwijs en studeren.",
			},
			{
				label: "DUO — studeren in het hbo",
				url: "https://duo.nl/particulier/student/hbo/index",
				description:
					"Dienst Uitvoering Onderwijs over inschrijving, studiefinanciering en studievoortgang.",
			},
		],
	},
	{
		keywords: ["mbo"],
		sources: [
			{
				label: "MBO uitgelegd",
				url: "https://nl.wikipedia.org/wiki/Middelbaar_beroepsonderwijs",
				description:
					"Wat het MBO inhoudt, de niveaus 1 tot en met 4 en hoe de beroepsopleidingen werken.",
			},
			{
				label: "Middelbaar beroepsonderwijs — Rijksoverheid",
				url: "https://www.rijksoverheid.nl/onderwerpen/middelbaar-beroepsonderwijs",
				description:
					"Officiële informatie van de Rijksoverheid over mbo-diploma's en opleidingen.",
			},
			{
				label: "DUO — mbo-student",
				url: "https://duo.nl/particulier/mbo-student/index",
				description:
					"DUO-informatie voor mbo-studenten over inschrijving en studiefinanciering.",
			},
		],
	},
	{
		keywords: ["wo"],
		sources: [
			{
				label: "Wetenschappelijk onderwijs uitgelegd",
				url: "https://nl.wikipedia.org/wiki/Wetenschappelijk_onderwijs",
				description:
					"Informatie over het wetenschappelijk onderwijs, de universitaire opleidingen en bachelor- en masterdiploma's.",
			},
			{
				label: "Hoger onderwijs — Rijksoverheid",
				url: "https://www.rijksoverheid.nl/onderwerpen/hoger-onderwijs",
				description:
					"Officiële informatie van de Rijksoverheid over hoger onderwijs en studeren.",
			},
		],
	},
	{
		keywords: ["vca"],
		sources: [
			{
				label: "VCA — Veiligheid, gezondheid en milieu",
				url: "https://www.vca.nl/",
				description:
					"De officiële VCA-website: wat deze certificering inhoudt, de examens en de geldigheid ervan.",
			},
			{
				label: "VCA-certificering uitgelegd",
				url: "https://nl.wikipedia.org/wiki/Veiligheid,_gezondheid_en_milieu_(certificatie)",
				description:
					"Achtergrondinformatie over de VCA-certificering voor veilig, gezond en milieubewust werken.",
			},
		],
	},
	{
		keywords: ["bhv"],
		sources: [
			{
				label: "NIBHV — BHV-help en opleiding",
				url: "https://www.nibhv.nl/",
				description:
					"De officiële stichting voor Bedrijfshulpverlening: opleidingen, herhaling en certificering.",
			},
		],
	},
	{
		keywords: ["rijbewijs", "bromfiets", "theorie-examen"],
		sources: [
			{
				label: "CBR — Centraal Bureau Rijvaardigheidsbewijzen",
				url: "https://www.cbr.nl/",
				description:
					"De officiële instantie voor rijbewijzen: theorie- en praktijkexamens in Nederland.",
			},
			{
				label: "Rijbewijs — Rijksoverheid",
				url: "https://www.rijksoverheid.nl/onderwerpen/rijbewijs",
				description:
					"Officiële informatie van de Rijksoverheid over het aanvragen en verlengen van een rijbewijs.",
			},
		],
	},
];

const GENERAL_SOURCES: ExternalSource[] = [
	{
		label: "Diploma's en onderwijs — Rijksoverheid",
		url: "https://www.rijksoverheid.nl/onderwerpen/onderwijs",
		description:
			"Officiële informatie van de Nederlandse overheid over het onderwijs en diploma's.",
	},
	{
		label: "DUO — Dienst Uitvoering Onderwijs",
		url: "https://duo.nl/particulier/index",
		description:
			"De officiële uitvoeringsdienst voor onderwijsregistraties, diploma's en studiefinanciering.",
	},
];

function escapeRegex(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function matchesKeyword(haystack: string, keyword: string): boolean {
	const pattern = new RegExp(
		`(^|[^a-z])${escapeRegex(keyword)}([^a-z]|$)`,
		"i",
	);
	return pattern.test(haystack);
}

export function getExternalLinks(
	product: Pick<Product, "title" | "metatitle" | "tags">,
): ExternalSource[] {
	const haystacks = [product.title, product.metatitle, ...(product.tags ?? [])]
		.filter(Boolean)
		.map((value) => value.toLowerCase())
		.join(" \n ");

	const seen = new Set<string>();
	const links: ExternalSource[] = [];

	for (const group of GROUPS) {
		const matched = group.keywords.some((keyword) =>
			matchesKeyword(haystacks, keyword),
		);
		if (!matched) continue;
		for (const source of group.sources) {
			if (seen.has(source.url)) continue;
			seen.add(source.url);
			links.push(source);
		}
	}

	for (const source of GENERAL_SOURCES) {
		if (seen.has(source.url)) continue;
		seen.add(source.url);
		links.push(source);
	}

	return links;
}
