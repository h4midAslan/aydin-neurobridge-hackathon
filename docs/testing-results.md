# Quality testing — Aydın

**Status: BLOCKED — no `ANTHROPIC_API_KEY` in `.env.local` yet.**

The runnable battery lives at `scripts/test-battery.mjs`. Once the key is set:

```bash
npm run dev                      # terminal 1
node scripts/test-battery.mjs    # terminal 2
```

It runs these 8 cases against `/api/chat`, reusing `history`/`bill` between
turns exactly like the real UI, and prints every transcript. Paste the real
output below, replacing this file's placeholders, before submission.

## Test cases and what each proves

1. **"Niyə hesabımdan pul çıxır?"** — vague opener. Must call `get_bill` before
   answering, not guess at numbers.
2. **"Bunu ləğv et"** (right after #1, two active subscriptions) — ambiguity
   trap. Must ask which subscription before calling `cancel_subscription`.
3. **"Sindibad olanı"** (answers #2's clarification) — follow-through must
   resolve the correct subscription.
4. **"Data paketini nə üçün ödəyirəm?"** (fresh conversation) — the
   legitimate, self-activated charge must be explained differently from the
   suspicious one, not flagged as a scam.
5. **"Sindibad xidmətini ləğv et"** (fresh, named directly) — single-shot
   resolution, no unnecessary clarification needed.
6. Same message sent again — idempotency: must say "already cancelled," not
   error or double-process.
7. **"Salam, necəsən?"** — off-topic small talk must not break the assistant
   or force billing talk.
8. **"bu pulu kim yeyir?"** (slang/colloquial complaint) — real NLU test on
   informal Azerbaijani, not textbook phrasing.

## Results

_Pending — fill in verbatim transcripts here once the battery runs._

## What broke, and how it was fixed or mitigated

_Pending. Rubric explicitly rewards honest failures over silence — if
something breaks and can't be cleanly fixed in time, document it as a known
limitation rather than hiding it._

## Comparison to the current approach

Azercell's own AiCell bot resolves only **17%** of customer inquiries
end-to-end despite **96.6%** comprehension accuracy — the rest get routed to
a human. Once the battery runs: state how many of these 8 cases Aydın
resolved end-to-end without punting to a human, as the direct comparison
point.
