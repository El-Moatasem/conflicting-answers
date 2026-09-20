# Architecture

Flask serves a read-only `/api/catalog`, `/healthz` and browser assets from `public/`.
`engine.py` classifies the curated source pairs. SQLite is the local default; `db.py`
uses PostgreSQL when `DATABASE_URL` is set. The public catalog is the only server data.

## Preparation and change review

`public/planning.js` is a pure module shared between the browser and Node tests.
`requirements(case)` uses stable case and claim keys to identify preparation items.
Fingerprints use sorted canonical JSON with source identity, URL, source section,
applicability, scope notes, effective dates, claim text/term/value and comparison status.
Source check dates and catalog version labels are intentionally excluded. A wording or
source-reference change conservatively requires review; no LLM judges semantic equivalence.
A source list reorder retains the same fingerprint.

`reconcile(previous, current, checks)` retains only boolean completion for unchanged,
agreed requirements. Changed/new items start unchecked. Removed items lose their ticks
and get an explanation. If a pair becomes incomparable, its old preparation rows are
removed from that comparison. This never asserts removal of an institutional rule.

The browser runs reconciliation on successful catalog load/reconnection even when a
curator forgot to bump the version. Existing v1 snapshots can migrate using their old
catalog evidence; the v1 entry is deleted only after a successful v2 save. Changed scope
also clears the corresponding applicant acknowledgement. Comparisons still require
local office confirmation. Acknowledging scope does not establish eligibility.

`ca-snapshot-v2` contains the dated catalog, non-identifying ticks, scope acknowledgement,
language and change explanations. Explicit save persists it. In-memory updates do not
write automatically. A saved update survives offline reopening. An unchanged response
on repeated fetch does not reset freshly completed work.

## Fictional demo

`makeDemo(1|2)` creates isolated fictional sources with three matching preparation items.
Stage 2 changes receipt-copy count only. The same reconciliation function reopens that
step while preserving unrelated ticks. Demo state stays in memory, real saves are disabled,
exports are labeled fictional, and exiting restores the active real comparison. Reloading
exits the demo. Neither the server nor stored official evidence is mutated.

## Offline shell

`public/sw.js` caches the app shell including `planning.js`; the API remains network-only.
The saved catalog supplies offline evidence. Source links require their own connectivity.
The cache version changes with this release. HTTPS is needed except on localhost.
Clear saved data removes both app snapshot versions and this app's shell cache/worker.
Browser history and downloaded documents remain outside that operation.

## Deployment and updates

No database migration is required. Existing catalog schemas are compatible. Keep the
same Render service and Neon database, replace code, and verify `/healthz` and the UI.
Startup uses idempotent initialization. The operator-only publication script updates
the database with an expected-version guard; there is no public write endpoint.
