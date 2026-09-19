# Verification record

Completed locally:
- Fourteen pytest cases: all six classifications, unknown dates, missing scope, old/future
  review dates, absent statements, API security/read-only behavior, idempotent seeding
  and database failure handling.
- Browser checks: observed terminology result; two matching statements; progress saving;
  actual offline reload; scope/date/missing cases; isolated synthetic resolution; real-case
  resolution disabled; Swahili; 390px mobile overflow; text export; catalog-version tick
  invalidation; local deletion; no JavaScript page errors.
- Actual Git history preserved in a bundle. Hosted PR descriptions remain drafts.
- Pitch PDF rendered and visually checked. Demo exported to H.264 MP4 with captions.

Not verified: live Neon database, Render deployment, remote GitHub Actions execution,
independent translation, assistive-technology user acceptance, institutional interpretation,
community impact or compliance with the brief's idea-origin restriction.

Re-run instructions are in README.md. PostgreSQL CI uses a test-only local service; its
credentials are not real deployment credentials. It has not run on a hosted repository yet.
