# Information architecture

The user’s follow-up asks for the actual website. Proceed with the previously proposed defaults and provide a working, unindexed preview for review. The page is one complete visual direction; public indexing remains gated. No source fact is considered externally verified.

| Section | Job | Reader conclusion | Exact content fields | Omit rule |
| --- | --- | --- | --- | --- |
| Header / introduction | Identify the candidate, scope and contact immediately | Ahmad Kassar works on web apps and ERP systems in Beirut | identity, headline, summary (final sentence), contact.email, links | Identity and contact are essential and present |
| Production proof | Give the strongest stated real evidence at the first fold | Features shipped on TheBridge and Populus | summary (production-systems sentence), experience | Omit a standalone proof section if fewer than two source systems |
| Selected projects | Explain concrete end-to-end project work | Can own application flows across client and data layers | sections[0].items[*].title / tools / achievements | Omit if fewer than two projects; omit URLs and screenshots unless sourced |
| Experience | Make exact employment titles and scope easy to verify | Frontend Developer roles at Horecons and Interphase | experience[*] | Retain any real role; dates never modified |
| Skills | Group technical capability by actual use | Frontend, backend/data, automation and delivery skills | skills[*] | Omit an empty group |
| Education / languages | Add background and working language context | Stated qualifications and language proficiency | education[*], languages[*] | Retain any real education entry; omit only empty optional groups |
| Contact / footer | Offer a clear next action | Email or use a real profile link | contact.email, links, identity | Phone omitted; labelled redacted CV download provided |

Name, role, location, production proof and email link must be readable in server-rendered HTML. All project content remains in HTML with a native details control for secondary bullets. No fact is behind a client-only render or entrance animation.

## Grid specification

Desktop uses a 78rem cap, 1.15fr/.85fr hero, 1.14fr/.86fr project grid and narrow-date/wide-scope experience rows. Reading order: name, scope/contact, production proof. Tablet 768–1024px uses equal hero/project columns and 1:2 experience rows with tighter spacing. Mobile is a single column. Identity, experience, education and credentials are retained even for a single real entry, per the updated brief.
