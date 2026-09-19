# Conflicting Answers — written submission draft

**Track:** Transparency & Accountability  
**Theme:** Information you can trust  
**Stage:** Working proof of concept, with local-user and institutional validation pending.

## Problem and intended users

A resident may find different instructions on institutional pages and still not know
which documents to prepare or what to ask next. Conflicting Answers makes that uncertainty
visible and actionable. The initial audience is adults preparing a first Kenyan passport,
with particular attention to people who need a lightweight, reusable preparation guide.
The frequency and cost of this problem have not yet been measured with local users.

## Solution

The prototype compares a small curated set of source statements. It distinguishes
matching evidence, different document terminology, potential numerical conflicts,
missing statements, different applicant/location scopes and different effective periods.
It shows the evidence side by side and never chooses an authoritative winner automatically.

Matching statements become a partial preparation checklist. Unresolved wording becomes
a precise clarification request with both source links. Users can copy and review that
request, download an action pack, print it or save it for offline reopening. Nothing is
sent to an institution automatically. The tool does not submit applications or take payment.

## Information sources

The observed case uses two pages accessed on 19 September 2026:

- Directorate of Immigration Services: https://immigration.go.ke/application-requirements/
- eCitizen Immigration passport page: https://immigration.ecitizen.go.ke/index.php?id=4

The first refers to two payment invoices; the second refers to three application
receipts. This is an observed wording/count difference. It is not proof of a current
contradiction: the document terms may differ, effective dates are unknown and the
pages' present applicability needs institutional clarification. The prototype correctly
labels it as clarification needed. It does not reproduce unverified fees or processing
time estimates as current guidance.

Five additional scenarios are explicitly synthetic and test the comparison rules. Their
source pages, dates and requirements are invented. A separate fictional clarification
preview demonstrates how matching evidence could add a preparation step, but cannot
be saved as reviewed official guidance.

## Trust and accuracy

Every observed statement traces to a source page and section. Check dates remain separate
from effective dates. Retrieval hashes record which bytes informed curation; they do not
establish truth. Missing information remains unknown, a newer retrieval never wins by
default, and source agreement is not a guarantee of correctness.

Comparability depends on curated service, jurisdiction and applicant context. The eCitizen
page covers broader situations, so that mapping remains a review question. The engine
cannot infer legal priority, resolve terminology or certify applicability. Its role is
to make those questions explicit. A maintainer must review source revisions before a
version-guarded catalog update. A new version clears saved ticks for user review.

## Access, language and privacy

The application uses text, native browser controls and a responsive layout. English and
draft Swahili cover the main journey. Swahili still needs independent review, which is
visible in the interface. Human accessibility testing also remains pending.

Saved guidance reopens offline, with dated evidence and an offline label. First access
requires internet and a browser. Text downloads and printouts support assisted access;
SMS and USSD are outside the prototype.

No account, identity-document upload or personal-data field is required. Progress stays
in memory until explicit saving, then in local browser storage. Users can clear saved
data. Downloads and browser history are outside that deletion action. Hosting providers
may process ordinary access metadata, so anonymity is not promised.

## Implementation and AI coding usage

Flask serves a read-only API and plain HTML/CSS/JavaScript interface. A deterministic
Python engine compares curated statements. SQLite supports local development and
psycopg supports Neon PostgreSQL. Render deployment files, tests, real local Git commits,
PR drafts and recording scripts accompany the code. No runtime LLM or API key is required.

Codex assisted with brainstorming, architecture, code generation, test design, debugging,
translation drafting and submission materials. Fourteen local automated tests passed,
along with browser checks for evidence classifications, offline reopening, language/mobile
behavior, clarification-preview isolation, version invalidation and deletion. These
checks do not establish live cloud readiness, translation accuracy or user impact.

The supplied brief asks participants not to use AI to generate the idea. This concept
emerged from AI-assisted brainstorming and should not be described as independently
human-originated. Eligibility clarification from the organizers is required before
submitting this concept. The package can otherwise serve as an implementation exercise.

## Potential impact and scalability

The intended benefit is helping residents distinguish usable information from unresolved
questions and contact institutions more precisely. No reduction in repeat visits, money
saved or adoption figures is claimed. A next study would ask intended users to identify
what is consistent, what remains uncertain and whom to contact, comparing their accuracy
and completion time with the original pages.

Expansion requires new reviewed source sets, local applicability rules, translations and
accountable content owners. The software workflow is reusable, but content maintenance
is the main scaling dependency. Institutional collaboration and independent language
review should precede public community use.

## Delivery status

The package includes runnable code, a Git bundle, public-repository/PR publishing commands,
Render/Neon instructions, a pitch PDF, a captioned MP4 and narration transcript. A public
GitHub remote, live PRs, Render service and Neon database have not been provisioned here.
