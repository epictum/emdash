# MK's EmDash test site

This `test-site` branch exists only in the epictum/emdash fork. **Never open a PR from it.**

- Cloudflare Worker: `emdash-test` → https://emdash-test.michael-a46.workers.dev
- D1: `emdash-test-db` · R2: `emdash-test-media` (nothing shared with Folsom Press)
- Workers Builds deploys this branch on every push.

## Differences from upstream `demos/cloudflare`

- `wrangler.jsonc`: own Worker/D1/R2 names, workers.dev instead of demo.emdashcms.com, no AI Search, no edge cache, Worker Loader commented out (needs Workers Paid).
- `astro.config.mjs`: passkey auth instead of Cloudflare Access, no Cloudflare Images/Stream, no AI Search, no sandboxed plugins or edge cache.

## Testing a feature branch

```bash
git checkout test-site
git merge my-feature   # or: git merge upstream/main to refresh
git push origin test-site
```
