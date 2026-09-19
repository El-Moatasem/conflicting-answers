"""Rebuild only the local JSON fixture. Does not fetch, verify or publish sources."""

import copy, json
from pathlib import Path

P = Path(__file__).resolve().parents[1]


def t(en, sw):
    return {"en": en, "sw": sw}


def claim(value, term, en, sw):
    return {"value": value, "term": term, "text": t(en, sw)}


scope = {
    "service": "first_passport",
    "jurisdiction": "KE",
    "applicant": "adult_citizen_by_birth",
}
a = {
    "id": "directorate",
    "publisher": "Directorate of Immigration Services",
    "url": "https://immigration.go.ke/application-requirements/",
    "section": "Requirements for new (First time) applications",
    "checked_at": "2026-09-19",
    "valid_from": None,
    "valid_to": None,
    "scope": scope,
    "scope_note": t(
        "Curated for an adult citizen by birth. Confirm local office applicability.",
        "Imechaguliwa kwa raia mzima kwa kuzaliwa. Thibitisha matumizi katika ofisi yako.",
    ),
    "claims": {
        "payment_documents": claim(
            2,
            "payment_invoice",
            "Two payment invoices accompany the completed application form.",
            "Ankara mbili za malipo ziambatane na fomu ya maombi iliyojazwa.",
        ),
        "birth_certificate": claim(
            "original_and_copy",
            "birth_certificate",
            "Original birth certificate plus a copy.",
            "Cheti halisi cha kuzaliwa pamoja na nakala.",
        ),
        "national_id": claim(
            "original_and_copy",
            "national_id",
            "Original national identity card plus a copy.",
            "Kitambulisho halisi cha taifa pamoja na nakala.",
        ),
    },
    "short_quote": "2 payment invoices",
}
b = {
    "id": "ecitizen",
    "publisher": "eCitizen Immigration passport page",
    "url": "https://immigration.ecitizen.go.ke/index.php?id=4",
    "section": "Steps of Application / During the Submission",
    "checked_at": "2026-09-19",
    "valid_from": None,
    "valid_to": None,
    "scope": copy.deepcopy(scope),
    "scope_note": t(
        "Broader application page, scoped by the prototype curator. Currency and local applicability remain unconfirmed.",
        "Ukurasa wa jumla wa maombi, uliochaguliwa na mtayarishaji. Usasa na matumizi ya eneo bado hayajathibitishwa.",
    ),
    "claims": {
        "payment_documents": claim(
            3,
            "application_receipt",
            "Print three application receipts with the application form.",
            "Chapisha risiti tatu za maombi pamoja na fomu ya maombi.",
        ),
        "birth_certificate": claim(
            "original_and_copy",
            "birth_certificate",
            "Original birth certificate plus a photocopy.",
            "Cheti halisi cha kuzaliwa pamoja na nakala.",
        ),
        "national_id": claim(
            "original_and_copy",
            "national_id",
            "Original national identity card plus a copy.",
            "Kitambulisho halisi cha taifa pamoja na nakala.",
        ),
    },
    "short_quote": "three application receipts",
}
cases = [
    {
        "id": "observed",
        "title": t(
            "Kenya passport: invoices or receipts?",
            "Pasipoti ya Kenya: ankara au risiti?",
        ),
        "synthetic": False,
        "description": t(
            "Two official pages use different counts and document terms. Their relationship needs institutional clarification.",
            "Kurasa mbili rasmi zinatumia idadi na majina tofauti ya hati. Taasisi inahitaji kufafanua uhusiano wake.",
        ),
        "sources": [a, b],
    }
]


def fixture(id, title, modify):
    x = copy.deepcopy(a)
    y = copy.deepcopy(a)
    for i, s in enumerate((x, y)):
        s["id"] = f"{id}-{i}"
        s["publisher"] = f"Synthetic source {i+1}"
        s["url"] = None
        s["short_quote"] = None
        s["valid_from"] = "2026-01-01"
        s["scope_note"] = t(
            "Invented test fixture. Not official guidance.",
            "Mfano wa kubuni wa majaribio. Si mwongozo rasmi.",
        )
    modify(x, y)
    cases.append(
        {
            "id": id,
            "title": t(
                title,
                {
                    "same-term": "Tofauti ya idadi (mfano)",
                    "different-scope": "Eneo tofauti (mfano)",
                    "different-period": "Vipindi tofauti (mfano)",
                    "missing": "Taarifa isiyotajwa (mfano)",
                    "agreement": "Taarifa zinazolingana (mfano)",
                }[id],
            ),
            "synthetic": True,
            "description": t(
                "Synthetic test case. It demonstrates classification, not a real public-service rule.",
                "Mfano wa majaribio wa kubuni. Unaonyesha uainishaji, si kanuni halisi ya huduma.",
            ),
            "sources": [x, y],
        }
    )


fixture(
    "same-term",
    "Same document, different counts (fixture)",
    lambda x, y: y["claims"]["payment_documents"].update(
        value=3, text=t("Three payment invoices.", "Ankara tatu za malipo.")
    ),
)
fixture(
    "different-scope",
    "Different locations (fixture)",
    lambda x, y: y["scope"].update(jurisdiction="TZ"),
)
fixture(
    "different-period",
    "Different effective periods (fixture)",
    lambda x, y: (x.update(valid_to="2026-03-31"), y.update(valid_from="2026-04-01")),
)
fixture(
    "missing",
    "A missing statement (fixture)",
    lambda x, y: y["claims"].pop("payment_documents"),
)
fixture("agreement", "Matching statements (fixture)", lambda x, y: None)
data = {
    "version": "2026-09-19.1",
    "review_window_days": 30,
    "cases": cases,
    "contact": {"email": "info@immigration.go.ke", "url": a["url"]},
    "coverage": t(
        "Kenya passport pilot. Curated statements, not a complete application checklist.",
        "Jaribio la pasipoti ya Kenya. Taarifa zilizochaguliwa, si orodha kamili ya maombi.",
    ),
    "translation_status": "AI-drafted Swahili; independent review pending",
}
(P / "data/catalog.json").write_text(
    json.dumps(data, ensure_ascii=False, indent=2) + "\n"
)
