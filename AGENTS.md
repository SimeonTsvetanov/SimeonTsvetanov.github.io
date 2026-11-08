# AGENTS.md — simeontsvetanov.github.io (hub site)

The host-root site for Simeon "Moni" Tsvetanov's free micro-apps: app list, root `robots.txt`,
`sitemap.xml`, `llms.txt`, `.well-known/security.txt`, favicons, `WebSite` + `Person` JSON-LD.
Rules come from the forge (`simeonts-microapp-forge`): forge-growth seo-geo §5–§8,
forge-engineering security §1 and §7, forge-design accessibility + `tokens.css`.

## Where things are
```
data/apps.json     copy of forge plugins/forge-workflow/apps.json (update at each app /release)
scripts/build.mjs  builds dist/ (HTML, robots, sitemap, llms.txt, security.txt) — Node 24, no deps
scripts/icons.py   regenerates static/ icons + OG image (Pillow); output is committed
src/               site.css, tokens.css (forge copy), site.js (year + anti-scraping email)
static/            logo.svg, favicons, og-image.png — copied as-is
```

## Rules
- Talk to Moni in **Bulgarian**; every file, commit and issue in **English**.
- No frameworks, no npm dependencies, no third-party scripts/fonts. Meta CSP stays the first
  element of `<head>`; no inline scripts (JSON-LD data only); tokens only, no borders.
- Actions pinned to full SHAs (same as the forge apps), top-level `permissions: contents: read`.
- Before every commit: `node scripts/build.mjs`, then the forge checks against a local serve of
  `dist/`: `security-check.mjs --dist dist --repo .` and `a11y-check.mjs <url>` → 0 FAIL.
- Never commit secrets. `Expires` in security.txt is build date + 1 year — redeploy at least yearly.
