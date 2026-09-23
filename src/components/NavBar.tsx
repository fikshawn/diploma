import { Link, useNavigate, useRouteContext } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { logoutFn } from "#/lib/server_functions/auth/authentication";

export default function NavBar() {
	const { user } = useRouteContext({ from: "__root__" });
	const navigate = useNavigate();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};
	const handleLogout = async () => {
		await logoutFn();
		toast.success("Uitloggen succesvol");
		navigate({ to: "/" });
	};
	return (
		<nav className="bg-white/70 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-50 py-3">
			<div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
				<div className="relative flex items-center justify-between h-16">
					<div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
						<Link to="/" className="shrink-0 flex items-center">
							<img className="block h-20 w-auto" src="/logo.png" alt="Logo" />
						</Link>
						<div className="hidden sm:block sm:ml-6">
							<div className="flex space-x-4 mt-5">
								<Link
									to="/"
									className="[&.active]:bg-gray-100 text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
								>
									Startpagina
								</Link>
								<Link
									to="/faq"
									className="[&.active]:bg-gray-100 text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
								>
									FAQ
								</Link>
								<Link
									to="/contact-us"
									className="[&.active]:bg-gray-100 text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
								>
									Contact
								</Link>
							</div>
						</div>
					</div>
					<div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
						<div className="hidden sm:flex sm:items-center">
							{user && (
								<div className="space-x-2">
									<Link
										to="/dashboard"
										className="[&.active]:bg-gray-100 text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
									>
										Dashboard
									</Link>
									<button
										type="button"
										onClick={() => handleLogout()}
										className="text-red-500 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
									>
										Uitloggen
									</button>
								</div>
							)}
							{/* {user ? (
								<div className="space-x-2">
									<Link
										to="/dashboard"
										className="[&.active]:bg-gray-100 text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
									>
										Dashboard
									</Link>
									<button
										type="button"
										onClick={() => handleLogout()}
										className="text-red-500 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
									>
										Uitloggen
									</button>
								</div>
							) : (
								<div>
									<Link
										to="/panchak"
										className="text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
									>
										Inloggen
									</Link>
									<Link
										to="/panchak2"
										className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
									>
										Registreren
									</Link>
								</div>
							)} */}
						</div>

						<div className="sm:hidden">
							<button
								type="button"
								onClick={toggleMobileMenu}
								className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
								aria-expanded={isMobileMenuOpen}
							>
								<span className="sr-only">Hoofdmenu openen</span>
								<svg
									className="block h-6 w-6"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M4 6h16M4 12h16M4 18h16"
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Mobile menu */}
			<div className={`sm:hidden ${isMobileMenuOpen ? "" : "hidden"}`}>
				<div className="px-2 pt-2 pb-3 space-y-1">
					<Link
						to="/"
						className="bg-gray-100 text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
					>
						Startpagina
					</Link>
					<Link
						to="/faq"
						className="bg-gray-100 text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
					>
						FAQ
					</Link>
					<Link
						to="/contact-us"
						className="bg-gray-100 text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
					>
						Contact
					</Link>

					{/* <div className="pt-4 pb-3 border-t border-gray-200">
						<div className="flex items-center px-3 space-y-2 flex-col">
							<Link
								to="/panchak"
								className="block w-full text-center text-gray-900 bg-gray-100 px-3 py-2 rounded-md text-base font-medium"
							>
								Inloggen
							</Link>
							<Link
								to="/panchak2"
								className="block w-full text-center bg-indigo-600 text-white px-3 py-2 rounded-md text-base font-medium"
							>
								Registreren
							</Link>
						</div>
					</div> */}
				</div>
			</div>
		</nav>
	);
}
