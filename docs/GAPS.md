# Remaining gaps and deliberate omissions

The user explicitly asked to proceed and create the actual website after the initial fact-sheet checkpoint. The complete noindexed preview serves as the content/design review. Production promotion and public indexing remain separate from preview delivery.

| Item | Status | Evidence / next step |
| --- | --- | --- |
| Current job and total years | Source wording retained; total-years headline omitted | The CV says Present and 3 years. No present-day employment verification or duration inference was made. A redacted download preserves the original source wording. |
| Individual project demos and repositories | Omitted | The CV supplies no project URLs. The GitHub profile is linked; project cards contain authentic descriptions and expandable bullets. |
| Headshot, testimonials, awards, credentials, licences | Omitted | No source evidence supplied. No substitutes or fabricated proof. |
| Playwright standard installation | Failed; Chromium substitute used | `npx playwright install --with-deps chromium webkit` failed because apt could not set groups/ownership. The browser-only retry timed out downloading Chromium. A packaged Chromium binary is used for actual local Chromium checks. |
| WebKit / real iOS Safari | Not yet verified | No usable WebKit was installed. The browser report records the precise status; Chromium mobile emulation is not claimed as Safari coverage. |
| First Load JS build column | Not emitted by this Next.js version | The actual Next.js 16.3.5 build log is retained. Lighthouse transfer data is separate; no fabricated build-column value. |
| Production promotion / indexing | Awaiting review of the complete preview | Existing main/production remains intact. Search indexing stays disabled in metadata and headers. |

See `docs/QA_REPORT.md` for actual measurement results. All checks are reported as measured, failed or skipped; there is no inference of passing from installation alone.
