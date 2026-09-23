import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contact-us")({
	head: () => ({
		scripts: [
			{
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "ContactPage",
					name: "Contact — Diploma Kopen",
					description:
						"Neem contact op met Diploma Kopen voor vragen over documenten, bestellingen of diensten.",
					"@graph": [
						{
							"@type": "Organization",
							name: "Diploma Kopen",
							url: "https://certificaatkopen.com",
							contactPoint: [
								{
									"@type": "ContactPoint",
									contactType: "customer support",
									email: "support@docustore.com",
									telephone: "+18005551234",
									availableLanguage: ["Dutch", "English"],
								},
							],
						},
					],
				}),
			},
		],
	}),
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<section className="bg-linear-to-r from-slate-800 via-slate-700 to-indigo-900 text-white relative overflow-hidden">
				<div className="absolute inset-0 opacity-10 bg-[url('/netherland-bachelor-degree.png')] bg-cover bg-center mix-blend-overlay"></div>
				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
					<div className="max-w-2xl">
						<span className="inline-block bg-indigo-400/20 text-indigo-200 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm mb-4">
							<i className="fas fa-headset mr-1"></i> Neem contact op
						</span>
						<h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
							Wij zijn hier om <br />
							<span className="text-indigo-300">u te helpen</span>
						</h1>
						<p className="mt-4 text-slate-200 text-lg max-w-lg leading-relaxed">
							Heeft u vragen over onze documenten, bestellingen of diensten?
							Neem contact met ons op — ons team staat klaar om u te helpen.
						</p>
					</div>
				</div>
			</section>

			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 h-screen">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="contact-card bg-white rounded-2xl shadow-sm border border-slate-200/70 p-6">
						<div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl">
							<i className="fas fa-envelope"></i>
						</div>
						<h3 className="font-bold text-slate-800 mt-3">E-mail ons</h3>
						<p className="text-sm text-slate-500 mt-1">
							Wij reageren binnen 24 uur
						</p>
						<a
							href="mailto:support@docustore.com"
							className="text-indigo-600 hover:text-indigo-800 font-medium text-sm mt-2 inline-block"
						>
							support@docustore.com
						</a>
					</div>

					<div className="contact-card bg-white rounded-2xl shadow-sm border border-slate-200/70 p-6">
						<div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 text-xl">
							<i className="fas fa-phone"></i>
						</div>
						<h3 className="font-bold text-slate-800 mt-3">
							Neem contact op via Telegram
						</h3>
						<a
							href="tel:+18005551234"
							className="text-indigo-600 hover:text-indigo-800 font-medium text-sm mt-2 inline-block"
						>
							+1 (800) 555-1234
						</a>
					</div>

					<div className="contact-card bg-white rounded-2xl shadow-sm border border-slate-200/70 p-6">
						<div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 text-xl">
							<i className="fas fa-map-marker-alt"></i>
						</div>
						<h3 className="font-bold text-slate-800 mt-3">Bezoek ons</h3>
						<p className="text-sm text-slate-500 mt-1">
							123 Document Street, Suite 200
						</p>
						<p className="text-sm text-slate-500">New York, NY 10001</p>
					</div>

					{/* <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200/70 p-6 sm:p-8">
						<div className="mb-6">
							<h2 className="text-2xl font-bold text-slate-800">
								Send us a message
							</h2>
							<div className="divider-gradient h-px w-20 mt-2"></div>
							<p className="text-sm text-slate-500 mt-2">
								Fill out the form below and we'll get back to you shortly.
							</p>
						</div>

						<form className="space-y-5">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label
										htmlFor="fullname"
										className="block text-sm font-medium text-slate-700 mb-1.5"
									>
										Full name
									</label>
									<div className="input-group flex items-center bg-white rounded-xl border border-slate-200/80 px-4 py-2.5 transition">
										<i className="fas fa-user text-slate-400 text-sm w-5"></i>
										<input
											type="text"
											id="fullname"
											placeholder="John Doe"
											className="w-full bg-transparent border-0 focus:ring-0 text-sm text-slate-800 placeholder-slate-400 outline-none"
										/>
									</div>
								</div>
								<div>
									<label
										htmlFor="email"
										className="block text-sm font-medium text-slate-700 mb-1.5"
									>
										Email address
									</label>
									<div className="input-group flex items-center bg-white rounded-xl border border-slate-200/80 px-4 py-2.5 transition">
										<i className="fas fa-envelope text-slate-400 text-sm w-5"></i>
										<input
											type="email"
											id="email"
											placeholder="you@example.com"
											className="w-full bg-transparent border-0 focus:ring-0 text-sm text-slate-800 placeholder-slate-400 outline-none"
										/>
									</div>
								</div>
							</div>

							<div>
								<label
									htmlFor="subject"
									className="block text-sm font-medium text-slate-700 mb-1.5"
								>
									Subject
								</label>
								<div className="input-group flex items-center bg-white rounded-xl border border-slate-200/80 px-4 py-2.5 transition">
									<i className="fas fa-tag text-slate-400 text-sm w-5"></i>
									<select
										id="subject"
										className="w-full bg-transparent border-0 focus:ring-0 text-sm text-slate-800 outline-none"
									>
										<option value="">Select a topic...</option>
										<option value="order">Order inquiry</option>
										<option value="document">Document question</option>
										<option value="support">Technical support</option>
										<option value="feedback">Feedback</option>
										<option value="other">Other</option>
									</select>
								</div>
							</div>

							<div>
								<label
									htmlFor="message"
									className="block text-sm font-medium text-slate-700 mb-1.5"
								>
									Message
								</label>
								<div className="input-group flex items-start bg-white rounded-xl border border-slate-200/80 px-4 py-2.5 transition">
									<i className="fas fa-pen text-slate-400 text-sm w-5 mt-1.5"></i>
									<textarea
										id="message"
										rows={4}
										placeholder="How can we help you?"
										className="w-full bg-transparent border-0 focus:ring-0 text-sm text-slate-800 placeholder-slate-400 outline-none resize-none"
									></textarea>
								</div>
							</div>

							<button
								type="submit"
								className="submit-btn w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition shadow-sm shadow-indigo-200/50 flex items-center justify-center gap-2"
							>
								<i className="fas fa-paper-plane"></i> Send message
							</button>
						</form>

						<p className="text-[10px] text-slate-400 text-center mt-4 flex items-center justify-center gap-1">
							<i className="fas fa-lock text-indigo-300 text-[10px]"></i> Your
							information is secure and will not be shared.
						</p>
					</div> */}
				</div>
			</section>
		</div>
	);
}
