# Disclosure (mandatory — NeuroBridge.SI rules, Section 5)

Ready-to-paste content for the three Submission page disclosure fields.

## Models

- **Claude Sonnet 5** (Anthropic Messages API, model id `claude-sonnet-5`) — powers the assistant's reasoning, Azerbaijani-language understanding/generation, and tool-calling (`get_bill`, `cancel_subscription`). Called directly via the Messages API (`https://api.anthropic.com/v1/messages`), no SDK dependency — plain `fetch` in `src/app/api/chat/route.ts`.
- **Claude Code** — used throughout the build as the AI coding assistant (writing/editing the Next.js app, the tool-calling logic, and this documentation itself), disclosed per the "AI assistant" category of the mandatory disclosure requirement.

## Data

- **Synthetic mock bill data** — the account balance and two example subscriptions (one legitimate data add-on, one suspicious third-party content charge) are hand-authored synthetic fixtures in `src/lib/mockBill.ts`. No real customer or partner data is used anywhere in the app.
- **Public reference statistics (motivation only, not training/input data):** Azercell's own published figures for its AiCell voice bot (96.6% Azerbaijani comprehension accuracy, 17% end-to-end resolution rate) are cited in the pitch/submission as the problem motivation and comparison baseline — these numbers are not consumed by the running application, only referenced in the written materials.

## Components, libraries and templates

- **Next.js 16** (App Router) + **React 19** + **TypeScript** — application framework
- **Tailwind CSS v4** — styling
- Scaffolded with **`create-next-app`** (public official Next.js template/CLI) — disclosed as a public template per the rules
- **Vercel** — hosting/deployment (production demo link)
- No other third-party AI libraries, vector databases, or SDKs are used — the Anthropic API is called directly over HTTP.

## Eligibility note

This project was built from scratch after the hackathon's build time started (9 October 2026, 11:00 Baku time). No previously developed product or prior codebase was reused. Research into the problem (Azercell's public AiCell statistics, general Azerbaijani-NLP feasibility) was done before the hackathon per the rules' allowance for prior research; no code predates the start of build time.
