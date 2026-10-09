# Aydın

An AI assistant that **resolves** unwanted recurring subscription charges end-to-end, in Azerbaijani — not just explains them. Built for NeuroBridge.SI Baku 2026 (AI Enterprise Solutions track).

**Landing page:** https://aydin-self.vercel.app
**Live interactive demo:** https://aydin-self.vercel.app/console

## Setup

```bash
npm install
cp .env.example .env.local   # add ANTHROPIC_API_KEY
npm run dev
```

The only required environment variable is `ANTHROPIC_API_KEY` (Claude Messages API, used for the tool-calling chat backend in `src/app/api/chat/route.ts`).

## How it works

The assistant reads a mock bill via a `get_bill` tool call, explains any suspicious recurring third-party charge in plain Azerbaijani, and — once the user confirms — calls `cancel_subscription` to actually cancel it. If more than one active subscription exists and the request is ambiguous, it asks which one before acting.

## Disclosure (mandatory, NeuroBridge.SI rules Section 5)

- **Models:** Claude Sonnet 5 (Anthropic Messages API) for the assistant; Claude Code as the AI coding assistant used to build this project.
- **Data:** synthetic mock bill fixtures only (`src/lib/mockBill.ts`) — no real customer data. Azercell's public AiCell statistics (96.6% comprehension / 17% resolution) are cited as motivation/benchmark in the pitch, not consumed by the app.
- **Components:** Next.js 16 + React 19 + TypeScript, Tailwind CSS v4, scaffolded via the public `create-next-app` template, deployed on Vercel. No other third-party AI libraries or SDKs — the Anthropic API is called directly over HTTP.

Full breakdown: [`docs/disclosure.md`](docs/disclosure.md).

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
