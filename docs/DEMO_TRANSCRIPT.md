# Conflicting Answers — two-minute demo transcript

The supplied MP4 is a silent screen recording with captions. The narration below is
optional text for your own voice-over. Keep the observed case separate from fixtures.

| Time | Screen | Narration |
|---|---|---|
| 00:00–00:12 | Observed case overview | “Conflicting Answers helps people compare public-service instructions and identify a clear next step. This prototype focuses on Kenyan passport preparation using two dated institutional pages.” |
| 00:12–00:24 | Two source cards | “One page mentions two payment invoices. The other mentions three application receipts. These terms might describe different documents, and neither effective date is established. The correct result is clarification needed.” |
| 00:24–00:36 | Statement comparison | “The app separates matching statements from unresolved evidence. It does not assume that a missing statement is a contradiction or that the most recently fetched page must be correct.” |
| 00:36–00:48 | Clarification draft and partial checklist | “Users can prepare the matching items and copy a precise question with both source links. This is a partial checklist. Nothing is sent automatically and no personal documents are uploaded.” |
| 00:48–01:00 | Different-scope fixture | “This clearly labeled synthetic example compares different locations. The engine refuses to call that a contradiction. A separate test case distinguishes non-overlapping effective periods.” |
| 01:00–01:12 | Same-term count fixture | “Here, an invented example uses the same document term but different counts. That creates a potential conflict for review. It still does not establish which source is right.” |
| 01:12–01:24 | Fictional clarification preview | “A fictional clarification demonstrates what would change when evidence agrees: a new preparation step becomes available. This preview cannot be saved as reviewed official guidance.” |
| 01:24–01:36 | Swahili interface and review notice | “The same journey works in English and draft Swahili. The translation needs independent review. The interface uses text, native controls and a layout that adapts to smaller screens.” |
| 01:36–01:48 | Offline reload after explicit save | “Networking is now disabled. The saved comparison reopens with its source dates and an offline label. It remains a snapshot and cannot verify the live sources until connectivity returns.” |
| 01:48–02:00 | Clear data and overview | “Users can clear saved progress on shared devices. The package includes source code and deployment guides. AI assisted ideation and development, so organizer eligibility clarification remains necessary under the brief.” |

## Regeneration

From the repository root, install the documented Playwright development dependency and
browser. Stop other services on port 8000, then run `node scripts/record_demo.cjs`.
It starts its own local server and writes `artifacts/demo-raw.webm` plus captions.
Run `python scripts/render_video.py artifacts` with ffmpeg installed to create the MP4.

Record no secrets or real applicant data. Do not describe synthetic resolution as an
institutional response. If you change the implementation, re-record the demo.
