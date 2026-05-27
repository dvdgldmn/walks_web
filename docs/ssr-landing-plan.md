# Step 4 — Landing page SSR refactor (plan)

Branch: `feature/ssr-landing`. Goal of this doc: agree the approach before writing code.

## Goal
Render the landing route `/[lang]` as **server-side React** (like the secondary pages
already are), pulling all content from the CMS on the server, with a few small
`'use client'` islands for interactivity. **Visual output must stay 1:1** with today.

## Non-goals
- No redesign / no visual changes.
- No CMS schema changes (same translation sections + media slots).
- No change to the API or secondary pages' behaviour.

## Why (problems this fixes)
Today `/[lang]` injects the static `public/landing-template.html` (body + inline
`<style>` + inline `<script>`). The script fetches the CMS **client-side** and rewrites
the DOM. Consequences:
- **Dual source of truth**: every string exists as an English literal in the HTML *and*
  as a CMS value → "flash of old text" on load.
- **Duplicate footer/nav**: landing has its own copy; secondary pages use React
  `SiteFooter`/`SecondaryNav`. Every change must be made twice.
- **Hardcoding** (onelink link, labels, copyright) lives in template JS, not CMS/SSR.
- **Weak CSP** (`'unsafe-inline'`) forced by the inline scripts/styles.
- No real SEO/metadata for the landing (crawlers see English placeholders).

## Target architecture
`app/[lang]/page.tsx` (server component) fetches CMS via `app/lib/content.ts` and renders
a React tree of section components. Shared chrome (`SiteNav`, `SiteFooter`) is used by
**both** the landing and the secondary pages. Interactive bits are isolated client islands.

### SSR (server-rendered from CMS) — no client JS needed
nav structure · hero copy + CTAs · marquee text · how-it-works (§01) · competition cards
text + screen images (§03) · season (§04) · impact rows · tracker · pricing · partners ·
final-CTA + QR · footer. All text via CMS translations, all images via media slots, all
links (onelink, `/[lang]/contact`, store URLs) baked at render time.

### Client islands (`'use client'`) — keep behaviour, no content fetching
1. **Hero Lottie** — lazy-load bodymovin, play the existing animation.
2. **Competition §03** — desktop screen switcher + mobile drag carousel (current Shadow-DOM
   logic ported into a client component; screen images passed in as props).
3. **Marquee** — the scrolling ticker animation.
4. **Impact counters** — `animateCounter` triggered on scroll (IntersectionObserver).
5. **Nav** — scroll-based background switch + burger menu (fold into shared `SiteNav`).
6. **Language switch** — already link-based; keep.

## Phased implementation (each phase builds + visually verified, committed separately)
- **Phase 0 — CSS extraction.** Move the landing's inline `<style>` into a scoped
  `landing.module.css` (or a co-located stylesheet). Pure move, no visual change. Lets us
  drop inline styles and shrink the template. *Checkpoint: pixel-identical.*
- **Phase 1 — Shared chrome.** Build a single `SiteNav` (merging landing nav + the
  burger/scroll behaviour) and reuse `SiteFooter` on the landing. *Checkpoint: nav+footer
  identical on landing and secondary pages, one source of truth.*
- **Phase 2 — Static sections to RSC.** Port hero, how, season, impact, tracker, pricing,
  partners, final-CTA as server components reading CMS. *Checkpoint: each section matches
  current at az/en, desktop+mobile.*
- **Phase 3 — Interactive islands.** Port competition §03, marquee, hero Lottie, counters
  as client components. *Checkpoint: carousel drag/switch, marquee, animation, counters all
  behave as now (Playwright click test).*
- **Phase 4 — Switch over.** Point `page.tsx` at the new React tree; add `generateMetadata`
  (SEO) from CMS; stop injecting the template. *Checkpoint: full landing parity, no flash.*
- **Phase 5 — Cleanup.** Delete `public/landing-template.html` + `app/[lang]/landing-template.ts`,
  remove now-dead `globals.css` classes, tighten website CSP (drop `'unsafe-inline'` where
  possible now that inline scripts/styles are gone). *Checkpoint: build clean, CSP tighter.*

## Verification & safety
- All work on `feature/ssr-landing`; `main` stays deployable the whole time.
- Acceptance bar per phase = **visual parity** vs current main (compare both langs and the
  mobile breakpoint) + interactive behaviour intact.
- CMS content + DB dump are already in the repo, so content renders reproducibly.
- Playwright smoke test for the interactive islands before Phase 5.
- Rollback = revert the offending phase commit (phases are independent commits).

## Decisions (confirmed)
1. **Visual = strictly 1:1.** Port pixel-for-pixel; no visual changes during the refactor.
   Any improvements (alt text, a11y, etc.) happen as a separate pass afterwards.
2. **CSP — pragmatic (Phase 5).** Drop `'unsafe-inline'` from `style-src` (no inline styles
   after CSS extraction). Leave `script-src` as-is (Next still emits inline hydration);
   nonce-based script CSP is out of scope for now.
3. **Lottie — self-host.** Use the `lottie-web` package (already a website dependency)
   instead of the cdnjs `<script>`; remove `cdnjs.cloudflare.com` from the CSP.
