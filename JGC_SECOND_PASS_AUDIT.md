# JGC Website — Second-Pass Audit

**Site:** https://jgusewcomputers.com  
**Repo:** https://github.com/jgusewcomputers/jgusewcomputerswebsite  
**Audit date:** 2026-05-26  
**Completed fixes reviewed:** FIX 1–9  
**Live checks:** Performed  
**Git status at audit:** Clean — working tree has no uncommitted changes  

---

## ⚠️ CRITICAL FINDING — READ FIRST

**The live site is NOT serving the code from the GitHub repo.**

Live checks confirm the Cloudflare Pages project is serving an original Direct Upload snapshot that predates ALL nine completed fixes. None of FIX 1 through FIX 9 are live on jgusewcomputers.com.

Evidence:
- `https://jgusewcomputers.com/` returns `<title>JGusew Computers — Practical technology help without the hype</title>` — the pre-FIX 2 title. The repo has `JGusew Computers | Practical Tech Help, Websites and AI Automation`.
- OG image on live site is a relative URL (`assets/logos/horizontal-lockup-light.png`) — FIX 1 changed all OG images to absolute URLs.
- No canonical tag in live `<head>` — FIX 1 added canonical tags to all pages.
- `https://jgusewcomputers.com/sitemap.xml` → **404 Not Found** — FIX 3 added sitemap.xml to repo root.
- `https://jgusewcomputers.com/services/computer-help.html` → **404 Not Found** — FIX 7 created all six service pages.
- `https://jgusewcomputers.com/services/computer-help` (no extension) → **404 Not Found**.
- Security headers (`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`) are absent from live response headers — FIX 8 added `_headers` to repo root.
- `https://jgusewcomputers.com/about.html` → 307 → `/about` (Cloudflare Pages HTML extension stripping), but the live `/about` page has the old title "About — JGusew Computers" not "About Jehiah Gusew — JGusew Computers" from FIX 2.
- `https://jgusewcomputers.com/robots.txt` returns **Cloudflare Content Signals boilerplate** — not the custom robots.txt from the repo.
- `https://www.jgusewcomputers.com/` → DNS resolution failure (exit code 6) — the www subdomain has never been added as a Cloudflare Pages custom domain.

**Action required before FIX 10:** Fix the Cloudflare Pages deployment so that GitHub pushes trigger a live deploy. See section H and the Decision section at the end.

---

## A. Executive Summary

### Scores — two columns: repo (what was built) vs live (what the public sees)

| Dimension | Repo score | Live site score | Movement |
|-----------|-----------|-----------------|----------|
| Overall website health | 70 / 100 | 35 / 100 | — |
| Business usefulness | 76 / 100 | 48 / 100 | — |
| Technical quality | 65 / 100 | 30 / 100 | — |
| Trust and credibility | 80 / 100 | 42 / 100 | — |
| Conversion readiness | 72 / 100 | 34 / 100 | — |
| Maintenance risk | 55 / 100 | 20 / 100 | — |

Repo scores reflect nine completed, well-executed fixes. Live scores reflect the original Direct Upload state — effectively the pre-audit baseline. The gap between the two is the deployment problem.

### Summary points

**Biggest improvement since the first audit (repo):** The form (FIX 5). The new fields — enquiry type, service selector, urgency pills, consent checkbox — transform a generic contact form into a structured intake that will genuinely help triage enquiries faster. The TogglePills component and EMPTY_FORM constant are well-implemented.

**Biggest remaining risk:** The deployment pipeline. The GitHub repo is fully up-to-date and correct. The Cloudflare Pages project is not reading from it. Every improvement made in FIX 1–9 is invisible to the public and to search engines.

**Biggest commercial opportunity:** Getting the deployment working so the six service pages go live. These pages target specific search queries ("computer help Sunbury", "small business website help", etc.) and have structured CTAs back to the contact form. Currently they don't exist on the live site.

**Whether to continue with FIX 10:** No. Pause and fix the Cloudflare Pages deployment connection first. FIX 10 (performance) done on code that isn't live is premature.

---

## B. Same vs Different Comparison

| # | Original issue | Original severity | Current status | Same / Improved / Worse / New | Evidence from repo | Evidence from live site | Next action |
|---|----------------|-------------------|----------------|-------------------------------|-------------------|------------------------|-------------|
| 1 | www subdomain unreachable | High | Not fixed | Same | `_redirects` rule present but requires Cloudflare dashboard step | `www.jgusewcomputers.com` — DNS failure (curl exit 6) | Add www as Cloudflare Pages custom domain OR add Cloudflare Redirect Rule |
| 2 | No canonical tags | High | Fixed in repo, not live | Improved (repo) / Same (live) | All 10 pages have canonical tags | Live `<head>` has no canonical tag | Fix deployment |
| 3 | Weak/wrong metadata | Medium | Fixed in repo, not live | Improved (repo) / Same (live) | Updated title, description, og:site_name, og:locale on all pages | Live title is pre-FIX 2 informal title | Fix deployment |
| 4 | Relative OG image URLs | Medium | Fixed in repo, not live | Improved (repo) / Same (live) | All OG images are absolute `https://jgusewcomputers.com/assets/...` | Live OG image is still relative `assets/logos/...` | Fix deployment |
| 5 | No sitemap.xml | High | Fixed in repo, not live | Improved (repo) / Worse (live) | `sitemap.xml` at repo root, 10 URLs, correct namespace* | `/sitemap.xml` → 404 | Fix deployment; also fix namespace (see note) |
| 6 | No robots.txt | Medium | Fixed in repo, replaced by Cloudflare on live | New issue | `robots.txt` at repo root, correct format, references sitemap | Cloudflare is serving Content Signals boilerplate instead | Fix deployment; investigate Cloudflare Content Signals override |
| 7 | No service pages | High | Fixed in repo, not live | Improved (repo) / Same (live) | Six complete service pages in `/services/`, all linked from bento grid | All `/services/*` URLs → 404 | Fix deployment |
| 8 | Homepage copy weak | High | Fixed in repo, not live | Improved (repo) / Same (live) | New hero CTAs, correct services heading, bento grid updated | Live homepage is original pre-fix version | Fix deployment |
| 9 | Form missing context fields | Medium | Fixed in repo, not live | Improved (repo) / Same (live) | TogglePills, service select, consent checkbox, urgency | Live form is original 4-field version | Fix deployment; then update EmailJS template |
| 10 | Privacy policy had internal markers | Low | Fixed in repo, not live | Improved (repo) / Same (live) | "v0.1 — draft" and "Free testing only" removed, EmailJS section added | Live privacy page is old version | Fix deployment |
| 11 | No accessibility features | Medium | Fixed in repo, not live | Improved (repo) / Same (live) | Skip link, focus-visible, hamburger nav, h5→h3 headings, aria-hidden SVGs | Live site has none of these | Fix deployment |
| 12 | No security headers | Medium | Fixed in repo, not live | Improved (repo) / Same (live) | `_headers` file in repo root with 4 safe headers | No custom headers in live responses | Fix deployment |
| 13 | React/Babel CDN performance | High | Not fixed — repo uses dev build | Same | `react.development.js` loaded (not production min); Babel standalone ~900KB+ | Same on live | FIX 10 should switch to production React builds and consider removing Babel |
| 14 | No analytics | Low | Not started | Same | No GA4, no Cloudflare Analytics configured | No analytics visible | FIX 11 |
| 15 | No automation | Low | Not started | Same | EmailJS to email only | Same | FIX 12 when ready |

**\* Sitemap namespace note:** The sitemap.xml uses `xmlns="http://www.sitemaps.org/schemas/sitemap/9/0"`. The correct namespace is `http://www.sitemaps.org/schemas/sitemap/0.9`. This appears to be a typo. Google's parser is lenient and will likely still process it, but it should be corrected. Minor fix.

### Additional new issues found in this audit

| # | Issue | Severity | Where |
|---|-------|----------|-------|
| N1 | GitHub → Cloudflare Pages integration not working | Critical | Cloudflare dashboard |
| N2 | Cloudflare Content Signals overriding custom robots.txt | High | Cloudflare dashboard |
| N3 | Sitemap namespace typo (`/9/0` instead of `/0.9`) | Low | `sitemap.xml` line 2 |
| N4 | React loaded as development build (not production min) | Medium | `index.html` lines 77–78 |
| N5 | Canonical tags use `.html` extension; Cloudflare Pages strips it (307 redirect) | Medium | All static pages |
| N6 | Static pages (about, safety, privacy, services/*) have no skip link | Low | All static HTML pages |
| N7 | `.doc-nav` CSS duplicated inline in every static page | Low | 9 pages |
| N8 | Footer "Services" links scroll to `#services` section, not individual service pages | Low | `index.html` footer |
| N9 | EmailJS public key hardcoded and no integrity attribute on EmailJS CDN `<script>` | Low | `index.html` line 74–75 |
| N10 | `check-circle-on-light.png` still served as PNG (not WebP like the other icons) | Very low | `index.html` ICON constant |

---

## C. Website Purpose and Business Alignment

**Based on repo state (not yet live):**

The site now clearly answers all five key questions:

- **Who it helps:** Everyday people and small businesses — stated in the hero, the lead paragraph, the explainer band, and repeated throughout.
- **What problems it solves:** Computers, websites, forms, email setup, AI automation, small business tech advice. Listed in the services section heading, bento grid, marquee, structured data.
- **Why people should trust it:** The "AI drafts. Jehiah reviews." pillar is stated in the nav, hero, how-it-works, callout section, about page, and safety page — appropriately consistent without feeling repetitive. The "Free during launch" badge is explained in the explainer band so it doesn't feel suspicious.
- **What action visitors should take:** The hero has two clear CTAs (Ask for tech help / See how I can help). The contact form is structured and friction-appropriate. Each service page has a specific "Ask about…" CTA.
- **Tone:** Calm, plain-English, specific, honest. The "Honest expectations" sections on service pages are particularly well-judged — they set realistic expectations without being off-putting.

**Concerns remaining:**
- The "Free during launch" positioning will need updating before the business moves to paid. This phrase appears in 5+ places.
- No pricing signal at all for future reference — sensible now but worth planning.
- The site is email-only. For Sunbury VIC local search, a phone number or physical address (even just suburb) would help local SEO. The suburb is mentioned in footer copy and structured data but there's no local phone signal.

---

## D. Technology Stack Review

### Confirmed from repo

| Component | Detail | Assessment |
|-----------|--------|------------|
| Static HTML | Pure static, no package.json, no build tool | Simple, reliable, cheap. Right for this stage. |
| Cloudflare Pages | GitHub integration intended, currently serving Direct Upload | Platform is correct; integration is broken |
| GitHub | Repo at jgusewcomputers/jgusewcomputerswebsite | Correct. All commits clean. |
| EmailJS | CDN-loaded browser SDK, public key in HTML | Acceptable for client-side. No Allowed Origins restriction is the gap. |
| React 18 + Babel standalone | CDN-loaded, JSX compiled in-browser at runtime | Works. Development build is the performance concern. Babel runtime is the biggest page-weight item. |
| Google Fonts | Loaded via @import in `colors_and_type.css` | Render-blocking risk. font-display: swap is present. Preconnect hint is not. |
| SRI integrity | React and Babel have integrity hashes | Good. EmailJS script has no integrity attribute. |
| WebP images | Icons and logos converted | Done well. One PNG icon remains (check-circle-on-light.png). |

### Confirmed from live site

- Main page: Serving original Direct Upload. Not GitHub-sourced.
- About, safety, privacy: Serving old versions (no OG tags, old titles).
- Service pages: 404.
- Sitemap, robots.txt, _headers, _redirects: Either 404, overridden by Cloudflare, or not in effect.

### Inferred risks

- The Cloudflare Pages GitHub integration may have been "enabled" in the Cloudflare dashboard but not fully configured (wrong branch, wrong output dir, or the GitHub repo is not actually linked).
- Cloudflare's Content Signals feature (which serves its own AI-permission robots.txt) may continue to override the custom robots.txt even after the deployment is fixed. This is a Cloudflare product-level change that requires a dashboard setting to resolve.
- The development React builds increase page weight and disable React's production optimisations (profiling mode, non-batched updates, etc.).

---

## E. Performance and Speed

### Current performance risks (repo state)

**Render-blocking scripts — High impact:**

```html
<!-- Line 77 — react.development.js: ~1.1MB unminified -->
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js" ...>
<!-- Line 78 — react-dom.development.js: ~3.7MB unminified -->
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" ...>
<!-- Line 79 — babel.min.js: ~900KB minified -->
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" ...>
```

The React builds loaded are the **development** variants — significantly larger than the production-minified versions:
- `react.development.js` (~1.1MB) vs `react.production.min.js` (~7KB)
- `react-dom.development.js` (~3.7MB) vs `react-dom.production.min.js` (~130KB)

This is the single highest-impact quick win in FIX 10. Switching to production builds requires a one-line change per script tag. No other changes needed.

Babel standalone (900KB minified) is harder to eliminate without a build step, but the React build switch alone saves ~4MB of page weight.

**Google Fonts — Medium impact:**
- Loaded via `@import` inside `colors_and_type.css` (render-blocking).
- `font-display: swap` is present — mitigates FOIT.
- No `<link rel="preconnect" href="https://fonts.googleapis.com">` or `<link rel="preconnect" href="https://fonts.gstatic.com">` in `<head>`. Adding these shaves 50–200ms on first load.

**EmailJS CDN — Low impact:**
- `cdn.jsdelivr.net/@emailjs/browser@4` — reasonable size, fast CDN. Low concern.

**Images:**
- Icons and logos converted to WebP (confirmed). Well done.
- `loading="lazy"` on below-fold images (confirmed). Well done.
- The `horizontal-lockup-light.png` referenced in OG tags is still PNG (not WebP), but OG images are fetched by crawlers, not rendered in the browser, so this is not a performance issue.
- The `assets/photos/jehiah-seated.jpg` on the about page — JPEG is fine for photos; WebP would be slightly better. Not urgent.

**CSS:**
- The `.doc-nav` style block is duplicated inline in all 9 static page `<style>` tags. Not a real performance problem at this site size, but adds maintenance overhead.

**Core Web Vitals risk assessment:**
- LCP (Largest Contentful Paint): The H1 and hero are text rendered by React — they're blocked until React + Babel parse and execute. On slow mobile connections, LCP will be poor.
- CLS (Cumulative Layout Shift): Fonts use `font-display: swap` — some swap flash possible. Otherwise layout is not data-dependent.
- INP (Interaction to Next Paint): React on mobile should be fine given the relatively small component tree.

**FIX 10 priority order:**
1. Switch React to production min builds (5-minute change, massive weight reduction)
2. Add `<link rel="preconnect">` for Google Fonts CDN
3. Consider Babel alternatives after the deployment is stable

---

## F. SEO and Search Visibility

### Repo state

**What's in good shape:**
- Unique, descriptive titles on all 10 pages.
- Meta descriptions on all 10 pages — practical, specific.
- Canonical tags on all 10 pages.
- Full OG and Twitter card metadata on all 10 pages including og:site_name, og:locale, og:url.
- Sitemap includes all 10 URLs at correct priorities.
- robots.txt allows all crawlers and references the sitemap.
- Heading hierarchy fixed: H1 → H2 → H3 structure on homepage (FIX 9).
- Structured data: `ProfessionalService` + `Person` graph on homepage. All 12 service types listed.
- Internal linking: bento cards link to service pages; service pages link back to homepage sections.

**What's weak or missing in repo:**
- Sitemap namespace typo (`/9/0` instead of `/0.9`). Minor but fix it before submitting to Search Console.
- Canonical URLs use `.html` extension; Cloudflare Pages strips `.html` and redirects (307) to the extensionless URL. After deployment, canonical tags will point to `about.html` but the page is served at `/about`. Canonical mismatch risk. Fix: update canonical tags to remove `.html` extension. Medium priority.
- Local SEO signals are minimal. Sunbury VIC is in footer and structured data, but no local phone number, no Google Business Profile reference. For a service targeting local customers, this is a gap.
- `areaServed: "Online"` in structured data — for a local Sunbury-area provider, consider `"areaServed": {"@type": "City", "name": "Sunbury", "addressRegion": "VIC", "addressCountry": "AU"}` or at least a wider region.
- No breadcrumb schema on service pages.
- Footer "Services" links point to `#services` (homepage anchor) rather than to individual service pages — missed internal linking opportunity.

### Live site state

**Nothing from the repo SEO improvements is live.** The live site has:
- No canonical tags.
- Relative OG image URLs.
- No sitemap (404).
- Cloudflare Content Signals boilerplate at `/robots.txt` (not custom).
- No service pages.
- Old title/description on all pages.

From Google's perspective, this site currently has: a reasonable homepage (old copy), about/safety/privacy pages (old metadata), and nothing else.

**robots.txt Cloudflare override — important context:**
Cloudflare has rolled out a "Content Signals" feature that intercepts `/robots.txt` requests at the CDN edge and serves its own policy file regarding AI crawlers. This is separate from your custom `robots.txt` file and overrides it. Even after the deployment is fixed, this may continue. To restore control of your own robots.txt, the Content Signals feature needs to be disabled or configured in the Cloudflare dashboard.

---

## G. Accessibility and Usability

### Repo state — FIX 9 assessment

All FIX 9 tasks were completed and committed correctly:

**Well implemented:**
- Skip link: `<a href="#main-content" className="skip-link">` with `id="main-content"` on `<main>`. CSS shows and hides it correctly on `:focus`.
- Focus visible: Global `:focus-visible` rule with glow-blue outline. Excluded from `.glass-form` inputs (which have their own glow) — correct.
- Mobile hamburger nav: `aria-expanded`, `aria-controls`, `aria-label` all present and toggling correctly. `closeMenu()` called on all item selections. CSS spans animate to ✕.
- Heading hierarchy: ExplainerBand h4→h2, SafetyBand h3→h2, Footer h5→h3. Correct.
- Decorative SVGs: `aria-hidden="true" focusable="false"` applied across all pages. Correct.
- Tap target: BentoCard "Details →" link has `padding: 6px 10px, margin: -6px -10px` to expand hit area without changing visual layout. Correct.

**Gaps remaining:**
- Static pages (about.html, safety.html, privacy.html, all 6 service pages) have **no skip link**. The skip link was added only to the React App component in index.html. This is a genuine accessibility gap for keyboard users on those pages.
- The static page nav (`.doc-nav`) has no hamburger on mobile. On small screens, the brand + back link should still be manageable, but there's no responsive check. Worth testing.
- The consent checkbox in the contact form lacks an explicit `htmlFor` on the wrapping label. The checkbox is inside the label which makes it functional, but a dedicated `id` + `htmlFor` would be more robust.
- No `lang` attribute added to service pages — confirmed `lang="en"` is present on all pages. ✓

---

## H. Security and Risk

### Confirmed facts from repo

- `_headers` at repo root: 4 safe headers applied (`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`).
- CSP deliberately held — documented reason: Babel standalone requires `'unsafe-eval'` which severely weakens CSP.
- HSTS deliberately held — documented reason: pending HTTPS stability confirmation.
- All pages served over HTTPS (Cloudflare Pages enforces this).

### Confirmed facts from live site

- **None of the `_headers` headers are present in live responses.** The live site has zero custom security headers.
- No `Content-Security-Policy` (expected — deliberately held).
- No `Strict-Transport-Security` (expected — deliberately held).

### Inferred risks

**EmailJS public key exposure:** The public key `dEyzQD3JwgIZVH6vh` is visible in the page source. This is acceptable — EmailJS public keys are designed to be client-side. But without Allowed Origins restriction in the EmailJS dashboard, anyone who reads your source can send emails using your EmailJS allocation. Medium risk; easy fix in the EmailJS dashboard.

**Form spam:** No CAPTCHA. EmailJS free tier has a 200 email/month limit. A spam bot that discovers the EmailJS service ID and template ID in your source could exhaust this limit. Risk is low for now (site has low traffic) but will grow. Cloudflare's own bot protection may help.

**Cloudflare dashboard steps outstanding:**
1. GitHub integration for Cloudflare Pages (not done — critical)
2. www custom domain or Redirect Rule (not done — high)
3. Disable/configure Content Signals robots.txt override (newly identified — high)
4. EmailJS Allowed Origins (not done — medium)

---

## I. Content Quality and Trust

### Homepage (repo state — not live)

The copy is good. Specific, honest, calm. Key quality signals:

- "Free during launch" is explained, not just stated — the explainer band clarifies what this actually means. Visitors won't feel tricked.
- "AI drafts. Jehiah reviews." is stated enough times to land as a genuine pillar, not just a tagline.
- The JehiahNote component is the best part of the homepage: *"the chrome and the glass on this page is the brand; the help underneath is just me"* — this is genuine and specific. It doesn't sound AI-written.
- "No hype · No pressure · No pretending it's easy" — this is well-targeted at the anxiety of non-technical users who've been burned by tech shops before.
- Safety band warning ("Please don't send passwords…") is prominent and not buried.

**One concern:** Some service page copy in the bento grid is verbose for a card. "When every store says something different, we help you understand what suits your needs, what specs matter, what's overkill, and what's likely poor value. Refurbished, new, repair, replace — we compare honestly so you don't overspend." — this is good copy but long for a card. Not a critical issue.

### Service pages

The service pages are consistent in structure and honest in tone. The "Honest expectations" sections are particularly strong — they build trust by explicitly listing what the service is NOT, which is unusual and credible.

**Minor gap:** The service pages don't have Jehiah's direct email address as a fallback (they have "Ask about [service]" CTA that goes to the homepage contact form, but no `mailto:` fallback like the main contact section). Some visitors prefer email direct.

### About page

The about page is specific and human. Mentions the suburb, explains the approach, sets expectations. The "AI drafts. Jehiah reviews." pillar block in the about page is well-placed.

### Privacy and safety pages

Both are public-ready. The privacy page correctly:
- Removes internal markers (done in FIX 6).
- Lists EmailJS as the delivery mechanism.
- Offers `mailto:` as an alternative to the form.
- Has correct data retention language for a launch-period service.

---

## J. Conversion and Lead Generation

### CTA placement (repo state)

- **Hero:** Two CTAs — primary "Ask for tech help" (→ contact form), secondary "See how I can help" (→ services section). Clear hierarchy. Well-placed.
- **Each service page:** "Ask about [service]" primary CTA → `../index.html#contact`. Correct.
- **"Get help by email" in nav:** Present but slightly overshadowed by the hamburger on mobile. Ensure this button remains visible on smaller screens after the mobile nav CSS applies.

### Form quality

The updated form (FIX 5) is genuinely good. The toggle pills for enquiry type and urgency are a better UX pattern than dropdowns for binary/ternary choices. The service dropdown covers the right options. The consent checkbox is required before submission.

**Outstanding:** The EmailJS template still needs to be updated in the EmailJS dashboard to surface the new fields (`enquiry_type`, `service`, `urgency`). Until this is done, new form submissions will arrive with only name/email/phone/message in the email body.

### Friction points

- Email-only — no phone number. Some older or more anxious users may abandon if they can't speak to someone. Acceptable for now given the single-operator setup.
- No pricing. No pricing is fine for a free-launch service, but once pricing is introduced, the form will need a note about what happens after submission (e.g. "We'll reply with a quote estimate within 1 working day").
- Form has no character counter on the message textarea. Minor.

### Missing trust signals

- No testimonials or case studies (deliberate — no fake ones, which is correct. Real ones could be added once work is done).
- No Google Business Profile or any third-party review signal.
- No response-time guarantee beyond "within 1 working day" — acceptable.

---

## K. Analytics, Tracking, and Business Intelligence

### Currently missing (confirmed)

No analytics of any kind are configured on the live site or in the repo. This means:

- No visibility into how many visitors arrive.
- No way to know which pages visitors read before contacting.
- No data on which service resonates most.
- No form submission success/failure rate.
- No search query data.

### Recommended free options (priority order)

1. **Google Search Console** — free, no code change. Verify ownership via HTML meta tag or DNS TXT record. Submit the sitemap. See what queries bring traffic. Start this now — it takes time to collect data.
2. **Cloudflare Web Analytics** — zero code. Enable in Cloudflare dashboard → Analytics → Web Analytics. Privacy-friendly, GDPR-compliant. Shows page views, visitors, top pages.
3. **GA4** — more detail, requires a `<script>` snippet in every `<head>`. Useful once traffic grows. Not urgent for launch.

### Key events to track when GA4 is added

- `form_submit_success` — correlate with enquiry quality.
- `form_submit_error` — identify submission failures.
- `service_cta_click` — see which service pages generate intent.
- `email_link_click` — track `mailto:` clicks as alternative contact signal.

---

## L. Cost, Maintainability, and Operational Efficiency

### Where the site is cheap and good

| Component | Cost | Quality | Risk |
|-----------|------|---------|------|
| Cloudflare Pages hosting | Free | Excellent | Low |
| GitHub repo | Free | Excellent | Low |
| EmailJS free tier | Free (200/mo) | Good | Low (for now) |
| Custom domain | Domain registration only | Good | Low |
| Static HTML files | £0 | Good | Low |

### Where the site is cheap but carries future risk

| Component | Current cost | Future risk |
|-----------|-------------|-------------|
| React dev build from unpkg.com | Free | Performance and availability — unpkg.com is a third-party CDN with occasional outages |
| Babel standalone | Free | 900KB+ page weight; no production build means no tree-shaking |
| EmailJS 200/mo limit | Free | When traffic grows, free tier is quickly exhausted by spam or genuine volume |
| Inline duplicate CSS (doc-nav block in 9 files) | Zero now | Maintenance cost grows with every style change |
| No build step | Zero now | Once the React JSX becomes complex, debugging in browser Babel is painful |

### What will become painful later

1. **Updating the nav style** across all static pages requires editing 9 files. This is fine now but will compound.
2. **Adding a new page** requires copying the full HTML boilerplate including the inline CSS block.
3. **Content changes** to service pages require knowing which file to edit and where. No CMS.
4. **The "Free during launch" copy** appears in many places — when the service transitions to paid, this will need a multi-file find-and-replace.

### Whether a simple build step is worth it later

Not yet. The overhead of a build step is not justified at this stage. The right trigger for a build step would be: "The JSX is complex enough that browser Babel debugging is a problem" OR "We need code splitting / lazy loading" OR "We want to add TypeScript." None of these apply now.

The one change that IS worth doing now (FIX 10): switch the React CDN URLs from `react.development.js` to `react.production.min.js`. No build step needed. Saves ~4MB of page weight.

---

## M. Automation and AI Opportunities

### Current flow

```
Visitor fills form → EmailJS → email to hello@jgusewcomputers.com → Jehiah reviews manually
```

This is correct for the current stage. No automation should be added until the base flow is working and generating real enquiries.

### Immediate next step once deployment is fixed

Update the EmailJS template to include the three new variables (`enquiry_type`, `service`, `urgency`). This is a manual dashboard step, not a code change. Once done, Jehiah receives structured enquiry emails that show:
- Is this for home or business?
- What service do they need?
- How urgent?

This alone reduces the triage step significantly.

### Near-term (3–6 months)

Once real enquiry volume is running:
- Consider a simple Google Sheets log of enquiries (can be exported from Gmail manually or via Zapier on a free plan).
- Google Search Console data will show which search queries lead to contact — useful for refining service page copy.

### Medium-term (6–12 months)

If volume justifies it:
- EmailJS Pro plan ($15/mo) unlocks webhooks.
- Webhook → n8n (self-hosted, free) or Make (free tier) → auto-create an enquiry record in a Google Sheet → Slack or email notification with AI summary.
- This is a natural JGusew Computers demo case: "Here's how I automated my own intake process."

### Demo opportunity

JGusew Computers offers AI automation as a service. The current intake → manual review → reply workflow is a genuine example of a process that COULD be automated, but where the business owner has made a deliberate choice to keep it human. This is worth calling out on the site ("We could automate this, but we choose not to") as a trust differentiator.

---

## N. Improvement Levels

### Level 1 — Basic Cleanup (Do now or very soon)

- Fix Cloudflare Pages deployment (critical)
- Fix Cloudflare Content Signals robots.txt override (high)
- Add www as Cloudflare Pages custom domain or Redirect Rule (high)
- Update EmailJS template with new variables (high)
- Restrict EmailJS Allowed Origins (medium)
- Fix sitemap namespace typo (`/9/0` → `/0.9`) (low)
- Fix canonical URLs to remove `.html` extension (medium, post-deployment)
- Add Google Search Console ownership verification (medium)

### Level 2 — Performance and Trust Upgrade (FIX 10 + 11)

- Switch React CDN from `.development.js` to `.production.min.js` (FIX 10 — high value, tiny effort)
- Add `<link rel="preconnect">` for Google Fonts CDN (FIX 10)
- Add Cloudflare Web Analytics (FIX 11 — zero code)
- Add Google Search Console (FIX 11 — no code in HTML if DNS verification used)
- Add skip link to static pages (about, safety, privacy, service pages) (accessibility follow-up)

### Level 3 — Commercial Optimisation (3–6 months)

- Update "Free during launch" copy site-wide when moving to paid
- Add pricing signals or "What happens after you contact us"
- Add real testimonials/case studies once work begins
- Improve local SEO with structured address data and Google Business Profile
- Update service page structured data with breadcrumb schema
- Add `<link rel="preload">` for display font
- Fix footer "Services" links to point to individual service pages (not just #services anchor)

### Level 4 — Strategic Rebuild or Migration

- Replace Babel standalone with a light Vite + React build (eliminates 900KB Babel CDN, enables production builds, tree-shaking, code splitting).
- Extract the shared `.doc-nav` CSS into a separate file included by all static pages.
- Consider a simple CMS (Decap CMS or Obsidian + Git bridge) for content changes without editing HTML.
- **Do not do these now.** Business stability and real traffic data should come first.

### Level 5 — Intelligent Website System

- EmailJS Pro webhook → n8n → structured enquiry records → AI summary → Jehiah review queue.
- Dynamic service availability status on homepage.
- Search Console API → quarterly content gap report.
- This is 12–18 months out and should be designed around actual business data, not speculation.

---

## O. Prioritised Action Plan

| # | Recommendation | Category | Priority | Effort | Cost | Business impact | Risk of not doing | Who | Timeframe | Controlled by |
|---|---------------|----------|----------|--------|------|-----------------|-------------------|-----|-----------|---------------|
| 1 | Fix Cloudflare Pages GitHub integration | Deployment | **Critical** | Small | Free | Very high | 9 fixes invisible to public forever | Developer + Cloudflare admin | This week | Cloudflare dashboard |
| 2 | Disable/configure Cloudflare Content Signals robots.txt override | SEO | **High** | Small | Free | High | Custom robots.txt never served | Developer + Cloudflare admin | This week | Cloudflare dashboard |
| 3 | Add www.jgusewcomputers.com as Cloudflare Pages custom domain | Domain | **High** | Small | Free | Medium | www visitors get DNS error | Cloudflare admin | This week | Cloudflare dashboard |
| 4 | Update EmailJS template_wnuvasi with new variables | Form | **High** | Small | Free | High | New context fields silently dropped | EmailJS admin | This week | EmailJS dashboard |
| 5 | Restrict EmailJS Allowed Origins to jgusewcomputers.com | Security | **Medium** | Small | Free | Medium | Anyone can spam your EmailJS quota | EmailJS admin | This week | EmailJS dashboard |
| 6 | Fix sitemap namespace (`/9/0` → `/0.9`) | SEO | Low | Small | Free | Low | Sitemap technically non-compliant | Developer | Before sitemap submission | Repo |
| 7 | Fix canonical tags to remove .html extension | SEO | **Medium** | Small | Free | Medium | Canonical mismatch on all pages | Developer | After deployment | Repo |
| 8 | Set up Google Search Console | Analytics | **Medium** | Small | Free | High | No search query data, no indexing visibility | Developer + Business owner | This week | Google tool |
| 9 | Add Cloudflare Web Analytics | Analytics | Low | Small | Free | Medium | No traffic visibility | Developer | After deployment | Cloudflare dashboard |
| 10 | Switch React CDN to production.min.js (FIX 10 first task) | Performance | **High** | Small | Free | High | ~4MB unnecessary page weight on every load | Developer | FIX 10 session | Repo |
| 11 | Add preconnect hints for Google Fonts | Performance | Medium | Small | Free | Medium | Slower font loading | Developer | FIX 10 session | Repo |
| 12 | Add skip link to all static pages | Accessibility | Low | Small | Free | Low | Keyboard users on static pages can't skip nav | Developer | FIX 10 or separate | Repo |
| 13 | Update footer services links to link to individual service pages | SEO / UX | Low | Small | Free | Low | Missed internal linking | Developer | FIX 10 or separate | Repo |
| 14 | Update structured data areaServed for local search | SEO | Low | Small | Free | Medium | Weak local search signal | Developer | FIX 10 or separate | Repo |

---

## P. Quick Wins

These can be done in order, smallest effort first:

1. **Fix Cloudflare Pages deployment** — makes all 9 fixes live instantly. Highest ROI action in this list.
2. **Configure Cloudflare Content Signals** — restores control of your own robots.txt without code changes.
3. **Add www domain/redirect in Cloudflare** — eliminates DNS failure for www visitors.
4. **Update EmailJS template** — structured enquiry context starts arriving in email immediately.
5. **Restrict EmailJS Allowed Origins** — five-minute dashboard change, reduces spam risk.
6. **Set up Google Search Console** — free, no code, starts building search data immediately. Submit sitemap after deployment.
7. **Fix sitemap namespace typo** — one character change in sitemap.xml. Do it in the same commit as canonical fix.
8. **Fix canonical tags to remove .html extension** — update all canonical hrefs in all 10 pages. One find-and-replace operation.
9. **Switch React to production.min.js** — two URL changes in index.html, saves ~4MB page weight.
10. **Add `<link rel="preconnect">` for Google Fonts** — two lines in `<head>` of index.html and colors_and_type.css import link.

---

## Q. Bigger Strategic Opportunities

**Over 3–6 months:**

1. **Build out real case studies.** Once the first real enquiries come in and are resolved, a simple "Here's what someone came to us with, and here's what we did" page would be the highest-trust content possible. Specific, verifiable, human.

2. **Local search optimisation.** Set up a Google Business Profile for JGusew Computers (free). Sunbury, VIC. Link to the website. This is the single largest source of "near me" tech help search traffic, and it's currently completely absent.

3. **Transition away from the "Free during launch" model.** When the service moves to paid, the copy across the site needs a co-ordinated update. Start planning what the pricing model will be (hourly? per-enquiry? subscription?). The site architecture supports this cleanly — it's a copy update, not a redesign.

4. **Service page SEO refinement.** Once the pages are live and Google Search Console is running, you'll see which queries are arriving. If "computer advice Sunbury" generates impressions but no clicks, refine that page title. If "AI automation small business Melbourne" gets traction, expand that page. Let data guide the content.

5. **Automation as a product demo.** Add a brief, visible note on the AI automation service page: "This site uses EmailJS and a review process as a real example of a human-supervised intake workflow. It's not fully automated — and that's intentional." This makes the service tangible and positions Jehiah as someone who's actually using the tools he recommends.

**Over 6–12 months:**

6. **EmailJS Pro + simple intake CRM.** Webhook → n8n → Google Sheet → Jehiah review. Adds structure to the enquiry log without requiring a paid CRM.

7. **Productionise the Babel build** if the homepage JSX becomes complex enough to warrant it. A simple Vite build can be introduced without changing anything visible to users — same HTML structure, same CSS, same URLs, just compiled JS rather than in-browser Babel. The site is small enough that migration would be a one-day job.

8. **Content expansion.** Blog or resource posts ("How to tell if your computer is worth repairing", "Five questions to ask before signing up for a website builder") would build topical authority and long-tail search traffic. Not urgent — content needs to be genuinely useful, not padded.

---

## R. Final Recommendation

The site architecture is correct. Static HTML on Cloudflare Pages is the right choice for this stage. The nine completed fixes represent solid, well-executed work. The code in the GitHub repo is clean, honest in content, and correct in implementation.

The only thing stopping the site from being good is that **none of it is live.**

**Recommended sequence:**

1. **Fix the Cloudflare Pages deployment** this week. This is the single highest-priority action. Verify that a GitHub push triggers a Pages deploy. Confirm with a live check on the title, sitemap, and a service page.

2. **Fix the Cloudflare robots.txt override** and add the www redirect in the same dashboard session.

3. **Update the EmailJS template** to show the new form fields in email. This can be done in the same sitting.

4. **Set up Google Search Console** immediately after deployment is confirmed — it needs time to collect data.

5. **Continue to FIX 10** (performance cleanup) once deployment is verified live. The most impactful FIX 10 task — switching React from development to production builds — is a 10-minute change.

6. **FIX 11** (analytics) can partly be done in the Cloudflare dashboard immediately. GA4 can come later.

7. **FIX 12** (automation) remains a future planning item — no code work yet.

---

## Decision: Continue FIX 10 or Pause?

**Recommendation: Pause. Fix Cloudflare Pages deployment first.**

**Do not continue to FIX 10.** Nine completed code fixes are sitting in a GitHub repo that is not connected to the live site. FIX 10 on code that isn't deployed compounds the problem.

The correct sequence is:

**Step 1 (Cloudflare dashboard — do this first):**
- Go to dash.cloudflare.com → Workers & Pages → jgusewcomputers project
- Check Custom domains: add `www.jgusewcomputers.com` OR create a Redirect Rule
- Check Settings → Builds & deployments: verify GitHub is connected to the correct repo and branch (main), build command is empty, output dir is `/`
- If GitHub integration is not connected: either connect it, OR use Wrangler CLI to deploy (`npx wrangler pages deploy .`) as a one-off to get the repo content live
- Also check: AI → Crawler hints / Content Signals — disable or configure the robots.txt override

**Step 2 (verify deployment worked):**
- `curl -I https://jgusewcomputers.com/sitemap.xml` → should return 200
- `curl https://jgusewcomputers.com/` → title should include "Practical Tech Help, Websites and AI Automation"
- `curl -I https://jgusewcomputers.com/services/computer-help.html` → should return 200 or 307 (extension stripping)
- `curl -I https://jgusewcomputers.com/` → should show `x-content-type-options: nosniff` header

**Step 3 (same session, EmailJS dashboard):**
- Update template_wnuvasi to add `{{enquiry_type}}`, `{{service}}`, `{{urgency}}`
- Add `https://jgusewcomputers.com` to Allowed Origins

**Step 4 (Google Search Console):**
- Verify ownership
- Submit `https://jgusewcomputers.com/sitemap.xml`

**Step 5 (FIX 10 — back to code):**
- Switch React CDN URLs to production.min.js
- Add preconnect hints for Google Fonts
- Fix canonical tags to remove .html extension (post-deployment discovery)
- Fix sitemap namespace

---

## Exact next Claude Code prompt

### If the Cloudflare deployment is now confirmed working:

```
Continue the JGusew Computers website optimisation project. The repo is at `C:\Users\user1\JGUSEWCOMPUTERS WEBSITE`. FIX 1 through 9 are done and the Cloudflare Pages deployment is now confirmed working. Do FIX 10 only — performance cleanup. Also fix the following issues discovered in the second-pass audit before anything else:

1. Fix sitemap namespace: change `xmlns="http://www.sitemaps.org/schemas/sitemap/9/0"` to `xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"` in sitemap.xml.
2. Fix canonical tags: remove `.html` extension from all canonical href values on all pages (index.html, about.html, safety.html, privacy.html, all 6 services/*.html pages). Example: change `href="https://jgusewcomputers.com/about.html"` to `href="https://jgusewcomputers.com/about"`.
3. Switch React CDN from development to production builds in index.html (lines 77–78): change `react.development.js` → `react.production.min.js`, `react-dom.development.js` → `react-dom.production.min.js`.
4. Add `<link rel="preconnect" href="https://fonts.googleapis.com">` and `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` to the `<head>` of index.html.
5. Update footer "Services" links to point to individual service pages rather than the `#services` anchor (optional — only if this doesn't affect mobile scrolling).

Do not start FIX 11. Constraints: pure static HTML, no build step, Cloudflare Pages, free tiers only, no backend, no framework changes. Commit when done.
```

### If the Cloudflare deployment is NOT yet fixed:

```
The JGusew Computers website at https://jgusewcomputers.com is deployed on Cloudflare Pages but the GitHub integration is not connected. The live site is serving an old Direct Upload snapshot — NOT the current GitHub repo. The GitHub repo at https://github.com/jgusewcomputers/jgusewcomputerswebsite has all 9 fixes committed but none are live.

This is NOT a code session. This is a deployment verification and Cloudflare dashboard session. I need help with:

1. Diagnosing whether the Cloudflare Pages GitHub integration is connected (check dash.cloudflare.com → Workers & Pages → jgusewcomputers → Settings → Build & deployments).
2. If it is connected: trigger a manual deploy and verify.
3. If it is NOT connected: walk me through connecting it (correct repo, branch: main, no build command, output dir: /).
4. Alternative: if GitHub integration can't be set up quickly, help me use Wrangler CLI to do a one-off deploy of the local repo folder as a Cloudflare Pages direct upload.
5. After deploy: verify with curl commands that sitemap.xml, service pages, and security headers are live.
6. Also guide me through the Cloudflare Content Signals / robots.txt override issue and how to configure or disable it.

The repo folder is at: C:\Users\user1\JGUSEWCOMPUTERS WEBSITE
Cloudflare Pages project name: jgusewcomputers
GitHub repo: https://github.com/jgusewcomputers/jgusewcomputerswebsite
```

---

*Audit completed: 2026-05-26*  
*Auditor: Second-pass review against first-audit baseline and fix log*  
*Method: Full repo inspection + live curl checks against jgusewcomputers.com*
