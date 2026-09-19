# Conflicting Answers

Compare public-service instructions, inspect their evidence, and prepare a precise
clarification request. An independent proof of concept for **Transparency & Accountability**.

The pilot compares a Kenyan Directorate of Immigration page with an eCitizen passport
page. They use different counts and terms for payment documents. The app classifies
this as **clarification needed**, not a confirmed contradiction. Effective dates and
local applicability remain unconfirmed. Five separately labeled synthetic cases show
how scope, missing statements, dates and numerical differences affect the result.

## Run locally

Python 3.11+ is required. Node is needed only for browser tests and recording.

```sh
python -m venv .venv
source .venv/bin/activate
# Windows PowerShell: .venv\Scripts\Activate.ps1
python -m pip install -r requirements-dev.txt
python app.py
```

Open http://localhost:8000. Startup initializes a local SQLite public catalog.
No API keys or personal documents are needed. Do not enter real identity information.

## What works

- Deterministic comparison of curated statements: scope, document terminology, values,
  effective periods, missing statements and source-review age.
- Both source links, retrieval/check dates, short excerpts and visible uncertainty.
- Matching-statement preparation steps and a copyable clarification draft.
- Explicit offline save, dated snapshot reopening, text download, printing and deletion.
- English and draft Swahili, responsive layout, native controls and visible focus states.
- Synthetic clarification preview isolated from official evidence and offline saving.
- Catalog version changes clear saved ticks for review.
- Flask API, SQLite locally, PostgreSQL support for Neon, and Render configuration.

No live crawler, arbitrary-URL ingestion, automatic truth verdict, background alerts,
SMS/USSD, application submission, account system or runtime LLM is implemented.
The app is not a complete passport application guide. Source agreement does not prove
currency or institutional acceptance. Swahili needs independent review.

## Verify

```sh
python -m pytest -q
# Optional UI checks; stop any other server on port 8000 first:
npm install --no-save playwright
npx playwright install chromium
node tests/browser.cjs
```

The UI tests launch their own local server. Browser binaries and npm development
packages are not needed for production. GitHub Actions includes SQLite tests and a
PostgreSQL smoke job; remote execution and live Neon connectivity are not claimed.

## Record the demo

Stop other services on port 8000. After installing Playwright:

```sh
node scripts/record_demo.cjs
python scripts/render_video.py artifacts
```

The second command requires ffmpeg. Output: `artifacts/demo.mp4`, a captioned silent
recording. Use [the transcript](docs/DEMO_TRANSCRIPT.md) to record your own narration.

## Documentation

- [Render and Neon deployment](docs/DEPLOY_RENDER_NEON.md)
- [Git-flow commits and PRs](docs/GIT_FLOW.txt)
- [Architecture and comparison rules](docs/ARCHITECTURE.md)
- [Sources and trust](docs/SOURCES_AND_TRUST.md)
- [Written submission](docs/SUBMISSION_SUMMARY.md)
- [AI usage](docs/AI_USAGE.md)
- [Validation](docs/VALIDATION.md)
- Pitch PDF: `submission/Pitch.pdf` in the completed delivery.

## Source governance

Review `data/catalog.json` manually before publication. Run
`python scripts/publish_catalog.py data/catalog.json --expected-version CURRENT_VERSION`
with the intended database configured, after bumping the version. Seeding never silently
overwrites reviewed database content. There is no public write endpoint.

## Submission integrity

The concept emerged from AI-assisted brainstorming. The supplied brief asks participants
not to use AI to generate the idea. Confirm eligibility with the organizers before
submitting this concept; do not represent its origin as independent human ideation.
The materials disclose this history and distinguish observed evidence from fixtures.

## Publication status

The delivery includes a clean source tree and a separate Git bundle with actual local
commits. PR descriptions are drafts. A public GitHub repository, hosted PRs, Render
service and Neon database are not created by the downloadable files.
