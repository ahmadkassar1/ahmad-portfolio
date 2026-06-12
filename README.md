# Ahmad Kassar — Portfolio

Personal portfolio as a navigable 3D world ("the Ops Deck") layered over a fully server-rendered 2D site ("the Ledger"). Capable devices walk into the world; everyone else — crawlers, reduced-motion visitors, weak GPUs — gets the complete 2D site with an opt-in pill.

**Stack:** Next.js (App Router) · React · TypeScript · Tailwind CSS v4 · Motion · React Three Fiber · drei · zustand · maath

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
│   ├── ledger-site.tsx       # the full 2D site, server-rendered (SSR fallback)
│   ├── world/                # the 3D Ops Deck
│   │   ├── ops-deck.tsx      # client shell: device probe, mode flip, tour driver, Escape
│   │   ├── world-canvas.tsx  # Canvas root, quality tiers, PerformanceMonitor
│   │   ├── camera-rig.tsx    # camera state machine + OrbitControls handoff
│   │   ├── skills-constellation.tsx  # orbiting tech objects
│   │   ├── project-station.tsx / station-props.tsx  # project pedestals + holo props
│   │   ├── about-area.tsx / contact-terminal.tsx    # physical About + Contact
│   │   ├── holo-core.tsx / room.tsx / lighting.tsx / particles.tsx / effects.tsx
│   │   └── ui/               # DOM overlay: hud, panel-shell, project/tech/info panels, loader, enter-pill
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
├── data/
│   ├── site.ts               # name, links, email, site URL  ← edit me
│   ├── projects.ts           # project showcases              ← edit me
│   ├── capabilities.ts       # what-I-build cards + principles
│   ├── experience.ts         # compact shipped-at entries
│   ├── skills.ts             # toolbox groups
│   ├── tech.ts               # constellation: shapes, levels, orbits  ← edit me
│   ├── stations.ts           # station ring layout + camera framing
│   ├── areas.ts              # About desk / Contact terminal placement
│   └── about.ts              # about-panel narrative + facts
└── lib/
    ├── experience-store.ts   # zustand state machine (mode, focus, tour)
    ├── device-profile.ts     # capability probe → quality tier / auto-enter
    ├── canvas-textures.ts    # procedural CanvasTextures (labels, screens, QR, floor)
    ├── tech-positions.ts     # live orbit positions for the camera rig
    ├── moods.ts              # station mood palettes
    └── prng.ts               # seeded randomness (mulberry32)
```

All content lives in `src/data/` — components never hardcode copy that belongs to data.

## Things to update before going live

1. **Site URL** — `src/data/site.ts` → `url`. Used by metadata, sitemap, robots, and Open Graph. Replace the placeholder with your real domain.
2. **Project links** — `src/data/projects.ts` → each project's `links` array is empty on purpose. Add GitHub/demo URLs as repos go public (the link row renders automatically).
3. **Phone number** — intentionally left off the public site to avoid scraping/spam. Add it to `contact.tsx` if you want it visible.
4. **Project screenshots** — the layout is text-first by design. If you add imagery later, use `next/image` inside the project article's right column.

## The Ops Deck (3D world)

### Scene layout

A circular deck under a star field, dissolving into fog at the rim:

- **Holo core** (center) — wireframe icosahedron pair around an emissive heart; pure ambiance.
- **Skills constellation** — ten technologies orbit the core as symbolic procedural objects (React's atom, RxJS's stream knot, SQL's drum, Git's commit graph…). Orbits freeze while one is focused so the camera target holds still.
- **Four project stations** on a ring (radius 6.2) at the diagonal angles — pedestal, mood-colored trim, painted label plate, and a per-project holo prop (pipeline stages, QR phone, page stack, shelf rack).
- **About desk** (left wing) — monitor, keyboard, coffee, books, lamp. The person as a place.
- **Contact terminal** (right wing) — console kiosk with a terminal screen and blinking cursor.

### Interaction system

One zustand state machine (`src/lib/experience-store.ts`) drives everything: `intro → idle ⇄ (focusing → focused → returning)`. Any clickable thing in the world is a *focus target* (`station | tech | about | contact`); clicking it (or its DOM twin in the HUD/toolbox) flies the camera in (maath damped easing) and opens the matching DOM panel on arrival. Escape unwinds one layer per press: tour → panel → focus. Panels cross-navigate — a tech's "Shipped in" buttons jump to stations, a project's stack chips jump to techs. **Tour** auto-cycles every target with a 5.5s dwell; any scene interaction cancels it. In idle, OrbitControls own the camera (drag to orbit, clamped angles).

The canvas is `aria-hidden` decoration: every action and all content is reachable through the DOM HUD, the panels, and the toolbox — and the entire 2D site remains underneath as server-rendered HTML.

### Performance decisions

- **Zero external assets** — no GLTF/Draco/textures to load or compress because everything is procedural geometry and canvas-painted textures (CSP pins `font-src`/`connect-src` to `'self'`). First render needs nothing but the JS bundle, which is code-split behind `dynamic(…, { ssr: false })` and never loaded by visitors who stay on the ledger.
- **Quality tiers** (`high`/`medium`/`low`) probed on entry — DPR caps, shadow resolution, particle count, antialiasing, and postprocessing (bloom + vignette skipped on low) all scale; drei's `PerformanceMonitor` walks quality down live if the GPU can't hold frame rate.
- **No per-frame allocations** — every `useFrame` reuses preallocated vectors and mutates buffers in place; orbit clocks accumulate deltas so freezes are true pauses.
- **Mobile/weak devices** default to the 2D ledger (full content, no WebGL cost) with the world one explicit tap away.

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
