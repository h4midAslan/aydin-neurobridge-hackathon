# Disclosure (mandatory — NeuroBridge.SI rules, Section 5)

Ready-to-paste content for the three Submission page disclosure fields.

## Models

- **Claude Sonnet 5** (Anthropic Messages API, model id `claude-sonnet-5`) — powers the live assistant's reasoning, Azerbaijani-language understanding/generation, and tool-calling (`get_bill`, `cancel_subscription`, `request_refund`, `get_usage_profile`, `recommend_plan`). Called directly via the Messages API, no SDK dependency — plain `fetch` in `src/app/api/chat/route.ts`.
- **scikit-learn `LogisticRegression`** (multinomial) — the tariff/persona classifier behind the plan recommender. Trained offline in Python on synthetic data (see Data), compared head-to-head against 6 other model types under 5-fold cross-validation (RandomForest, ExtraTrees, HistGradientBoosting, GradientBoosting, SVM-RBF, MLP) — logistic regression won on macro-F1 (0.992) and was exported as plain weights, reimplemented as a dependency-free scorer in TypeScript (`src/lib/tariff/recommend.ts`). No model runs server-side in production; inference is a client-side dot-product + softmax.
- **scikit-learn `KMeans`** — used offline, training-time only, to discover the 10 named usage personas from synthetic data before the classifier was trained on the resulting labels. Not shipped to production.
- **Claude Code** — used throughout the build as the AI coding assistant (application code, the ML pipeline, and this documentation), disclosed per the "AI assistant" category of the mandatory disclosure requirement.

## Data

- **Synthetic mock bill data** — the account balance and example subscriptions (one legitimate data add-on, one suspicious third-party content charge, "PlayZone Plus") are hand-authored synthetic fixtures in `src/lib/mockBill.ts`. No real customer or partner data is used anywhere in the app.
- **Synthetic usage-profile generator** (`ml/gen_sections.py`) — produces 5,000 training users, a 2,000-user held-out same-distribution test set, and a 2,000-user simulated-drift test set (usage ×1.3), across 10 generator-defined hidden usage types (never exposed to the classifier as a feature, used only to score clustering quality). Trains the persona classifier and the 30-package pricing table in `ml/pipeline.py`.
- **Public reference pricing (verified vs. assumed, explicitly separated)** — real Azercell tariff prices scraped from azercell.com/app (3GB/9 AZN, 6GB/12 AZN, 12GB/19 AZN, 30GB/29 AZN, 56GB/39 AZN 28-day packs; Premium+ 60GB/60 AZN and 100GB/90 AZN) used as the real-world price ceiling every generated package is capped against. A small number of DigiMax price points (5GB/12 AZN, 10GB/18 AZN, 25GB/30 AZN) are *assumed*, inferred from DigiMax's public price selector rather than directly observed, and are labeled `assumed_digimax` in the data wherever they're used — never presented as verified.
- **Public reference statistics (motivation only, not consumed by the running app):** Azercell/AiCell's own published figures (96.6% comprehension, 17% resolution), C+R Research's consumer subscription study ($219 actual vs. $86 estimated monthly spend, 42% forgotten-subscription rate), and market-sizing figures from Mordor Intelligence and Grand View Research — all cited in the pitch and submission materials as problem motivation and TAM context, not as inputs to the app itself.

## Components, libraries and templates

- **Next.js 16** (App Router) + **React 19** + **TypeScript** — application framework, scaffolded with the public `create-next-app` template/CLI
- **Tailwind CSS v4** — styling
- **Vercel** — hosting/deployment
- **Python 3 + pandas + numpy + scikit-learn** — the offline ML training pipeline (`ml/`) only; none of this ships to the deployed app, which has zero Python runtime dependency
- No other third-party AI libraries, vector databases, or SDKs are used in the live app — the Anthropic API is called directly over HTTP.

## Eligibility note

This project was built from scratch after the hackathon's build time started (9 October 2026, 11:00 Baku time). No previously developed product or prior codebase was reused. Research into the problem (Azercell's public AiCell statistics, general Azerbaijani-NLP feasibility, tariff pricing research) was done before the hackathon per the rules' allowance for prior research; no code predates the start of build time.
