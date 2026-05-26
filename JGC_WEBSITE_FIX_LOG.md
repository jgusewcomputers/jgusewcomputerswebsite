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

### Session 4 — FIX 4: Homepage clarity and conversion

**Date:** 2026-05-26  
**Status:** Complete

#### What was inspected

- Hero CTAs: primary said "Get help by email", secondary said "See services" — both needed updating per action plan brief.
- Services section heading was vague ("A handful of practical things, done carefully").
- Bento grid had 8 cards but was **missing website help and forms/enquiry systems** — the page title and meta description both mention websites and forms, but neither appeared in the services section, marquee, or footer services list.
- Marquee did not include website or forms items.
- Footer services list did not include website or forms items.
- Structured data serviceType array did not include website or forms.
- No fake testimonials, no jargon overuse, no excessive animation — these were already in good shape.

#### Changes made

**`index.html` — Hero section**
- Primary CTA: `"Get help by email"` → `"Ask for tech help"`
- Secondary CTA: `"See services"` → `"See how I can help"`

**`index.html` — Services section heading**
- h2: `"A handful of practical things, done carefully."` → `"Computers, websites, forms, email, AI automation and small business tech advice."`
- Description: added "in plain English" for clarity

**`index.html` — BentoServices**
- Added card: `"Website help"` (std) — plain static sites, contact forms, domain/hosting setup, no lock-in
- Added card: `"Forms and enquiry systems"` (std) — structured enquiry forms without complex tools

**`index.html` — Marquee**
- Added `"Website help"` and `"Forms and enquiry systems"` to items array

**`index.html` — Footer services list**
- Added `"Website help"` and `"Forms and enquiry systems"` links

**`index.html` — Structured data (ld+json)**
- Added `"Website help"` and `"Forms and enquiry systems"` to serviceType array

#### Files changed

- `index.html`

#### Commands run

- `git add` + `git commit` + `git push`

#### Build/lint/test result

Not applicable. Static HTML, no build step.

#### External actions required

None.

#### Git status after session

```
Committed and pushed to main
Working tree clean
```

---

### Session 5 — FIX 5: EmailJS contact/intake form improvements

**Date:** 2026-05-26  
**Status:** Complete

#### What was inspected

- Existing form fields: name (required), email (required), phone (optional), message (required).
- Missing context fields: no way to indicate home vs business, no service type, no urgency signal.
- EmailJS payload only sent: `from_name`, `from_email`, `phone`, `message`.
- No consent checkbox — users submitting had no explicit acknowledgement of privacy notice.
- No `htmlFor`/`id` associations on labels and inputs (accessibility gap, addressed here).

#### Changes made

**`index.html` — Contact component (complete rewrite of component)**

New state shape:
```js
{ name, email, phone, enquiry_type, service, urgency, message, consent }
```

New form fields added:
- **"This is for"** — toggle pill buttons: "Home / personal" / "Small business" (optional, deselectable)
- **"What do you need help with?"** — `<select>` dropdown with 8 service options matching the services section
- **"How soon do you need a response?"** — toggle pill buttons: "No rush" / "Soon — within a fortnight" / "Fairly urgent — a few days" (no "emergency" option — site is not an emergency service)
- **Consent checkbox** — required, links to privacy notice: "I understand JGusew Computers will use my contact details to respond to this enquiry. I've read the privacy notice."

New `TogglePills` component — reusable pill-button toggle group used for enquiry_type and urgency. Deselectable (clicking active option clears it). Dark glass styling to match form aesthetic.

Updated EmailJS payload now sends:
```js
{ from_name, from_email, phone, enquiry_type, service, urgency, message }
```
Optional fields send "Not specified" if left blank.

Submit button:
- Disabled when consent unchecked (in addition to existing sending/sent states)
- Label changed from "Send" → "Send enquiry" for clarity
- All existing states preserved: idle / sending / sent / error

Accessibility improvements:
- All inputs now have `id` attributes
- All labels now use `htmlFor` to match `id`

Copy:
- Contact section intro updated: "we only ask for the details needed to understand your enquiry — nothing more"
- Safety note link updated from inline scroll to `safety.html` href (more robust)

**EMPTY_FORM** and **SERVICES** constants extracted to module scope for clean reset on send.

#### ⚠️ MANUAL ACTION REQUIRED — EmailJS dashboard

The new form sends three new template variables: `enquiry_type`, `service`, `urgency`.  
**The EmailJS template must be updated to include these or they will be silently ignored.**

Steps:
1. Go to https://www.emailjs.com → Email Templates → `template_wnuvasi` → Edit
2. Add the new variables to the template body, e.g.:
   ```
   Enquiry type: {{enquiry_type}}
   Service: {{service}}
   Urgency: {{urgency}}
   ```
3. Save the template.

Until the template is updated, submitted forms will still arrive — the existing fields (name, email, phone, message) will continue to work. The new fields will just not appear in the email body.

#### Files changed

- `index.html`

#### Commands run

- `git add` + `git commit` + `git push`

#### Build/lint/test result

Not applicable. Static HTML, no build step.

#### External actions required

1. **EmailJS template update** (required for new fields to appear in emails) — see above.
2. **EmailJS Allowed Origins** — restrict to `https://jgusewcomputers.com` (outstanding from FIX 1).

#### Git status after session

```
Committed and pushed to main
Working tree clean
```

---

### Session 6 — FIX 6: Privacy policy and form trust copy

**Date:** 2026-05-26  
**Status:** Complete

#### What was inspected

- `privacy.html` doc-meta block had "v0.1 — draft" (Version) and "Free testing only" (Stage) — internal markers not suitable for a public-facing page.
- "What we collect" list didn't reflect the new fields added in FIX 5 (enquiry type, service, urgency).
- "How we use your information" — "Classify and assess the issue" was slightly internal; also missing the reassurance line about only collecting what's needed.
- No mention of EmailJS anywhere in the privacy notice, despite all form data passing through it.
- "How long we keep it" used "free testing stage" — internal language.
- Footer linked only Home and Safety; About was missing.
- The form CTA section in the notice had no direct email fallback for people who prefer not to use the form.

#### Changes made

**`privacy.html` — doc-meta block**
- Removed: "Version: v0.1 — draft" (internal marker)
- Removed: "Stage: Free testing only" (internal marker)
- Kept: Owner, Last updated
- Added: Contact field with email address

**`privacy.html` — "What we collect"**
- Added reassurance line at top: "We only ask for the details needed to understand your enquiry — nothing more."
- Updated list to reflect new form fields added in FIX 5: enquiry type (home/business), service type, urgency

**`privacy.html` — "How we use your information"**
- Removed "Classify and assess the issue" (too internal)
- Tightened bullet list to plain-English purpose statements
- Expanded non-sharing statement: "We do not share your details with third parties for their own purposes."

**`privacy.html` — New section: "How contact form enquiries are delivered"**
- Added between "Where information is stored" and "How long we keep it"
- Explains EmailJS is used to deliver form submissions
- Notes JGusew Computers does not operate a custom backend
- Links to EmailJS privacy policy
- Offers direct email as alternative for users who prefer not to use the form

**`privacy.html` — "How long we keep it"**
- "free testing stage" → "current launch period"
- Added "promptly" to the redaction sentence

**`privacy.html` — Footer**
- Added "About" link between Home and Safety
- Added "Sunbury, VIC, Australia" to copyright line

#### Files changed

- `privacy.html`

#### Commands run

- `git add` + `git commit` + `git push`

#### Build/lint/test result

Not applicable. Static HTML, no build step.

#### External actions required

None new. FIX 5 external actions (EmailJS template update, Allowed Origins) still outstanding.

#### Git status after session

```
Committed and pushed to main
Working tree clean
```

---

### Session 7 — FIX 7: Service pages

**Date:** 2026-05-26  
**Status:** Complete

#### What was done

Created six new service pages in `/services/` subdirectory. Each page follows the same `doc-nav` / `doc-wrap` pattern as `about.html`, `safety.html`, and `privacy.html`.

All asset paths use `../` prefix (e.g. `../colors_and_type.css`, `../assets/logos/monogram-light.webp`) since pages live one level below root.

Each page contains: eyebrow, H1, intro, "What we help with" section, "How it works" or equivalent, "Honest expectations" section, CTA with two buttons (service-specific "Ask about…" + "All services"), footer with full site links.

#### Files created

- `services/computer-help.html` — covers: new computer advice, slow computer assessment, repair vs replace
- `services/website-help.html` — covers: new static sites, improvements, contact forms, domain/hosting, email setup
- `services/forms-enquiry-systems.html` — covers: contact forms, structured intake forms, enquiry routing
- `services/ai-automation.html` — covers: workflow mapping, automation identification, free-first options; includes "AI drafts. A person reviews." pillar
- `services/email-account-cleanup.html` — covers: inbox cleanup, account separation, retiring old accounts, digital organisation; explicitly states no password/login access
- `services/small-business-tech-advice.html` — covers: tools audit, workflow pain, security gaps, technology decisions

#### Files modified

**`index.html` — BentoCard component**
- Added optional `href` prop
- When `href` is present, renders a "Details →" inline link at the bottom of the card
- Eight cards now link to their corresponding service pages:
  - New computer advice, Slow computer, Repair vs replace → `services/computer-help.html`
  - Website help → `services/website-help.html`
  - Forms and enquiry systems → `services/forms-enquiry-systems.html`
  - Email cleanup → `services/email-account-cleanup.html`
  - AI automation → `services/ai-automation.html`
  - Small business tech review → `services/small-business-tech-advice.html`
- Scam & security triage and Elderly tech help have no dedicated service page — no link added

**`sitemap.xml`**
- Added all six service page URLs (priority 0.8, monthly)

#### Commands run

- `git add` + `git commit` + `git push`

#### Build/lint/test result

Not applicable. Static HTML, no build step.

#### External actions required

None new.

#### Git status after session

```
Committed and pushed to main
Working tree clean
```

---

### Session 8 — FIX 8: Cloudflare Pages security headers

**Date:** 2026-05-26  
**Status:** Complete (phase 1 — safe headers applied; CSP and HSTS held)

#### External dependencies audited before writing headers

Scripts loaded by `index.html`:
- `cdn.jsdelivr.net` — EmailJS browser SDK
- `unpkg.com` — React 18, ReactDOM 18, Babel standalone
- `api.emailjs.com` — EmailJS send endpoint (XHR/fetch from browser)

Styles loaded by `colors_and_type.css`:
- `fonts.googleapis.com` — Google Fonts CSS
- `fonts.gstatic.com` — Google Fonts actual font files

#### What was applied

**New file: `_headers`** (at repo root = Cloudflare Pages output root)

```
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

Applied to all paths via `/*`. These four headers have no interaction with the CDN scripts, fonts, or EmailJS.

**Header rationale:**
- `X-Content-Type-Options: nosniff` — prevents MIME-type sniffing; browsers must respect declared Content-Type
- `Referrer-Policy: strict-origin-when-cross-origin` — sends full URL for same-origin, only origin for cross-origin HTTPS, nothing for downgrade to HTTP
- `X-Frame-Options: DENY` — prevents any page on this site from being embedded in an iframe on another domain
- `Permissions-Policy: camera=(), microphone=(), geolocation=()` — disables browser API access to camera, microphone, and geolocation for all origins

#### What was deliberately held

**Content-Security-Policy** — not yet applied. Reason: Babel standalone (loaded from unpkg.com) uses `eval()` internally. A safe CSP must include `'unsafe-eval'` in `script-src`, which significantly weakens the CSP value. When/if Babel CDN is replaced with compiled/vanilla JS (FIX 10 consideration), CSP becomes practical. Full allowlist for reference when ready:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://cdn.jsdelivr.net https://unpkg.com 'unsafe-eval';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.emailjs.com;
  img-src 'self' data: https:;
  frame-ancestors 'none';
```

**Strict-Transport-Security (HSTS)** — not yet applied. Cloudflare Pages already enforces HTTPS, but HSTS commits the browser to HTTPS for the declared `max-age`. Safe to add once HTTPS stability is confirmed; suggested value: `Strict-Transport-Security: max-age=63072000; includeSubDomains`.

#### Files changed

- `_headers` (new)

#### Commands run

- `git add` + `git commit` + `git push`

#### Build/lint/test result

Not applicable. Static HTML, no build step.  
Cloudflare Pages reads `_headers` from the output root on next deploy. Verify with browser DevTools → Network → response headers after deploy.

#### External actions required

None. `_headers` at repo root is picked up automatically by Cloudflare Pages.

#### Git status after session

```
Committed and pushed to main
Working tree clean
```

---

## FIX 9 — Accessibility and mobile usability pass

**Date:** 2026-05-26  
**Status:** Done  
**Files changed:** `premium.css`, `index.html`, `about.html`, `safety.html`, `privacy.html`, all 6 service pages

---

### What was done

#### Heading hierarchy

- `index.html` ExplainerBand: all three `<h4>` headings → `<h2>` (correct document outline)
- `index.html` SafetyBand: `<h3>` → `<h2>` (was nested under H1 incorrectly)
- `index.html` Footer: all four `<h5>` column headings → `<h3>` (Services, Trust, About, Contact)

#### Skip link

- Added `<a href="#main-content" className="skip-link">Skip to main content</a>` as first element in App render
- Added `id="main-content"` to `<main>` element
- Skip link CSS added to `premium.css`: visually hidden until focused, slides in from top on `:focus`

#### Focus visible

- Added global `:focus-visible` rule in `premium.css`: 2px glow-blue outline, 3px offset, 4px border-radius
- Excluded `.glass-form` inputs (they have their own glow focus style)

#### Mobile navigation hamburger

- Nav brand `<div>` → `<button>` with `aria-label="JGusew Computers — back to top"` and inline style reset
- Added hamburger `<button>` with `aria-expanded`, `aria-controls="nav-menu"`, `aria-label` (toggles between open/close text)
- Menu `<div>` given `id="nav-menu"` matching hamburger `aria-controls`
- All nav item click handlers call `closeMenu()` so menu closes on selection
- `menuOpen` state drives `.open` class on both hamburger and menu
- CSS: hamburger hidden on desktop, displayed on `≤768px`; menu hidden by default, shown as `flex-direction: column` when `.open`; hamburger spans animate to ✕ when open

#### Decorative SVG aria-hidden

- `aria-hidden="true" focusable="false"` added to all decorative SVGs across:
  - `index.html`: Arrow component, BentoCard "Details →" arrow
  - `about.html`, `safety.html`, `privacy.html`: back-arrow and forward-arrow SVGs (replace_all)
  - All 6 service pages: back-arrow and forward-arrow SVGs (replace_all)

#### Tap target

- BentoCard "Details →" link: added `padding: "6px 10px", margin: "-6px -10px"` to expand clickable area to ≥44px without changing visual layout

---

#### Build/lint/test result

Not applicable. Static HTML, no build step.

#### External actions required

None.

#### Git status after session

```
Committed and pushed to main
Working tree clean
```

---
