# Ahmad Kassar — Portfolio

Personal portfolio site. Single page, statically rendered, built for speed and clarity.

**Stack:** Next.js (App Router) · React · TypeScript · Tailwind CSS v4 · Motion

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run build   # production build
npm start       # serve the production build
npm run lint    # eslint
```

## Project structure

```
src/
├── app/
│   ├── layout.tsx            # fonts, metadata, JSON-LD, skip link
│   ├── page.tsx              # section composition
│   ├── globals.css           # design tokens (colors, fonts) + base styles
│   ├── icon.svg              # favicon
│   ├── opengraph-image.tsx   # generated OG/Twitter card
│   ├── robots.ts             # robots.txt
│   └── sitemap.ts            # sitemap.xml
├── components/
│   ├── nav.tsx               # fixed nav + mobile menu
│   ├── hero.tsx              # identity hero (CSS entrance)
│   ├── hero-sculpture.tsx    # interactive CSS-3D centerpiece
│   ├── selected-work.tsx     # project showcase (vignettes as art)
│   ├── detail-strip.tsx      # scroll-snap component gallery
│   ├── capabilities.tsx      # what I build
│   ├── about.tsx             # approach + principles
│   ├── skills.tsx            # toolbox
│   ├── experience.tsx        # compact "where this shipped" band
│   ├── contact.tsx
│   ├── footer.tsx
│   ├── section-heading.tsx
│   ├── meta-label.tsx        # the single mono-label spec
│   ├── spotlight-card.tsx
│   ├── vignettes/            # hand-coded UI mockups + shared bits
│   ├── motion/               # LazyMotion provider + Reveal primitive
│   └── ui/copy-email-button.tsx
└── data/
    ├── site.ts               # name, links, email, site URL  ← edit me
    ├── projects.ts           # project showcases              ← edit me
    ├── capabilities.ts       # what-I-build cards + principles
    ├── experience.ts         # compact shipped-at entries
    └── skills.ts             # toolbox groups
```

All content lives in `src/data/` — components never hardcode copy that belongs to data.

## Things to update before going live

1. **Site URL** — `src/data/site.ts` → `url`. Used by metadata, sitemap, robots, and Open Graph. Replace the placeholder with your real domain.
2. **Project links** — `src/data/projects.ts` → each project's `links` array is empty on purpose. Add GitHub/demo URLs as repos go public (the link row renders automatically).
3. **Phone number** — intentionally left off the public site to avoid scraping/spam. Add it to `contact.tsx` if you want it visible.
4. **Project screenshots** — the layout is text-first by design. If you add imagery later, use `next/image` inside the project article's right column.

## Design system — "Cobalt Ledger"

- **Palette** (defined in `globals.css`): warm graphite ground `#111110`, panel `#1b1a18`, bone text `#f2f0ea` with two muted tiers, hairlines `#2a2925`, and one accent — cobalt `#4d7cff` (the brand `#12399a` evolved two stops lighter to survive on dark; `#7396ff` for hovers). Desaturated data-ink tones (`good`/`warn`/`bad`) appear only inside UI vignettes, with one documented exception (the hero availability dot). All combinations verified WCAG AA.
- **Project art**: no screenshots — each project renders as a hand-coded UI vignette (`src/components/vignettes/`) built from shared primitives (`bits.tsx`: GreekBar, MiniChip, MicroAction, Value, Browser/PhoneFrame). Replace any vignette with a real screenshot later by swapping the component inside the showcase's `role="img"` wrapper.
- **Hero sculpture** (`hero-sculpture.tsx`): CSS-3D layered panels with pointer tilt (gated to fine pointers and `prefers-reduced-motion: no-preference`), an ambient state cycle (paused offscreen, in hidden tabs, under reduced motion, or via the visible pause control), and a keyboard-operable kanban card with focus restoration and `aria-live` announcements.
- **Type**: Geist (UI/body), Geist Mono (labels, data), Newsreader italic (editorial accents), plus `.text-display` / `.text-display-lg` clamp utilities for the showcase scale. All self-hosted via `next/font`.
- **Motion**: `LazyMotion strict` + `m` components keep the animation runtime out of the critical bundle; the hero text column animates with pure CSS (`.rise` / `.fade-rise`) so the headline is LCP-eligible before hydration. `MotionConfig reducedMotion="user"` covers every JS animation; CSS animations and smooth scroll sit behind the same media query.

## Security

- Security headers in `next.config.ts`: CSP, HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`.
- CSP uses `'unsafe-inline'` for scripts/styles — the documented trade-off for fully static Next.js sites (nonces would force dynamic rendering). There is no user input, no forms, no cookies, and no third-party scripts on this site.
- All external links use `rel="noopener noreferrer"`.
- JSON-LD is hand-authored static data, escaped with `<`.
- No contact form by design: nothing to spam, no backend secret to manage. If you add one later, pair a server action with Resend/Postmark, validate with zod, and add a honeypot field + rate limiting.

## Deploying to Vercel

1. Push this repo to GitHub.
2. [vercel.com/new](https://vercel.com/new) → import the repo. Framework auto-detects as Next.js; no configuration needed.
3. After the first deploy, set your production domain, then update `url` in `src/data/site.ts` and redeploy.

No environment variables are required.
