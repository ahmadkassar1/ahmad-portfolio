# Ahmad Kassar — portfolio

A responsive, CV-backed Next.js portfolio with project disclosures, production experience, grouped skills, education, languages, email actions, light/dark themes and a clearly labelled redacted CV download.

## Run and maintain

Requires Node 24 and npm. Versions are pinned in `package.json` and `package-lock.json`.

```bash
npm ci
npm run dev
npm run typecheck
npm run lint
npm run build
npm start
```

Edit facts only in `content/cv.ts`. Keep authored interface labels and connective copy in `content/authored.ts`. `content/display.ts` only selects or formats source content. Design tokens, font scales and motion durations live in `src/styles/tokens.ts`; layout styles are in `src/app/globals.css`. App Router routes are in `src/app`, with small components in `src/components`.

## Source evidence and privacy

The attached PDF was parsed locally with `pdftotext -layout`. Its unedited extraction is retained locally as `content/cv.source.txt` and deliberately excluded from Git and deployments. The raw PDF is not in the repository. The only published PDF is `public/Ahmad_Kassar_CV_Redacted.pdf`, produced by actual text redaction of the phone while preserving the original PDF layout. Hash and text-extraction checks are in `reports/cv-redaction.json`.

When working from a fresh clone, privately place the same extraction at `content/cv.source.txt` before running `npm run audit:content`. Never commit it. That audit compares all mapped fields and all achievement bullets to the local evidence; it is separate from lint, static typing and browser checks. Do not copy the earlier private Gate A archive into this repository.

## Preview and deployment

This implementation is on branch `codex/cv-portfolio-20260915` of the existing `ahmadkassar1/ahmad-portfolio` repository. It descends from the repository's clean initial starter commit, preserving the existing main branch and avoiding the unrelated site's later history. The repository is already connected to Vercel project `ahmad-portfolio`. Pushing this preview branch triggers a preview deployment. Keep updates on this branch until the owner reviews the site.

```bash
git checkout codex/cv-portfolio-20260915
git add src content/cv.ts content/authored.ts content/display.ts
git commit -m "Update portfolio content"
git push origin codex/cv-portfolio-20260915
```

Every route, including the PDF, has `X-Robots-Tag: noindex, nofollow`, and page metadata also specifies noindex. `robots.txt` allows crawling so crawlers can see those directives. There is no analytics or availability statement. Noindex is a search-engine directive, not authentication. Vercel's existing preview protection is preserved.

After explicit owner approval, a maintainer can review/merge the preview branch and deploy production through the connected Vercel project. The previous main site has substantial unrelated functionality, so review the replacement before merging. To keep employment-related privacy, leave indexing off unless separately authorized. If indexing is authorized, update both `src/lib/site.ts` and `next.config.ts`, then recheck page and PDF response headers. Set the intended canonical origin in `src/lib/site.ts` before publishing to another domain.

To remove a preview, use Vercel → ahmad-portfolio → Deployments → select the specific preview → Delete. Deleting a Git branch alone does not remove an existing deployment. To remove the entire site, archive/delete the intended Vercel project only after reviewing its other deployments and domains.

## Verification

`reports/` contains actual command output. `docs/QA_REPORT.md` records results and any skipped checks; `docs/GAPS.md` records scope omissions and environmental limitations. The browser suite uses Playwright with axe. Standard setup is:

```bash
npx playwright install --with-deps chromium webkit
npm run build
npm start
# in another terminal
npm run test:browser
```

Set `CHROME_PATH` to an installed Chromium binary when using a substitute. In this execution environment, browser installation was restricted; the exact substitute and limitations are documented in the QA report. Do not treat an SSO page or development-server score as portfolio performance evidence.

Design rationale and sources: `docs/RESEARCH.md`, `docs/DESIGN.md`, `docs/IA.md`. Defaults and source transformations: `docs/ASSUMPTIONS.md`, `docs/PROVENANCE.md`. The supplied brief is retained in `docs/PORTFOLIO_BRIEF.md`.
