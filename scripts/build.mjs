// scripts/build.mjs — builds the hub site into dist/. Node 24, no dependencies.
// Inputs: data/apps.json (copy of the forge registry), src/ (CSS/JS), static/ (icons, OG image).
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const SITE = "https://simeontsvetanov.github.io";
const HOME = `${SITE}/`;
const GITHUB = "https://github.com/SimeonTsvetanov";
const LINKEDIN = "https://www.linkedin.com/in/simeon-tsvetanov-a00963159";
const COFFEE = "https://buymeacoffee.com/simeontsvetanov";
const MORE = `${GITHUB}?tab=repositories&q=simeonts-microapp`;
const EMAIL = { user: "tsvetanov.simeon", domain: "gmail.com" };
const TITLE = "Free micro-apps by Simeon Tsvetanov";
const SITE_NAME = "Simeon Tsvetanov — free micro-apps";
const DESCRIPTION =
  "Small, free, private web apps that do one job well — no sign-up, no ads, no tracking. Built by Simeon Tsvetanov.";

/** Escapes text for HTML content and attribute values. */
const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const { apps } = JSON.parse(readFileSync(join(root, "data/apps.json"), "utf8"));
const live = apps.filter((a) => String(a.status).toLowerCase().startsWith("live"));
const today = new Date();
const isoDate = today.toISOString().slice(0, 10);

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${HOME}#website`,
      name: SITE_NAME,
      alternateName: ["Simeon Tsvetanov micro-apps", "simeontsvetanov.github.io"],
      url: HOME,
      description: DESCRIPTION,
      inLanguage: "en",
      publisher: { "@id": `${HOME}#person` },
    },
    {
      "@type": "Person",
      "@id": `${HOME}#person`,
      name: "Simeon Tsvetanov",
      alternateName: "Moni",
      url: HOME,
      image: `${SITE}/icon-512.png`,
      sameAs: [GITHUB, LINKEDIN],
      address: { "@type": "PostalAddress", addressCountry: "BG" },
    },
  ],
};

/** Shared <head>: meta CSP first (security §1), then the rest. */
function head({ title, description, canonical, robots }) {
  return `<head>
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${robots ? `<meta name="robots" content="${robots}">\n` : ""}${canonical ? `<link rel="canonical" href="${canonical}">\n` : ""}<meta name="referrer" content="strict-origin-when-cross-origin">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#F5F5F7">
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000000">
<meta name="author" content="Simeon Tsvetanov">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(SITE_NAME)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical ?? HOME}">
<meta property="og:locale" content="en_US">
<meta property="og:image" content="${SITE}/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="ST monogram with the text: Free micro-apps by Simeon Tsvetanov">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${SITE}/og-image.png">
<meta name="twitter:image:alt" content="ST monogram with the text: Free micro-apps by Simeon Tsvetanov">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/favicon-48.png" type="image/png" sizes="48x48">
<link rel="icon" href="/logo.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="describedby" href="${SITE}/llms.txt">
<link rel="stylesheet" href="/site.css">
<script src="/site.js" defer></script>
</head>`;
}

const footer = `<footer class="foot">
  <div class="wrap">
    <nav aria-label="Contact and links">
      <ul>
        <li><a href="${GITHUB}" rel="noopener me" target="_blank">GitHub</a></li>
        <li><a href="${LINKEDIN}" rel="noopener me" target="_blank">LinkedIn</a></li>
        <li><a href="${COFFEE}" rel="noopener" target="_blank">Buy me a coffee</a></li>
        <li><a href="${GITHUB}" data-email-user="${EMAIL.user}" data-email-domain="${EMAIL.domain}">Contact</a></li>
      </ul>
    </nav>
    <p>© <span data-year>${today.getFullYear()}</span> Simeon Tsvetanov · Made in Bulgaria</p>
  </div>
</footer>`;

const card = (a) => `      <li>
        <a class="card" href="${esc(a.url)}">
          <h3>${esc(a.name)}</h3>
          <p>${esc(a.tagline)}</p>
          <span class="status">Live</span>
        </a>
      </li>`;

const index = `<!doctype html>
<html lang="en">
${head({ title: TITLE, description: DESCRIPTION, canonical: HOME })}
<body>
<a class="skip" href="#apps">Skip to apps</a>
<header class="hero">
  <div class="wrap">
    <img src="/logo.svg" alt="" width="64" height="64">
    <h1>Free micro-apps by Simeon Tsvetanov</h1>
    <p>Small web apps that do one job well — free, private, no sign-up, no ads, and they work offline.</p>
  </div>
</header>
<main id="apps" class="apps" tabindex="-1">
  <div class="wrap">
    <h2>Apps</h2>
    <ul class="grid">
${live.map(card).join("\n")}
    </ul>
    <p class="more"><a href="${MORE}" rel="noopener" target="_blank">More apps on GitHub</a></p>
  </div>
</main>
${footer}
<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>
</body>
</html>
`;

const notFound = `<!doctype html>
<html lang="en">
${head({ title: "Page not found — Simeon Tsvetanov", description: "This page doesn't exist. Go to the list of free micro-apps.", robots: "noindex" })}
<body>
<main class="notfound wrap">
  <img src="/logo.svg" alt="" width="56" height="56">
  <h1>Page not found</h1>
  <p>The page you're looking for doesn't exist or has moved.</p>
  <div class="actions">
    <a class="btn primary" href="/">Go to home</a>
    <a class="btn" href="/#apps">See all apps</a>
  </div>
</main>
${footer}
</body>
</html>
`;

const robotsTemplate = `# robots.txt — host root for every app under https://simeontsvetanov.github.io/<app-id>/.
# Generated by scripts/build.mjs (structure: forge-growth templates/robots.txt).
# Policy: everyone allowed, AI search and AI training included (Moni 2026-11-05). Named groups
# document intent and keep a future "*" Disallow from silently applying to them.
User-agent: *
Allow: /

# Search and answer crawlers
User-agent: Googlebot
User-agent: Bingbot
User-agent: OAI-SearchBot
User-agent: Claude-SearchBot
User-agent: PerplexityBot
User-agent: Applebot
Allow: /

# User-triggered fetchers (may not follow robots.txt)
User-agent: ChatGPT-User
User-agent: Claude-User
User-agent: Perplexity-User
Allow: /

# Training tokens (Google-Extended and Applebot-Extended don't crawl; they control model use only)
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: CCBot
Allow: /

# Hub sitemap + one line per app sitemap (absolute URLs)
Sitemap: ${SITE}/sitemap.xml
${apps.map((a) => `Sitemap: ${new URL("sitemap.xml", a.url.endsWith("/") ? a.url : `${a.url}/`).href}`).join("\n")}
`;

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${HOME}</loc><lastmod>${isoDate}</lastmod></url>
</urlset>
`;

const llms = `# Simeon Tsvetanov — free micro-apps

> Small, free, private web apps by Simeon Tsvetanov (Bulgaria). Each app does one job, runs in the browser as an installable PWA, needs no sign-up and has no ads or tracking. Most also ship a core library and a local MCP server for AI agents.

Every app lives at https://simeontsvetanov.github.io/<app-id>/ and has its own llms.txt with what it does, its limits and its privacy notes.

## Apps

${live.map((a) => `- [${a.name}](${a.url}): ${a.tagline}. Agent notes: ${new URL("llms.txt", a.url).href}`).join("\n")}

## Optional

- [All micro-app repositories](${MORE}): source code on GitHub
- [GitHub profile](${GITHUB}): Simeon Tsvetanov
- [Security contact](${SITE}/.well-known/security.txt): RFC 9116 security.txt
`;

const expires = new Date(today);
expires.setUTCFullYear(expires.getUTCFullYear() + 1);
const securityTxt = `Contact: mailto:${EMAIL.user}@${EMAIL.domain}
Contact: ${GITHUB}
Expires: ${expires.toISOString().replace(/\.\d{3}Z$/, "Z")}
Preferred-Languages: en, bg
Canonical: ${SITE}/.well-known/security.txt
`;

rmSync(dist, { recursive: true, force: true });
mkdirSync(join(dist, ".well-known"), { recursive: true });
cpSync(join(root, "static"), dist, { recursive: true });
for (const f of ["site.css", "tokens.css", "site.js"]) cpSync(join(root, "src", f), join(dist, f));
writeFileSync(join(dist, "index.html"), index);
writeFileSync(join(dist, "404.html"), notFound);
writeFileSync(join(dist, "robots.txt"), robotsTemplate);
writeFileSync(join(dist, "sitemap.xml"), sitemap);
writeFileSync(join(dist, "llms.txt"), llms);
writeFileSync(join(dist, ".well-known/security.txt"), securityTxt);
writeFileSync(join(dist, ".nojekyll"), "");
console.log(`Built dist/ — ${live.length} live app(s) of ${apps.length}.`);
