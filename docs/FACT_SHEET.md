> Historical initial fact-sheet checkpoint. The later instruction to create the site superseded the wait; current applied defaults are in ASSUMPTIONS.md.

# Gate A — CV fact sheet

Prepared from the attached PDF on 2026-09-15 using local `pdftotext -layout` in Bash. The original PDF and its text were not uploaded to an extraction or conversion service.

## Identity and field

**Name:** Ahmad Kassar  
**Header:** FULL-STACK DEVELOPER — WEB APPS & ERP SYSTEMS  
**Location:** Beirut, Lebanon  
**Email:** ahmadkassar771@gmail.com

**Classification [inferred]:** Engineering — web applications and ERP/business platforms. Signals: Frontend Developer employment titles; Angular/TypeScript interfaces; Next.js, Node.js and PostgreSQL backend work; TheBridge and Populus; and a Software Engineering Program. AI/automation appears as product integration, not as a separately dated AI or data-science role. The primary role proposal is Full-Stack Developer, with Frontend Developer as a secondary target; no seniority label is inferred.

The strongest stated proof is shipped features on TheBridge and Populus. These are CV claims, not independently verified outcomes. No external research or profile enrichment has been performed.

## Every employment role, exactly as written

| Title | Employer | Dates | Location |
| --- | --- | --- | --- |
| Frontend Developer | Horecons | Oct 2025 – Present | Ghazir, Lebanon |
| Frontend Developer | Interphase | Mar 2024 – Sep 2025 | Beirut, Lebanon |

## Education, exactly as written

| Program / qualification | Institution | Dates |
| --- | --- | --- |
| Software Engineering Program (project-based, peer-to-peer) | 42 Beirut | 2024 – 2025 |
| B.A. in Business Administration | Institut Renee Mouawad | 2020 – 2022 |

The 42 Beirut entry explicitly says it was completed alongside the full-time Interphase role. It remains a Software Engineering Program, not a degree or professional licence.

## Every quantitative CV claim

| Exact quantity | Meaning in the CV | Source lines |
| --- | --- | --- |
| 3 years | Summary's experience claim | 7–8 |
| two production systems | TheBridge and Populus | 8–10 |
| 4 products | Independently designed, built and deployed | 11–12 |
| 3 ERP modules | SalesSphere, Stock Management and ProjectPilot | 32–34 |
| 3 core modules | Populus Kanban task board, form builder and website builder | 43–44 |
| 4 separate routed views | Scoopadoop product browsing, category navigation, product detail and cart checkout | 72–73 |

These are not newly measured performance results. No revenue, user-count, percentage improvement, team-size or budget figure is supplied. Dates are preserved in the tables above. Numerals in names and technologies, such as 42 Beirut and HTML5, are names rather than achievement metrics.

## Projects

- AI Lead-Generation and CRM Pipeline SaaS
- Restaurant QR Menu and Ordering Platform
- Content Publishing Platform
- Scoopadoop E-Commerce Store

No dates, project-specific repository URLs, live demos or screenshots accompany these entries. Descriptions and tools are preserved; missing proof will not be invented.

## Languages and skills

Arabic: Native. English: Professional working proficiency. Skill categories remain Frontend; Backend and Data; AI and Automation; Engineering and Delivery. Full verbatim items and achievements are in `content/cv.ts`.

## Privacy and omitted sections

- The phone number is excluded from the public-facing content object. It remains in the unchanged original PDF and private unedited extraction.
- No date of birth, age, marital status, nationality, identity/passport number, street address, or referee contact details were found in the supplied CV. Beirut, Lebanon is retained as the stated city/country.
- The source text is ignored by Git, kept outside public assets, and must never be imported into the app or committed. The original PDF must not be served while the phone decision is unresolved.
- No credentials, licences, awards, publications, memberships, speaking engagements or testimonials are supplied. Their standalone sections will be omitted. Education is retained as education.
- A headshot and individual project demo/repository buttons are omitted because no supporting assets or URLs were supplied.

## Contradictions and ambiguities

- The summary states 3 years, while dated employment begins Mar 2024. This could be rounding or include undated project work; the CV does not explain the basis. Preserve all dates and avoid a total-years claim in the site until confirmed.
- The CV header says FULL-STACK DEVELOPER; both employment titles say Frontend Developer. Preserve these titles and use the separately described end-to-end projects to support the target positioning.
- Horecons ends in Present. Treat current employment as provisional and ask for confirmation; do not add an availability claim.
- The education/employment overlap is explicitly explained in the CV, not an unresolved contradiction. No overlapping employment dates or expired credentials were found in the listed entries.
- The default original CV download would expose the phone despite SHOW_PHONE=no. Recommended resolution: keep the original private and disable download until a redacted copy is approved or phone publication is explicitly authorized.

## Derivations

Only layout whitespace/bullet normalization, existing-list grouping, role-scoped tool grouping, HTTPS scheme prefixes, and the labelled configuration inferences above were applied. No durations or total years were calculated; no rounding rule was used. No factual prose was authored or translated. Detailed decisions and reversals are in `docs/ASSUMPTIONS.md`.

## Gate A questions — reply “all defaults” or list changes

1. **Target roles:** Full-Stack Developer first, Frontend Developer second, without a seniority label? **Recommended default: yes.**
2. **Employment:** Keep Horecons as Oct 2025 – Present and treat you as currently employed, with no “open to opportunities” line? **Recommended default: yes, following this CV.**
3. **Experience claim:** Preserve all dates and omit the summary's total-years claim from the site until its basis is confirmed? **Recommended default: yes.**
4. **Phone and PDF:** Hide the phone and disable the original CV download until a redacted copy is approved or phone publication is explicitly authorized? **Recommended default: yes.**
5. **Market and contact:** Use Beirut, Lebanon, the CV's email/LinkedIn/GitHub, English text, and no stated remote/hybrid preference? **Recommended default: yes.**
6. **Release defaults:** Use Vercel preview only, noindex, no analytics, no headshot, no additional exclusions, and the provisional adjectives precise/ restrained/readable? **Recommended default: yes.** The brief's design-preview and publication checkpoints remain in place.

## Evidence and next action

`content/cv.source.txt` is the unedited local extraction. `content/cv.ts` holds structured source-backed facts and field-level source mappings. `content/authored.ts` is intentionally empty of prose until content approval. The reproducible factual check is `node scripts/audit-content.mjs`; its actual output is saved in `reports/content-audit.json`. Local extraction and source rendering commands are recorded in `reports/extraction.txt` and `reports/render-source.txt`.

Gate A is required by section 3 of the user's attached brief: do not scaffold, install or design before confirmation. No application scaffold, dependency installation, design, repository creation, Vercel authentication or deployment has been performed. After confirmation, proceed to the information architecture, bounded research and the requested single-direction design preview, then Gate B.
