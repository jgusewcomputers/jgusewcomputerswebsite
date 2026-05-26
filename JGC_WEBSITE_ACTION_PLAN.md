# JGC Website — Action Plan

**Site:** https://jgusewcomputers.com  
**Repo:** https://github.com/jgusewcomputers/jgusewcomputerswebsite  
**Framework:** Pure static HTML (no build system)  
**Last updated:** 2026-05-26

---

## Fix list

| # | Fix | Status | Owner |
|---|-----|--------|-------|
| 1 | Cloudflare Pages deployment and canonical domain readiness | **Done** | Developer + Cloudflare admin |
| 2 | Metadata and technical SEO foundation | **Done** | Developer |
| 3 | Sitemap and robots.txt | **Done** | Developer |
| 4 | Homepage clarity and conversion | **Done** | Developer + Business owner |
| 5 | EmailJS contact/intake form improvements | **Done** | Developer + EmailJS admin |
| 6 | Privacy policy and form trust copy | **Done** | Developer + Business owner |
| 7 | Service pages | **Done** | Developer + Business owner |
| 8 | Cloudflare Pages security headers | **Done** | Developer + Cloudflare admin |
| 9 | Accessibility and mobile usability pass | Not started | Developer |
| 10 | Performance cleanup | Not started | Developer |
| 11 | Analytics readiness | Not started | Developer + Business owner |
| 12 | Future automation readiness | Not started | Developer + Automation specialist |

---

## Fix detail

---

### FIX 1 — Cloudflare Pages deployment and canonical domain readiness

**Status:** Done  
**Controlled by:** Repo + Cloudflare dashboard  
**Owner:** Developer (repo changes done) · Cloudflare admin (dashboard step outstanding)

**Business reason:**  
Without canonical tags, search engines may index www and non-www versions as duplicate content.
Without a www redirect, visitors who type www get an error or a separate unbranded page.

**What was done (repo):**
- `_redirects` created with www → apex 301 rule
- Canonical `<link>` tags added to all 4 HTML pages
- `og:url` added to index.html
- OG/Twitter image URLs changed from relative to absolute

**What still needs doing (Cloudflare dashboard):**  
Option A — Add www as a Pages custom domain (then `_redirects` handles the redirect):
1. Cloudflare Pages → jgusewcomputers project → Custom domains → Add `www.jgusewcomputers.com`

Option B — Cloudflare Redirect Rule (no Pages custom domain needed):
1. Cloudflare Dashboard → Rules → Redirect Rules → Create rule
2. Condition: hostname = `www.jgusewcomputers.com`
3. Action: Redirect to `https://jgusewcomputers.com${uri.path}` (301, preserve path)

**Recommendation:** Option B is simpler for a Cloudflare-managed domain.

**Technical notes:**
- `_redirects` is at repo root = output root for this static site. Confirmed compatible with Cloudflare Pages.
- No build command. Output dir = `/`.

---

### FIX 2 — Metadata and technical SEO foundation

**Status:** Done  
**Controlled by:** Repo  
**Owner:** Developer

**Business reason:**  
Current title is informal. Description could better match real search queries. Missing some SEO-standard tags.

**Tasks:**
- Improve homepage `<title>` (recommended: `JGusew Computers | Practical Tech Help, Websites and AI Automation`)
- Improve homepage meta description to match recommended copy
- Check/add OG metadata to about, safety, privacy pages
- Confirm canonical tags are on all pages (done in FIX 1)
- Consider adding `og:locale`, `og:site_name`

**Technical notes:**
- Pure static HTML — edit `<head>` of each file directly.
- No framework-native metadata API.

---

### FIX 3 — Sitemap and robots.txt

**Status:** Done  
**Controlled by:** Repo  
**Owner:** Developer

**Business reason:**  
Google and Bing cannot reliably discover all pages without a sitemap. robots.txt signals what to crawl.

**Tasks:**
- Create `sitemap.xml` at repo root (= output root)
- Create `robots.txt` at repo root
- Include all public pages: `/`, `/about.html`, `/safety.html`, `/privacy.html`
- robots.txt must reference `Sitemap: https://jgusewcomputers.com/sitemap.xml`
- Verify both files will be at `/sitemap.xml` and `/robots.txt` after Cloudflare Pages deploys

**Technical notes:**
- Static files placed at repo root are served at their filename path by Cloudflare Pages.
- No framework generation needed — hand-write both files.

---

### FIX 4 — Homepage clarity and conversion

**Status:** Done  
**Controlled by:** Repo  
**Owner:** Developer + Business owner

**Business reason:**  
A non-technical visitor should understand the business within 5 seconds of landing.

**Tasks:**
- Review above-the-fold section
- Primary CTA: "Ask for tech help"
- Secondary CTA: "See how I can help"
- Clearly list services (computers, websites, forms, email, AI automation, small business advice)
- Remain calm — no overuse of animation, no fake testimonials, no jargon

**Technical notes:**
- Changes are in the React/Babel inline block in `index.html`.
- No build step — changes are live on next deploy.

---

### FIX 5 — EmailJS contact/intake form improvements

**Status:** Done  
**Controlled by:** Repo + EmailJS dashboard + Cloudflare Pages env vars  
**Owner:** Developer + EmailJS admin

**Business reason:**  
Current form collects name, email, phone, and a message. Adding service type, urgency, and home/business context will help triage enquiries faster.

**Current EmailJS config (already wired):**
- Service ID: `service_59pweih`
- Template ID: `template_wnuvasi`
- Public key: hardcoded in `index.html`

**Tasks:**
- Add form fields: home/business selector, service type, urgency
- Add consent checkbox
- Keep success/error/loading states (already present)
- Document env variable approach for when a build step is introduced
- Recommend restricting EmailJS allowed origins to `jgusewcomputers.com`

**EmailJS dashboard steps (manual):**
1. Update template in EmailJS dashboard to include new field variables
2. Restrict Allowed Origins: Account → Security → add `https://jgusewcomputers.com`

**Technical notes:**
- `@emailjs/browser` is currently loaded via CDN `<script>` tag.
- When/if a build system is added, install as: `npm install @emailjs/browser`

---

### FIX 6 — Privacy policy and form trust copy

**Status:** Done  
**Controlled by:** Repo  
**Owner:** Developer + Business owner

**Business reason:**  
A basic privacy policy is expected by Australian small-business visitors. The existing `privacy.html` is a solid draft but references internal process notes (e.g. "CRM Logs tab") that should not be on a public-facing page.

**Tasks:**
- Review and clean up `privacy.html` for public-facing language
- Add form reassurance copy: "We only ask for the details needed to understand your enquiry."
- Confirm footer links to Privacy and Safety pages exist (already present)
- Mention EmailJS use for contact form delivery

**Technical notes:**
- `privacy.html` already exists. FIX 6 is a copy/content review, not a new page.

---

### FIX 7 — Service pages

**Status:** Done  
**Controlled by:** Repo  
**Owner:** Developer + Business owner

**Business reason:**  
Dedicated service pages improve SEO for specific search queries and give visitors focused information.

**Pages to create:**
- `/services/computer-help.html`
- `/services/website-help.html`
- `/services/forms-enquiry-systems.html`
- `/services/ai-automation.html`
- `/services/email-account-cleanup.html`
- `/services/small-business-tech-advice.html`

**Technical notes:**
- Same static HTML pattern as existing pages.
- Add nav links from homepage services section.

---

### FIX 8 — Cloudflare Pages security headers

**Status:** Done (phase 1 — safe headers applied; CSP and HSTS held, see fix log)  
**Controlled by:** Repo + Cloudflare dashboard  
**Owner:** Developer

**Business reason:**  
Basic security headers reduce attack surface and improve browser security scores.

**Tasks:**
- Create `_headers` at repo root
- Add safe headers:
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `X-Frame-Options: DENY`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- Hold Content-Security-Policy until EmailJS, Google Fonts, CDN scripts are mapped
- Add HSTS only after HTTPS is confirmed stable

**Technical notes:**
- `_headers` syntax: path on one line, headers indented below.
- Must not break EmailJS CDN, Google Fonts CDN, React CDN, Babel CDN.
- CSP would require allowing all those CDNs — document for future hardening.

---

### FIX 9 — Accessibility and mobile usability pass

**Status:** Not started  
**Controlled by:** Repo  
**Owner:** Developer

**Business reason:**  
The target audience includes non-technical users and older Australians. Accessibility is also a trust signal.

**Tasks:**
- Check heading hierarchy on all pages
- Check form label associations
- Check button accessible names
- Check alt text on all images
- Check focus visible states
- Check tap target sizes on mobile
- Check text size and line length

---

### FIX 10 — Performance cleanup

**Status:** Not started  
**Controlled by:** Repo  
**Owner:** Developer

**Business reason:**  
Fast load = better user experience and better Google ranking signal. Especially important for mobile users on slower connections.

**What was already done:**
- Chrome icons converted from PNG to WebP (25–49% reduction)
- `loading="lazy"` added to below-fold images

**Remaining tasks:**
- Check React + Babel CDN load cost (these are large and block rendering)
- Consider replacing inline React/Babel with vanilla JS for a static site of this size
- Check Google Fonts loading (currently blocking render)
- Add `font-display: swap` if not already present (it is, in colors_and_type.css)

---

### FIX 11 — Analytics readiness

**Status:** Not started  
**Controlled by:** Repo + Cloudflare dashboard + Google  
**Owner:** Developer + Business owner

**Business reason:**  
Understanding where visitors come from and which pages perform well guides future improvements.

**Recommended free options:**
- **Cloudflare Web Analytics** — zero code, configured in dashboard, privacy-friendly
- **Google Analytics 4** — more detailed, requires snippet in HTML
- **Google Search Console** — free, shows which search queries drive traffic (no code needed)

**Key events to track when GA4 is added:**
- `form_submit_success`
- `form_submit_error`
- `email_click`
- `service_cta_click`

---

### FIX 12 — Future automation readiness

**Status:** Not started  
**Controlled by:** Repo (documentation only)  
**Owner:** Developer + Automation specialist

**Business reason:**  
JGusew Computers offers AI automation as a service. The contact form → email workflow can be extended when the business is ready.

**Current flow:**
```
Visitor fills form → EmailJS → email to hello@jgusewcomputers.com → Jehiah reviews manually
```

**Future optional flow (no changes needed now):**
```
Visitor fills form → EmailJS email → Zapier/Make/n8n webhook → 
  AI summary draft → Notion/HubSpot contact record → 
  Jehiah review task → Reply
```

**Notes:**
- Do not add paid automation tools until requested.
- EmailJS webhooks (Pro plan) can trigger automation — document when considering.
- Cloudflare Pages Functions (free tier) could receive form POSTs and forward to a webhook — document for later.

---

## External actions outstanding

| Action | Where | Priority | Status |
|--------|--------|----------|--------|
| Add `www.jgusewcomputers.com` as custom domain OR add Cloudflare Redirect Rule for www→apex | Cloudflare dashboard | High | Not done |
| Restrict EmailJS allowed origins to `https://jgusewcomputers.com` | EmailJS dashboard | Medium | Not done |
| Verify Google Search Console ownership | Google Search Console | Medium | Not done |
| Set up Cloudflare Web Analytics | Cloudflare dashboard | Low | Not done |
