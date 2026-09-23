import { Link } from "@tanstack/react-router";

export default function Footer() {
	return (
		<footer className="bg-slate-800 text-slate-300">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
				<div className="grid grid-cols-2 md:grid-cols-3 gap-8">
					<div>
						<h3 className="text-white font-semibold mb-3">Diploma Kopen</h3>
						<p className="text-sm text-slate-400">
							Bestel geverifieerde certificaten en diploma's zoals VWO, HAVO,
							HBO en VCA met een premium afwerking.
						</p>
					</div>
					<div>
						<h3 className="text-white font-semibold mb-3">Navigatie</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link to="/" className="hover:text-white transition">
									Startpagina
								</Link>
							</li>
							<li>
								<Link to="/faq" className="hover:text-white transition">
									Veelgestelde vragen
								</Link>
							</li>
							<li>
								<Link to="/contact-us" className="hover:text-white transition">
									Contact
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h3 className="text-white font-semibold mb-3">Bestellen</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link to="/" className="hover:text-white transition">
									Alle diploma's
								</Link>
							</li>
							<li>
								<Link to="/contact-us" className="hover:text-white transition">
									Bestelformulier
								</Link>
							</li>
							<li>
								<Link to="/faq" className="hover:text-white transition">
									Levering en betaling
								</Link>
							</li>
						</ul>
					</div>
				</div>
				<div className="border-t border-slate-700 mt-8 pt-6 text-lg text-slate-300 flex flex-col sm:flex-row justify-center">
					<p>&copy; 2026 Certificaat Kopen.</p>
				</div>
			</div>
		</footer>
	);
}
