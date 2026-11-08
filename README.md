# simeontsvetanov.github.io

Hub site for the free micro-apps by Simeon Tsvetanov: https://simeontsvetanov.github.io/

It serves the host root that every app under `/<app-id>/` shares: the app list page, `robots.txt`
(with every app sitemap), `sitemap.xml`, `llms.txt`, `/.well-known/security.txt`, favicons and the
`WebSite` + `Person` structured data. Plain HTML/CSS built by one Node 24 script — no dependencies.

## Update the app list
`data/apps.json` is a copy of `plugins/forge-workflow/apps.json` from the
[forge](https://github.com/SimeonTsvetanov/simeonts-microapp-forge). It is **updated at each app
`/release`**: copy the file over, run the build, commit, push. Only apps whose `status` starts with
`live` get a card; every app's sitemap goes into `robots.txt`.

## Commands
```bash
node scripts/build.mjs     # build dist/
python3 scripts/icons.py   # only when the monogram changes: regenerate static/ PNG/ICO (Pillow)
```
Pushing to `main` deploys via `.github/workflows/deploy.yml` (Pages source: GitHub Actions).

## Licence
MIT — see [LICENSE](LICENSE).
