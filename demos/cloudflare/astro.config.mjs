// @ts-check
import cloudflare from "@astrojs/cloudflare";
import { cacheCloudflare } from "@astrojs/cloudflare/cache";
import react from "@astrojs/react";
import { d1, r2, sandbox } from "@emdash-cms/cloudflare";
import { formsPlugin } from "@emdash-cms/plugin-forms";
import webhookNotifier from "@emdash-cms/plugin-webhook-notifier";
import { defineConfig, fontProviders } from "astro/config";
import emdash from "emdash/astro";

export default defineConfig({
	output: "server",
	adapter: cloudflare({
		imageService: "cloudflare",
	}),
	i18n: {
		defaultLocale: "en",
		locales: ["en", "fr", "es"],
		fallback: {
			fr: "en",
			es: "en",
		},
	},
	image: {
		// Enable responsive images globally
		layout: "constrained",
		responsiveStyles: true,
	},
	integrations: [
		react(),
		emdash({
			// D1 database - binding name must match wrangler.jsonc
			// session: "auto" enables read replicas (nearest replica for anon,
			// bookmark-based consistency for authenticated users)
			database: d1({ binding: "DB", session: "auto" }),
			// R2 storage for media
			storage: r2({ binding: "MEDIA" }),
			// Test site: default passkey auth (no Cloudflare Access)
			// Trusted plugins (run in host worker)
			plugins: [
				// Test plugin that exercises all v2 APIs
				formsPlugin(),
			],
			// Sandboxed plugins (run in isolated workers)
			sandboxed: [webhookNotifier],
			// Sandbox runner for Cloudflare
			sandboxRunner: sandbox(),
			// Plugin marketplace
			marketplace: "https://marketplace.emdashcms.com",
		}),
	],
	// Preferred edge HTML cache: native Workers Caching via the Astro Cloudflare
	// adapter. Pair with `"cache": { "enabled": true }` in wrangler.jsonc (the
	// adapter also injects that when this provider is detected). Invalidation is
	// `cache.purge()` from cloudflare:workers — no CF_ZONE_ID / API token.
	cache: {
		provider: cacheCloudflare(),
	},
	routeRules: {
		"/": {
			maxAge: 3_600,
			swr: 864_000,
		},
		"/[...slug]": {
			maxAge: 3_600,
			swr: 864_000,
		},
	},
	fonts: [
		{
			provider: fontProviders.google(),
			name: "Inter",
			cssVariable: "--font-sans",
			weights: [400, 500, 600, 700],
			fallbacks: ["sans-serif"],
		},
		{
			provider: fontProviders.google(),
			name: "JetBrains Mono",
			cssVariable: "--font-mono",
			weights: [400, 500],
			fallbacks: ["monospace"],
		},
	],
	devToolbar: { enabled: false },
});
