# Applied defaults and source transformations

Review date: 2026-09-15. These are reversible defaults applied after the user instructed us to create the actual website, not preferences stated by the user.
The attached PDF is the sole factual authority. Prior chats and outside profiles were not used to add or correct facts.

| Input | Current value or proposed default | Basis and reason | How to reverse |
| --- | --- | --- | --- |
| CV_FILE | Attached Ahmad_Kassar_Full_Stack_Developer_CV.pdf | Explicit attachment; local text extraction succeeded | Supply a replacement CV |
| NAME | Ahmad Kassar | Exact source spelling | Confirm corrected source spelling |
| TARGET_ROLES | Full-Stack Developer; Frontend Developer [inferred] | Header and both employment titles | Specify preferred target titles |
| SENIORITY | No label [inferred default] | No formal seniority appears in the CV | Supply a supported level |
| MARKET | Beirut, Lebanon; no remote/hybrid preference stated | Location is from the CV; preference is absent | State desired market and working arrangement |
| LINKS | CV email, LinkedIn and GitHub only | Exact contacts in the CV; HTTPS prefixes added | Supply corrected URLs or exclude a contact |
| SHOW_PHONE | No [brief default] | Explicit privacy default | Explicitly authorize phone publication |
| CV_DOWNLOAD | Labelled redacted PDF [updated brief default] | Phone removed through actual PDF redaction, layout preserved; original unchanged and hashes recorded | Supply a replacement redacted CV or explicitly authorize the original and its phone |
| CURRENTLY_EMPLOYED | Yes [inferred, unconfirmed] | Horecons ends in Present | Confirm the true end date/status |
| BRAND | Precise, restrained, readable [inferred default] | Clear Signal direction: typographic identity, blue accent, source-backed production proof | Change tokens after reviewing the preview |
| HARD_NO | Brief's explicit restrictions; no additional exclusions assumed | The field is TODO | Add restrictions |
| EXCLUDE | No additional exclusions assumed; privacy defaults apply | The field is TODO | List items to omit |
| HEADSHOT | None [inferred default] | No headshot supplied | Attach a real approved headshot |
| PUBLISH | Preview only, noindex [brief default] | User asked to create the site; preview serves as the review | Approve later publication explicitly; remain unindexed while employed unless explicitly changed |
| DOMAIN | Vercel-assigned vercel.app preview host [inferred default] | Vercel explicitly requested; no owned domain supplied | Supply an owned domain after preview review |
| ANALYTICS | No [brief default] | No opt-in supplied | Explicitly opt in |
| LANGUAGE | English, html lang=en [inferred from source language] | CV is English | Request and approve translation |
| Total experience | No derived total for publication; recommend omitting a total-years claim pending confirmation | CV summary states 3 years; dated employment begins Mar 2024 | Confirm the claim and its basis; no dates will be stretched |
| Project evidence links | Omit demo/repository buttons; preserve the GitHub profile link | No individual project URLs are in the CV | Supply exact project URLs |

## Transformations and derivations

1. Layout whitespace is collapsed and bullet glyphs are removed in structured fields. Wording, punctuation, casing, dates, spelling and bullet order remain unchanged. The raw extraction remains byte-for-byte unedited.
2. Existing skill categories are preserved. Comma-separated lists are tokenized outside parentheses; no new tool is inferred.
3. `https://` is prepended to the two profile addresses printed without a scheme. Their domains, paths and casing are unchanged. No external link validity has been claimed.
4. Per-role tools are grouped only from text inside that specific role. Project tools come only from that project's printed header.
5. Target role proposals use the CV header and employment titles with title casing. Employment titles themselves remain exactly Frontend Developer.
6. `Present` supplies the provisional employment-status setting. English prose supplies `lang=en`. These are inferred settings, not additional CV facts.
7. No duration or total-years calculation, rounding, title promotion, date repair, translation, metric invention or new factual sentence was performed. The CV's original summary, including 3 years, is retained as source content pending the display decision.

A noindexed preview is authorized by the user’s follow-up; production promotion is not inferred. The first-message instruction was inside the unread attachment, so the initial attachment-inspection message preceded it; the role-specific site-value assessment was supplied immediately after reading the brief.

## Website-build follow-up

The user asked where the website was and stated it had not been developed. Proceeding with the proposed defaults to deliver an actual working preview. This is a provisional build; there is no authorization to enable public indexing. The design review is embodied in the working preview rather than another planning-only handoff.
