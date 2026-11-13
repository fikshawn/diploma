import { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface ContactWidgetProps {
	/**
	 * Signal username link. Signal usernames are not linkable by name, so this
	 * takes the handle from Signal → Settings → Profile → Share username link,
	 * either as the full `https://signal.me/#eu/…` URL or just the `#eu/…`
	 * fragment.
	 */
	signalUsername: string;
	telegramUsername: string; // e.g., 'your_username'
}

const SIGNAL_USERNAME_PREFIX = "https://signal.me/#eu/";

/**
 * Accepts a full `signal.me` username URL or a bare `#eu/…` / `eu/…` handle and
 * returns a complete link. A plain `@name.123` is not linkable by Signal, so it
 * is treated as a handle and would not resolve — callers must pass the share
 * link produced by the Signal app.
 */
function toSignalUsernameUrl(raw: string): string {
	const value = raw.trim();

	if (value.startsWith(SIGNAL_USERNAME_PREFIX)) {
		return value;
	}

	const handle = value.replace(/^#?eu\//, "").replace(/^@/, "");
	return `${SIGNAL_USERNAME_PREFIX}${handle}`;
}

export function ContactWidget({
	signalUsername,
	telegramUsername,
}: ContactWidgetProps) {
	const [mounted, setMounted] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	const signalUrl = toSignalUsernameUrl(signalUsername);
	const telegramUrl = `https://t.me/${telegramUsername}`;

	return (
		<div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
			{/* Sub-buttons container */}
			<div
				className={`flex flex-col gap-3 transition-all duration-300 transform ${
					isOpen
						? "scale-100 opacity-100 translate-y-0"
						: "scale-75 opacity-0 translate-y-4 pointer-events-none"
				}`}
			>
				{/* Telegram Button */}
				<a
					href={telegramUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="flex h-12 w-12 items-center justify-center rounded-full bg-[#26A5E4] text-white shadow-md transition-transform hover:scale-110"
					aria-label="Chat on Telegram"
				>
					<span className="sr-only">Chat on Telegram</span>
					<svg
						className="h-6 w-6 fill-current"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path d="M19.897 5.03L2.247 11.84c-1.2.48-1.19 1.15-.22 1.45l4.53 1.41 10.5-6.62c.5-.3-.1-.15-.47.19l-8.5 7.67-.33 4.96c.49 0 .7-.22.98-.49l2.35-2.28 4.89 3.61c.9.5 1.55.24 1.77-.84l3.21-15.12c.33-1.32-.5-1.92-1.37-1.53z" />
					</svg>
				</a>

				{/* Signal Button */}
				<a
					href={signalUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3A76F0] text-white shadow-md transition-transform hover:scale-110"
					aria-label="Chat on Signal"
				>
					<span className="sr-only">Chat on Signal</span>
					<svg
						className="h-6 w-6 fill-current"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path d="M12 0q-.934 0-1.83.139l.17 1.111a11 11 0 0 1 3.32 0l.172-1.111A12 12 0 0 0 12 0M9.152.34A12 12 0 0 0 5.77 1.742l.584.961a10.8 10.8 0 0 1 3.066-1.27zm5.696 0-.268 1.094a10.8 10.8 0 0 1 3.066 1.27l.584-.962A12 12 0 0 0 14.848.34M12 2.25a9.75 9.75 0 0 0-8.539 14.459c.074.134.1.292.064.441l-1.013 4.338 4.338-1.013a.62.62 0 0 1 .441.064A9.7 9.7 0 0 0 12 21.75c5.385 0 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25m-7.092.068a12 12 0 0 0-2.59 2.59l.909.664a11 11 0 0 1 2.345-2.345zm14.184 0-.664.909a11 11 0 0 1 2.345 2.345l.909-.664a12 12 0 0 0-2.59-2.59M1.742 5.77A12 12 0 0 0 .34 9.152l1.094.268a10.8 10.8 0 0 1 1.269-3.066zm20.516 0-.961.584a10.8 10.8 0 0 1 1.27 3.066l1.093-.268a12 12 0 0 0-1.402-3.383M.138 10.168A12 12 0 0 0 0 12q0 .934.139 1.83l1.111-.17A11 11 0 0 1 1.125 12q0-.848.125-1.66zm23.723.002-1.111.17q.125.812.125 1.66c0 .848-.042 1.12-.125 1.66l1.111.172a12.1 12.1 0 0 0 0-3.662M1.434 14.58l-1.094.268a12 12 0 0 0 .96 2.591l-.265 1.14 1.096.255.36-1.539-.188-.365a10.8 10.8 0 0 1-.87-2.35m21.133 0a10.8 10.8 0 0 1-1.27 3.067l.962.584a12 12 0 0 0 1.402-3.383zm-1.793 3.848a11 11 0 0 1-2.345 2.345l.664.909a12 12 0 0 0 2.59-2.59zm-19.959 1.1L.357 21.48a1.8 1.8 0 0 0 2.162 2.161l1.954-.455-.256-1.095-1.953.455a.675.675 0 0 1-.81-.81l.454-1.954zm16.832 1.769a10.8 10.8 0 0 1-3.066 1.27l.268 1.093a12 12 0 0 0 3.382-1.402zm-10.94.213-1.54.36.256 1.095 1.139-.266c.814.415 1.683.74 2.591.961l.268-1.094a10.8 10.8 0 0 1-2.35-.869zm3.634 1.24-.172 1.111a12.1 12.1 0 0 0 3.662 0l-.17-1.111q-.812.125-1.66.125a11 11 0 0 1-1.66-.125" />
					</svg>
				</a>
			</div>

			{/* Main Toggle Button */}
			<Button
				onClick={() => setIsOpen(!isOpen)}
				className="flex h-14 items-center justify-center rounded-full bg-slate-900 px-6 text-sm font-semibold text-white shadow-lg transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
				aria-expanded={isOpen}
				aria-label="Contact us"
			>
				Contact us
			</Button>
		</div>
	);
}
