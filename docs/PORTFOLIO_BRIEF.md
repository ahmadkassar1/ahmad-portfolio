# Portfolio site, built entirely from my CV, deployed to Vercel

You are an agentic coding assistant with shell, filesystem and — where available — browser and network access. You own this end to end: read my CV, decide the design, build a motion-led responsive site from its real contents, verify it with commands, deploy it to Vercel, and hand me a live URL plus a repo I can maintain without you.

**Before your first tool call, tell me in one or two sentences how much a personal site actually moves the needle for the roles in `TARGET_ROLES`.** For design, creative and front-end work it is often decisive. For many finance, legal, clinical, HR, ops and academic roles a strong PDF and a good LinkedIn outrank a website, and this site is a supporting asset. Say which case mine is. Do not accept the premise that a website lands a job, then build the best possible version anyway.

---

## 0. Environment preflight — do this first, report the table

Commands below are POSIX. Before relying on any of them, check what actually exists here and paste the results:

| Need | Check | If absent |
|---|---|---|
| PDF/DOCX text | `pdftotext -v`, `python -c "import pypdf"`, `unzip -v` | use your own file reader; say which |
| Hashing | `sha256sum --version` | `shasum -a 256`, or PowerShell `Get-FileHash -Algorithm SHA256` |
| HTTP checks | `curl --version` | **On Windows call `curl.exe` explicitly** — PowerShell's `curl` is an alias for `Invoke-WebRequest` and rejects `-I`/`-w` |
| Chrome for Lighthouse | `npx lighthouse --version` and a real Chrome/Chromium binary | set `CHROME_PATH`, or install one; in a container add `--chrome-flags="--headless=new --no-sandbox"` |
| Browser automation | `npm i -D @playwright/test && npx playwright install --with-deps chromium webkit` | if it cannot install, say so — then every screenshot line in §10 and §14 is SKIPPED, not PASS |

Roughly ten screenshots are mandated below (360/768/834/1280/1920, one landscape phone, Gate B at 390/1440, reduced-motion, keyboard-focus, JS-disabled). Install the tool that takes them **now**, not when you need it. The JS-disabled run is `browser.newContext({ javaScriptEnabled: false })`. Never describe a screenshot you did not capture.

---

## 1. Fill this in before running (I complete this; do not guess these)

```
CV_FILE:            TODO  path on disk, or "chat text only"
NAME:               TODO  exact spelling, casing and diacritics as they must appear
TARGET_ROLES:       TODO  1-3 titles
SENIORITY:          TODO  e.g. graduate / mid / senior / head of
MARKET:             TODO  city / region / remote / hybrid preference
LINKS:              TODO  label + full URL per line (email, LinkedIn, GitHub, Scholar, work samples)
SHOW_PHONE:         TODO  yes / no                          (default no)
CV_DOWNLOAD:        TODO  no / redacted (default) / original, unredacted
CURRENTLY_EMPLOYED: TODO  yes / no  - if yes: no "open to opportunities" line, and stay noindexed
HEADSHOT:           TODO  path, or none   (default none - in some markets a photo is a liability)
BRAND:              TODO  2-4 adjectives, or "you choose"
HARD_NO:            TODO  anything you must not do (e.g. no dark-only, no particles) or NONE
EXCLUDE:            TODO  employers, dates, metrics or gaps that must not appear publicly, or NONE
PUBLISH:            TODO  noindexed until I say go (default) / publish live immediately
DOMAIN + ANALYTICS: TODO  vercel.app subdomain or a domain I own: ____ ; analytics no (default) / yes
```

If `CV_FILE` is missing or unreadable, stop and ask. For any other blank: take the CV's own value if it has one, otherwise choose a neutral, easily reversed default, log it in `docs/ASSUMPTIONS.md` (decision, why, how to reverse), and continue. Never present a default as my choice.

**Privacy defaults, applied unless `EXCLUDE` overrides them.** Omit date of birth, age, marital status, nationality, national ID or passport number, street address, and referees' names and contact details. Publish the phone only on `SHOW_PHONE: yes`. Report what you stripped. **These defaults govern the downloadable file too — see §9.**

---

## 2. Absolute rules

1. **Do not invent CV facts.** No employer, title, date, degree, certification, licence, client, tool, team size, budget or metric that is not in the CV. Do not promote a title, do not round or stretch a date to close a gap, do not turn "supported" into "led", do not attach a number to a bullet that had none. If the CV says "improved performance", the site says that — not "40% faster".
2. **No fake proof.** No testimonials, no logo walls, no awards, no counters of invented figures, no stock screenshots presented as my work, no generated portrait of me.
3. **Missing data has two legal outcomes: ask me, or omit the section.** An *optional* section (projects, publications, awards, speaking, memberships) with fewer than two real entries is dropped and its absence reported. **Identity, experience, education and credentials are never dropped for thinness** — a single real role, degree or licence renders as a single entry, and if it is the discipline's lead proof artefact it still leads.
4. **Never upload my CV to a third-party extraction, conversion or summarisation service.** Parse it locally.
5. **No unmeasured numbers, no unrun checks.** Every figure you report comes with the command that produced it and the path of its output file. If a tool cannot run in this environment, say so and hand me the command — never imply a pass.
6. **Language and direction:** set `<html lang>` from the CV's language and preserve my name's exact orthography. If the CV is right-to-left (Arabic, Hebrew, Persian, Urdu), set `dir="rtl"`, build the layout on logical properties (`margin-inline`, `padding-inline`, `inset-inline`, `text-align: start`) rather than left/right, mirror the reading path, and re-check the masked line reveal and any letterbox treatment — both break under naive mirroring. Ask before translating any CV text; translation is a factual transformation.
7. **Scale the site to the CV.** Length is a function of substance. A one-page early-career CV should produce a one-screen site with no nav, and that is a success, not an unfinished deliverable.
8. **Secrets and personal data stay out of the repo.** No committed `.env*`, `.vercel/` gitignored, no unredacted personal data in git history.
9. **Never silently narrow scope.** Anything dropped, deferred or simplified goes in `docs/GAPS.md` and in that turn's report. Do not halt on the first blocker: record the exact error, substitute, say what you substituted, and finish everything not blocked by it.

---

## 3. Phase 1 — read the CV, classify it, then GATE A (wait for me)

Extract the text with a local tool and say which worked: your own file reader, `pdftotext -layout`, `pypdf`, `python-docx` or `mammoth` for DOCX, `unzip -p <file>.docx word/document.xml` as a last resort. If the PDF has no text layer, or a two-column layout interleaves so the date-to-employer mapping is ambiguous, **stop and ask me for a text-bearing version** rather than reconstructing content. If the CV reached you as chat text only, say plainly that there is no evidence file to keep and no original to offer as a download — do not regenerate a PDF and present it as mine.

Produce:

- `content/cv.source.txt` — the unedited extraction, kept as the local evidence file. **Add it to `.gitignore`, along with any raw CV file that is not the redacted download**, and say so in the README. Before any push to a Git host, verify with `git ls-files` and `git log -p -- content/` that no unredacted CV text is in history.
- `content/cv.ts` — one typed module (plain TypeScript interfaces are enough): identity, headline, summary, contact, links, experience (employer, title, location, start/end, achievements verbatim, tools), education, credentials and licences with jurisdiction, skills grouped by how I use them, languages in the CV's own proficiency wording, plus a generic `sections: { title, items[] }[]` for anything else the CV carries (publications, projects, awards, memberships, speaking). **This is the only place site copy lives. No CV string may appear in a component.**
- `content/authored.ts` — any connective sentence you wrote yourself. Authored prose may frame facts; it may never assert one.

Derivation is permitted only for: durations and total years from stated dates (state the rounding rule), reverse-chronological ordering, grouping, casing and place-name normalisation, expanding an acronym the CV itself expands, and assembling a headline from my most recent title plus `TARGET_ROLES`. Log each one.

**Classify the discipline now, in this phase** (see §4 for what it drives). Print the signals — titles, tooling, certifications, employer sectors, degree field, achievement verbs — and your decision. Where two fields are genuinely close (data analyst vs data engineer, marketing vs growth, design vs design engineering), make the tie-break one of the Gate A questions with your recommendation as its default, rather than picking silently.

Then post a **fact sheet** and stop: every role as `title | employer | start-end` exactly as written, every metric found, everything stripped under the privacy defaults, every derivation, the discipline classification and its signals, any contradiction in the CV (overlapping dates, an expired certification, a title that differs between summary and history), whether the CV file itself carries privacy-default fields that would leak through a download, and **at most eight numbered questions, each with a recommended default**, so I can reply "all defaults". Do not scaffold, install or design before I confirm.

---

## 4. Let the discipline drive the structure

**Never default to a software-engineer portfolio.** A repo grid, a tech-stack marquee or a terminal hero actively damages a finance, HR, clinical, legal or academic candidate. The classification from §3 sets three things — the lead proof artefact, the section order, and the vocabulary (use the CV's own domain nouns, not generic product-speak):

| Field | Leads with | Proof artefact |
|---|---|---|
| Engineering / data | shipped systems, scope | architecture or result summaries, real repos only if the CV lists them |
| Design / creative | visual case studies | process-to-outcome sequences from real work |
| Finance / audit | ownership scope, cycle times, controls | process and governance summaries, no deal figures the CV omits |
| Legal / clinical | admissions, licensure, settings | jurisdictions and practice areas, never a client or patient detail |
| Marketing / sales | campaigns, quota, channel | named channels and outcomes the CV states |
| HR / ops / PM | programmes, headcount, throughput | before/after operating changes |
| Academic | publications and teaching | citation list from the CV, in a real citation style |

If `TARGET_ROLES` do not match my recent history, say so and lead with transferable capability rather than a reverse-chronological wall.

`HEADSHOT`: include a photo only if I supplied one. Then serve it through `next/image` with explicit `width`/`height`, `priority` only if it is the LCP element, `sizes` matching its rendered width, and alt text naming me — never a description of my appearance. If I left it `none`, do not substitute an illustration, an avatar or an initial monogram treated as a portrait. Say in one line whether a photo helps or hurts for `TARGET_ROLES` in `MARKET`.

Write `docs/IA.md` before coding: per section, its job, the one conclusion the reader should draw, the exact `cv.ts` fields it reads, and the rule for omitting it. Name the grid explicitly — columns, where the asymmetry sits, and what the eye hits first, second and third — plus the tablet rule for 768–1024px. A hiring manager for `TARGET_ROLES`, on a phone, must get my name, the role I am aiming at, my location, the single strongest real proof and one contact action — **from the server-rendered HTML, never gated behind an animation.**

---

## 5. Research protocol, bounded, one artefact

Open **six real, currently live reference sites** — at least three personal or studio sites in or adjacent to my discipline, at least two of those text-and-type-led with little imagery (an asset-light CV needs real precedent, not stock padding) — **plus at least two current guidance sources** on scroll motion and typographic scale (MDN, web.dev, the WCAG 2.2 quick reference, Nielsen Norman Group, motion.dev and Codrops are all reasonable). Verify any browser-support claim on MDN or caniuse rather than asserting a version. Under budget pressure, cut to three sites and one guidance source, and say so.

Write `docs/RESEARCH.md`. Per reference: URL, date opened, the one technique worth taking, its cost in JS and time-to-readable, a steal / adapt / reject verdict, and whether it suits my discipline. Then a **decisions table** with real values — font pairing with full fallback stacks, fluid type scale, colour tokens with measured contrast ratios, spacing and radius scale, motion durations and easings, section order — each with a one-line rationale, plus what you rejected and why.

If a page will not load, drop it and say so. A fabricated citation is worse than four real references. Do not quote a statistic you cannot source — in particular, do not repeat the "recruiters spend six seconds" claim or any relative of it. If you cannot browse at all, say so in the file and mark every principle as unverified.

---

## 6. Design, tokens, and what "cinematic" means here

Tokens (colour, spacing, type scale, radii, durations, easings) live in one CSS or theme layer and are the only home for raw values; components reference token names, never magic numbers. Ship designed light and dark palettes honouring `prefers-color-scheme`; dark mode is never `filter: invert()`.

Report measured contrast in a table for both themes and **name the tool** — DevTools' colour picker, the WebAIM Contrast Checker, or a scripted check (`culori`, `apca-w3`) are all acceptable. Body text at least 4.5:1; large text and the boundaries and focus indicators of interactive components at least 3:1 (WCAG 1.4.3, 1.4.11). Gradient text, images behind text and translucent overlays are where this fails and where automated checkers report nothing: for any text over a gradient, image or overlay, report the ratio **at the worst pixel of the text run** and attach a screenshot of that spot.

**Cinematic means directed, not busy.** Pick at most three of these techniques plus one signature moment, and implement them as named:

- **Staged section reveal** — `whileInView` with `once: true` and a viewport margin. **Do not substitute CSS `animation-timeline: view()` for this:** a view timeline is scroll-*driven* and bidirectional, so scrolling back up runs the reveal in reverse and re-hides content, which this brief forbids, and it leaves below-fold text at `opacity: 0` in the JavaScript-disabled screenshot. Use CSS scroll-driven animation only for a genuinely scrubbed, reversible effect whose content is fully legible at progress 0.
- **Masked line reveal** — split by *line*, never by letter: `overflow: hidden` on the wrapper, inner span translating from 100%. Keep the accessible name on the container and hide the fragments.
- **Sticky progress scene** — `position: sticky` with scroll progress mapped to transforms. Never intercept the wheel.
- **Layered depth** — at most three layers at 15% differential or less, never on body copy.
- **Shared-element continuity** — a layout-id transition within the document; verify cross-document view-transition support on MDN before relying on it.
- **Editorial treatment** — static grain, vignette or letterbox. Static, not animated, at **6% opacity or less**, and it must not move any text/background pair below its contrast floor — re-measure the affected pairs with the overlay composited, not without it.

A **signature moment** is the one sequence a visitor would describe afterwards. It occurs once, at or above the first section fold, runs to 900ms or is scroll-scrubbed, and has a still equivalent under reduced motion. It must not cost LCP: **the LCP element may not sit inside the animated subtree, and Lighthouse LCP with the moment present must be within 100ms of a build with it removed — report both numbers.** If you cannot name what it communicates, you do not have one — remove it.

Enforced budget:

- UI durations 180–600ms; the signature moment up to 900ms. Two or three named easings, referenced by token.
- Animate `transform` and `opacity` only (`filter` sparingly). Never `width`, `height`, `top`, `left`, `margin` or `box-shadow`, and never from a raw scroll listener that reads layout. Add `will-change` and remove it after.
- Reveals fire once; scrolling up never re-hides content. Stagger 40–70ms, at most six staggered children. Text translates at most 24px, cards 40px; entrance scale starts at 0.96–0.98, never 0.8.
- No scroll-jacking, no wheel hijacking, no forced snapping, no preloader or percentage counter, no intro that needs skipping, no custom cursor replacing the system one, no autoplaying audio, no looping decoration outside one small accent. Smooth-scroll libraries: off by default.
- **Content never depends on JavaScript to be visible.** A CSS `opacity: 0` undone only by an observer is a content-loss bug. Apply the hidden state after JS confirms, or use `@starting-style`. Load the page with JS disabled: all text present and readable.
- Keep a motion ledger in `docs/DESIGN.md`: every animation, its trigger, its token, and what it communicates. Delete any row whose justification is "looks nice".

**Avoid the generic AI-portfolio look.** Each tell, and what to do instead:

| Tell | Instead |
|---|---|
| Purple-to-blue gradient hero | one restrained accent over a real surface; type carries the hero |
| Glassmorphic card soup, floating blobs, stock 3D | flat surfaces, hairline borders, real whitespace |
| Everything centred in identical stacked cards | the asymmetric grid named in `docs/IA.md`, with a stated reading path |
| Emoji per heading, icon-per-skill marquee | words, grouped by how I actually use the skill |
| Animated counters of invented metrics | the CV's own numbers, stated plainly, or none |
| "Hi, I'm X, passionate about crafting beautiful digital experiences" | first person, specific, evidence-led, in my domain's vocabulary |
| Grey placeholder rectangles or stock mockups as my work | a typographic treatment that needs no images |

Banned in copy: passionate about, results-driven, dynamic professional, team player, ninja/rockstar/guru, third-person bio, emoji.

---

## 7. Stack, dependencies, architecture

Default: **Next.js (App Router) + TypeScript + Tailwind**, scaffolded non-interactively:

```
npx create-next-app@latest <project-name> --ts --tailwind --eslint --app --src-dir --yes
```

**The project name is a positional argument and `--yes` does not supply it** — omit it and the CLI stops on "What is your project named?", which is the exact hang this is meant to avoid. If you need a non-default import alias, pass `--import-alias` with quoting that survives your shell. Check `--help` first, because the prompts change between versions; if it still prompts, scaffold manually rather than hanging. Name the project something neutral — see §8, the project name becomes a public URL.

The justification you must be able to defend: static-first rendering puts every CV fact in the HTML, `next/font` self-hosts at build time with a metric-matched fallback that *reduces* layout shift, `next/image` removes the other usual shift source, and the Metadata plus `sitemap` / `robots` / `opengraph-image` conventions cover §9 with no extra dependency while Vercel auto-detects the preset so no build configuration is needed. You may substitute (Astro, Vite) with one README paragraph naming what you lose.

**One animation library, not two.** Default `motion`, imported from `motion/react` — it is the successor package to `framer-motion` under a different package name, so do not `npm i framer-motion` and then import from `motion/react`. Reach for GSAP + ScrollTrigger only if the design genuinely needs a pinned, scrubbed timeline, and then do not also ship `motion`. No 3D or WebGL unless my discipline is 3D, games, graphics or creative technology; if used, lazy-load it client-side behind a static poster, never block the largest paint, and skip it under reduced motion.

No UI kit, no CMS, no database, no auth. Analytics only if I said yes. Every non-framework dependency gets a README line: what it is for and its **measured** transferred size from the build output or bundle analyzer — never a weight quoted from memory. No dependency that two lines of CSS would cover.

Architecture limits: all copy read from `content/`, no component file over 200 lines, no route file over 150. A single large `page.tsx` is a rejected deliverable.

Build order: tokens, then layout and type primitives, then sections wired to real CV content, **then** motion. Content before choreography. Never animate placeholder copy, and no lorem ipsum at any commit.

---

## 8. Smoke-deploy, then GATE B (design direction)

Prove the auth and remote build path before the site exists — discovering a broken deploy after the budget is spent is the most common way this run fails.

`npm i -g vercel@latest` or `npx vercel@latest`. `vercel login` is interactive: if you cannot complete it, stop and ask me to log in, or ask me for a token and export `VERCEL_TOKEN`. Then `vercel whoami`, `vercel link --yes`, then deploy. **Pass `--yes` (and set `VERCEL_TOKEN` where you can) on every CLI call so nothing blocks on a prompt.**

**Critical, and it governs §11: Vercel's first deployment of a new project is always a production deployment, even without `--prod`.** It is aliased to `<project>.vercel.app`, and Deployment Protection does *not* cover production domains — so that first deploy is public and crawlable unless you stop it. Therefore, from the very first deploy and until I say go at Gate C:

- `robots: { index: false, follow: false }` in route metadata, **and** an `X-Robots-Tag: noindex` response header (set it in `next.config` headers so it covers files in `public/` too).
- Keep the `robots` route **allowing** crawl. Never pair a robots.txt `Disallow` with a noindex: the disallow prevents the crawler from reading the noindex, so the URL can still be indexed from an inbound link (Google Search Central), and it also breaks the `/sitemap.xml` fetch in §10.
- Deploy later iterations with `vercel deploy --yes` (preview target). Note that **Vercel Authentication is on by default for preview deployments**, so a preview URL answers 401 to me unless I am signed in to that Vercel account, and to `curl` unless you configure a protection-bypass secret (check the current CLI and dashboard options rather than assuming a command). **Never report a Lighthouse, axe or status-code result taken against a protected URL — you measured the SSO page.**

Confirm the smoke deploy returns 200 and keep `.vercel` gitignored. **Delete the placeholder route before Gate C** — do not leave it behind a `/preview` path.

### GATE B — design direction (delete this section for full autonomy)

Now that the app scaffold and the deploy path both exist: build **one** direction as a static route with real CV copy, deploy it so I can actually open it, screenshot it at 390px and 1440

### GATE B — design direction (delete this section for full autonomy)

Now that the app scaffold and the deploy path both exist: build **one** direction as a static route with real CV copy, deploy it so I can actually open it, screenshot it at 390px and 1440px with the tool from §0, write the named direction and the alternative you rejected into `docs/DESIGN.md`, and wait for my go. Delete or noindex that route once a direction is chosen. *If I want you to run unattended, I will delete this gate; then choose the direction, record it and the rejected alternative in `docs/DESIGN.md`, and continue without stopping.*

---

## 9. Accessibility, reduced motion, responsive, shareability

- **Keyboard:** skip link as the first focusable element, visible `:focus-visible` on every control (never `outline: none` with nothing in its place), logical tab order, Escape closes overlays, no focus trap, nothing focusable while off-screen or invisible. Walk the whole page and report what you found.
- **Reduced motion is a requirement, and must yield an equivalent site, not a blank one.** Implement both halves: the library switch (`MotionConfig` with `reducedMotion="user"`, plus the reduced-motion hook where a component must branch) and a CSS `@media (prefers-reduced-motion: reduce)` block for everything outside it. Under it: every element at final position and full opacity, parallax and scroll-linked transforms gone, sticky scenes become normal stacked sections with all their content, marquees stopped and readable. Verify by emulating the setting (Playwright `page.emulateMedia({ reducedMotion: 'reduce' })`) and attach the screenshot. An element stuck at `opacity: 0` here is the worst defect in this build.
- **Semantics:** landmarks with accessible names, exactly one `h1`, no skipped heading levels, an accessible name on every control and link (no bare icon buttons), real alt text for meaningful images and `alt=""` for decorative ones, decorative motion layers `aria-hidden`.
- **Screen reader:** report what is announced for the `h1`, the nav and the primary call to action, using whatever reader this machine has (VoiceOver, NVDA, Narrator, Orca). **A pass is:** the `h1` announces my name and target role once, with no split-text fragments leaking; the nav announces as a navigation landmark with an accessible name; the primary CTA announces its action and its destination. If no reader exists here, say so and give me the steps.
- **Responsive as behaviour, not shrinkage:** mobile-first; multi-column grids become one column with reading order intact; wide tables become card stacks; every hover affordance has a tap equivalent and is guarded by `@media (hover: hover) and (pointer: fine)`; `dvh`/`svh` instead of bare `100vh`; `env(safe-area-inset-*)` on anything fixed **together with the opt-in that makes those values non-zero** — in Next, `export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' }`; without it every inset resolves to 0. A decided 768–1024px layout, screenshotted at 834px to show it is neither the phone stack nor the desktop grid. A content cap keeping measure at or under ~75ch on ultra-wide. Tap targets meet WCAG 2.2 SC 2.5.8 (24×24 CSS px minimum), 44×44 preferred on primary actions. Usable at 200% text zoom with content reflowing rather than clipping, and no two-dimensional scrolling at 320 CSS px. Screenshot 360, 768, 834, 1280 and 1920 plus one landscape phone, and assert no horizontal overflow at 320.
- **Cross-browser:** verify in WebKit — real iOS Safari, or `--project=webkit` in Playwright, declared as the substitute it is — and report any divergence at 390px. The four features this brief mandates that diverge most there are `dvh`/`svh`, `env(safe-area-inset-*)`, sticky progress scenes, and any backdrop treatment.
- **Shareability:** per-route metadata with `metadataBase` set to the **production origin, never localhost**, a canonical URL, title `Name — Target Role`, a description written from the CV, `Person` JSON-LD whose values match `cv.ts` exactly and whose `sameAs` lists only real links, plus `sitemap` and `robots` routes, a favicon and correct `lang`/`dir`. The Open Graph image goes through the `opengraph-image` convention, which **does not choose a size for you**: export `size = { width: 1200, height: 630 }` and `contentType = 'image/png'`, and if you use `ImageResponse` from `next/og` with a non-system font you must fetch that font and pass it in `fonts` — a missing font is the usual cause of a blank card. Open the rendered image and confirm it is not blank and is legible at thumbnail size.
- **Recruiter mechanics:** serve the CV from `public/` **only after you have opened the file and confirmed it carries nothing on the privacy-defaults list or `EXCLUDE`.** A real CV routinely carries a street address, date of birth, nationality, marital status, national ID and referees' phone numbers — stripping those from the page and then shipping them in an unauthenticated, crawlable PDF is a leak, and DoD line 2 covers this file: a privacy-default field inside the served PDF is a **FAIL**, not a pass. Default to a redacted PDF, name every field you removed, and serve the unredacted original only on an explicit `CV_DOWNLOAD: original, unredacted`. Never a re-typeset copy. Add `X-Robots-Tag: noindex` for the file, show its date, and hash the source and the served file (`sha256sum` or the §0 equivalent) and report both. A copy-email button using the Clipboard API with a real `mailto:` fallback that works with JS off, its confirmation announced in a polite live region. A `@media print` stylesheet: light background, no fixed positioning, collapsed sections expanded, link URLs via `content: attr(href)`, two pages or fewer — verify by printing to PDF. State in the README that applicant tracking systems parse the uploaded PDF, not this website; do not call the site "ATS-optimised".

---

## 10. Measured gates — run these and paste the output

All performance numbers come from a production build (`npm run build && npm start`) or the live URL. **Never Lighthouse the dev server, and never a URL behind Vercel Authentication.** Lighthouse defaults to mobile emulation and there is no mobile preset: run it plain for mobile, and with `--preset=desktop` for desktop.

| Gate | Command / method | Bar |
|---|---|---|
| Typecheck and lint | `npx tsc --noEmit`; `npx eslint .` | clean |
| Production build | `npm run build` | clean; paste the landing route's First Load JS verbatim. That is Next's JS-chunk accounting, **not** transferred page weight — report transferred bytes separately from the browser network panel |
| Lighthouse mobile | `mkdir -p reports` first (`--output-path` does not create parents), then `npx lighthouse <prod-url> --output=json --output-path=reports/lh-mobile.json` | Performance ≥ 90. Needs a real Chrome (§0); if it cannot run here, hand me the command and mark **SKIPPED** — never infer a score |
| Lighthouse desktop | same with `--preset=desktop` | report all four categories |
| Core Web Vitals | from those reports | LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms (report TBT as the lab proxy) |
| Signature-moment LCP | Lighthouse LCP with it, and with it removed | within 100ms; report both |
| Automated a11y | `npx @axe-core/cli <prod-url>` — it drives a real browser through webdriver and often cannot run in a headless agent environment; if it fails, substitute `@axe-core/playwright` and name which you used | zero serious or critical, each violation named |
| Contrast | measured ratio per text/background pair in both themes, tool named, worst-pixel ratio for text over gradients/images/overlays | 4.5:1 body, 3:1 large text and interactive-component boundaries |
| JS disabled | `browser.newContext({ javaScriptEnabled: false })`, full-page screenshot | all text present |
| WebKit | same page at 390px in WebKit | divergences named |
| Live links | every outbound link, the CV download, the OG image, `/sitemap.xml`, `/robots.txt` against the production origin: `curl -sS -A 'Mozilla/5.0' -o /dev/null -w '%{http_code} %{url_effective}\n' -L <url>`, falling back from HEAD to GET; `curl.exe` on Windows | paste every code. **Treat 999 (LinkedIn's bot block), 403 and 405 as "blocked to non-browser clients — verify in a browser", not as dead.** A link is dead only on 404/410 or DNS failure, and you never delete one of my real links on a bot block |

Missing a bar is acceptable if you report the real number and the reason. Claiming an unmeasured bar is not. **The Lighthouse accessibility score is a weighted subset of automated checks, not an accessibility claim** — report keyboard, reduced-motion and screen-reader findings separately, and never treat 100 as a pass.

---

## 11. Publish — GATE C (wait for me)

This page puts my name, employment history and contact details onto a permanent, scraped, indexed surface; on `CURRENTLY_EMPLOYED: yes` it is visible to my employer.

1. The site is already deployed and noindexed from §8. Confirm the noindex is actually in force: `curl -sSI <url> | grep -i x-robots-tag`, and the meta tag in the served HTML.
2. Send me the URL and **wait**. Tell me the minimum I should check before saying go: my name's spelling, every date and title, that nothing on `EXCLUDE` appears, that the phone and photo decisions are as I set them, and that the CV download is the file I expect with the redactions I asked for.
3. On my explicit go: remove the noindex metadata and header, then `vercel --prod --yes`.
4. Verify: `curl -sS -o /dev/null -w "%{http_code}\n" <url>` returns 200, the URL opened in a browser and screenshotted, both Lighthouse runs and the link sweep re-run against production, the OG image opened and legible, and `x-robots-tag` now absent. A deploy is not done until an opened production URL has been seen. If the Vercel build fails, read the deployment's build logs (`vercel inspect` with its logs flag, or the dashboard) rather than guessing.
5. Hand back the stable `https://<project>.vercel.app` alias, not only a hashed one-off deployment URL.
6. **If I do not reply:** that is not a failure and not a gap. Hand over the noindexed URL, the exact command to publish (`vercel --prod --yes` after removing the noindex, named file and line), and the README redeploy path. Say plainly that the site is built, verified and one command from live, and that the last step is mine by design.
7. **The Git-import alternative, one README paragraph:** push the repo to GitHub/GitLab/Bitbucket (after the history check in §3) and import it at vercel.com/new; the Next.js preset is auto-detected, thereafter pushes to the production branch deploy to production and every other branch and PR gets a preview. Set Root Directory only if the app is not at the repo root. Do not hand-write a `vercel.json` build command.
8. Tell me the unpublish path: remove the deployment or delete the project in the dashboard.
9. Custom domain only if I said I own one: add it via the CLI or project settings and give me the exact DNS records Vercel shows. Do not touch my DNS, and do not call it live before the certificate has issued.

**Handover:** the README states install, dev, build, where content lives, and the one-command update path — edit `content/cv.ts`, `npm run build`, `vercel --prod --yes`. Nothing may depend on your environment. Commit in logical increments.

---

## 12. If you run short of turns or context

A correct small site that is live beats an unfinished large one. Cut in this order: extra pages, then viewport screenshots beyond 360/834/1280, then the WebKit pass, then the desktop Lighthouse run, then the signature moment, then research references down to the §5 floor. **Never cut:** CV accuracy, the privacy check on the downloadable file, reduced motion, keyboard access, the JS-disabled check, the link sweep, or getting the site deployed and noindexed. Say what you cut in the same turn you cut it, and in `docs/GAPS.md`.

---

## 13. Reporting

Between gates, decide rather than ask, and log to `docs/ASSUMPTIONS.md`. Each phase, report five short blocks: **Done** — **Files** (paths) — **Evidence** (the command and its result, or a screenshot path) — **Assumptions added** — **Next**. Mark anything you inferred rather than read with `[inferred]`. Do not restate this brief back to me.

Final handback, in this order: the live URL and repo path; the local run and redeploy commands; the §10 gate table with real numbers and report file paths; a screenshot index including reduced-motion, keyboard-focus, JS-disabled and WebKit states; a provenance table mapping each section to its CV source; the redaction list for the served CV; assumptions I should review; open questions; labelled gaps with what would close each; and one honest paragraph on what would most improve my chances for `TARGET_ROLES` that this site cannot fix — a missing credential, an unexplained gap, thin quantification in the CV itself.

---

## 14. Definition of done — walk this list and report PASS / FAIL / SKIPPED per line

You may not mark a line PASS unless you ran the check in this environment and can name its output or file. SKIPPED with a reason is an acceptable answer; a PASS you did not obtain is not.

1. Every fact on the site traces to `content/cv.source.txt`, and the provenance table proves it.
2. Nothing from `EXCLUDE` or the privacy defaults appears in the build output **or inside the served CV file**.
3. `content/cv.source.txt` and any raw CV are gitignored and absent from git history.
4. No CV string appears outside `content/`; no file over the §7 limits.
5. Typecheck, lint and production build clean, with First Load JS pasted.
6. Lighthouse mobile Performance ≥ 90, with LCP, CLS and TBT reported from the JSON.
7. Zero serious or critical axe violations, tool named.
8. Contrast table complete for both themes, including worst-pixel ratios over gradients/images/overlays.
9. Reduced-motion pass: emulated, screenshotted, nothing invisible.
10. Keyboard pass walked and reported; skip link and focus styles present. Screen-reader pass against the §9 criteria.
11. No horizontal overflow at 320px; usable at 200% zoom; screenshots at the named viewports including 834px; WebKit checked at 390px.
12. All text present with JavaScript disabled.
13. Every link, the CV download, the OG image, the sitemap and robots return their status codes against production, with bot-blocks distinguished from dead links.
14. Smoke-deploy placeholder and Gate B preview route removed or noindexed.
15. Production URL opened, screenshotted and returning 200, with the stable alias handed over — or, pending my go, the noindexed URL plus the one command that publishes it.
16. README carries install, content location, redeploy and unpublish.

---

## 15. Failure modes — do not do these

1. Scaffolding and choosing a look before reading the CV, then bending my content into it.
2. Filling a thin section with invented projects, metrics, testimonials or a logo strip — which ends the candidacy at the first reference check.
3. Making every CV a software-engineer portfolio regardless of discipline.
4. Quietly closing a date gap, promoting a title "for impact", or attaching a number to a bullet that had none.
5. Hardcoding CV copy across twenty components, so one date fix is a find-and-replace and the OG image, JSON-LD and print view drift apart.
6. Animating everything, delaying the headline behind an entrance, or honouring reduced motion by shortening durations while elements stay stuck at `opacity: 0`.
7. Rendering the hero client-side inside an animation wrapper, so JS-off, a hydration error and crawlers all see nothing.
8. Leaving mobile to the end and calling a desktop-perfect page responsive.
9. Reporting Lighthouse, axe or contrast numbers that were never run, or run against the dev server, localhost, or a URL behind Vercel Authentication — and leaving `metadataBase` at localhost so every shared link renders a blank card.
10. **Letting the first deploy go public because `--prod` was not passed.** It is production by default. Noindex from deploy one.
11. Shipping the unredacted CV PDF from `public/` after carefully stripping the same fields from the page.
12. Calling it deployed from a line of CLI output, without an opened 200-returning production URL — or publishing my name, history and contact details before I have read the rendered page.
