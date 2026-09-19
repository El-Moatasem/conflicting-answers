"""Operator-only publication after evidence review; optimistic concurrency guard."""

import argparse, json, os, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from db import connection
from engine import compare

p = argparse.ArgumentParser(description=__doc__)
p.add_argument("file")
p.add_argument("--expected-version", required=True)
a = p.parse_args()
d = json.loads(Path(a.file).read_text())
if not d.get("cases") or d.get("version") == a.expected_version:
    raise SystemExit("Provide cases and a new version.")
ids = [c["id"] for c in d["cases"]]
if len(ids) != len(set(ids)):
    raise SystemExit("Duplicate case IDs.")
for c in d["cases"]:
    if len(c["sources"]) != 2:
        raise SystemExit("Each case needs two sources.")
    compare(*c["sources"])
    if not c.get("synthetic") and any(
        not s.get("url", "").startswith("https://") for s in c["sources"]
    ):
        raise SystemExit("Real cases need HTTPS source references.")
m = "%s" if os.environ.get("DATABASE_URL") else "?"
with connection() as conn:
    row = conn.execute("SELECT payload FROM ca_catalog WHERE id='pilot'").fetchone()
    if not row or json.loads(row[0])["version"] != a.expected_version:
        raise SystemExit("Version conflict: re-read current catalog.")
    result = conn.execute(
        f"UPDATE ca_catalog SET payload={m} WHERE id='pilot' AND payload={m}",
        (json.dumps(d, ensure_ascii=False), row[0]),
    )
    if result.rowcount != 1:
        raise SystemExit("Concurrent change detected.")
print("Reviewed catalog published. Returning users must review and re-save their plan.")
