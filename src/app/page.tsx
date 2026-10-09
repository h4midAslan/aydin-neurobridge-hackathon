"use client";

import { useState } from "react";
import { initialBillState, type BillState } from "@/lib/mockBill";

type ChatMessage = { role: "user" | "assistant"; text: string };

export default function Home() {
  const [bill, setBill] = useState<BillState>(initialBillState());
  const [apiHistory, setApiHistory] = useState<unknown[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Salam! Mən Aydın-am, hesabınızla bağlı köməkçiyəm. Balans və ya abunəliklərlə bağlı sualınız var?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", text: userText }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: userText, history: apiHistory, bill }),
      });
      const data = await res.json();

      if (data.error) {
        setMessages((m) => [...m, { role: "assistant", text: "Xəta: " + data.error }]);
      } else {
        setApiHistory(data.history);
        setBill(data.bill);
        setMessages((m) => [...m, { role: "assistant", text: data.reply }]);
      }
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "Şəbəkə xətası baş verdi. Yenidən cəhd edin." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col md:flex-row">
      <aside className="w-full md:w-80 border-b md:border-b-0 md:border-r border-neutral-200 p-4 bg-white">
        <h2 className="font-semibold text-lg mb-1">Aydın</h2>
        <p className="text-sm text-neutral-500 mb-4">Hesab icmalı</p>

        <div className="mb-4">
          <div className="text-xs text-neutral-500">Balans</div>
          <div className="text-2xl font-semibold">{bill.balanceAzn.toFixed(2)} AZN</div>
        </div>

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
      </aside>

      <main className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-xl rounded-2xl px-4 py-2 ${
                m.role === "user"
                  ? "bg-neutral-900 text-white ml-auto"
                  : "bg-white border border-neutral-200"
              }`}
            >
              {m.text}
            </div>
          ))}
          {loading && (
            <div className="max-w-xl rounded-2xl px-4 py-2 bg-white border border-neutral-200 text-neutral-400">
              yazır…
            </div>
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
