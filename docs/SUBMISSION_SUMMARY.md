# Conflicting Answers — Before You Travel

**Participant:** El-Moatasem Mohamed Madani  
**Theme:** Information you can trust  
**Track:** Transparency & Accountability  
**Repository:** https://github.com/El-Moatasem/conflicting-answers  
**Version:** Before You Travel integration, prepared 20 September 2026

## Problem and intended users

People preparing for a public-service visit may encounter instructions spread across
several official pages. Different terminology, missing context and unclear effective
dates can leave them unsure what to prepare. A saved checklist can also become outdated.
The problem hypothesis is that clearer evidence and preparation could help people avoid
preventable confusion and repeat visits. We have not measured those outcomes.

The pilot focuses on adults who are Kenyan citizens by birth preparing a first passport.
It requires confirmation of the applicant situation and visibly states that local office
applicability still needs confirmation. The prototype is independent and does not provide
a complete application checklist, institutional endorsement or a legal determination.

## Solution and working proof of concept

Conflicting Answers now includes a Before You Travel preparation journey. Users inspect
source differences, prepare matching statements, copy a precise clarification request,
and save or download a dated plan. The preparation screen keeps unresolved questions
beside the checklist rather than treating an uncertain requirement as resolved.

Its distinguishing behavior connects source changes to the user's saved work. Each
preparation item has a stable identifier. On successful catalog reload or reconnection,
the app compares evidence for each item against the prior catalog. Unchanged preparation
stays checked. Changed items reopen with before/after explanations. Added items begin
unchecked. Removed comparison items are explained without claiming that the institution
removed its requirement. A newer source-check date or catalog version alone does not
reopen completed work. Scope, wording, effective dates, references and conflict status
can all affect whether an item needs review.

A separate, visibly fictional example demonstrates receipt copies changing from two
to three. Only that preparation step reopens; two unchanged steps remain checked. It
uses the same reconciliation function as reviewed catalog updates. It runs in browser
memory, disables saving, labels exports fictional and leaves official-source data and
saved real progress separate. It is not an actual institutional policy change.

## Sources and trust

The observed example uses two public institutional pages:

- Directorate of Immigration Services: https://immigration.go.ke/application-requirements/
- eCitizen Immigration: https://immigration.ecitizen.go.ke/index.php?id=4

The catalog retains source-check dates of 19 September 2026. The integration did not
advance those dates or claim a new retrieval. Neither effective date is established.
The broader eCitizen page's applicability to the selected applicant situation is a
curatorial assumption requiring confirmation. Retrieval receipts from the earlier
work record hashes and byte counts. Users can open the original pages.

The pages use different counts and terms for payment documents. The system treats
this as a clarification need, not a confirmed contradiction. It distinguishes matching
statements, different scope, different effective periods, terminology differences,
missing statements and potential conflicts. It never selects a winning institution
based solely on a newer retrieval. Five clearly labeled synthetic comparison cases
exercise these distinctions alongside the separate fictional preparation-update demo.

The catalog is human-curated. An operator reviews changes, records a new version and
publishes through a command with an expected-version check. There is no live crawler,
background alert or automatic institutional response.

## Access, privacy and inclusion

The browser client uses plain HTML, CSS and JavaScript. The first visit requires a
browser and internet connection. Users can explicitly save a dated snapshot for offline
reopening, download plain text or print an action pack for assisted access. Offline
content cannot verify whether the institution has changed its instructions.

English and draft Swahili are available. The Swahili interface visibly identifies the
need for independent review. Responsive layout, labeled controls, keyboard focus and a
skip link support accessibility, but independent accessibility testing remains pending.
The prototype does not support SMS/USSD or promise use on all basic phones.

The app collects no names or identity documents and has no account system. Preparation
progress and scope acknowledgement stay in browser storage only after explicit save.
The server stores the public catalog. Clearing saved data removes this app's snapshots
and cached shell. Downloaded files and browser history are outside that action. Hosting
providers may retain request logs.

## Implementation, AI tools and validation

Flask exposes the catalog and serves the frontend. A Python comparison engine evaluates
curated claims. A pure JavaScript preparation module handles evidence fingerprints and
saved-plan reconciliation. SQLite runs locally; PostgreSQL support and Render configuration
support a Neon-backed deployment. The integration requires no database schema migration.

Codex assisted with implementation, debugging, tests, draft translation, documentation,
pitch and video scripting. The app makes no runtime generative-model calls. Concrete
engineering decisions included preserving unknowns, isolating fictional evidence and
replacing blanket tick invalidation with requirement-level change review.

Fourteen Python tests and fourteen Node tests passed locally. Browser checks covered
selective changes, date-only updates, offline reopening, synthetic isolation, exports,
mobile layout, language switching and local deletion. These checks do not establish
live deployment readiness, institutional acceptance or user impact. Hosted CI and
Render/Neon connectivity should be verified after publishing this update.

## Potential impact and scalability

A future pilot should measure whether users identify unresolved questions accurately,
find relevant evidence faster and understand which preparation needs review. Follow-up
research could examine repeat visits with appropriate consent. No adoption, cost-saving
or reduced-visit figures are claimed.

The same comparison and preparation workflow can support other services and countries
through locally reviewed catalogs, applicability rules, languages and responsible content
owners. Egypt and Arabic are possible extensions, not implemented coverage. Scaling
reliable source review and local interpretation is a substantive operational requirement.

## Idea-origin disclosure

AI assisted the concept's brainstorming as well as its development. The supplied brief
asks participants not to use AI to generate the idea. Organizer eligibility clarification
is needed before submitting this concept. This submission must not imply independent
human ideation or invent user research, institutional confirmation or impact results.
