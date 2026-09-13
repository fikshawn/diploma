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
				title: "Diploma Kopen",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
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
				{/* <TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/> */}
				<Scripts />
			</body>
		</html>
	);
}
