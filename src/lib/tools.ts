import type { BillState } from "./mockBill";
import { demoUsageProfile } from "./usageProfile";
import { recommendPlan, cheapestExistingOffer } from "./tariff/recommend";

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
  {
    name: "get_usage_profile",
    description:
      "İstifadəçinin son 30 gündə mobil internetini hansı tətbiqlərdə işlətdiyini qaytarır. Müştəri istifadə vərdişlərini özü TƏSVİR ETMƏYİBSƏ, tarif tövsiyəsindən əvvəl bunu çağır.",
    input_schema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "recommend_plan",
    description:
      "Ən uyğun yeni tarif paketini və qiymətini qaytarır. Əgər müştəri istifadə vərdişlərini söhbətdə TƏSVİR EDİBSƏ (məsələn 'çox PUBG oynayıram'), SƏN ÖZÜN hər sahə üçün ağlabatan GB dəyəri təxmin edib birbaşa buraya ötür. Əks halda, əvvəlcə get_usage_profile çağır və onun dəyərlərini olduğu kimi buraya ötür.",
    input_schema: {
      type: "object",
      properties: {
        social_media_gb: { type: "number" },
        tiktok_gb: { type: "number" },
        instagram_gb: { type: "number" },
        video_streaming_gb: { type: "number" },
        youtube_gb: { type: "number" },
        netflix_gb: { type: "number" },
        communication_gb: { type: "number" },
        whatsapp_gb: { type: "number" },
        collaboration_gb: { type: "number" },
        teams_gb: { type: "number" },
        ai_apps_gb: { type: "number" },
        chatgpt_gb: { type: "number" },
        claude_gb: { type: "number" },
        gemini_gb: { type: "number" },
        gaming_gb: { type: "number" },
      },
      required: [
        "social_media_gb", "tiktok_gb", "instagram_gb",
        "video_streaming_gb", "youtube_gb", "netflix_gb",
        "communication_gb", "whatsapp_gb",
        "collaboration_gb", "teams_gb",
        "ai_apps_gb", "chatgpt_gb", "claude_gb", "gemini_gb",
        "gaming_gb",
      ],
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

  if (name === "get_usage_profile") {
    return { result: demoUsageProfile(), nextBill: bill };
  }

  if (name === "recommend_plan") {
    const usage = {
      social_media_gb: Number(args.social_media_gb) || 0,
      tiktok_gb: Number(args.tiktok_gb) || 0,
      instagram_gb: Number(args.instagram_gb) || 0,
      video_streaming_gb: Number(args.video_streaming_gb) || 0,
      youtube_gb: Number(args.youtube_gb) || 0,
      netflix_gb: Number(args.netflix_gb) || 0,
      communication_gb: Number(args.communication_gb) || 0,
      whatsapp_gb: Number(args.whatsapp_gb) || 0,
      collaboration_gb: Number(args.collaboration_gb) || 0,
      teams_gb: Number(args.teams_gb) || 0,
      ai_apps_gb: Number(args.ai_apps_gb) || 0,
      chatgpt_gb: Number(args.chatgpt_gb) || 0,
      claude_gb: Number(args.claude_gb) || 0,
      gemini_gb: Number(args.gemini_gb) || 0,
      gaming_gb: Number(args.gaming_gb) || 0,
    };
    const rec = recommendPlan(usage);
    if ("error" in rec) {
      return { result: { ok: false, error: rec.error }, nextBill: bill };
    }
    const totalGb = Object.values(usage).length
      ? usage.social_media_gb + usage.video_streaming_gb + usage.communication_gb +
        usage.collaboration_gb + usage.ai_apps_gb + usage.gaming_gb
      : 0;
    const existing = cheapestExistingOffer(totalGb);
    return {
      result: {
        ok: true,
        persona: rec.persona,
        confidencePct: Math.round(rec.confidence * 100),
        tier: rec.tier,
        recommendedPackage: {
          ...rec.package,
          totalGb: Math.round(rec.package.totalGb),
          priceAzn: Math.round(rec.package.priceAzn),
          buckets: Object.fromEntries(
            Object.entries(rec.package.buckets).map(([k, v]) => [k, Math.round(v)])
          ),
          generalPoolGb: Math.round(rec.package.generalPoolGb),
        },
        comparison: {
          cheapestExistingOfferAzn: Math.round(existing.priceAzn),
          existingOfferSource: existing.source,
          savingsAzn: Math.round(existing.priceAzn - rec.package.priceAzn),
        },
      },
      nextBill: bill,
    };
  }

  return { result: { ok: false, error: "Naməlum funksiya: " + name }, nextBill: bill };
}
