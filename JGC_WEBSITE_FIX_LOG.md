# JGC Website — Fix Session Log

---

## Framework and deployment summary

**Framework:** Pure static HTML — no build system, no package.json, no framework.  
**Build command:** None.  
**Output directory:** Repository root (`/`). Cloudflare Pages serves the repo root directly.  
**Pages:** `index.html`, `about.html`, `safety.html`, `privacy.html`  
**Assets:** `assets/` (icons, logos, brand, photos), `fonts/`, `colors_and_type.css`, `premium.css`  
**Repo:** https://github.com/jgusewcomputers/jgusewcomputerswebsite  
**Live domain:** https://jgusewcomputers.com  
**Cloudflare Pages project name:** jgusewcomputers (deployed via Direct Upload initially; GitHub integration enabled)

### Cloudflare Pages — key facts for this project

- No build command. Output dir = `/` (root).
- `_redirects` placed at the repo root IS the output root. Cloudflare Pages will read it.
- `_headers` placed at the repo root will also be read (needed for FIX 8).
- `_redirects` cross-domain rules (e.g. www → apex) only fire if `www.jgusewcomputers.com`
  is also added as a custom domain in the Cloudflare Pages dashboard.
- Cloudflare Pages free tier supports custom domains, redirects, and headers.

### EmailJS setup notes

- EmailJS browser SDK loaded via CDN in `index.html`.
- Public key, service ID, and template ID are hardcoded in `index.html`.
- These are public-side values (client-rendered) so hardcoding is low-risk,
  but moving to environment variables is recommended when a build step is introduced.
- EmailJS dashboard: https://www.emailjs.com
- Service ID: service_59pweih
- Template ID: template_wnuvasi
- Public key: stored in index.html (acceptable for client-side, non-secret)
- Allowed origins should be restricted to `jgusewcomputers.com` in the EmailJS dashboard
  (Account → Security → Allowed Origins). See ACTION PLAN FIX 5.

---

## Fix sessions

---

### Session 1 — FIX 1: Cloudflare Pages deployment and canonical domain readiness

**Date:** 2026-05-26  
**Status:** Complete

#### What was inspected

- No `package.json` — confirmed pure static HTML site.
- No `_redirects` file existed.
- No `_headers` file existed.
- No canonical `<link>` tags on any page.
- OG image URLs were relative (`assets/logos/...`) — will not resolve for social sharing crawlers.
- `og:url` was missing on all pages.
- Git was clean before changes.

#### Changes made

**New file: `_redirects`**  
Added www → apex 301 redirect rule. Placed at repo root (= Cloudflare Pages output root).  
Rule: `https://www.jgusewcomputers.com/* https://jgusewcomputers.com/:splat 301`  
NOTE: This rule only fires once `www.jgusewcomputers.com` is added as a custom domain
in the Cloudflare Pages dashboard (see External actions below).

**`index.html`**  
- Added `<link rel="canonical" href="https://jgusewcomputers.com/">`  
- Added `<meta property="og:url" content="https://jgusewcomputers.com/">`  
- Changed OG/Twitter image URLs from relative to absolute.

**`about.html`**  
- Added `<link rel="canonical" href="https://jgusewcomputers.com/about.html">`

**`safety.html`**  
- Added `<link rel="canonical" href="https://jgusewcomputers.com/safety.html">`

**`privacy.html`**  
- Added `<link rel="canonical" href="https://jgusewcomputers.com/privacy.html">`

#### Files changed

- `_redirects` (new)
- `index.html`
- `about.html`
- `safety.html`
- `privacy.html`

#### Commands run

- `git status` — confirmed clean before changes
- `git add` + `git commit` + `git push`
- No build command (not applicable — static site)
- No lint/test (not applicable)

#### Build/lint/test result

Not applicable. Static HTML, no build step.  
Cloudflare Pages will deploy on next push to main.

#### External actions required

**Cloudflare dashboard — REQUIRED for www redirect to work:**

1. Go to: https://dash.cloudflare.com → Workers & Pages → jgusewcomputers project  
2. Click **Custom domains** tab  
3. Click **Set up a custom domain**  
4. Enter: `www.jgusewcomputers.com`  
5. Cloudflare will add a CNAME record automatically (domain is already on Cloudflare)  
6. Wait for SSL provisioning (usually 1–2 minutes)  
7. The `_redirects` rule will now fire for www requests → redirect to apex

**Alternative (no _redirects needed):**  
Use Cloudflare Redirect Rules instead:  
Dashboard → Rules → Redirect Rules → Create rule  
- When: hostname equals `www.jgusewcomputers.com`  
- Then: Redirect to `https://jgusewcomputers.com${uri.path}` (301)  
This works without adding www as a Pages custom domain.

**EmailJS — Recommended:**  
Add `jgusewcomputers.com` and `www.jgusewcomputers.com` to Allowed Origins in EmailJS dashboard.

#### Git status after session

```
1 commit ahead of origin (or already pushed)
Working tree clean
```

---

### Session 2 — FIX 2: Metadata and technical SEO foundation

**Date:** 2026-05-26  
**Status:** Complete

#### What was inspected

- `index.html`: title informal, description present but not matching recommended copy, OG/Twitter present and absolute, missing `og:site_name` and `og:locale`.
- `about.html`: title acceptable, description decent, canonical present, OG and Twitter tags completely absent.
- `safety.html`: title acceptable, description decent, canonical present, OG and Twitter tags completely absent.
- `privacy.html`: title acceptable, description short but acceptable, canonical present, OG and Twitter tags completely absent.

#### Changes made

**`index.html`**
- Title updated to: `JGusew Computers | Practical Tech Help, Websites and AI Automation`
- Meta description updated to match recommended copy (computers, websites, forms, email setup, AI automation, no hype/jargon)
- Added `og:site_name` = `JGusew Computers`
- Added `og:locale` = `en_AU`
- Updated `og:title` and `twitter:title` to match new title
- Updated `og:description` and `twitter:description` to match recommended copy

**`about.html`**
- Title updated to: `About Jehiah Gusew — JGusew Computers`
- Meta description improved
- Added full OG block: `og:type`, `og:url`, `og:site_name`, `og:locale`, `og:title`, `og:description`, `og:image`
- Added full Twitter card block: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- OG image: `https://jgusewcomputers.com/assets/logos/horizontal-lockup-light.png` (absolute)

**`safety.html`**
- Meta description improved (added context sentence)
- Added full OG block (same pattern as about.html)
- Added full Twitter card block

**`privacy.html`**
- Meta description improved (added "we only ask for the details needed to understand your enquiry")
- Added full OG block (same pattern as about.html)
- Added full Twitter card block

#### Files changed

- `index.html`
- `about.html`
- `safety.html`
- `privacy.html`

#### Commands run

- `git add` + `git commit` + `git push`
- No build command (static site)

#### Build/lint/test result

Not applicable. Static HTML, no build step.

#### External actions required

None new. See FIX 1 external actions (www redirect, EmailJS origins) — still outstanding.

#### Git status after session

```
Committed and pushed to main
Working tree clean
```

---

### Session 3 — FIX 3: Sitemap and robots.txt

**Date:** 2026-05-26  
**Status:** Complete

#### What was inspected

- No `sitemap.xml` existed at repo root.
- No `robots.txt` existed at repo root.
- Cloudflare Pages serves static files from repo root directly — files placed here are reachable at their filename path.

#### Changes made

**New file: `sitemap.xml`**  
Standard XML sitemap. Includes all four public pages:
- `https://jgusewcomputers.com/` (priority 1.0, weekly)
- `https://jgusewcomputers.com/about.html` (priority 0.8, monthly)
- `https://jgusewcomputers.com/safety.html` (priority 0.7, monthly)
- `https://jgusewcomputers.com/privacy.html` (priority 0.6, monthly)

**New file: `robots.txt`**  
Allows all crawlers. References the sitemap:
```
User-agent: *
Allow: /

Sitemap: https://jgusewcomputers.com/sitemap.xml
```

#### Files changed

- `sitemap.xml` (new)
- `robots.txt` (new)

#### Commands run

- `git add` + `git commit` + `git push`

#### Build/lint/test result

Not applicable. Static HTML, no build step.  
After deploy: verify `https://jgusewcomputers.com/sitemap.xml` and `https://jgusewcomputers.com/robots.txt` return correctly.

#### External actions recommended (not required for this fix)

- Submit `https://jgusewcomputers.com/sitemap.xml` to Google Search Console once ownership is verified.
- Submit to Bing Webmaster Tools if desired.

#### Git status after session

```
Committed and pushed to main
Working tree clean
```

---
