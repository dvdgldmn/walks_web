# AGENT.md — Project briefing for the next AI agent

Read this once and you should be productive without grepping the world. Everything below is current as of the latest commit on `main`. Production secrets live in **`DEPLOY.md`** (gitignored, repo root) — they're not duplicated here.

---

## TL;DR

**Dosty Walks** — a Next.js (SSR React) marketing landing + secondary pages + a Next.js admin panel + a NestJS API + Postgres. Repo: <https://github.com/dvdgldmn/walks_web> (public). Branch you work on: **`main`**. Local working dir on this machine: `E:\Projects\DostywalksV2\www`. There's a stale sibling `E:\Projects\DostywalksV2 - Copy\www` — ignore / delete.

The landing was originally a static `landing-template.html` injected client-side. It was refactored to **full SSR React** in late May 2026 (15-commit feature branch already merged). Don't try to bring the template back.

---

## Repo layout

```
www/
├── apps/
│   ├── api/                       # NestJS + Prisma + Postgres
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── seed.ts            # default content + admin
│   │   │   └── migrations/
│   │   └── src/
│   │       ├── main.ts            # helmet, CORS allowlist, exception filter, trust proxy
│   │       ├── auth/              # JWT cookie auth, /auth/me does DB lookup
│   │       ├── contact/           # contact form → Zoho Mail HTTP API (NOT SMTP)
│   │       ├── public/            # read-only endpoints used by website
│   │       └── ...                # pages, media, settings, translations, shelter-animals
│   ├── admin/                     # Next.js admin panel (port 3001)
│   └── website/                   # Next.js public site (port 3000)
│       ├── app/
│       │   ├── globals.css        # base/reset + :root vars + responsive --gutter
│       │   ├── layout.tsx         # also imports landing.css globally (nav lives there)
│       │   └── [lang]/            # 'az' | 'en'
│       │       ├── page.tsx       # /[lang] — SSR React landing
│       │       ├── landing.css    # ~1000 lines, all landing-specific global classes
│       │       ├── components/
│       │       │   ├── site-nav.tsx          # delegates to SiteNavLanding
│       │       │   ├── site-nav-landing.tsx  # actual nav, transparent? prop
│       │       │   ├── site-footer.tsx       # used by both landing and secondary
│       │       │   ├── secondary-shell.tsx   # wrapper for privacy/terms/contact/shelter/rules
│       │       │   ├── secondary-shell.module.css  # hero/content/footer styles
│       │       │   ├── contact-form.tsx
│       │       │   ├── legal-page-content.tsx
│       │       │   ├── shelter-page-content.tsx
│       │       │   └── landing/
│       │       │       ├── hero.tsx                  + hero-animation.tsx (client, Lottie)
│       │       │       ├── marquee.tsx
│       │       │       ├── how.tsx                   # §01
│       │       │       ├── competition.tsx           + competition-interactive.tsx
│       │       │       │                             + competition-carousel-style.ts
│       │       │       ├── season.tsx                # §04
│       │       │       ├── final-cta.tsx
│       │       │       └── landing-media.ts          # relative /uploads/... helper
│       │       ├── privacy-policy/, terms-of-use/, contact/, shelter/, rules/, [slug]/
│       └── public/
│           ├── assets/animations/welcome.json   # hero Lottie (~750 KB, self-hosted)
│           ├── assets/brand/                    # mascot, UI screen fallbacks
│           ├── assets/logos/, assets/shelter/
│           └── (no landing-template.html — deleted in Phase 5)
├── docs/
│   └── ssr-landing-plan.md       # historical: the SSR refactor plan
├── seed-data/
│   ├── db-dump.sql               # bootstrap content (texts + admin)
│   └── README.md                 # restore instructions
├── scripts/
│   ├── backup.sh                 # pg_dump + uploads tar with retention
│   ├── repair-*.cjs              # one-off DB repair scripts (Prisma)
│   └── import-*.cjs              # initial content imports
├── uploads/                      # images referenced by DB (logos, sections, shelter-animals, qr)
├── docker-compose.yml            # dev
├── docker-compose.prod.yml       # prod (5 services, healthcheck, migrate service)
├── .env.production.example       # template for prod env file
├── DEPLOY.md                     # GITIGNORED — full deployment guide + all secrets
└── package.json                  # npm workspaces, scripts: dev:* build:* prisma:*
```

---

## Stack (versions)

- Node ≥ 20 (root `package.json` `engines`).
- **API**: NestJS 11 + Prisma 6 + Postgres 16 + bcrypt + helmet + @nestjs/throttler.
- **Website / Admin**: Next.js 15.5.x (App Router) + React 19 + TypeScript.
- **Auth**: JWT in **httpOnly cookie** named `dosty_admin_token`, 8 h expiry.
- **Lottie**: `lottie-web` package (self-hosted; cdnjs was removed).
- **Email**: Zoho Mail HTTP API via OAuth refresh-token (DigitalOcean blocks outbound SMTP).

---

## Architecture / data flow

```
Browser  ── HTTPS ──>  Reverse proxy (nginx/Caddy in prod, none locally)
            │
            ├──> Website (Next.js, :3000)  ── /api, /uploads rewrites ──> API
            └──> Admin   (Next.js, :3001)  ── /api, /uploads rewrites ──> API

API (:4000) ── Prisma ──> Postgres
API serves /uploads/ statically from the on-disk uploads/ folder (bind-mounted in prod).
```

Both Next apps **proxy `/api/*` and `/uploads/*`** to `INTERNAL_API_URL` (default `http://localhost:4000`, `http://api:4000` in compose). Browsers never call the API directly — they only ever see same-origin URLs.

Inside containers, Express **trusts proxy** (`loopback, linklocal, uniquelocal`) so `req.ip` reflects the real client (matters for the throttler).

---

## How the landing renders

`app/[lang]/page.tsx` is an **async server component**. It fetches `translations`, `media`, `settings`, and the legal pages (privacy/terms/faq) via `lib/content.ts` (`fetch` with `cache: 'no-store'`), then renders:

```
<SiteNav variant="landing" ...>
<LandingHero/>            (text+CTAs SSR, Lottie loaded by hero-animation.tsx client island)
<LandingMarquee/>         (pure CSS animation)
<LandingHow/>             (§01)
<LandingCompetition/>     (cards/screens SSR; competition-interactive.tsx builds the
                           desktop switcher + mobile Shadow-DOM drag carousel)
<LandingSeason/>          (§04)
<LandingFinalCta/>        (with QR — img if CMS has download/qr, else inline SVG fallback)
<SiteFooter/>
```

There is **no `landing-template.html` anymore**. There is no client-side content fetching, no flash of old text, no inline-injected `<script>`. SEO comes from `generateMetadata`.

### Hero animation
- File: `public/assets/animations/welcome.json` (~750 KB).
- Loaded in `hero-animation.tsx` via dynamic `import('lottie-web')` inside `useEffect`.
- Applies a responsive `viewBox` adjustment on `DOMLoaded` (matches the original template behavior).
- The mascot target div is kept (for markup parity) but is hidden — it never rendered visually.

### Competition §03 carousel
- Server renders four `.smart-cell` cards (CMS text from `competition/card{1..4}Eyebrow/Title/Body`) and a central `.iphone__screen` (CMS image from `competition/screen-1`).
- Client island `competition-interactive.tsx` runs on mount:
  - Wires desktop cell clicks → swaps the centre phone image (`screenMap`).
  - Builds the mobile carousel in a **Shadow DOM** attached to `#smartMobileHost`. The shadow CSS lives in `competition-carousel-style.ts` (template literal, editable).
  - Drag handlers are attached to **both** the `.track` and `.phone-wrap` (swiping the phone block also pans the carousel).
  - On viewports < 420 px the active card is `calc(100vw - 100px)` wide so the next card peeks ~35 px on the right (UX hint that swipe is possible).

---

## Shared chrome (`SiteNav` + `SiteFooter`)

There is **one nav component** and **one footer component**, used by both the landing and every secondary page. This is the result of the deduplication pass after Phase 4.

### SiteNav (`site-nav.tsx`)
A thin wrapper that always delegates to `SiteNavLanding`. It accepts `variant: 'solid' | 'landing'` and maps it to `transparent`:

- `variant="landing"` → `transparent=true` → scroll-driven background (transparent over `#top` hero, solid after).
- `variant="solid"` → `transparent=false` → no scroll listener, an inline `SOLID_STYLE` makes the bar always white (`rgba(255,255,255,.92)` + `blur(14px)` + `var(--hairline)` border).

**Both variants emit identical markup and use the same `landing.css` classes** (`.nav`, `.nav__inner`, `.nav__brand`, `.nav__panel`, …). This is why `landing.css` is imported in `app/layout.tsx` (not just in `app/[lang]/page.tsx`) — secondary pages need those styles too. The mobile burger panel is pixel-identical between landing and secondary.

### SiteFooter (`site-footer.tsx`)
Pure server component, used by both `secondary-shell.tsx` and `app/[lang]/page.tsx`. It receives `lang`, `translations`, `pages` (privacy/terms/faq), `settings`, `shelterLabel`, and a `styles` prop (CSS module passed by the parent — currently `secondary-shell.module.css`).

---

## CMS data model

The website reads everything from the public API. The main shapes:

- **Translations** (`/api/public/translations?lang=az|en`) → `{section, key, value}[]`. Sections in use:
  - `nav` (how, season, download, shelter, rules, impact*)
  - `hero` (eyebrow, title, primaryCta, secondaryCta)
  - `footer` (productTitle, partnersTitle, legalTitle, becomePartner, pressKit, contacts, cookies, tagline, bottomLeft, bottomRight, faq)
  - `marquee` (item1-4)
  - `how` (eyebrow, note, step{1,2,3}{Tag,Title,Body})
  - `competition` (eyebrow, note, card{1..4}{Eyebrow,Title,Body})
  - `season` (eyebrow, note, title, body)
  - `download` (eyebrow, title, body)
  - Sections like `pricing`/`tracker`/`partners`/`impact` exist in CMS but their corresponding landing sections were cut from the design — values are ignored.
  - `*` = `nav/impact` is wired to the footer's third Product link via JS — but live link goes to onelink (the Get App URL).
- **Media** (`/api/public/media`) → `{section, slot, filePath, altAz, altEn}[]`. Slots used:
  - `settings/logo`, `hero/phone` (was the competition phone; now superseded), `season/phone`,
  - `competition/screen-1..4`, `download/qr`.
  - `landing-media.ts` resolves `(section, slot)` to a **relative** `/uploads/${filePath}` URL (same-origin via the proxy).
- **Pages** (`/api/public/pages/{type}?lang=...`, `/api/public/pages-by-slug/{slug}?lang=...`) → `PublicPage | null`. Types: `privacy`, `terms`, `faq`, `contact`, `shelter`, `rules`.
- **Shelter animals** (`/api/public/shelter-animals?lang=...`) → array of dog records.
- **Settings** (`/api/public/settings`) → `Record<string, Record<string, unknown>>`. Used keys: `social.instagram/.facebook/.tiktok`, `store.apple/.google` (largely no longer in use — store badges were removed), `site.seo` (`titleAz/En`, `descriptionAz/En`).

`lib/content.ts` exports the helpers (`getTranslations`, `getMedia`, `getPublicPage`, `getSiteSettings`, `pickTranslation`, `getMediaUrl`). All use `fetch(..., { cache: 'no-store' })`.

---

## Hardcoded values you'll meet

| Constant | Where | Why |
|---|---|---|
| `https://walks.onelink.me/JjqT/9mczp2y4` | every "Get App" CTA (landing template SiteNavLanding, hero, mobile panel) | Smart-link to the app stores. There is no admin UI for it; if it ever changes, grep the repo. |
| `dosty_admin_token` (cookie name) | `apps/api/src/auth/auth.service.ts` + `jwt-auth.guard.ts` | Cookie name used everywhere. |
| `JWT_ACCESS_EXPIRES=8h` | `.env.production` | 8h sessions. |
| `var(--hairline)` (CSS) | `landing.css` defines `--hairline: #E5E5E5;` on `:root` | Used by the solid-nav border. `globals.css` does **not** define it. If you ever stop importing `landing.css` globally, the solid-variant border breaks on secondary pages — define `--hairline` in `globals.css` first. |
| `var(--gutter)` (CSS) | Both `globals.css` and `landing.css` define a responsive ladder: 32 → 18 (≤560) → 14 (≤380) | `.wrap` uses it; both stylesheets carry the media queries so the value matches whether or not `landing.css` is loaded. |
| `var(--display-font)` | `'Truculenta', 'Arial Narrow', sans-serif` (`:root`) | The brand display font. **`Anton`** strings exist in some legacy declarations and `globals.css` rules but Anton is **never loaded** — those declarations are effectively dead (the shared `!important` rule forces `var(--display-font)`). Don't add `Anton` to anything new. |

---

## Running locally

Postgres must be running on `localhost:5432` (native install on Windows here; collation `Russian_Russia.utf8`, encoding UTF8). Credentials: `dostywalks` / `change-me` / DB `dostywalks`. Dev `.env` already has the matching `DATABASE_URL` and weak placeholder secrets — fine for dev. The real prod secrets live in `DEPLOY.md` and the gitignored `.env.production`.

Scripts in root `package.json`:

```
npm install
npm run dev:api        # nest start --watch
npm run dev:admin      # next dev
npm run dev:website    # next dev
npm run build:api      # nest build
npm run build:admin    # next build
npm run build:website  # next build
npm run prisma:generate / prisma:migrate / prisma:seed
```

But on this host the apps are usually run in **production mode**:

```
# in apps/<app>:
npm run build && npm run start
```

…which is what's already running here on ports 3000 / 3001 / 4000. To swap a built artefact for the running process, kill the listener on its port (PowerShell):

```powershell
$p = (Get-NetTCPConnection -LocalPort 3000 -State Listen).OwningProcess
if ($p) { Stop-Process -Id $p -Force }
```

…then start the new build in a backgrounded shell. The `Bash` tool's `run_in_background:true` keeps the process alive across turns.

### Gotcha: `next.config.ts` headers / rewrites need `next build`

Next compiles `headers()` and `rewrites()` into `.next/routes-manifest.json` at **build** time. If you change them, you must rebuild — `next start` won't pick them up. Don't waste a turn restarting only to see the old headers.

---

## Common operations

```bash
# fresh DB content
docker compose --env-file .env.production -f docker-compose.prod.yml run --rm migrate
docker compose --env-file .env.production -f docker-compose.prod.yml run --rm api npx prisma db seed --schema apps/api/prisma/schema.prisma

# restore the bundled bootstrap dump (texts + images)
psql "$DATABASE_URL" -f seed-data/db-dump.sql
# then change the default admin password (admin@dosty.local / admin12345)

# repair-style one-offs live in scripts/ — Prisma-based, see scripts/repair-shelter-animals-separators.cjs
DATABASE_URL=postgresql://dostywalks:change-me@localhost:5432/dostywalks node scripts/repair-shelter-animals-separators.cjs

# backup
DATABASE_URL=... UPLOADS_DIR=./uploads scripts/backup.sh
```

---

## Production

See **`DEPLOY.md`** (repo root, **gitignored**) for the full deploy guide and every production secret (Postgres password, JWT secrets, ADMIN_PASSWORD, Zoho OAuth credentials, reverse-proxy snippets). It is hand-written, source-of-truth, and never shared via git. If you find yourself answering "what's the prod password" or "how do I deploy" — read it.

Quick recap:
- `docker-compose.prod.yml` builds 5 services (postgres, migrate, api, admin, website). Compose ports are bound to **127.0.0.1** — only a reverse proxy can reach them.
- Migrations run via a one-shot `migrate` service; `api` waits on `service_completed_successfully`. Postgres has a `pg_isready` healthcheck; `api`/`migrate` wait on `service_healthy`.
- Email goes through Zoho's HTTP API (`contact.service.ts`). DO does not allow outbound SMTP.

---

## Conventions / style

- **Server components by default**, only `'use client'` when you need state, refs, scroll handlers, browser APIs, etc.
- **Markup conventions**: the landing emits the landing.css global classes (`.band--white`, `.flow__title`, …). Secondary pages use module classes from `secondary-shell.module.css` for the page chrome (hero/content/footer/forms). The **nav** uses landing.css classes everywhere now.
- **No inline scripts** other than React-emitted ones. CSP is pragmatic: `script-src 'self' 'unsafe-inline'` (Next hydration), `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com` (we use `style={}` attrs in components, can't drop `'unsafe-inline'` without nonces).
- **Renderer for CMS HTML**: `lib/render-rich-text.tsx` parses `<br>/<em>/<strong>` from the CMS into safe React nodes (no `dangerouslySetInnerHTML` of CMS data). The carousel cards inside Shadow DOM are an exception — `item.title`/`item.copy` go straight into `innerHTML` (admin-controlled text, mirror of the template behaviour).
- **i18n**: `lang` is always `'az' | 'en'`. `pickTranslation(items, section, key, fallback)` is your tool.

---

## Lessons learned (don't relearn the hard way)

- The landing's `.wrap` and the secondary module `.wrap` must use the **same** formula. They diverge if you change one without the other (visible as a "logo shifts a few pixels" bug between routes). Both now use `max-width: var(--max); padding: 0 var(--gutter)`.
- `.cta` is **shared between the contact form submit button and the (now removed) nav CTA** in the module CSS. Any global "remove all nav classes from the module" script must whitelist `.cta` — otherwise the form submit becomes unstyled or hidden on mobile.
- `'Anton'` font is declared in many places but **never loaded**. Don't trust `font-family: 'Anton', sans-serif` declarations — they fall back to `sans-serif` (or are overridden by the shared `!important var(--display-font)` rule). If you "fix" Anton, you usually want `var(--display-font)`.
- The mobile carousel lives in a **Shadow DOM**. To style or inspect it, use the live `mobileHost.shadowRoot`. The shadow CSS is in `competition-carousel-style.ts` (template-literal, easy to edit).
- The **media URL helper** (`landingMediaSrc` and `getMediaUrl`) returns a *relative* `/uploads/...` path. Don't return the API's internal URL — browsers can't reach `http://api:4000` directly.
- **`next start`** reads the build manifest, not `next.config.ts` directly, for `headers()` / `rewrites()` / `redirects()`. Changing them needs a rebuild.
- DigitalOcean droplets **block outbound SMTP**. The contact service uses Zoho Mail's REST API (`contact.service.ts`) — don't refactor it back to nodemailer.

---

## Known follow-ups (not blockers)

- Reverse-proxy + HTTPS — set up on the production host (see `DEPLOY.md`).
- Backups — `scripts/backup.sh` is ready, cron not yet configured.
- Error monitoring (Sentry/etc.) — not wired in. `/api/health` exists; no probe configured.
- Strict-CSP via nonces — out of scope; we accept `'unsafe-inline'` on script/style.
- `globals.css` and `landing.css` both define `:root` vars (mostly the same set). They're tolerated as duplicates because landing.css used to be optional. If you ever drop the global `landing.css` import in `layout.tsx`, move `--hairline` and the responsive `--gutter` ladder into `globals.css` first.

---

## Quick file index

| You want… | Open this |
|---|---|
| The landing page entrypoint | `apps/website/app/[lang]/page.tsx` |
| Landing layout / global imports | `apps/website/app/layout.tsx` |
| Nav (one source) | `apps/website/app/[lang]/components/site-nav.tsx` + `site-nav-landing.tsx` |
| Footer (one source) | `apps/website/app/[lang]/components/site-footer.tsx` |
| Secondary page wrapper | `apps/website/app/[lang]/components/secondary-shell.tsx` |
| A landing section (e.g. §03) | `apps/website/app/[lang]/components/landing/competition.tsx` (server) + `competition-interactive.tsx` (client) + `competition-carousel-style.ts` (shadow CSS) |
| Contact form | `apps/website/app/[lang]/components/contact-form.tsx` |
| Hero Lottie | `apps/website/app/[lang]/components/landing/hero-animation.tsx` + `public/assets/animations/welcome.json` |
| CMS helpers | `apps/website/app/lib/content.ts` |
| Safe HTML render | `apps/website/app/lib/render-rich-text.tsx` |
| API entrypoint | `apps/api/src/main.ts` |
| Contact (Zoho HTTP API) | `apps/api/src/contact/contact.service.ts` |
| JWT auth | `apps/api/src/auth/auth.service.ts` + `auth.controller.ts` + `guards/jwt-auth.guard.ts` |
| Prisma schema | `apps/api/prisma/schema.prisma` |
| Seed | `apps/api/prisma/seed.ts` |
| Production deploy guide (gitignored) | `DEPLOY.md` |
| SSR refactor plan (historical) | `docs/ssr-landing-plan.md` |
