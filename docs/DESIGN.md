# Direction: Clear Signal

One light-first editorial direction with a fully designed dark palette. The name is the typographic anchor; an asymmetric introduction leads into real production proof, then substantial text-based project panels. There is no stock imagery or simulated product screenshot.

Rejected alternative: a 3D workspace / terminal environment. It adds navigation and rendering cost while the supplied CV is strongest on shipped ERP features and practical business applications. The existing production portfolio is not the source of any facts in this build.

## Grid and reading path

Desktop: constrained 78rem shell. Hero columns are 1.15fr / .85fr; project columns 1.14fr / .86fr. The eye hits the name, the role/scope and contact, then TheBridge/Populus proof. Experience pairs a narrow date column with a wider account of the work.

Tablet 768–1024px: balanced two-column hero and projects, tighter gaps, vertically grouped hero actions, and a 1:2 date/content experience grid. Mobile: one reading column and a separate simple nav row. Identity, location, proof and email remain ordinary HTML.

## Motion ledger

| Animation | Trigger | Token | Meaning / static equivalent |
| --- | --- | --- | --- |
| Staged section reveal | First viewport intersection, once=true, negative bottom margin | theme.motion.reveal; theme.motion.distance; theme.motion.ease | Nudge new work into the reading flow; opacity stays 1 even before hydration. Reduced motion is the final transform |
| Button lift | Pointer hover only | --duration-hover; --ease-responsive; --hover-shift | A small action affordance; focus and tap work without it |
| Signature: connection rule | Initial CSS animation outside the LCP name/intro subtree | --duration-signature; --ease-directed | Connects the identity to production proof; static equivalent is the complete line |

No raw scroll handler, pinned scene, body-copy parallax, character splitting, blocking intro, repeated reveal or hidden text. Motion elements set will-change at start and clear it on completion. The signature is retained only if the requested Lighthouse baseline supports its LCP budget; otherwise remove it and record that decision.

All main colour, typography, spacing, radius and motion values live in src/styles/tokens.ts. CSS media-query breakpoints and print overrides are platform-specific layout values. Open Graph dimensions and SVG coordinates are format geometry, not UI tokens.

No headshot was supplied. For this engineering portfolio, the useful proof is the work itself; a photo adds no necessary qualification evidence.
