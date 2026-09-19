import json, copy
from pathlib import Path
from datetime import date
import pytest
from engine import compare
from app import app
from db import initialize, read_catalog

CASES = json.loads(
    (Path(__file__).resolve().parents[1] / "data/catalog.json").read_text()
)["cases"]
TODAY = date(2026, 9, 19)


@pytest.mark.parametrize(
    "case,status",
    zip(
        CASES,
        [
            "terminology_review",
            "potential_conflict",
            "different_scope",
            "different_period",
            "incomplete_evidence",
            "agreement",
        ],
    ),
)
def test_classification(case, status):
    r = compare(*case["sources"], TODAY)
    assert r["status"] == status
    if case["id"] == "observed":
        assert "effective_date_unknown" in r["cautions"]
        assert sum(x["status"] == "agreement" for x in r["rows"]) == 2


def test_unknown_dates_do_not_choose_winner():
    a, b = copy.deepcopy(CASES[1]["sources"])
    b["valid_from"] = None
    r = compare(a, b, TODAY)
    assert r["status"] == "potential_conflict"
    assert r["reason"] == "no_automatic_winner"
    assert "effective_date_unknown" in r["cautions"]


def test_missing_scope_cannot_establish_comparability():
    a, b = copy.deepcopy(CASES[1]["sources"])
    del b["scope"]["applicant"]
    assert compare(a, b, TODAY)["status"] == "insufficient_context"


@pytest.mark.parametrize("day", [date(2026, 11, 1), date(2026, 1, 1)])
def test_stale_or_future_check_date(day):
    assert "source_review_due" in compare(*CASES[0]["sources"], day)["cautions"]


def test_missing_claim_is_not_disagreement():
    r = compare(*CASES[4]["sources"], TODAY)
    assert all(x["status"] != "potential_conflict" for x in r["rows"])


@pytest.fixture
def client(tmp_path, monkeypatch):
    monkeypatch.delenv("DATABASE_URL", raising=False)
    monkeypatch.setenv("SQLITE_PATH", str(tmp_path / "test.sqlite3"))
    initialize()
    return app.test_client()


def test_api_and_security(client):
    r = client.get("/api/catalog")
    assert r.status_code == 200
    assert len(r.json["cases"]) == 6
    assert client.post("/api/catalog", json={}).status_code == 405
    assert client.get("/.env").status_code == 404
    assert "frame-ancestors 'none'" in r.headers["Content-Security-Policy"]


def test_seed_is_idempotent(client):
    a = read_catalog()
    initialize()
    assert a == read_catalog()


def test_failure_is_visible(client, monkeypatch):
    monkeypatch.setenv("SQLITE_PATH", "/does-not-exist/catalog.sqlite3")
    assert client.get("/healthz").status_code == 503
    assert client.get("/api/catalog").json == {"error": "catalog_unavailable"}
