import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { Toaster } from "sonner";
import Footer from "#/components/Footer";
import NavBar from "#/components/NavBar";
import { TelegramWidget } from "#/components/TelegramWidget";
import { fetchCurrentSession } from "#/lib/server_functions/auth/authentication";
import { SITE_URL } from "#/lib/site";
import appCss from "../styles.css?url";

// 1. Define the global context type based on your function's return type
type RouterContext = {
	user: Awaited<ReturnType<typeof fetchCurrentSession>>;
};
export const Route = createRootRouteWithContext<RouterContext>()({
	// 2. Fetch the session on the server before loading any route
	beforeLoad: async () => {
		const user = await fetchCurrentSession();
		return { user }; // This becomes available everywhere as context.user
	},
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				// Kept under 580px in the SERP font so it is not truncated.
				// 538px, all target keywords intact.
				title: "Koop VWO-, HAVO-, HBO- en VCA-diploma's en certificaten",
			},
			{
				name: "description",
				content:
					"Koop certificaten online — bestel certificaten en diploma's zoals VWO, HAVO, HBO en VCA met een uniform, compatibel en premium afwerking.",
			},
			{
				name: "keywords",
				content:
					"diploma kopen, MBO diploma kopen, VCA diploma kopen, HAVO diploma replica, certificaat kopen online, certificaten online, diploma online, diploma kopen online, certificaten kopen online, diploma's kopen online,",
			},
			{
				property: "og:title",
				content: "Koop certificaten online",
			},
			{
				property: "og:description",
				content:
					"Diploma Kopen — bestel certificaten en diploma's zoals VWO, HAVO, HBO en VCA met een uniform, compatibel en premium afwerking.",
			},
			{
				property: "og:type",
				content: "website",
			},
			{
				property: "og:url",
				content: SITE_URL,
			},
			{
				property: "og:site_name",
				content: "Diploma Kopen",
			},
			{
				property: "og:image",
				content: `${SITE_URL}/logo.png`,
			},
			{
				name: "theme-color",
				content: "#1e293b",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			// Browsers only fall back to requesting /favicon.ico by convention, so
			// the icons are declared for anything that reads the HTML — Google Search
			// Console included, which reports a missing favicon otherwise.
			{
				rel: "icon",
				href: "/favicon.ico",
				sizes: "any",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "32x32",
				href: "/icon-32.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "16x16",
				href: "/icon-16.png",
			},
			// iOS ignores the icon links above and only ever looks for this one.
			{
				rel: "apple-touch-icon",
				sizes: "180x180",
				href: "/apple-touch-icon.png",
			},
			{
				rel: "manifest",
				href: "/manifest.json",
			},
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="nl">
			<head>
				<HeadContent />
			</head>
			<body>
				<NavBar />
				{children}
				<TelegramWidget
					username="Cornelisjansen"
					message="Hello! I need some assistance."
				/>
				<Footer />
				<Toaster position="top-center" richColors />
				<Scripts />
			</body>
		</html>
	);
}
