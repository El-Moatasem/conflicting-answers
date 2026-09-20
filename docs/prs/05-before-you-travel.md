## Why

A catalog version change previously cleared every saved tick. Residents need to know
which requirement changed while keeping preparation for unchanged items.

## Changes

Integrates Before You Travel into the existing comparison journey. Adds applicant-scope
acknowledgement, a partial preparation plan, unresolved questions, evidence fingerprints,
selective reopening and before/after explanations. A fictional update demo uses the same
comparison logic while keeping saved official evidence separate. Extends offline caching,
legacy snapshot handling, tests, documentation and the submission pitch/demo script.

## Verification

Run `python -m pytest -q`, `node --test tests/test_planning.cjs` and the optional Playwright
browser test. The delivery's validation document records checks actually completed.
Verify hosted CI and the Render/Neon deployment separately after merging.

## Limits

The checklist remains partial. The official source pair needs clarification rather than
an automatic verdict. Swahili needs independent review. No runtime LLM, source monitoring,
background notifications or measured user impact is claimed. No database migration.
