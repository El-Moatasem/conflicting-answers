import json, os, sqlite3
from pathlib import Path
from contextlib import contextmanager

ROOT = Path(__file__).resolve().parent


@contextmanager
def connection():
    if os.environ.get("DATABASE_URL"):
        import psycopg

        c = psycopg.connect(os.environ["DATABASE_URL"], connect_timeout=10)
    else:
        c = sqlite3.connect(
            os.environ.get("SQLITE_PATH", str(ROOT / "catalog.sqlite3"))
        )
    try:
        yield c
        c.commit()
    except Exception:
        c.rollback()
        raise
    finally:
        c.close()


def initialize():
    payload = (ROOT / "data/catalog.json").read_text()
    with connection() as c:
        c.execute(
            "CREATE TABLE IF NOT EXISTS ca_catalog (id TEXT PRIMARY KEY, payload TEXT NOT NULL)"
        )
        m = "%s" if os.environ.get("DATABASE_URL") else "?"
        c.execute(
            f"INSERT INTO ca_catalog (id,payload) VALUES ({m},{m}) ON CONFLICT (id) DO NOTHING",
            ("pilot", payload),
        )


def read_catalog():
    with connection() as c:
        r = c.execute("SELECT payload FROM ca_catalog WHERE id='pilot'").fetchone()
    if not r:
        raise RuntimeError("Run scripts/init_db.py")
    return json.loads(r[0])
