"use client";

import { useEffect, useRef, useState } from "react";
import { initialBillState, type BillState } from "@/lib/mockBill";

type ChatMessage = { role: "user" | "assistant"; text: string; time: string };

const AICELL_RESOLUTION_NOTE = "AiCell-in bu tip hallarda həll dərəcəsi: 17%";

function formatElapsed(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function nowLabel() {
  return new Date().toLocaleTimeString("az-AZ", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function Home() {
  const [bill, setBill] = useState<BillState>(initialBillState());
  const [apiHistory, setApiHistory] = useState<unknown[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startedRef = useRef(false);

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
        const newlyCancelled = newBill.subscriptions.some(
          (s) =>
            s.status === "cancelled" &&
            billBefore.subscriptions.find((old) => old.id === s.id)?.status === "active"
        );
        if (newlyCancelled) setResolved(true);

        setMessages((m) => [...m, { role: "assistant", text: data.reply, time: nowLabel() }]);
      }
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: "Şəbəkə xətası baş verdi. Yenidən cəhd edin.",
          time: nowLabel(),
        },
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

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col md:flex-row">
      <aside className="w-full md:w-80 border-b md:border-b-0 md:border-r border-neutral-200 p-4 bg-white flex flex-col gap-4">
        <div>
          <h2 className="font-semibold text-lg mb-1">Aydın</h2>
          <p className="text-sm text-neutral-500">Zəng konsolu</p>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-xs">
          <div className="text-neutral-500 mb-1">Müqayisə üçün</div>
          <div className="font-medium">{AICELL_RESOLUTION_NOTE}</div>
        </div>

        <div>
          <div className="text-xs text-neutral-500">Balans</div>
          <div className="text-2xl font-semibold">{bill.balanceAzn.toFixed(2)} AZN</div>
        </div>

        <div>
          <div className="text-xs text-neutral-500 mb-2">Abunəliklər</div>
          <ul className="space-y-2">
            {bill.subscriptions.map((s) => (
              <li
                key={s.id}
                className={`rounded-lg border p-3 ${
                  s.status === "cancelled"
                    ? "border-neutral-200 bg-neutral-100 opacity-60"
                    : "border-amber-200 bg-amber-50"
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-medium text-sm">{s.name}</span>
                  <span className="text-sm whitespace-nowrap">
                    {s.amountAzn} AZN/{s.period === "daily" ? "gün" : "ay"}
                  </span>
                </div>
                <div className="text-xs text-neutral-500 mt-1">{s.description}</div>
                <div className="mt-1 text-xs font-medium">
                  {s.status === "cancelled" ? "✓ Ləğv edilib" : "Aktiv"}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <div className="border-b border-neutral-200 bg-white px-4 py-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`inline-block h-2.5 w-2.5 rounded-full ${
                resolved ? "bg-neutral-300" : "bg-red-500 animate-pulse"
              }`}
            />
            <span className="text-sm font-medium tracking-wide">
              {resolved ? "ZƏNG BİTDİ" : "ZƏNG DAVAM EDİR"}
            </span>
            <span className="text-sm text-neutral-400">· {formatElapsed(elapsed)}</span>
          </div>
          <div
            className={`text-sm font-semibold rounded-full px-3 py-1 ${
              resolved ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-500"
            }`}
          >
            {resolved ? "✅ ZƏNG: HƏLL EDİLDİ — Aydın" : "ZƏNG: HƏLL EDİLMƏYİB"}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-sm">
          {messages.map((m, i) => (
            <div key={i} className="leading-snug">
              <span className="text-neutral-400 mr-2">{m.time}</span>
              <span
                className={`font-semibold mr-1 ${
                  m.role === "user" ? "text-neutral-900" : "text-sky-700"
                }`}
              >
                {m.role === "user" ? "Müştəri:" : "Aydın:"}
              </span>
              <span>{m.text}</span>
            </div>
          ))}
          {loading && (
            <div className="text-neutral-400 font-mono text-sm">Aydın yazır…</div>
          )}
        </div>

        <div className="p-4 border-t border-neutral-200 bg-white flex gap-2">
          <input
            className="flex-1 rounded-full border border-neutral-300 px-4 py-2 outline-none focus:border-neutral-500"
            placeholder="Mesajınızı yazın…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button
            onClick={send}
            disabled={loading}
            className="rounded-full bg-neutral-900 text-white px-5 py-2 disabled:opacity-40"
          >
            Göndər
          </button>
        </div>
      </main>
    </div>
  );
}
