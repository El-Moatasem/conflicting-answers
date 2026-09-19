# Architecture and comparison rules

Browser: plain HTML/CSS/JavaScript. It renders public evidence and server-computed
comparisons, builds a local clarification draft and stores progress only after Save.
The service worker caches the application shell; the saved catalog remains a dated
snapshot. Requests to the catalog API do not use implicit cached API responses.

Server: Flask, with GET /api/catalog and GET /healthz. The catalog endpoint runs the
same deterministic Python comparison engine tested by pytest. Health checks include
a database read. Responses hide connection failures and set CSP, no-sniff and referrer
policies. Source content renders as text, not arbitrary HTML.

Database: SQLite locally or PostgreSQL through psycopg on Neon. Public catalog data
only. Parameterized queries and an operator-only optimistic-concurrency update.

## Decision order

1. Missing service, jurisdiction or applicant scope: insufficient context.
2. Different scope values: different situations, no contradiction comparison.
3. Known, non-overlapping effective intervals: different effective periods.
4. Same claim key but absent statement/value: incomplete evidence.
5. Different or unknown document terms: terminology review.
6. Same term and equal normalized values: matching statements.
7. Same term and different values: potential conflict, never an automatic winner.

Unknown effective dates and old/future source-check dates remain cautions. Retrieval
date never substitutes for an effective date. Values and term normalization are curated
inputs, not inferred from arbitrary pages. Exact matching cannot resolve synonyms,
legal hierarchy, exceptions or ambiguous applicability. Those require human review.

## Action workflow

Only matching statements appear as preparation steps. They are explicitly a partial
checklist. The real-case clarification draft asks whether invoices and receipts are
identical, which count applies now and whether a current notice establishes that.
It never sends a message or application. Real cases cannot use the synthetic-resolution
control. The fixture preview clears its new step and blocks saving as reviewed evidence.

## Scale and limits

The data model can describe more services and jurisdictions, but each needs reviewed
sources, applicability rules, translation and a content owner. The current UI ships six
curated cases for a single service context. There is no unbounded URL ingestion or live
crawler. The design avoids an arbitrary-fetch/SSRF endpoint entirely.

Before real deployment: independent Swahili/accessibility review, intended-user testing,
content governance, monitoring, request throttling, least-privilege DB roles, backups and
provider log-retention configuration. No performance or community-impact claims are made.
