## Problem
Residents need to distinguish a genuine disagreement from differences in context or wording.

## Changes
Adds curated source statements, a deterministic comparison engine, a read-only catalog API,
SQLite/PostgreSQL persistence and meaningful edge-case tests. Unknown effective dates remain
unknown. Source omission does not imply a negative requirement.

## Validation
Local pytest checks cover scope, time periods, document terms, missing statements and API failure.

## Limits
The real invoices/receipts pair needs clarification. No institutional contradiction or legal
priority is established. Curation and terminology review remain human responsibilities.
