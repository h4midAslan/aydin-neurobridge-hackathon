# Aydın — demo video script (target: 2:00, hard cap)

Recording notes: single take through the live app if possible. Pre-load the app
with the default mock bill (balance 4.72 AZN; "Sindibad Premium Content" 0.35
AZN/gün — active; "Əlavə 2GB internet paketi" 2.0 AZN/ay — active) before
hitting record. Type at a normal pace; don't rush the clarification beat, it's
the most important 10 seconds in the video.

## 0:00–0:15 — Opening (on-screen title card over the loaded app)

**Caption (on screen, AZ):**
> Azercell-in AiCell botu müraciətlərin 96.6%-ni başa düşür — amma yalnız
> 17%-ni HƏLL edir. Aydın qalan 83%-dən biri ilə başlayır: anlaşılmayan
> abunəlik haqları.

Cut title card at 0:12–0:15, reveal the live app underneath (sidebar visible:
balance + two active subscriptions).

## 0:15–0:30 — Vague opener

**Type into chat (AZ):**
> Niyə hesabımdan pul çıxır?

Let the "yazır…" indicator show briefly (proves it's a live call, not a
canned reply). Assistant calls `get_bill` and responds explaining **both**
charges — the Sindibad one flagged as a third-party/suspicious charge, the
2GB add-on identified as something the user activated themselves. Let the
full reply render on screen (pause here, don't talk over it — the judge
needs to read it).

## 0:30–0:45 — The ambiguity trap (this is the proof-of-reasoning beat)

**Type into chat (AZ):**
> Bunu ləğv et.

Assistant must NOT guess — it should ask which subscription is meant
(listing both by name). Hold on this exchange for a beat; this is the moment
that shows real reasoning instead of a scripted lookup, so don't cut away
quickly.

## 0:45–1:05 — Resolution, live

**Type into chat (AZ):**
> Sindibad olanı.

Assistant calls `cancel_subscription` and confirms in Azerbaijani (e.g.
"Sindibad Premium Content ləğv edildi. Artıq gündə 0.35 AZN alınmayacaq.").
**Camera must catch the sidebar update live** — the Sindibad row flips to
"✓ Ləğv edilib" the moment the tool executes. This single frame is the whole
pitch: the AI didn't explain, it resolved.

## 1:05–1:20 — Idempotency / confidence beat (optional if time allows, cut first if over)

**Type into chat (AZ):**
> Yenə ləğv et.

Assistant should recognize it's already cancelled and say so plainly,
without erroring. Shows the system is robust, not just a lucky happy path.
If running long, skip this beat entirely and go straight to 1:20.

## 1:20–1:30 — Testing nod (on-screen text overlay, 2–3s, no narration)

> [CONFIRM COUNT] real müştəri ifadəsi ilə sınaqdan keçirildi — bağlı,
> açıq-aydın, hətta danışıq dilində.

(Count to be filled once the Test Engineer's battery results land —
currently scoped as an 8-case battery.)

## 1:30–1:40 — Feasibility nod (on-screen text overlay, 2–3s, no narration)

> Resolution başına təxmini xərc: [INSERT FROM docs/submission.md
> FEASIBILITY SECTION]

## 1:40–2:00 — Closing

**Caption (on screen, AZ), held for the last ~15s over a still frame of the
resolved bill state:**
> AiCell: müraciətlərin 17%-ni həll edir.
> Aydın: eyni şikayəti başdan sona özü həll edir.

End card:
> Aydın — NeuroBridge.SI Baku 2026 · AI Enterprise Solutions

---

**Total runtime budget:** 2:00 flat. If anything overruns, cut the
idempotency beat (1:05–1:20) first — it's the only non-essential section;
every other beat maps directly to one of the five scoring criteria.
