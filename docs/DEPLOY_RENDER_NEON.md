# Deploy Conflicting Answers to Render and Neon

The repository is a Flask web service with a static browser client. It has no frontend
build step. These instructions do not imply that cloud resources have been provisioned.

## 1. Publish GitHub

Use `GIT_FLOW.txt` to publish to a new public repository. Confirm `main` contains the
complete app before connecting Render. Never commit database credentials or `.env`.

## 2. Create a Neon database

Create a Neon project, select the desired branch/database and click **Connect**. Choose
a PostgreSQL/Python connection string, using a pooled endpoint if appropriate. Copy
its complete URL including TLS parameters into Render's `DATABASE_URL` secret.

Typical shape only:
`postgresql://USER:PASSWORD@HOST/DB?sslmode=require&channel_binding=require`

Use the actual generated string. The app does not load `.env` automatically; for local
PostgreSQL tests, export DATABASE_URL in your terminal. Do not put secrets in commands
that you intend to share. For local SQLite, leave DATABASE_URL unset.

The only table is `ca_catalog(id TEXT PRIMARY KEY, payload TEXT NOT NULL)`. It contains
public source metadata, claims and synthetic fixtures. Personal progress is never sent
to this database. The code uses parameterized SQL and a ten-second connection timeout.

## 3. Create the Render service

Connect the new public GitHub repository as a Web Service:

| Setting | Value |
|---|---|
| Runtime | Python 3 |
| Branch | main |
| Root directory | blank / repository root |
| Build command | `pip install -r requirements.txt` |
| Start command | `sh scripts/start.sh` |
| Health check | `/healthz` |
| Secret | `DATABASE_URL` = your Neon URL |
| Python version | `PYTHON_VERSION` = `3.12.11` |

Alternatively select a Blueprint and use `render.yaml`. It explicitly requests the
free plan rather than allowing an implicit paid default. Check plan availability and
limits before creating resources. Choose nearby regions where available.

The start script requires DATABASE_URL, initializes the catalog idempotently, and runs
Gunicorn on `0.0.0.0:$PORT`. The app fails visibly if the database is unavailable. Use
Gunicorn for deployment; `python app.py` is the local development server only.

## 4. Verify the deployed URL

1. Open `/healthz`: expect HTTP 200 with `{"status":"ok"}`.
2. Open `/api/catalog`: confirm the expected version and six cases.
3. Inspect the observed case: result must be terminology review, not confirmed conflict.
4. Save a checked preparation item, disable browser networking and reload.
5. Confirm offline labeling, preserved source dates and saved progress.
6. Reconnect and inspect the synthetic scope and date cases.
7. Download a text action pack and switch to Swahili.
8. Clear saved data; confirm a reload no longer restores progress.

Offline browser support needs HTTPS except on localhost. A first visit needs internet.
If your hosting plan sleeps, wake it before recording. Cached snapshots cannot verify
new source content. The institution's links require their own connectivity.

## 5. Publish reviewed content

Recheck source wording, scope, effective dates and any institutional clarification.
Keep original evidence and document the reason for a revision. Bump the catalog version.
Only change `checked_at` when the source was actually rechecked. The fixture generation
script is not a verifier and is not part of server startup.

```sh
python scripts/publish_catalog.py data/catalog.json --expected-version 2026-09-19.1
```

Run this from a trusted operator terminal with DATABASE_URL set. A version mismatch
aborts. Startup does not overwrite existing content on redeploy. On a new catalog
version, the client clears saved ticks and asks the user to review and save again.
There is no public administrative write route or automatic source-monitoring job.

## Troubleshooting

- Missing DATABASE_URL: set the Render secret, then redeploy.
- Database errors: check database, branch, credentials and supplied TLS settings in Neon.
  Do not disable TLS to hide a connection failure.
- HTTP 503: the database or catalog is unavailable. Existing offline snapshots remain
  dated evidence; fresh users see an error.
- Old content after deploy: seed intentionally preserves existing data. Publish reviewed
  content using the guarded command above.
- Old application shell: bump the cache name in `public/sw.js` when releasing changed
  assets. During development, clear this site's saved data.
- Rollback: redeploy a previous code commit in Render. Database content is independent;
  publish a reviewed correction with a new version to roll content back.

## Official references checked on 19 September 2026

- https://render.com/docs/deploy-flask
- https://render.com/docs/blueprint-spec
- https://neon.com/docs/guides/python

Provider interfaces and plans may change. Live Render/Neon deployment remains untested
until performed with the user's accounts. A PostgreSQL CI smoke job is supplied.
