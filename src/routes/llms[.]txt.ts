// src/routes/llms[.]txt.ts
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/llms.txt")({
	server: {
		handlers: {
			GET: async () => {
				const content = `# My App

> My website is a platform for buying fake diplomas and certificates.

## Contact
- Website: http://localhost:3000/
- Email: 8p6yO@example.com
`;

				return new Response(content, {
					headers: {
						"Content-Type": "text/plain",
					},
				});
			},
		},
	},
});
