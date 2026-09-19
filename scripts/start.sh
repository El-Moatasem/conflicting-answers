#!/bin/sh
set -eu
: "${DATABASE_URL:?Set DATABASE_URL to your Neon connection string}"
python scripts/init_db.py
exec gunicorn --bind "0.0.0.0:${PORT:-8000}" --workers 2 --timeout 30 app:app
