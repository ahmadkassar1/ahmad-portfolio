# Portfolio verification — 15 September 2026

This is a complete noindexed preview, pending owner review before production promotion. The original and redacted CVs were read and rendered locally. Original source evidence is excluded from Git.

| Check | Status | Evidence |
| --- | --- | --- |
| CV facts and verbatim achievement bullets | PASS | `node scripts/audit-content.mjs --pdf ../upload/Ahmad_Kassar_Full_Stack_Developer_CV.pdf` → `reports/content-audit.json`: 130 source mappings; all 17 achievement bullets |
| Production build | PASS | `npm run build` → `reports/build.log`; Next.js 16.3.5, static routes |
| Static types / lint | PASS | `npm run typecheck`; `npm run lint` → `reports/typecheck.log`, `reports/lint.log` |
| Chromium browser flows | PASS | `CHROME_PATH=<installed-binary> node scripts/run-qa.mjs` → `reports/browser-audit.json`; tested the actual production build |
| Accessibility automation | PASS within measured scope | axe returned no violations in light or dark. This is not a complete WCAG or screen-reader certification. |
| Keyboard / reduced motion / JavaScript disabled | PASS | Skip link moves focus; keyboard targets recorded; final transforms under reduced motion; all 17 bullets readable without JavaScript |
| Email / project details / theme | PASS | Clipboard contains actual email and confirms success; mailto fallback; native disclosures; theme toggle |
| Viewports / zoom | PASS in Chromium | No overflow at 320, 360, 390, 768, 834, 1280, 1440, 1920px; 200% text zoom; screenshots including landscape and review direction |
| Contrast | PASS | `reports/contrast.json`: minimum tested normal-text ratio 5.542:1; minimum control ratio 3.519:1 |
| Redacted PDF | PASS | `reports/cv-redaction.json`; actual phone redaction, text extraction verified, both PDF pages visually reviewed, original unchanged |
| WebKit / actual Safari | SKIPPED | Installation unavailable; precise launch error in browser report. Chromium emulation is not Safari evidence. |
| Screen reader | SKIPPED | No NVDA/VoiceOver available. Semantic landmarks, accessible names and native controls inspected separately. |
| Lighthouse / signature comparison | PENDING | Must measure the actual accessible portfolio, never an authentication page. |
| Hosted URL / deployed asset sweep | PENDING | Updated after Vercel deployment is ready. |
| Production / indexing | SKIPPED by design | Owner must review the complete preview. Noindex is present in HTML and response headers. |

## Browser installation substitution

The mandated Playwright `--with-deps` installation failed when apt attempted unavailable setgroups/setuid/chown operations. The browser-only retry timed out at the Chromium CDN. Actual Chromium screenshots and axe checks were subsequently produced with the official `@sparticuz/chromium` package (version recorded in the lockfile). Its bundled archives were extracted into a task-local directory with ownership preservation disabled; no privileged package installation or permissions escalation was used. Playwright's normal WebKit installation remains unavailable. The Chromium executable and reported browser version are in `reports/browser-audit.json`.

Browser checks use `next start` from a completed production build, with a local server launched in the same execution namespace as the runner. A local production-build browser check is distinct from a hosted deployment check and from field Core Web Vitals. No INP claim is made from Lighthouse; TBT is a lab proxy.

Screenshots are delivered as a separate review artifact instead of adding large image files to the source repository. The direction is Clear Signal; rationale and rejected alternative are in `docs/DESIGN.md`. Every timing or score in the final report links to its measured output.
