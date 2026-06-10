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
│   ├── hero.tsx              # landing hero (staggered entrance)
│   ├── selected-work.tsx     # projects
│   ├── experience.tsx        # roles + education
│   ├── about.tsx
│   ├── skills.tsx            # toolbox
│   ├── contact.tsx
│   ├── footer.tsx
│   ├── section-heading.tsx
│   ├── motion/               # MotionConfig provider + Reveal primitive
│   └── ui/copy-email-button.tsx
└── data/
    ├── site.ts               # name, links, email, site URL  ← edit me
    ├── projects.ts           # project case studies           ← edit me
    ├── experience.ts         # roles + education
    └── skills.ts             # toolbox groups
```

All content lives in `src/data/` — components never hardcode copy that belongs to data.

## Things to update before going live

1. **Site URL** — `src/data/site.ts` → `url`. Used by metadata, sitemap, robots, and Open Graph. Replace the placeholder with your real domain.
2. **Project links** — `src/data/projects.ts` → each project's `links` array is empty on purpose. Add GitHub/demo URLs as repos go public (the link row renders automatically).
3. **Phone number** — intentionally left off the public site to avoid scraping/spam. Add it to `contact.tsx` if you want it visible.
4. **Project screenshots** — the layout is text-first by design. If you add imagery later, use `next/image` inside the project article's right column.

## Design system

- **Palette** (defined in `globals.css`): warm off-white paper `#faf9f7`, ink `#1a1c21`, two muted grays, hairline `#e7e5df`, and one accent — `#12399a` — used only for emphasis, focus rings, and interactive states.
- **Type**: Geist (UI/body), Geist Mono (labels, indices, meta), Newsreader italic (editorial accents). All self-hosted via `next/font` — no external font requests.
- **Motion**: one `Reveal` primitive (fade + 24px rise, custom ease) plus a staggered hero. `MotionConfig reducedMotion="user"` honors `prefers-reduced-motion` globally; smooth scrolling is also gated behind the same media query.

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
