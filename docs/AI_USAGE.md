# AI coding contribution

Codex assisted with concept brainstorming, implementation, debugging, tests, draft
Swahili, documentation, pitch and demo scripting. The application uses deterministic
comparison and change detection. It does not call a generative model at runtime.

This integration used the user's uploaded source ZIP as the base. The concrete change
was to replace blanket catalog-version invalidation with requirement-level evidence
comparison. Codex implemented a shared pure JavaScript module, scope acknowledgement,
selective preservation of ticks, change explanations and an isolated fictional demo.

Validation focused on meaningful failure modes: date-only changes, scope changes,
wording changes, requirements added/removed, conflicts, fixture isolation and saved
state reopening offline. The pure module is used by the UI itself, not a duplicate test
implementation. The browser test exercises actual controls and network disconnection.

AI-generated Swahili remains labeled as a draft. Official source dates were preserved
rather than advanced merely because code was regenerated. Fictional updates are not
presented as institutional clarification. No user interview, official response, hosted
CI success or production deployment is invented.

The supplied brief restricts using AI to generate the idea. The concept was AI-assisted;
clarify eligibility with the organizers before submission and describe its origin honestly.
