from pathlib import Path
import os
from datetime import date
from flask import Flask, jsonify, send_from_directory
from db import initialize, read_catalog
from engine import compare

ROOT = Path(__file__).resolve().parent
app = Flask(__name__, static_folder=None)


@app.after_request
def headers(r):
    r.headers["Content-Security-Policy"] = (
        "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'"
    )
    r.headers["X-Content-Type-Options"] = "nosniff"
    r.headers["Referrer-Policy"] = "no-referrer"
    r.headers["Cache-Control"] = "no-store"
    r.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    return r


@app.get("/healthz")
def health():
    try:
        read_catalog()
        return jsonify(status="ok")
    except Exception:
        return jsonify(status="unavailable"), 503


@app.get("/api/catalog")
def catalog():
    try:
        d = read_catalog()
        for case in d["cases"]:
            case["comparison"] = compare(*case["sources"])
        d["computed_at"] = date.today().isoformat()
        return jsonify(d)
    except Exception:
        return jsonify(error="catalog_unavailable"), 503


@app.get("/")
def index():
    return send_from_directory(ROOT / "public", "index.html")


@app.get("/<path:name>")
def static(name):
    return send_from_directory(ROOT / "public", name)


if __name__ == "__main__":
    initialize()
    app.run(host="127.0.0.1", port=int(os.environ.get("PORT", 8000)), debug=False)
