# Submission content — "Aydın"

Ready-to-paste text for the NeuroBridge.SI Submission page fields.

## Title
Aydın

## Track
AI Enterprise Solutions

## The user and the problem
**Who:** Azerbaijani prepaid mobile subscribers (the profile Azercell itself serves) who don't routinely check itemized balance deductions, and only notice a problem once their balance has unexpectedly run out.

**What goes wrong today:** Recurring charges from third-party content subscriptions (e.g. "Sindibad"-style services, often ~0.35 AZN/day) get activated through a single SMS-link click or a promo opt-in the customer doesn't remember agreeing to. The customer only discovers the drain when their balance hits zero, and today the only fix is calling support and waiting on a human to look it up and cancel it manually. Azercell's own AI assistant, AiCell, already understands Azerbaijani extremely well (96.6% comprehension accuracy) but still only resolves 17% of inquiries end-to-end — the remaining 83% get routed to a human anyway. The gap isn't language. It's follow-through.

**What Aydın does differently:** given a billing question, Aydın reads the customer's real subscriptions, explains which charge is legitimate and which looks like an unwanted third-party subscription, and — once the customer confirms — actually cancels it through a tool call. No handoff, no "please call this number." The resolution happens inside the conversation.

## Originality
AiCell proves Azerbaijani NLU is a solved problem for Azercell already; it does not prove resolution is solved — 83% of its inquiries still end in a human handoff. Aydın is built specifically as the resolution layer for that unresolved majority, targeting the single highest-friction, most emotionally charged case first: a customer watching their balance disappear to a subscription they don't remember choosing.

This also differs in kind from the other enterprise entries at this same event. DocuTrust AI, for example, is a retrieval-augmented chatbot over internal HR/compliance PDFs — valuable, but an *internal* knowledge-lookup pattern common across enterprise AI hackathons. Aydın is consumer-facing and action-taking: the AI doesn't just retrieve and answer, it executes a state-changing action (`cancel_subscription`) on the customer's behalf, inside the same conversation that diagnosed the problem.

## Feasibility
**Data requirements:** a production version needs read access to a telecom's real billing and active-subscription records per customer, plus a write path to cancel a third-party subscription. This is sensitive account data — any real deployment requires explicit customer authentication (already standard for Azercell's app/USSD channels) and an auditable consent/action log for every cancellation the assistant performs, so support teams can review or reverse an action if needed.

**Running cost:** using Claude Sonnet 5 ($2 / $10 per million input/output tokens), a full resolution conversation (initial question → bill lookup → explanation → confirmation → cancellation → confirmation) runs roughly 2,500 input tokens and 300 output tokens across the tool-call loop — about **$0.008 (under 2 qəpik) per fully resolved case**. That is negligible next to the cost of a human agent handling the same ticket by phone.

**Next step:** pilot through Azercell's own Barama Innovation Center, whose stated purpose is converting exactly this kind of hackathon prototype into a real business unit — a natural, already-existing path from this demo to production rather than a hypothetical one.
