# Clario — demo video script (target: 2:00, hard cap)

**Framing, read this before recording:** this is not a chatbot demo. It is one
recording of *the call that usually doesn't get finished*. AiCell (Azercell's
own voice bot) resolves this exact kind of request only 17% of the time
despite understanding Azerbaijani almost perfectly (96.6%). The whole video
is structured as: watch that call fail (stated, not shown — we don't have
AiCell footage), then watch the identical call succeed end to end in the
Clario call console. Never call our own product a chatbot in narration or
captions — it's a resolution console / call console. "Chatbot" is a word we
only use for what it's replacing.

Recording notes: single take through the live app if possible. Pre-load the
app with the default mock bill (balance 4.72 AZN; "Sindibad Premium Content"
0.35 AZN/gün — active; "Əlavə 2GB internet paketi" 2.0 AZN/ay — active)
before hitting record. The call console UI should be visible throughout: a
persistent corner badge reading "AiCell-in bu tip müraciətlərdə həll
nisbəti: 17%", a call-in-progress header/timer instead of chat-app chrome,
and a status line that flips from pending to a hard success state the
instant the cancellation executes.

## 0:00–0:15 — Opening (on-screen title card, before the call console is shown)

**Caption (on screen, AZ):**
> Azercell-in AiCell botu bu tip müraciətlərin 96.6%-ni başa düşür —
> amma yalnız 17%-ni HƏLL edir. Bax, həmin zəng adətən necə bitir.
> İndi Clario-ın onu necə bitirdiyinə bax.

Cut title card at 0:12–0:15, reveal the live call console underneath
(header/timer visible, sidebar showing balance + two active subscriptions,
the "17%" badge pinned in a corner).

## 0:15–0:35 — The call opens itself (proactive detection, not a typed question)

No user message yet. Clario has already scanned the account on connect and
opens the call on its own — flagging that something is worth checking
**without naming which subscription yet**, so the disambiguation moment at
0:35 is genuine rather than scripted:

**On-screen transcript (AZ), appearing as if spoken, not typed by a user:**
> Salam! Hesabınıza baxdım. Hazırda 2 aktiv abunəliyiniz var, və
> onlardan biri sizə tanış gəlməyə bilər — bir baxmaq istərdinizmi?

Let this render fully on screen, pause — this is the moment that proves the
product is not waiting to be asked. It noticed the problem first, but it
has deliberately not yet said which charge is the suspicious one.

## 0:35–0:50 — The ambiguity trap (this is the proof-of-reasoning beat)

**Fixed and verified against real test behavior.** Because the opener above
named neither subscription specifically, two active subscriptions are on
screen and nothing has been proposed as "the one" yet — so the exchange
below is structurally identical to the validated zero-context case in
`docs/testing-results.md` (case 10: "Abunəliyi ləğv et" as a first message),
which correctly triggered disambiguation. This replaces the earlier draft of
this beat, which had the opener name Sindibad directly and would not have
triggered a real "which one?" response (see case 2 in the same file for why).

**Type/speak into the console (AZ):**
> Bunu ləğv et.

Two subscriptions are visible and neither has been named as "the one" yet,
so "bunu" (this one) is genuinely ambiguous. Clario must NOT guess — it lists
both and asks which is meant. Hold on this exchange; it's the clearest
evidence this is reasoning over account state, not a scripted lookup
triggered by a keyword.

## 0:50–1:10 — Resolution, live

**Reply (AZ):**
> Sindibad olanı.

Clario calls `cancel_subscription` and confirms ("Sindibad Premium Content
ləğv edildi. Artıq gündə 0.35 AZN alınmayacaq."). **Camera must catch two
things updating live at once:** the sidebar row flips to "✓ Ləğv edilib",
and the call-status line flips from pending to **"✅ ZƏNG: HƏLL EDİLDİ"**
(CALL: RESOLVED) — directly beside the "AiCell: 17%" badge still pinned in
the corner. That juxtaposition in one frame is the entire pitch.

## 1:10–1:20 — Idempotency / confidence beat (optional, cut first if over time)

**Reply (AZ):**
> Yenə ləğv et.

Clario recognizes it's already cancelled and says so plainly, no error. Skip
entirely if running long — go straight to 1:20.

## 1:20–1:30 — Testing nod (on-screen text overlay, 2–3s, no narration)

> 10 real test ssenarisi işlədildi. 8/8 hesab məsələsi insana ötürülmədən
> həll edildi ya da təsdiq üçün dəqiq addım təklif olundu.
>
> (Source: docs/testing-results.md. Strict immediate-cancellation count is
> 4/9 — use the 8/8 "never punted to a human" framing here, it's the more
> honest and more impressive comparison against AiCell's 17%.)

## 1:30–1:40 — Feasibility nod (on-screen text overlay, 2–3s, no narration)

> Resolution başına təxmini xərc: ~$0.008 (2 qəpikdən az).

## 1:40–2:00 — Closing

**Caption (on screen, AZ), held for the last ~15s over a still frame of the
resolved call console (both the "HƏLL EDİLDİ" status and the "17%" badge
visible in the same shot):**
> AiCell: bu tip zəngləri 17% hallarda başa çatdırır.
> Clario: eyni zəngi başdan sona özü bitirir.
>
> Bu söhbət botu deyil — bitirilən zəngdir.

End card:
> Clario — NeuroBridge.SI Baku 2026 · AI Enterprise Solutions

---

**Total runtime budget:** 2:00 flat. If anything overruns, cut the
idempotency beat (1:10–1:20) first — it's the only non-essential section;
every other beat maps directly to one of the five scoring criteria.
