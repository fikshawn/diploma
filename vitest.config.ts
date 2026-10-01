import { defineConfig } from "vitest/config";

// `resolve.tsconfigPaths` is the same Vite 8 native option vite.config.ts uses,
// so the `#/*` and `@/*` aliases resolve identically in tests without adding
// a plugin dependency. The TanStack/Nitro plugins are deliberately omitted —
// they need a dev server, and the tests here are pure units.
export default defineConfig({
	resolve: { tsconfigPaths: true },
	test: {
		environment: "node",
		include: ["src/**/*.test.{ts,tsx}"],
	},
});
