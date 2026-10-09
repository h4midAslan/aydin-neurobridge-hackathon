# Pitch deck outline — "Aydın"

8 slides, each titled with the scoring criterion it answers, so the mapping to the 100-point card is unmissable to both the AI first-round readers and the human jury.

---

### Slide 1 — Title
**Aydın** — the AI that resolves your bill, not just explains it.
Track: AI Enterprise Solutions · Team whoami · NeuroBridge.SI Baku 2026

---

### Slide 2 — Value for the user (25 pts)
- Who: Azerbaijani prepaid mobile subscribers who don't check itemized deductions.
- What breaks today: unwanted recurring third-party charges (e.g. "Sindibad"-style, ~0.35 AZN/day) silently drain balance; the only fix today is calling support and waiting.
- The outcome Aydın delivers: the charge is explained *and cancelled* inside one chat, in Azerbaijani, with no human handoff.

---

### Slide 3 — Prototype and use of AI (30 pts)
- Live demo screenshot/GIF: chat on the right, real bill state on the left.
- The core mechanism: Claude Sonnet 5 tool-calling — `get_bill` (reads real account state) → `cancel_subscription` (executes the cancellation).
- Call out explicitly: **this is an action, not a lookup.** The bill panel visibly updates the instant the AI resolves the charge — that's the AI's contribution made visible.

---

### Slide 4 — Prototype and use of AI, continued: handling ambiguity
- Show the one hard case: two active subscriptions, customer says only "cancel it" — Aydın asks which one before acting, instead of guessing.
- This is the evidence it's reasoning over the account state, not pattern-matching a keyword to an action.

---

### Slide 5 — Quality testing (20 pts)
`[PLACEHOLDER — fill from docs/testing-results.md once the Test Engineer agent finishes the 8-case battery]`
- Structure to fill in: test cases run → pass/fail → the one honest failure found → the fix (or the known limitation if unfixed) → resolution-rate comparison against AiCell's own published 17%.

---

### Slide 6 — Feasibility (15 pts)
- Data needed for production: read access to real billing/subscription records + a cancellation write-path, with mandatory auth and an auditable action log.
- Cost: ~$0.008 per fully resolved conversation on Claude Sonnet 5 — negligible versus a human-handled support ticket.
- Next step: pilot via Azercell's Barama Innovation Center — built for exactly this hand-off from hackathon to business unit.

---

### Slide 7 — Originality (10 pts)
- AiCell (Azercell's own bot): 96.6% Azerbaijani comprehension, but only 17% end-to-end resolution — understands fine, doesn't finish the job.
- Aydın is the resolution layer for that unresolved 83%, starting with the #1 recurring-complaint pattern.
- Contrast with this event's other enterprise entries (e.g. DocuTrust AI): those retrieve and answer from internal documents; Aydın acts on a real external consumer problem and changes account state.

---

### Slide 8 — Close
- One line: "AiCell understands you. Aydın gets it done."
- Ask: a pilot slot through Barama Innovation Center.
