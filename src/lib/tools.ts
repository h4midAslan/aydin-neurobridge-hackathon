import type { BillState } from "./mockBill";

export const toolDefinitions = [
  {
    name: "get_bill",
    description:
      "İstifadəçinin cari balansını və aktiv/ləğv edilmiş abunəliklərini qaytarır. Hesabla bağlı hər hansı sualdan əvvəl bunu çağır.",
    input_schema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "cancel_subscription",
    description:
      "Verilən abunəliyi ləğv edir. İstifadəçi konkret bir abunəliyi ləğv etmək istədiyini TƏSDİQ etdikdən sonra çağır.",
    input_schema: {
      type: "object",
      properties: {
        subscription_id: {
          type: "string",
          description: "get_bill nəticəsindəki abunəliyin id dəyəri",
        },
      },
      required: ["subscription_id"],
    },
  },
  {
    name: "request_refund",
    description:
      "Keçmiş günlər/aylar üçün haqsız tutulmuş məbləği balansa geri qaytarır. Yalnız müştəri geri qaytarılacaq məbləği (neçə günlük/aylıq) TƏSDİQ etdikdən sonra çağır. cancel_subscription-dan ayrı, əlavə bir addımdır — ikisini qarışdırma.",
    input_schema: {
      type: "object",
      properties: {
        subscription_id: {
          type: "string",
          description: "get_bill nəticəsindəki abunəliyin id dəyəri",
        },
        periods: {
          type: "number",
          description:
            "Neçə dövr (gündəlik abunəlik üçün gün sayı, aylıq üçün ay sayı) geri qaytarılsın. Müştəri ilə razılaşılan ədəd.",
        },
      },
      required: ["subscription_id", "periods"],
    },
  },
];

export function runTool(
  name: string,
  args: Record<string, unknown>,
  bill: BillState
): { result: unknown; nextBill: BillState } {
  if (name === "get_bill") {
    return { result: bill, nextBill: bill };
  }

  if (name === "cancel_subscription") {
    const id = String(args.subscription_id ?? "");
    const sub = bill.subscriptions.find((s) => s.id === id);

    if (!sub) {
      return {
        result: { ok: false, error: "Abunəlik tapılmadı: " + id },
        nextBill: bill,
      };
    }

    if (sub.status === "cancelled") {
      return {
        result: { ok: true, alreadyCancelled: true, subscription: sub },
        nextBill: bill,
      };
    }

    const nextBill: BillState = {
      ...bill,
      subscriptions: bill.subscriptions.map((s) =>
        s.id === id ? { ...s, status: "cancelled" as const } : s
      ),
    };

    return {
      result: { ok: true, cancelled: { ...sub, status: "cancelled" } },
      nextBill,
    };
  }

  if (name === "request_refund") {
    const id = String(args.subscription_id ?? "");
    const periods = Math.max(1, Math.min(31, Number(args.periods) || 1));
    const sub = bill.subscriptions.find((s) => s.id === id);

    if (!sub) {
      return {
        result: { ok: false, error: "Abunəlik tapılmadı: " + id },
        nextBill: bill,
      };
    }

    const refundAmount = Math.round(sub.amountAzn * periods * 100) / 100;
    const nextBill: BillState = {
      ...bill,
      balanceAzn: Math.round((bill.balanceAzn + refundAmount) * 100) / 100,
      subscriptions: bill.subscriptions.map((s) =>
        s.id === id
          ? { ...s, refundedAzn: Math.round(((s.refundedAzn ?? 0) + refundAmount) * 100) / 100 }
          : s
      ),
    };

    return {
      result: {
        ok: true,
        refundedAzn: refundAmount,
        newBalanceAzn: nextBill.balanceAzn,
        subscription: sub.name,
      },
      nextBill,
    };
  }

  return { result: { ok: false, error: "Naməlum funksiya: " + name }, nextBill: bill };
}
