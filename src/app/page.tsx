"use client";

import { useEffect, useRef, useState } from "react";
import { initialBillState, type BillState, type Subscription } from "@/lib/mockBill";

type ChatMessage = { role: "user" | "assistant"; text: string; time: string };

type ResolvedEvent = {
  subscription: Subscription;
  refundedAzn: number;
  reference: string;
  timestamp: string;
};

const AICELL_NOTE = "ƏNƏNƏVİ IVR: 17% HƏLL DƏRƏCƏSİ  |  AYDIN: CANLI AVTO-HƏLL";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function formatElapsed(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${pad(m)}:${pad(s)}`;
}

function nowLabel() {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function fullTimestamp() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function SystemIcon() {
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-[#153226] text-[10px] font-bold text-[#22E6A6] shrink-0">
      {">_"}
    </span>
  );
}

function UserIcon() {
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-neutral-600 text-[10px] text-neutral-400 shrink-0">
      ●
    </span>
  );
}

export default function Home() {
  const [bill, setBill] = useState<BillState>(initialBillState());
  const [apiHistory, setApiHistory] = useState<unknown[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [resolvedEvent, setResolvedEvent] = useState<ResolvedEvent | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const startedRef = useRef(false);

  const [accountId, setAccountId] = useState("------");

  useEffect(() => {
    setAccountId("AZ-" + Math.floor(100000 + Math.random() * 900000));
  }, []);

  useEffect(() => {
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    runTurn(
      "[SİSTEM: istifadəçi tətbiqi indicə açdı. Hesabı skan et (get_bill çağır) və diqqəti çəkən məqamı özün, soruşulmadan, bildir.]",
      { visible: false }
    );
  }, []);

  async function runTurn(messageText: string, opts: { visible: boolean } = { visible: true }) {
    if (loading) return;
    const billBefore = bill;

    if (opts.visible) {
      setMessages((m) => [...m, { role: "user", text: messageText, time: nowLabel() }]);
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
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            text: "Üzr istəyirəm, bunu indi həll edə bilmədim. Zəhmət olmasa bir daha cəhd edin.",
            time: nowLabel(),
          },
        ]);
      } else {
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
          setResolvedEvent({
            subscription: newlyCancelled,
            refundedAzn: newlyCancelled.refundedAzn ?? 0,
            reference: "REF-" + fullTimestamp().replace(/[-: ]/g, "").slice(0, 14),
            timestamp: fullTimestamp(),
          });
        }

        setMessages((m) => [...m, { role: "assistant", text: data.reply, time: nowLabel() }]);
      }
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "Şəbəkə xətası baş verdi. Yenidən cəhd edin.", time: nowLabel() },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function send() {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput("");
    runTurn(text, { visible: true });
  }

  function executeRefundAndCancel(sub: Subscription) {
    if (loading) return;
    runTurn(
      `Bəli, ${sub.name} abunəliyini ləğv et və son 7 gün üçün tutulan pulu da geri qaytar.`,
      { visible: true }
    );
  }

  const flaggedSub = bill.subscriptions.find((s) => s.suspicious && s.status === "active");

  return (
    <div className="min-h-screen bg-[#07080A] text-neutral-200 [font-family:var(--font-geist-mono)] text-sm">
      {/* Header */}
      <header className="flex flex-col gap-3 border-b border-neutral-800 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-base font-bold tracking-wide text-white">
            AYDIN // TELEKOM MÜBAHİSƏ KONSOLU
          </span>
          <span className="flex items-center gap-2 text-[#22E6A6]">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                resolved ? "bg-[#22E6A6]" : "bg-[#22E6A6] animate-pulse"
              }`}
            />
            {resolved ? "ZƏNG TAMAMLANDI" : "CANLI ZƏNG QOŞULUB"} — {formatElapsed(elapsed)}
          </span>
        </div>
        <div className="rounded border border-[#F5B301]/60 px-3 py-1.5 text-xs font-semibold tracking-wide text-[#F5B301] whitespace-nowrap">
          {AICELL_NOTE}
        </div>
      </header>

      {/* Three-column console */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-neutral-800">
        {/* Column 1 — Account overview */}
        <section className="bg-[#07080A] p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span className="font-semibold tracking-wide text-neutral-300">HESAB BAXIŞI</span>
            <span>#{accountId}</span>
          </div>

          <div>
            <div className="text-xs text-neutral-500">HESAB BALANSI:</div>
            <div className="text-2xl font-bold text-white">{bill.balanceAzn.toFixed(2)} AZN</div>
          </div>

          <div className="border-t border-neutral-800 pt-3 flex flex-col gap-3">
            {flaggedSub && (
              <div className="border border-[#FF5C5C]/70 rounded-md p-3 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[#FF5C5C] font-semibold text-xs">
                  <span>⚠</span> İCAZƏSİZ TUTUM AŞKARLANDI
                </div>
                <div className="text-sm text-white">
                  {flaggedSub.name}: {flaggedSub.amountAzn} AZN/
                  {flaggedSub.period === "daily" ? "gün" : "ay"} (Təkrarlanan)
                </div>
                <div className="text-xs text-neutral-500 flex flex-col gap-0.5">
                  <span>XİDMƏT ID: {flaggedSub.serviceId ?? flaggedSub.id}</span>
                  <span>STATUS: Aktiv (İcazəsiz)</span>
                </div>
                <button
                  onClick={() => executeRefundAndCancel(flaggedSub)}
                  disabled={loading}
                  className="mt-1 w-full rounded bg-[#22E6A6] px-3 py-2 text-xs font-bold text-black tracking-wide disabled:opacity-40"
                >
                  [ LƏĞV ET VƏ PULU QAYTAR ]
                </button>
              </div>
            )}

            {bill.subscriptions
              .filter((s) => !s.suspicious)
              .map((s) => (
                <div
                  key={s.id}
                  className={`rounded-md border p-3 text-xs ${
                    s.status === "cancelled"
                      ? "border-neutral-800 text-neutral-500"
                      : "border-neutral-700 text-neutral-300"
                  }`}
                >
                  <div className="flex justify-between">
                    <span>{s.name}</span>
                    <span>
                      {s.amountAzn} AZN/{s.period === "daily" ? "gün" : "ay"}
                    </span>
                  </div>
                  <div className="text-neutral-600 mt-1">
                    {s.status === "cancelled" ? "Ləğv edilib" : "Aktiv · qanuni"}
                  </div>
                </div>
              ))}

            {bill.subscriptions
              .filter((s) => s.suspicious && s.status === "cancelled")
              .map((s) => (
                <div key={s.id} className="rounded-md border border-neutral-800 p-3 text-xs text-neutral-500">
                  <div className="flex justify-between">
                    <span>{s.name}</span>
                    <span>Ləğv edilib</span>
                  </div>
                  {s.refundedAzn ? (
                    <div className="text-[#22E6A6] mt-1">+{s.refundedAzn.toFixed(2)} AZN geri qaytarıldı</div>
                  ) : null}
                </div>
              ))}
          </div>
        </section>

        {/* Column 2 — Live transcript */}
        <section className="bg-[#07080A] p-4 flex flex-col gap-3 min-h-[360px]">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span className="font-semibold tracking-wide text-neutral-300">CANLI ZƏNG TRANSKRİPTİ</span>
            <span>ZƏNG #{accountId}</span>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-3 max-h-[480px]">
            {messages.map((m, i) => (
              <div key={i} className="flex gap-2 items-start">
                {m.role === "assistant" ? <SystemIcon /> : <UserIcon />}
                <div className="flex-1">
                  <div className="text-[10px] text-[#38BDF8]">
                    [{m.time}] <span className="text-neutral-400">{m.role === "assistant" ? "AYDIN:" : "MÜŞTƏRİ:"}</span>
                  </div>
                  <div className="text-neutral-200 leading-snug">{m.text}</div>
                </div>
              </div>
            ))}
            {loading && <div className="text-neutral-500 text-xs pl-7">Aydın yazır…</div>}
          </div>

          <div className="pt-3 border-t border-neutral-800 flex gap-2">
            <input
              className="flex-1 rounded border border-neutral-700 bg-[#0B0D0F] px-3 py-2 text-sm text-white outline-none focus:border-neutral-500"
              placeholder="Mesajınızı yazın…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button
              onClick={send}
              disabled={loading}
              className="rounded bg-neutral-100 px-4 py-2 text-xs font-bold text-black disabled:opacity-40"
            >
              GÖNDƏR
            </button>
          </div>
        </section>

        {/* Column 3 — Execution ledger */}
        <section className="bg-[#07080A] p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span className="font-semibold tracking-wide text-neutral-300">İCRA JURNALI</span>
            <span className={resolved ? "text-[#22E6A6]" : "text-[#F5B301]"}>
              {resolved ? "HƏLL EDİLDİ" : "GÖZLƏYİR"}
            </span>
          </div>

          {!resolved && (
            <div className="rounded-md border border-neutral-800 p-4 text-xs text-neutral-500">
              Hələ heç bir əməliyyat icra olunmayıb. Şübhəli tutum aşkarlandıqda, təsdiqdən sonra
              burada canlı qeyd olunacaq.
            </div>
          )}

          {resolved && resolvedEvent && (
            <>
              <div className="flex items-center gap-2 rounded bg-[#22E6A6] px-3 py-2 font-bold text-black text-xs">
                <span>✓</span> [ STATUS: MÜBAHİSƏ HƏLL EDİLDİ ]
              </div>

              <div className="text-xs font-semibold tracking-wide text-neutral-400">
                ƏMƏLİYYAT TƏFƏRRÜATI
              </div>

              {resolvedEvent.refundedAzn > 0 && (
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#153226] text-[#22E6A6]">
                    ✓
                  </span>
                  <div>
                    <div className="text-lg font-bold text-[#22E6A6]">
                      +{resolvedEvent.refundedAzn.toFixed(2)} AZN
                    </div>
                    <div className="text-[10px] text-neutral-500">BALANSA KEÇİRİLDİ</div>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1.5 text-xs">
                <div className="flex justify-between text-neutral-500">
                  <span>TİP:</span>
                  <span className="text-neutral-200">
                    {resolvedEvent.refundedAzn > 0 ? "Ləğv + Geri Qaytarma (Avto-Həll)" : "Ləğv edilmə (Avto-Həll)"}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>XİDMƏT:</span>
                  <span className="text-neutral-200">{resolvedEvent.subscription.name}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>İSTİNAD:</span>
                  <span className="text-neutral-200">{resolvedEvent.reference}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>VAXT:</span>
                  <span className="text-neutral-200">{resolvedEvent.timestamp}</span>
                </div>
              </div>

              <div className="rounded-md border border-neutral-800 p-3 flex items-start gap-2">
                <span className="text-[#22E6A6]">✓</span>
                <div>
                  <div className="text-xs font-semibold text-neutral-200">
                    MÜBAHİSƏ BAĞLANDI — {resolvedEvent.timestamp}
                  </div>
                  <div className="text-xs text-neutral-500 mt-0.5">
                    Müştəriyə pul qaytarıldı. Abunəlik ləğv edildi.
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
