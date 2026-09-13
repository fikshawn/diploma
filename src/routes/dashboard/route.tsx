import {
	createFileRoute,
	Link,
	Outlet,
	useRouteContext,
} from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { adminMiddleware } from "#/lib/middleware";

export const Route = createFileRoute("/dashboard")({
	server: {
		middleware: [adminMiddleware], // add middleware here
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { user } = useRouteContext({ from: "__root__" });
	return (
		<div>
			<div className="flex h-screen overflow-hidden">
				<aside className="hidden md:flex flex-col w-64 bg-gray-900 text-gray-100">
					<div className="h-16 flex items-center justify-center font-bold text-xl uppercase tracking-wider border-b border-gray-800">
						⚡ Acme Corp
					</div>
					<nav className="flex-1 px-4 py-4 space-y-1">
						<a
							href="#"
							className="flex items-center px-4 py-2.5 bg-gray-800 text-white rounded-lg font-medium"
						>
							<span className="mr-3">📊</span> Dashboard
						</a>
						{user?.role === "ADMIN" && (
							<a
								href="#"
								className="flex items-center px-4 py-2.5 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition font-medium"
							>
								<span className="mr-3">👤</span> Admin Panel
							</a>
						)}
						<Link
							to="/dashboard/products"
							className="flex items-center px-4 py-2.5 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition font-medium"
						>
							<span className="mr-3">
								<FileText size={16} />
							</span>{" "}
							Products
						</Link>
						<a
							href="#"
							className="flex items-center px-4 py-2.5 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition font-medium"
						>
							<span className="mr-3">⚙️</span> Settings
						</a>
					</nav>
					<div className="p-4 border-t border-gray-800 text-sm text-gray-500 text-center">
						v1.0.0
					</div>
				</aside>

				<div className="flex-1 flex flex-col overflow-y-auto">
					<header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10">
						<h1 className="text-xl font-semibold text-gray-800">Overview</h1>
						<div className="flex items-center space-x-4">
							<button className="text-gray-500 hover:text-gray-700 focus:outline-none">
								🔔
							</button>
							<div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden border border-gray-200">
								<img src="https://unsplash.com" alt="Avatar" />
							</div>
						</div>
					</header>

					<main className="p-6 space-y-6">
						<Outlet />
					</main>
				</div>
			</div>
		</div>
	);
}
