# JGusew Computers Design System Notes

Last updated: 2026-05-26

## Current Design Weaknesses

- The site already has useful dark/glass ingredients, but several sections still feel like separate pieces rather than one designed system.
- The homepage can read too much like general computer help unless the systems, website, AI, and small-business judgement offer is visible early.
- Service cards need to feel like parts of a practical technology operating system, not isolated blurbs.
- The contact form had the right fields, but it needed to feel like a polished intake console rather than a plain form placed inside a glass card.
- Static service pages use repeated inline styles, so they can drift away from the homepage unless the shared stylesheet deliberately pulls them back into the same visual language.
- Current generated brand images are useful as brand material, but many are large and should not be added casually as full-page imagery without optimisation.

## Premium Personal-Brand Direction

JGusew Computers should feel calm, sharp, technically capable, and personal. The impression should be: one careful technology person who can help with everyday problems, but also understands business systems, risk, websites, forms, AI workflows, and structured technology decisions.

The brand should feel:

- Dark, liquid, architectural, and composed.
- Professional without becoming corporate or anonymous.
- Personal without becoming casual or underpowered.
- Security-aware without sounding frightening.
- Practical and plain-English, with no fake enterprise claims.

## Contact Form Direction

The contact section should be a premium moment. It should feel like an intake console: structured, calm, and safe.

Rules:

- Keep visible labels and accessible focus states.
- Use clear helper text so users know imperfect explanations are fine.
- Make privacy and safety copy present without making the form feel scary.
- Keep success calm and reassuring.
- Keep error copy useful: direct users to email if sending fails.
- Do not change EmailJS unless the current implementation is broken.
- Do not request passwords, MFA codes, banking codes, or sensitive access details.

## Image And Visual Architecture

Current assets:

- Logo and monogram assets are strong brand anchors. Use them as integrated system elements, not decorative stickers.
- The portrait assets are appropriate for the About page and should remain personal, lightly framed, and trust-building.
- Large generated brand-panel images are visually aligned but heavy. Use sparingly until optimised.
- Icon assets are heavy for small icons. Future work should optimise or replace them with lighter WebP/SVG equivalents while preserving the existing look.

Visual integration rules:

- Prefer gradient masks, glass frames, soft borders, and system-panel layers.
- Use abstract operating-system panels where an image would feel stock or pasted on.
- Do not hotlink external imagery.
- Do not add large unoptimised images.
- If new imagery is needed later, create a bespoke abstract system visual for JGusew Computers rather than using generic stock photos.

## Reusable Design Rules

- Use the shared tokens in `colors_and_type.css` for surfaces, glass, borders, glow, states, radii, shadows, section spacing, form controls, buttons, bento cards, and image frames.
- Keep the dominant palette deep navy, chrome, soft blue, and restrained teal-green accents.
- Use glass sparingly: major panels, cards, form shells, CTA blocks, and image frames.
- Keep radius values deliberate: small controls around 12px, major panels around 24-32px, pills only for chips and primary CTAs.
- Use helper text inside workflows, not marketing copy.
- Copy should sound capable, calm, and specific. Avoid hype words and invented credentials.
- Accessibility improvements are part of the brand quality: skip link, focus-visible, tap targets, labels, and clear states must remain intact.

## What Not To Do

- Do not name employers, clients, confidential work, or law-firm details.
- Do not imply legal advice, law-firm endorsement, certifications, awards, guarantees, or client results.
- Do not add a backend, database, paid dependency, analytics, strict CSP, or a framework migration without a separate decision.
- Do not replace EmailJS during design work.
- Do not make the site feel like a generic SaaS landing page, neon gaming UI, template portfolio, or basic repair shop.
- Do not use random stock images or copyrighted inspiration-site assets.
