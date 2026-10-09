# Aydın

An AI assistant that **resolves** unwanted recurring subscription charges end-to-end, in Azerbaijani — not just explains them. Built for NeuroBridge.SI Baku 2026 (AI Enterprise Solutions track).

**Live demo:** https://aydin-self.vercel.app

## Setup

```bash
npm install
cp .env.example .env.local   # add ANTHROPIC_API_KEY
npm run dev
```

The only required environment variable is `ANTHROPIC_API_KEY` (Claude Messages API, used for the tool-calling chat backend in `src/app/api/chat/route.ts`).

## How it works

The assistant reads a mock bill via a `get_bill` tool call, explains any suspicious recurring third-party charge in plain Azerbaijani, and — once the user confirms — calls `cancel_subscription` to actually cancel it. If more than one active subscription exists and the request is ambiguous, it asks which one before acting.

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
