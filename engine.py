"""Conservative deterministic comparison of human-curated source statements.
A difference is never a ruling about which institution is correct.
"""

from datetime import date

SCOPE = ("service", "jurisdiction", "applicant")


def compare(left, right, today=None):
    today = today or date.today()
    reasons = []
    for key in SCOPE:
        if not left.get("scope", {}).get(key) or not right.get("scope", {}).get(key):
            return {
                "status": "insufficient_context",
                "rows": [],
                "reason": "missing_scope",
                "key": key,
            }
        if left["scope"][key] != right["scope"][key]:
            return {
                "status": "different_scope",
                "rows": [],
                "reason": "scope_mismatch",
                "key": key,
            }
    dates = []
    for s in (left, right):
        checked = s.get("checked_at")
        if not checked or (today - date.fromisoformat(checked)).days not in range(
            0, 31
        ):
            reasons.append("source_review_due")
        start = s.get("valid_from")
        end = s.get("valid_to")
        if not start:
            reasons.append("effective_date_unknown")
        dates.append(
            (
                date.fromisoformat(start) if start else date.min,
                date.fromisoformat(end) if end else date.max,
            )
        )
    if all(s.get("valid_from") for s in (left, right)) and max(
        x[0] for x in dates
    ) > min(x[1] for x in dates):
        return {
            "status": "different_period",
            "rows": [],
            "reason": "non_overlapping_dates",
        }
    rows = []
    for key in sorted(set(left["claims"]) | set(right["claims"])):
        a = left["claims"].get(key)
        b = right["claims"].get(key)
        row = {"key": key, "left": a, "right": b}
        if a is None or b is None:
            row["status"] = "missing_statement"
        elif not a.get("term") or not b.get("term") or a["term"] != b["term"]:
            row["status"] = "terminology_review"
        elif a.get("value") is None or b.get("value") is None:
            row["status"] = "missing_statement"
        elif a["value"] == b["value"]:
            row["status"] = "agreement"
        else:
            row["status"] = "potential_conflict"
        rows.append(row)
    if not rows:
        status = "insufficient_context"
    elif any(r["status"] == "potential_conflict" for r in rows):
        status = "potential_conflict"
    elif any(r["status"] == "terminology_review" for r in rows):
        status = "terminology_review"
    elif any(r["status"] == "missing_statement" for r in rows):
        status = "incomplete_evidence"
    else:
        status = "agreement"
    return {
        "status": status,
        "rows": rows,
        "cautions": sorted(set(reasons)),
        "reason": "no_automatic_winner",
    }
