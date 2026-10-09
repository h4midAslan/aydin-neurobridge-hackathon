// Quality-testing battery for "Aydın" — run with:
//   npm run dev   (in one terminal)
//   node scripts/test-battery.mjs   (in another, once ANTHROPIC_API_KEY is set in .env.local)
//
// Mirrors exactly how src/app/page.tsx talks to /api/chat: each turn sends
// { message, history, bill } and must reuse the `history` and `bill` returned
// by the previous turn to keep conversation + mock-backend state consistent.

const BASE_URL = process.env.AYDIN_BASE_URL || "http://localhost:3000";

// Must mirror src/lib/mockBill.ts -> initialBillState(). Duplicated here (not
// imported) so this script stays plain Node with no TS/build step required.
function freshBill() {
  return {
    userId: "demo-user-1",
    balanceAzn: 4.72,
    subscriptions: [
      {
        id: "sub-sindibad-content",
        name: "Sindibad Premium Content",
        amountAzn: 0.35,
        period: "daily",
        status: "active",
        description:
          "Üçüncü tərəf məzmun xidməti (oyun/əyləncə). Adətən bir SMS linkinə klik və ya kampaniyaya qoşulma zamanı aktivləşir.",
      },
      {
        id: "sub-data-addon",
        name: "Əlavə 2GB internet paketi",
        amountAzn: 2.0,
        period: "monthly",
        status: "active",
        description: "İstifadəçinin özü aktivləşdirdiyi əlavə data paketi.",
      },
    ],
  };
}

async function send(message, history, bill) {
  const res = await fetch(`${BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ message, history, bill }),
  });
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(`HTTP ${res.status}: ${data.error || JSON.stringify(data)}`);
  }
  return data; // { reply, history, bill }
}

function log(label, message, data) {
  console.log(`\n=== ${label} ===`);
  console.log("USER:", message);
  console.log("REPLY:", data.reply);
  console.log(
    "BILL:",
    data.bill.subscriptions.map((s) => `${s.name}:${s.status}`).join(", ")
  );
}

async function run() {
  // --- Group A: conversation continuity + ambiguous cancel + clarification ---
  let history = [];
  let bill = freshBill();

  let r = await send("Niyə hesabımdan pul çıxır?", history, bill);
  log("1: vague opener", "Niyə hesabımdan pul çıxır?", r);
  history = r.history;
  bill = r.bill;

  r = await send("Bunu ləğv et", history, bill);
  log("2: AMBIGUOUS cancel (2 active subs) — must ask which one", "Bunu ləğv et", r);
  history = r.history;
  bill = r.bill;

  r = await send("Sindibad olanı", history, bill);
  log("3: answers the clarification", "Sindibad olanı", r);

  // --- Group B: legitimate charge, must NOT be treated as suspicious ---
  r = await send("Data paketini nə üçün ödəyirəm?", [], freshBill());
  log("4: legitimate charge — fresh convo", "Data paketini nə üçün ödəyirəm?", r);

  // --- Group C: direct named cancel + idempotency ---
  let h2 = [];
  let b2 = freshBill();
  r = await send("Sindibad xidmətini ləğv et", h2, b2);
  log("5: direct named cancel — fresh convo", "Sindibad xidmətini ləğv et", r);
  h2 = r.history;
  b2 = r.bill;

  r = await send("Sindibad xidmətini ləğv et", h2, b2);
  log("6: cancel SAME sub again — idempotency check", "Sindibad xidmətini ləğv et", r);

  // --- Group D: off-topic small talk ---
  r = await send("Salam, necəsən?", [], freshBill());
  log("7: off-topic small talk", "Salam, necəsən?", r);

  // --- Group E: slang / colloquial NLU ---
  r = await send("bu pulu kim yeyir?", [], freshBill());
  log("8: colloquial complaint", "bu pulu kim yeyir?", r);

  // --- Group F: proactive opening trigger (page.tsx mount behavior) ---
  const openerMsg =
    "[SİSTEM: istifadəçi tətbiqi indicə açdı. Hesabı skan et (get_bill çağır) və diqqəti çəkən məqamı özün, soruşulmadan, bildir.]";
  r = await send(openerMsg, [], freshBill());
  log("9: proactive opener (synthetic mount trigger)", openerMsg, r);

  console.log("\nAll 9 cases ran. Copy the transcripts above into docs/testing-results.md.");
}

run().catch((err) => {
  console.error("\nTEST BATTERY FAILED:", err.message);
  process.exit(1);
});
