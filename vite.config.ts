import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

/**
 * Only pages whose content is fixed at build time are prerendered.
 *
 * Anything rendered from the database (`/`, `/products/*`) is deliberately
 * excluded: a prerendered file is served as a static asset forever, so a
 * product added or edited after a build would never appear, and the stale HTML
 * would ship to crawlers. Those routes are server-rendered on every request.
 *
 * `/dashboard/*` is behind adminMiddleware — prerendering it would follow the
 * redirect to "/" and write the public homepage HTML to those paths, serving it
 * statically and bypassing the auth check entirely.
 */
const PRERENDER_PATHS = new Set(["/faq"]);

const config = defineConfig({
	resolve: { tsconfigPaths: true },
	plugins: [
		devtools(),
		nitro({
			rollupConfig: { external: [/^@sentry\//] },
			serverDir: "./server",
		}),
		tailwindcss(),
		tanstackStart({
			prerender: {
				enabled: true,
				crawlLinks: true,
				filter: (page) => PRERENDER_PATHS.has(page.path),
			},
		}),
		viteReact(),
		babel({ presets: [reactCompilerPreset()] }),
	],
});

export default config;
