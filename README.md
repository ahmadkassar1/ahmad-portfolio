# Ahmad Kassar — Portfolio

A frontend portfolio with two ways to browse: a server-rendered **Ledger** and an optional interactive 3D **Ops Deck**. The Ledger is the default for reduced-motion visitors and less capable devices. The Lab contains five interactive frontend experiments with sample data.

[Live portfolio](https://ahmad-portfolio-nine-weld.vercel.app/) · [Course player demo](https://itlegend-course-player-taupe.vercel.app/) · [Course player source](https://github.com/ahmadkassar1/itlegend-course-player)

## Setup

Use Node.js 20.9 or newer and npm. No environment variables are required.

```bash
npm ci
npm run dev
```

Open http://localhost:3000. To serve a production build:

```bash
npm run build
npm start
```

`next/font` downloads the configured Google fonts during a build and serves them locally at runtime. The first build needs network access.

## Structure

- `src/app`: App Router pages, fonts, metadata, sitemap and social card.
- `src/components`: Ledger sections, shared UI and the optional 3D world.
- `src/components/featured-work.tsx`: server-rendered course player feature.
- `src/components/world`: canvas, camera, scene objects and DOM controls/panels.
- `src/data`: professional copy, project links, skills and Lab entries. `about.ts` is shared by both views; `featured-work.ts` supplies both the Ledger card and Ops Deck link.
- `src/lib`: interaction state and feature utilities.
- `src/app/lab`: Helm analytics, Forge form builder, Fixtura mock-data generator, Redacto document redaction and Margin Lab pricing experiments.
- `e2e/navigation.spec.ts`: existing Ops Deck navigation smoke test, run by the Playwright workflow.

## Content and links

The course player has public source and a live demo. The other project drawings are interface illustrations, not screenshots or evidence of public deployments. Unavailable repositories have no outbound link. Review source, credentials and ownership before publishing any private project.

Professional copy uses supported experience and training. Do not infer a degree, completion of a longer program or exact employment dates from an assessment or coursework record. Update `src/data/site.ts` if the production domain changes; canonical metadata, robots and sitemap share that value.

## Interface and architecture

Static sections remain Server Components. Interactive controls use Client Components; the 3D canvas is dynamically loaded. A Zustand store coordinates scene focus, panels, tour and navigation. DOM controls provide access to the scene's content without clicking WebGL objects. Escape unwinds the tour, panel and focus state.

The layout uses shared Tailwind tokens, reusable project vignettes, responsive grids and wrap-friendly controls. Motion respects reduced-motion preferences. The new featured card adds no client state or animation dependency.

Security headers are configured in `next.config.ts`. The static site's CSP permits inline scripts/styles required by its current rendering strategy. External links use `noopener noreferrer`. Lab tools accept input and use sample/local data; their individual privacy and processing guarantees require separate verification.

## Verification

```bash
npm run lint
npx tsc --noEmit
npm run build
```

The existing navigation workflow installs Playwright separately and runs the Ops Deck smoke test. For changes, also check the affected views in a browser: Ledger at narrow and wide widths, reduced motion, keyboard focus, Ops Deck controls, and the relevant Lab interaction. Compilation alone does not establish accessibility, privacy, device compatibility or functional completeness.

## Deployment

The existing portfolio is hosted on Vercel. Review a branch/preview before merging production changes. Keep the Next.js framework preset and the locked dependency versions. No environment variables are needed for the current portfolio.
