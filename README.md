# Conflicting Answers — Before You Travel

Prepare for a public-service visit, inspect conflicting instructions and understand
when reviewed changes affect your saved preparation. A working proof of concept for
**Transparency & Accountability** under **Information you can trust**.

## The pilot

An adult Kenyan citizen by birth preparing a first passport can inspect two official
pages, acknowledge the supported applicant situation and prepare matching statements.
The observed payment-document pair uses different terms and quantities. It needs
institutional clarification; this app does not declare a confirmed contradiction.
Local office applicability and effective dates remain unconfirmed. The checklist is
partial. Five comparison fixtures and a separate fictional update demo are labeled.

## Run locally

Python 3.11+ (3.12 recommended). Node 18+ is needed only for preparation tests and
optional browser testing/recording. No AI API key or cloud account is required.

```sh
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements-dev.txt
unset DATABASE_URL
python app.py
```

Windows PowerShell activation: `.venv\Scripts\Activate.ps1`. Remove a configured
`DATABASE_URL` from that shell to use SQLite. Open http://localhost:8000.
The server creates/seeds `catalog.sqlite3`. The app does not load `.env` automatically.

## Working journey

1. Select a comparison and acknowledge the stated applicant situation.
2. Prepare the matching statements using a partial checklist with source links.
3. Review unresolved questions and copy a clarification request with both sources.
4. Explicitly save the plan for offline use, download text or print it.
5. On reconnect/reload, compare current evidence against the previous catalog.
   Only affected requirements reopen. Unchanged completion marks remain.
6. Inspect before/after explanations. Added steps begin unchecked. Removed comparison
   items are shown separately and do not prove institutional requirements were removed.

Rule fingerprints include source identity, references, applicability, effective dates,
claim wording/value/term and comparison status. They exclude source check dates and
catalog version labels. A date-only refresh preserves progress. Stable requirement IDs
are `case.id + ':' + comparison-row.key`. Preserve those identifiers when curating data.
English and draft Swahili are supported. Swahili needs independent review.

## Demonstrate “What changed?”

Open **Try a fictional requirement update**, then **Start fictional demo**. Tick the
three preparation steps. Apply the fictional update: receipt copies change from two
to three, only that item reopens, and the other two stay checked. The before/after
explanation identifies the change. Saving is disabled during the preview and downloads
are labeled fictional. Exit returns to the real plan. No database or source is changed.

## Verify

```sh
python -m pytest -q
node --test tests/test_planning.cjs
```

Optional real-browser verification (stop any server on port 8000 first):

```sh
npm install --no-save --package-lock=false playwright
npx playwright install chromium
node tests/browser.cjs
```

The browser test launches its own local server. GitHub Actions covers Python tests,
Node preparation tests and PostgreSQL initialization. Remote CI is not claimed until
it actually runs on the repository.

## Deploy

Use one Render Python Web Service connected to Neon PostgreSQL. There is no separate
frontend build. Build: `pip install -r requirements.txt`. Start: `sh scripts/start.sh`.
Set the secret `DATABASE_URL` to the complete Neon connection string with its TLS
parameters. `render.yaml` supplies configuration. Health check: `/healthz`.
See [deployment](docs/DEPLOY_RENDER_NEON.md) and [update instructions](docs/UPDATE_EXISTING_REPO.txt).

Existing Neon catalogs need no migration for this feature. The integration derives
plans in the browser from the current read-only catalog. Startup never overwrites a
reviewed catalog. For an intentional evidence update, revise `data/catalog.json`, bump
its version, then use `scripts/publish_catalog.py` with the current expected version.


## Trust, privacy and limits

Official-source observations retain their 19 September 2026 check dates. Building a
new app version does not reverify the source. Unknown effective dates remain unknown.
The app never selects an authoritative winner automatically. No identity documents,
names or account details are collected. Progress is stored only after explicit save.
The hosting provider may retain request logs. Downloaded files and browser history are
outside the clear-saved-data action. First use needs a browser and internet access.
There is no runtime LLM, live source crawler, background alert, SMS/USSD, application
submission or payment processing. Accessibility/user testing remains pending.

