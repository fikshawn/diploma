import { useEffect, useState } from "react";

interface TelegramWidgetProps {
	username: string; // Your Telegram username without the '@', e.g., 'your_username'
	message?: string; // Optional pre-filled text
}

export function TelegramWidget({ username, message }: TelegramWidgetProps) {
	const [mounted, setMounted] = useState(false);

	// Ensures safety during TanStack Start Server-Side Rendering (SSR)
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	// Construct link with optional message fallback
	const telegramUrl = message
		? `https://t.me/${username}?text=${encodeURIComponent(message)}`
		: `https://t.me/${username}`;

	return (
		<a
			href={telegramUrl}
			target="_blank"
			rel="noopener noreferrer"
			className="fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#26A5E4] text-white shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#26A5E4] focus:ring-offset-2"
			aria-label="Chat on Telegram"
		>
			<span className="sr-only">Chat on Telegram</span>
			<svg
				className="h-7 w-7 mr-0.5 fill-current"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org"
				aria-hidden="true"
			>
				<path d="M19.897 5.03L2.247 11.84c-1.2.48-1.19 1.15-.22 1.45l4.53 1.41 10.5-6.62c.5-.3-.1-.15-.47.19l-8.5 7.67-.33 4.96c.49 0 .7-.22.98-.49l2.35-2.28 4.89 3.61c.9.5 1.55.24 1.77-.84l3.21-15.12c.33-1.32-.5-1.92-1.37-1.53z" />
			</svg>
		</a>
	);
}
