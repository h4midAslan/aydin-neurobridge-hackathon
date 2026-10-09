# Pitch deck outline — "Clario"

8 slides, each titled with the scoring criterion it answers, so the mapping to the 100-point card is unmissable to both the AI first-round readers and the human jury.

---

### Slide 1 — Title
**Clario** — the AI that resolves your bill, not just explains it.
Track: AI Enterprise Solutions · Team whoami · NeuroBridge.SI Baku 2026

---

### Slide 2 — Value for the user (25 pts)
- Who: subscribers of Azerbaijani telecom/subscription-based services who don't check itemized deductions — illustrated here against Azercell's own published customer base and complaint patterns.
- What breaks today: unwanted recurring third-party charges (e.g. "PlayZone"-style, ~0.35 AZN/day) silently drain balance; the only fix today is calling support and waiting.
- The outcome Clario delivers: the charge is flagged *and cancelled* end to end, in Azerbaijani, with no human handoff — and Clario raises it before the customer even has to ask.

---

### Slide 3 — Prototype and use of AI (30 pts)
- Live demo screenshot/GIF: a call console, not a chat window — call-in-progress header, a persistent "AiCell resolves 17% of this kind of case" badge, a status line that flips to "✅ ZƏNG: HƏLL EDİLDİ" (CALL: RESOLVED) on completion.
- The core mechanism: on connect, Clario has already scanned the account and **opens the call itself**, flagging the suspicious charge before being asked anything — proactive detection, not a reactive FAQ lookup.
- Then: Claude Sonnet 5 tool-calling across three real tools — `get_bill` (reads real account state) → `cancel_subscription` (stops the charge) → `request_refund` (returns money already taken for past periods) — and the model can chain more than one of these from a single customer confirmation, choosing the right combination itself.
- Call out explicitly: **this is an agent finishing a call, not a chatbot answering a question.** The console visibly flips from pending to resolved the instant the AI acts — that's the AI's contribution made unmissable, not just claimed in a caption.

---

### Slide 4 — Prototype and use of AI, continued: handling ambiguity and orchestration
- Show the one hard case: Clario has just named two charges unprompted, customer replies only "cancel it" — Clario asks which one before acting, instead of guessing.
- Show the multi-tool case: one customer reply ("yes, cancel it, and refund the last 7 days too") triggers `cancel_subscription` *and* `request_refund` correctly, in order, with the refund amount computed exactly right (0.35 AZN × 7 = 2.45 AZN) — verified live in `docs/testing-results.md`, case 11.
- This is the evidence it's reasoning over account state and conversation context, not pattern-matching a keyword to an action — the thing that separates an agent from a scripted form with a chat skin.

---

### Slide 5 — Quality testing (20 pts)
- 10 real test cases run live against Claude Sonnet 5, not scripted: vague openers, direct named cancellation, idempotent re-cancel, off-topic small talk, slang/colloquial NLU, the proactive opening trigger, and a genuine zero-context ambiguity test.
- Honest finding: our first ambiguity test was flawed (prior context had already resolved the reference) — caught it, added a real zero-context test, which passed: Clario correctly asked "which subscription?" instead of guessing.
- Result: of the 8 cases involving an actual billing concern, all 8 ended with Clario either resolving it on the spot or asking one confirming word before an irreversible action — never punting to a human. 4 of 9 resolved with an immediate completed cancellation in the same exchange.
- Compare: AiCell resolves 17% of such cases end-to-end. Full transcripts in `docs/testing-results.md`.

---

### Slide 6 — Feasibility (15 pts)
- Target market: Azerbaijani telecom and subscription-based service providers generally — not dependent on any single partner to be viable.
- Data needed for production: read access to real billing/subscription records + a cancellation write-path, with mandatory auth and an auditable action log.
- Cost: ~$0.008 per fully resolved conversation on Claude Sonnet 5 — negligible versus a human-handled support ticket.
- Next step: Azercell is the most relevant illustrative case study and the most natural first pilot partner, since they're already a partner of this hackathon network and have published the exact benchmark (AiCell's 17%) this product improves on — their Barama Innovation Center is built for exactly this hand-off from hackathon to business unit. The product itself generalizes beyond any one operator.

---

### Slide 7 — Originality (10 pts)
- AiCell (Azercell's own bot): 96.6% Azerbaijani comprehension, but only 17% end-to-end resolution — understands fine, doesn't finish the job, and even its resolved cases only stop future charges, never return money already taken.
- Clario is a resolution console, not a chatbot: it opens the call itself the moment it detects a problem, takes two distinct kinds of real action (cancel and, separately, refund), and the interface itself reports pending vs. resolved like a call log, not a message thread. The category is different, not just the feature set.
- Contrast with this event's other enterprise entries (e.g. DocuTrust AI): those retrieve and answer from internal documents; Clario acts on a real external consumer problem and changes account state on its own initiative.

---

### Slide 8 — Close
- One line: "AiCell understands the call. Clario finishes it."
- Ask: a pilot slot through Barama Innovation Center, as the first of many possible telecom/subscription-service partners.
