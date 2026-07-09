# Aqar One — Jobs Portal (`jobs.aqar1.com`)

Astro static site, deployed on **Cloudflare Pages**, applications collected via **Google Apps Script** → Google Sheet + Drive.

## Structure — edit in ONE place

| What you want to change | Where |
|---|---|
| Colors, fonts, spacing, radii, shadows | `src/styles/tokens.css` |
| Shared component styles (buttons, cards, forms…) | `src/styles/global.css` |
| Phone, email, offices, Apps Script URL | `src/config.ts` |
| Header / footer | `src/components/Header.astro`, `Footer.astro` |
| **Add a new job** | drop a new `.md` file in `src/content/jobs/` — the card and its page are generated automatically |

## Add a new job

Copy `src/content/jobs/head-of-sales-business-development.md`, rename it (filename = URL slug), and edit the frontmatter (`title`, `dept`, `code`, `responsibilities`, `requirements`, `datePosted`…). Done — it appears on the index and gets its own page at `/jobs/<filename>/` with Google Jobs (JSON-LD) structured data.

To close a job, set `open: false` (shows "Closing soon") or delete the file.

## Local development

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # output in dist/
```

## Application form backend (Google Sheet + Drive)

1. Follow the setup steps at the top of `apps-script/Code.gs`.
2. Paste the deployed Web App URL into `applyEndpoint` in `src/config.ts`.
3. Rebuild & redeploy.

The form posts JSON (as `text/plain`, a CORS "simple request" — required by Apps Script). The script saves the CV to Drive, appends a row to the Sheet, and emails HR.

## Deploy on Cloudflare Pages

1. Push this folder to a Git repository (GitHub/GitLab).
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
3. Settings:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
4. **Custom domain:** add `jobs.aqar1.com` (Cloudflare creates the CNAME automatically if the zone is on Cloudflare).

Every push to `main` redeploys automatically.

## SEO included

- Per-page `<title>`, meta description, canonical URL, Open Graph tags
- `JobPosting` JSON-LD on every job page (Google Jobs eligibility)
- `sitemap-index.xml` via `@astrojs/sitemap` + `robots.txt`
- Static HTML output — fully crawlable, no client-side rendering
