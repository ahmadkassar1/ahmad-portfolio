# Provenance

All source lines refer to the unedited `content/cv.source.txt`. Full per-field mappings are exported as `provenance` in `content/cv.ts` and checked by `scripts/audit-content.mjs`.

| Content group | Source lines | Transformation |
| --- | --- | --- |
| Name and headline | 1–2 | Layout whitespace only |
| Location and email | 3 | Split printed separators; omit phone |
| Profile links | 4 | Split printed separators; prefix HTTPS |
| Summary | 7–13 | Unwrap printed lines; preserve wording pending review |
| Grouped skills | 16–25 | Preserve original categories; tokenize commas outside parentheses |
| Horecons role | 28–40 | Preserve title/dates/location and bullet wording; group only role-local tools |
| Interphase role | 41–50 | Preserve title/dates/location and bullet wording; group only role-local tools |
| Projects | 51–73 | Preserve titles, printed technology lists and bullet wording; leave missing dates/links empty |
| Education | 76–80 | Preserve program/qualification names and dates; no degree inferred from the program |
| Languages | 83 | Preserve exact proficiency wording |
| Authored connective copy | None | No authored prose yet |

This table maps extracted content groups, not a chosen page structure. The information architecture is deferred until the user's required Gate A approval.
