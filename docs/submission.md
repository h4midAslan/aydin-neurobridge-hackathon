# Submission content — "Aydın"

Ready-to-paste text for the NeuroBridge.SI Submission page fields.

## Title
Aydın

## Track
AI Enterprise Solutions

## The user and the problem
**Who:** subscribers of Azerbaijani telecom and subscription-based services who don't routinely check itemized balance deductions, and only notice a problem once their balance has unexpectedly run out. Azercell's own published customer base and complaint patterns are the clearest available illustration of this, but the problem is structural to the category, not specific to one operator.

**What goes wrong today:** Recurring charges from third-party content subscriptions (e.g. "Sindibad"-style services, often ~0.35 AZN/day) get activated through a single SMS-link click or a promo opt-in the customer doesn't remember agreeing to. The customer only discovers the drain when their balance hits zero, and today the only fix is calling support and waiting on a human to look it up and cancel it manually. Azercell's own AI assistant, AiCell, already understands Azerbaijani extremely well (96.6% comprehension accuracy) but still only resolves 17% of inquiries end-to-end — the remaining 83% get routed to a human anyway. The gap isn't language. It's follow-through — a call that starts but doesn't finish.

**What Aydın does differently:** Aydın is a resolution console, not a chatbot — it scans the account on its own and opens with the problem it found, before the customer has to ask. It reads the customer's real subscriptions, explains which charge is legitimate and which looks like an unwanted third-party subscription, and — once the customer confirms — actually cancels it through a tool call. It goes one step further than stopping the bleeding: it offers to return the money already taken, requesting a refund for the recent period through a second, distinct tool call the customer confirms separately. No handoff, no "please call this number." The call that AiCell leaves open gets finished — forward and backward — in the same session that diagnosed it.

## Originality
AiCell proves Azerbaijani NLU is a solved problem already; it does not prove resolution is solved — 83% of its inquiries still end in a human handoff, and even where it resolves something, AiCell stops future charges — it doesn't return money already taken. Aydın is not a friendlier version of that same chatbot pattern — it's a different category: a resolution console that opens the call itself the moment it detects a problem, takes two distinct kinds of real action (cancel, and separately, refund) from one conversation, and whose interface reports a call as pending or resolved, not as a message thread. It's built specifically to close the single highest-friction, most emotionally charged case first: a customer watching their balance disappear to a subscription they don't remember choosing — and getting that money back, not just the promise that it won't happen again.

This also differs in kind from the other enterprise entries at this same event. DocuTrust AI, for example, is a retrieval-augmented chatbot over internal HR/compliance PDFs — valuable, but an *internal*, reactive knowledge-lookup pattern common across enterprise AI hackathons. Aydın is consumer-facing, proactive, and action-taking: the AI doesn't wait to be asked, doesn't just retrieve and answer, and executes a state-changing action (`cancel_subscription`) on the customer's behalf inside the same session that diagnosed the problem.

## Feasibility
**Data requirements:** a production version needs read access to a telecom's real billing and active-subscription records per customer, plus a write path to cancel a third-party subscription. This is sensitive account data — any real deployment requires explicit customer authentication (already standard for Azercell's app/USSD channels) and an auditable consent/action log for every cancellation the assistant performs, so support teams can review or reverse an action if needed.

**Running cost:** using Claude Sonnet 5 ($2 / $10 per million input/output tokens), a full resolution conversation (initial question → bill lookup → explanation → confirmation → cancellation → confirmation) runs roughly 2,500 input tokens and 300 output tokens across the tool-call loop — about **$0.008 (under 2 qəpik) per fully resolved case**. That is negligible next to the cost of a human agent handling the same ticket by phone.

**Next step:** the product targets Azerbaijani telecom/subscription-based service providers broadly, and isn't built to depend on any single partner. That said, Azercell is the most relevant illustrative case study and the most natural first pilot partner available right now — they're already a partner of this hackathon network, they've published the exact 17%/96.6% benchmark this product improves on, and their Barama Innovation Center exists specifically to convert hackathon prototypes like this one into real business units. It's a credible first step, not the only possible one.
