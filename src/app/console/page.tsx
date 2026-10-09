"use client";

import { useEffect, useRef, useState } from "react";
import { initialBillState, type BillState, type Subscription } from "@/lib/mockBill";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
  time: string;
};

type Mood = "idle" | "attentive" | "resolved";
type OrbSize = "sm" | "lg";
type Tab = "account" | "chat";

const PROACTIVE_TRIGGER =
  "[SİSTEM: istifadəçi tətbiqi indicə açdı. Hesabı skan et (get_bill çağır) və diqqəti çəkən məqamı özün, soruşulmadan, bildir.]";

const azn = (n: number) => n.toFixed(2);
const mmss = (t: number) =>
  `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
const nowTime = () => new Date().toLocaleTimeString("az-AZ", { hour: "2-digit", minute: "2-digit" });

/* ------------------------------------------------------------------ */
/* The character — the only place glow is used                         */
/* ------------------------------------------------------------------ */

const ORB_CSS = `
.aydin-orb{position:relative;display:inline-block;isolation:isolate}
.aydin-halo,.aydin-core,.aydin-ring{position:absolute;border-radius:9999px;pointer-events:none}
.aydin-halo{inset:-70%;z-index:-1;
  background:radial-gradient(circle,rgba(245,183,58,.5) 0%,rgba(245,183,58,.18) 36%,rgba(245,183,58,0) 68%)}
.aydin-orb[data-size="lg"] .aydin-halo{inset:-50%}
.aydin-core{inset:0;
  background:radial-gradient(circle at 38% 32%,#fff6d9 0%,#ffd36b 38%,#f5b73a 74%,#e09a14 100%);
  box-shadow:0 0 16px 2px rgba(245,183,58,.5)}
.aydin-ring{inset:0;border:1px solid rgba(245,183,58,.6);opacity:0}

.aydin-orb[data-mood="idle"] .aydin-halo{animation:aydin-halo-idle 6.5s ease-in-out infinite}
.aydin-orb[data-mood="idle"] .aydin-core{animation:aydin-core-idle 6.5s ease-in-out infinite}
@keyframes aydin-halo-idle{0%,100%{transform:scale(.9);opacity:.6}50%{transform:scale(1.08);opacity:1}}
@keyframes aydin-core-idle{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}

.aydin-orb[data-mood="attentive"] .aydin-halo{animation:aydin-halo-attn 3.6s ease-in-out infinite}
.aydin-orb[data-mood="attentive"] .aydin-core{animation:aydin-core-attn 3.6s ease-in-out infinite}
.aydin-orb[data-mood="attentive"] .aydin-ring{animation:aydin-ring-in 3.6s ease-out infinite}
@keyframes aydin-halo-attn{0%,100%{transform:scale(.7);opacity:.85}50%{transform:scale(.8);opacity:1}}
@keyframes aydin-core-attn{
  0%,100%{transform:translateY(0) scale(1);filter:brightness(1.02) saturate(1.05);box-shadow:0 0 10px 3px rgba(245,183,58,.6)}
  50%{transform:translateY(-1.5px) scale(1.035);filter:brightness(1.1) saturate(1.15);box-shadow:0 0 12px 4px rgba(245,183,58,.75)}}
@keyframes aydin-ring-in{0%{transform:scale(2);opacity:0}35%{opacity:.55}100%{transform:scale(1.05);opacity:0}}

.aydin-orb[data-mood="resolved"] .aydin-halo{
  animation:aydin-halo-bloom 2.4s cubic-bezier(.2,.7,.2,1) 1,aydin-halo-idle 6.5s ease-in-out 2.4s infinite}
.aydin-orb[data-mood="resolved"] .aydin-core{
  animation:aydin-core-bloom 2.4s cubic-bezier(.2,.7,.2,1) 1,aydin-core-idle 6.5s ease-in-out 2.4s infinite}
.aydin-orb[data-mood="resolved"] .aydin-ring{animation:aydin-ring-out 2.4s ease-out 1}
@keyframes aydin-halo-bloom{0%{transform:scale(.9);opacity:.6}30%{transform:scale(2.3);opacity:1}100%{transform:scale(.9);opacity:.6}}
@keyframes aydin-core-bloom{
  0%{transform:scale(1);filter:brightness(1)}
  28%{transform:scale(1.32);filter:brightness(1.2)}
  100%{transform:scale(1);filter:brightness(1)}}
@keyframes aydin-ring-out{0%{transform:scale(1);opacity:.7}100%{transform:scale(3.4);opacity:0}}

@media (prefers-reduced-motion:reduce){
  .aydin-halo,.aydin-core,.aydin-ring{animation-duration:14s !important}
}
`;

function Orb({ mood, size }: { mood: Mood; size: OrbSize }) {
  return (
    <span
      className={`aydin-orb shrink-0 ${size === "lg" ? "size-16" : "size-8"}`}
      data-mood={mood}
      data-size={size}
      aria-hidden="true"
    >
      <span className="aydin-halo" />
      <span className="aydin-ring" />
      <span className="aydin-core" />
    </span>
  );
}

function CheckIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4.5 10.5l3.5 3.5 7.5-8" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 16V4M4.5 9.5L10 4l5.5 5.5" />
    </svg>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/* ------------------------------------------------------------------ */
/* One service in the feed                                             */
/* ------------------------------------------------------------------ */

function ServiceRow({ sub, onStop }: { sub: Subscription; onStop: () => void }) {
  const every = sub.period === "daily" ? "gündə" : "ayda";
  const stopped = sub.status === "cancelled";

  return (
    <li className="flex gap-3 border-b border-[#2f3336] px-4 py-5 sm:gap-4">
      <span
        className={`grid size-11 shrink-0 place-items-center rounded-full text-sm font-bold ${
          sub.suspicious && !stopped
            ? "bg-[#f5b73a] text-black"
            : "bg-[#16181c] text-[#e7e9ea] ring-1 ring-[#2f3336]"
        }`}
        aria-hidden="true"
      >
        {initials(sub.name)}
      </span>

      <div className="min-w-0 flex-1">
        {sub.suspicious && (
          <p className="mb-1 flex items-center gap-2 text-sm font-bold text-[#f5b73a]">
            {stopped ? (
              <>
                <CheckIcon className="size-4" /> Dayandırıldı
              </>
            ) : (
              <>
                <span className="size-2 animate-pulse rounded-full bg-[#f5b73a]" /> Naməlum tutum
              </>
            )}
          </p>
        )}
        <div className="flex items-baseline justify-between gap-3">
          <p className={`truncate text-lg font-bold leading-snug ${stopped ? "text-[#8a9096]" : "text-white"}`}>
            {sub.name}
          </p>
          <p className={`shrink-0 text-lg font-bold tabular-nums ${stopped ? "text-[#8a9096] line-through" : "text-white"}`}>
            ₼{azn(sub.amountAzn)}
            <span className="ml-1 text-sm font-normal text-[#8a9096]">/{every}</span>
          </p>
        </div>
        <p className="mt-1 text-base leading-relaxed text-[#8a9096]">{sub.description}</p>

        {sub.suspicious && !stopped && (
          <>
            <p className="mt-3 text-base leading-relaxed text-[#e7e9ea]">
              Ətraflı izahı söhbətdə tapa bilərsiniz.
            </p>
            <button
              type="button"
              onClick={onStop}
              className="mt-4 min-h-11 rounded-full bg-[#f5b73a] px-6 text-base font-bold text-black transition hover:bg-[#ffc757] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Bu tutumu dayandır
            </button>
          </>
        )}
        {sub.suspicious && stopped && (
          <p className="mt-3 text-base text-[#e7e9ea]">
            Artıq tutulmayacaq. ₼{azn(sub.refundedAzn ?? 0)} geri qaytarıldı.
          </p>
        )}
      </div>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* The component                                                       */
/* ------------------------------------------------------------------ */

export default function AydinConsole() {
  const [bill, setBill] = useState<BillState>(initialBillState());
  const [apiHistory, setApiHistory] = useState<unknown[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [resolved, setResolved] = useState<boolean>(false);
  const [elapsed, setElapsed] = useState<number>(0);
  const [input, setInput] = useState<string>("");

  const [noticed, setNoticed] = useState<boolean>(false);
  const [bloom, setBloom] = useState<boolean>(false);
  const [tab, setTab] = useState<Tab>("account");
  const [unread, setUnread] = useState<boolean>(false);
  const [shownBalance, setShownBalance] = useState<number>(() => initialBillState().balanceAzn);

  const shownRef = useRef<number>(bill.balanceAzn);
  const scrollRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  const say = (text: string) =>
    setMessages((m) => [...m, { role: "assistant", text, time: nowTime() }]);

  async function runTurn(messageText: string, opts: { visible: boolean }) {
    const billBefore = bill;
    if (opts.visible) {
      setMessages((m) => [...m, { role: "user", text: messageText, time: nowTime() }]);
    }
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: messageText, history: apiHistory, bill }),
      });
      const data = await res.json();

      if (data.error) {
        console.error(data.error);
        say("Üzr istəyirəm, bunu indi həll edə bilmədim. Zəhmət olmasa bir daha cəhd edin.");
        return;
      }

      setApiHistory(data.history);
      setBill(data.bill);

      const newBill = data.bill as BillState;
      const newlyCancelled = newBill.subscriptions.find(
        (s) =>
          s.status === "cancelled" &&
          billBefore.subscriptions.find((old) => old.id === s.id)?.status === "active"
      );
      if (newlyCancelled) {
        setResolved(true);
        setBloom(true);
        setTab("account");
      }

      setNoticed(true);
      say(data.reply);
    } catch {
      say("Şəbəkə xətası baş verdi. Yenidən cəhd edin.");
    } finally {
      setLoading(false);
    }
  }

  /* Aydın notices the charge on its own — a real, silent scan turn. */
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    runTurn(PROACTIVE_TRIGGER, { visible: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (resolved) return;
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [resolved]);

  useEffect(() => {
    const from = shownRef.current;
    const to = bill.balanceAzn;
    if (from === to) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1400);
      const v = from + (to - from) * (1 - Math.pow(1 - p, 3));
      shownRef.current = v;
      setShownBalance(v);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [bill.balanceAzn]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, loading, tab]);

  useEffect(() => {
    if (tab !== "chat" && messages.length > 0 && messages[messages.length - 1].role === "assistant") setUnread(true);
  }, [messages, tab]);

  useEffect(() => {
    if (tab === "chat") setUnread(false);
  }, [tab]);

  useEffect(() => {
    if (!bloom) return;
    const id = setTimeout(() => setBloom(false), 2600);
    return () => clearTimeout(id);
  }, [bloom]);

  function onSend(text: string) {
    const clean = text.trim();
    if (!clean || loading) return;
    setInput("");
    runTurn(clean, { visible: true });
  }

  const handleSend = () => onSend(input);
  const stopCharge = (sub: Subscription) => {
    setTab("chat");
    onSend(`Bəli, ${sub.name} xidmətini ləğv et və son 7 gün üçün tutulan pulu da geri qaytar.`);
  };

  const flaggedSub = bill.subscriptions.find((s) => s.suspicious);
  const mood: Mood = bloom ? "resolved" : noticed && !resolved ? "attentive" : "idle";
  const status = resolved
    ? "Hər şey həll olundu"
    : noticed
    ? "Diqqət çəkən bir şey tapdım"
    : "Hesabınıza baxıram…";
  const lastIsAssistant = messages.length > 0 && messages[messages.length - 1].role === "assistant";
  const showChips = noticed && !resolved && !loading && lastIsAssistant;
  const askedAlready = messages.some((m) => m.role === "user");
  const canSend = input.trim().length > 0 && !loading;

  return (
    <main className="min-h-dvh overflow-x-clip bg-black font-[family-name:var(--font-geist-sans)] text-[#e7e9ea] antialiased">
      <style>{ORB_CSS}</style>

      <div className="mx-auto grid min-h-dvh w-full max-w-5xl lg:grid-cols-[minmax(0,1fr)_24rem] lg:border-x lg:border-[#2f3336]">
        {/* ============ Account feed ============ */}
        <div className={`${tab === "account" ? "block" : "hidden"} pb-20 lg:block lg:pb-0`}>
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-3 border-b border-[#2f3336] bg-black px-4">
            <div className="flex min-w-0 items-center gap-4">
              <Orb mood={mood} size="sm" />
              <div className="min-w-0">
                <h1 className="text-xl font-extrabold leading-none tracking-tight text-white">Aydın</h1>
                <p className="mt-1 truncate text-sm text-[#8a9096]" aria-live="polite">{status}</p>
              </div>
            </div>
            <p className="shrink-0 text-sm tabular-nums text-[#8a9096]">
              {resolved ? "Həll olundu — " : ""}
              <span className="font-bold text-white">{mmss(elapsed)}</span>
            </p>
          </header>

          {resolved && flaggedSub && (
            <section
              aria-label="Nə edildi"
              className="border-b border-[#2f3336] px-4 py-8 transition duration-700 ease-out starting:translate-y-3 starting:opacity-0"
            >
              <div className="flex items-center gap-6">
                <div className="p-2">
                  <Orb mood={mood} size="lg" />
                </div>
                <h2 className="text-4xl font-extrabold leading-none tracking-tight text-white sm:text-5xl">
                  Hər şey həll olundu.
                </h2>
              </div>
              <ul className="mt-8 grid gap-0 border-t border-[#2f3336]">
                <li className="flex items-start gap-4 border-b border-[#2f3336] py-5 transition duration-700 delay-500 starting:opacity-0">
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-[#f5b73a] text-black">
                    <CheckIcon className="size-4" />
                  </span>
                  <div>
                    <p className="text-xl font-bold text-white">Tutum dayandırıldı</p>
                    <p className="mt-1 text-base leading-relaxed text-[#8a9096]">
                      {flaggedSub.name} artıq {flaggedSub.period === "daily" ? "gündə" : "ayda"} ₼
                      {azn(flaggedSub.amountAzn)} çəkə bilməyəcək.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4 border-b border-[#2f3336] py-5 transition duration-700 delay-1000 starting:opacity-0">
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-[#f5b73a] text-black">
                    <CheckIcon className="size-4" />
                  </span>
                  <div>
                    <p className="text-xl font-bold text-white">₼{azn(flaggedSub.refundedAzn ?? 0)} geri qaytarıldı</p>
                    <p className="mt-1 text-base leading-relaxed text-[#8a9096]">Artıq hesabınızdadır.</p>
                  </div>
                </li>
              </ul>
              <p className="mt-5 text-base text-[#8a9096]">Zəng etməyə ehtiyac olmadı.</p>
            </section>
          )}

          <section aria-label="Hesabınız" className="border-b border-[#2f3336] px-4 py-8">
            <p className="text-base text-[#8a9096]">Hesabınızdakı pul</p>
            <p className="mt-2 text-6xl font-extrabold leading-none tracking-tight tabular-nums text-white sm:text-7xl">
              ₼{azn(shownBalance)}
            </p>
          </section>

          <section aria-label="Xidmətləriniz">
            <h2 className="border-b border-[#2f3336] px-4 py-4 text-xl font-extrabold text-white">Xidmətləriniz</h2>
            <ul>
              {bill.subscriptions.map((s) => (
                <ServiceRow key={s.id} sub={s} onStop={() => stopCharge(s)} />
              ))}
            </ul>
          </section>
        </div>

        {/* ============ Conversation ============ */}
        <section
          aria-label="Söhbət"
          className={`${tab === "chat" ? "flex" : "hidden"} h-dvh flex-col pb-16 lg:sticky lg:top-0 lg:flex lg:border-l lg:border-[#2f3336] lg:pb-0`}
        >
          <h2 className="flex h-16 shrink-0 items-center border-b border-[#2f3336] px-4 text-xl font-extrabold text-white">
            Söhbət
          </h2>

          <div ref={scrollRef} className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 py-6">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex flex-col gap-1.5 transition duration-500 starting:translate-y-2 starting:opacity-0 ${
                  m.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[88%] rounded-3xl px-4 py-3 text-[17px] leading-relaxed ${
                    m.role === "user"
                      ? "rounded-br-md bg-[#e7e9ea] text-black"
                      : "rounded-bl-md bg-[#16181c] text-[#e7e9ea]"
                  }`}
                >
                  {m.text}
                </div>
                <span className="px-2 text-sm tabular-nums text-[#8a9096]">{m.time}</span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-3 px-2 transition duration-500 starting:opacity-0" role="status">
                <span className="flex items-center gap-1.5" aria-hidden="true">
                  <span className="size-2 animate-pulse rounded-full bg-[#8a9096]" />
                  <span className="size-2 animate-pulse rounded-full bg-[#8a9096] [animation-delay:250ms]" />
                  <span className="size-2 animate-pulse rounded-full bg-[#8a9096] [animation-delay:500ms]" />
                </span>
                <span className="text-base text-[#8a9096]">
                  {messages.length === 0 ? "Aydın hesabınızı yoxlayır…" : "Aydın bunu həll edir…"}
                </span>
              </div>
            )}
          </div>

          <div className="shrink-0 border-t border-[#2f3336] p-3">
            {showChips && (
              <div className="mb-3 flex flex-wrap gap-2 transition duration-500 starting:translate-y-1 starting:opacity-0">
                <button
                  type="button"
                  onClick={() => onSend("Bəli, bunu ləğv et və son 7 gün üçün tutulan pulu da geri qaytar")}
                  className="min-h-11 rounded-full bg-[#f5b73a] px-5 text-base font-bold text-black transition hover:bg-[#ffc757] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Bəli, bunu həll et
                </button>
                {!askedAlready && (
                  <button
                    type="button"
                    onClick={() => onSend("Bu barədə daha ətraflı məlumat ver")}
                    className="min-h-11 rounded-full border border-[#536471] px-5 text-base font-bold text-white transition hover:bg-[#16181c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    Əvvəlcə ətraflı izah et
                  </button>
                )}
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Cavabınızı yazın"
                aria-label="Cavabınız"
                className="min-h-12 min-w-0 flex-1 rounded-full bg-[#202327] px-5 text-base text-white outline-none placeholder:text-[#8a9096] focus:ring-2 focus:ring-[#f5b73a]"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!canSend}
                aria-label="Göndər"
                className="grid size-12 shrink-0 place-items-center rounded-full bg-[#f5b73a] text-black transition hover:bg-[#ffc757] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:bg-[#2f3336] disabled:text-[#8a9096]"
              >
                <SendIcon />
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Phone / tablet: two tabs along the bottom */}
      <nav
        aria-label="Bölmələr"
        className="fixed inset-x-0 bottom-0 z-20 grid h-16 grid-cols-2 border-t border-[#2f3336] bg-black lg:hidden"
      >
        {(["account", "chat"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            aria-current={tab === t ? "page" : undefined}
            className={`relative text-base font-bold transition ${tab === t ? "text-white" : "text-[#8a9096]"}`}
          >
            <span className="relative inline-block">
              {t === "account" ? "Hesab" : "Söhbət"}
              {t === "chat" && unread && (
                <span className="absolute -right-3 top-0 size-2 rounded-full bg-[#f5b73a]" />
              )}
            </span>
            {tab === t && <span className="absolute inset-x-1/3 bottom-0 h-1 rounded-full bg-[#f5b73a]" />}
          </button>
        ))}
      </nav>
    </main>
  );
}
