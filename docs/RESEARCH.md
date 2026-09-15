# Design research — 15 September 2026

All URLs below were opened with the web tool. No reference-site timing or transfer size was measured; those cells are explicitly unknown. Techniques are observations/inferences, not measurements of the other sites. Application measurements are recorded separately in reports.

| Reference | Technique considered | Reference JS / time-to-readable | Verdict and discipline fit |
| --- | --- | --- | --- |
| [Brittany Chiang](https://brittanychiang.com/) | Clear identity, linked career scope and source-specific tools | Not measured / not measured | Adapt: engineering credibility through concrete experience; use a different palette and page grid |
| [Rauno Freiberg](https://rauno.me/) | Concise text-led identity and deliberate interaction details | Not measured / not measured | Adapt: typographic restraint; reject experimental navigation for this CV |
| [Paco Coursey](https://paco.me/) | Short descriptions that stand on their own without a screenshot | Not measured / not measured | Adapt: text-led project entries suit missing visual assets |
| [Lee Robinson](https://leerob.com/) | Direct biography and simple readable links | Not measured / not measured | Adapt: clarity; reject a writing-led page because this CV has no publications |
| [Emil Kowalski](https://emilkowal.ski/) | Named projects and focused interaction | Not measured / not measured | Adapt: restrained details; no newsletter because no source or backend supports one |
| [Josh W. Comeau](https://www.joshwcomeau.com/) | Strong labels and readable content hierarchy | Not measured / not measured | Adapt the hierarchy; reject tutorial-heavy density and decorative characters |

The www.emilkowal.ski attempt failed; the canonical emilkowal.ski page opened successfully. vlad.ai returned no inspectable content and was dropped. No technique or reference measurement is attributed to those failed reads.

## Current implementation guidance

- [Motion scroll animations](https://motion.dev/docs/react-scroll-animations): `whileInView` with `viewport.once` supplies one-time entrances. Our content retains full opacity at every stage.
- [MDN animation-timeline](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline): limited availability; no scroll timeline is required for readable content, and no bidirectional text reveal is used.
- [MDN clamp](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/clamp): bounded fluid scale between mobile and desktop sizes.
- [WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/): contrast, focus, target size, reflow and reduced-motion checks are tested separately.
- [Next.js installation](https://nextjs.org/docs/app/getting-started/installation): current CLI was checked with `--help`. The installed Next.js package's bundled layout/font/metadata guides were read before app code.

## Decisions

| Decision | Actual implementation | Rationale |
| --- | --- | --- |
| Body / display font | Manrope variable via next/font/local; fallbacks Arial, Helvetica, sans-serif | A clear editorial face that supports large names and practical body copy |
| Labels / technical text | IBM Plex Mono; fallbacks SFMono-Regular, Consolas, Liberation Mono, monospace | Distinguish dates and technology without a terminal theme |
| Name scale | clamp(5rem, 3.7rem + 5.6vw, 8.75rem) | Main identity anchors the page |
| Section scale | clamp(2rem, 1.2rem + 2.1vw, 3.25rem) | Clear hierarchy without taking over the screen |
| Body scale | clamp(0.95rem, 0.92rem + 0.15vw, 1.0625rem) | Reading size stays bounded |
| Colour | Light #f8f9fc / #172033 / #234fe5; dark #101621 / #f1f4fc / #abc0ff | Restrained blue with independently authored palettes; ratios in reports/contrast.json |
| Spacing | 4/8/12/16/20/24/32/40/48/64/80/96 px scale, fluid gutters | Consistent rhythm from controls to sections |
| Radii | 0.4rem / 0.85rem / 1.25rem | Clear surfaces without excessive rounding |
| Motion | 220ms controls, 480ms section transforms, 800ms signature rule | Feedback and reading progression without hiding copy |
| Easing | cubic-bezier(.22,1,.36,1), cubic-bezier(.2,0,0,1) | Directed entrances and responsive controls |
| Order | Introduction + production proof; projects; experience; skills; education/languages; contact | Real engineering proof precedes tools and background |

No gradient, text-on-image, grain, translucent overlay, portrait, stock screenshot, invented project URL, testimonial or claim of measured business impact is used. The contrast report includes all used text/surface and interactive boundary pairs; no worst-pixel overlay test applies because those treatments are absent.
