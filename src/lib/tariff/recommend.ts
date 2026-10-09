import modelData from "./model_export.json";
import type { UsageProfile } from "@/lib/usageProfile";

const SECTIONS = [
  "social_media_gb",
  "video_streaming_gb",
  "communication_gb",
  "collaboration_gb",
  "ai_apps_gb",
  "gaming_gb",
] as const;

type Model = {
  feature_columns: string[];
  scaler_mean: number[];
  scaler_scale: number[];
  classes: string[];
  coef: number[][];
  intercept: number[];
  packages: Record<
    string,
    {
      persona: string;
      tier: "S" | "M" | "L";
      total_gb: number;
      buckets_gb: Record<string, number>;
      general_pool_gb: number;
      price_azn: number;
    }
  >;
  tier_order: ("S" | "M" | "L")[];
};

const model = modelData as Model;

function engineerFeatures(u: UsageProfile): { totalGb: number; byName: Record<string, number> } {
  const sectionValue: Record<(typeof SECTIONS)[number], number> = {
    social_media_gb: u.social_media_gb,
    video_streaming_gb: u.video_streaming_gb,
    communication_gb: u.communication_gb,
    collaboration_gb: u.collaboration_gb,
    ai_apps_gb: u.ai_apps_gb,
    gaming_gb: u.gaming_gb,
  };

  const totalGb = SECTIONS.reduce((sum, s) => sum + sectionValue[s], 0) || 1e-6;

  const byName: Record<string, number> = {};
  for (const s of SECTIONS) {
    byName[`log_${s}`] = Math.log1p(sectionValue[s]);
    byName[`share_${s}`] = sectionValue[s] / totalGb;
  }

  const ytNf = u.youtube_gb + u.netflix_gb;
  byName["yt_vs_netflix"] = ytNf > 0 ? u.youtube_gb / ytNf : 0;

  const ttIg = u.tiktok_gb + u.instagram_gb;
  byName["tiktok_vs_instagram"] = ttIg > 0 ? u.tiktok_gb / ttIg : 0;

  return { totalGb, byName };
}

function softmax(scores: number[]): number[] {
  const max = Math.max(...scores);
  const exps = scores.map((s) => Math.exp(s - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

function predictPersona(byName: Record<string, number>): { persona: string; confidence: number; probs: Record<string, number> } {
  const x = model.feature_columns.map((name) => byName[name] ?? 0);
  const xScaled = x.map((v, i) => (v - model.scaler_mean[i]) / model.scaler_scale[i]);

  const scores = model.classes.map((_, c) => {
    let s = model.intercept[c];
    for (let i = 0; i < xScaled.length; i++) s += model.coef[c][i] * xScaled[i];
    return s;
  });

  const probs = softmax(scores);
  let bestIdx = 0;
  for (let i = 1; i < probs.length; i++) if (probs[i] > probs[bestIdx]) bestIdx = i;

  const probsByClass: Record<string, number> = {};
  model.classes.forEach((c, i) => (probsByClass[c] = probs[i]));

  return { persona: model.classes[bestIdx], confidence: probs[bestIdx], probs: probsByClass };
}

function assignTier(totalGb: number, persona: string): "S" | "M" | "L" | null {
  const candidates = model.tier_order
    .map((t) => ({ t, pkg: model.packages[`${persona}::${t}`] }))
    .filter((c) => c.pkg);
  if (candidates.length === 0) return null;

  const fitting = candidates.filter((c) => c.pkg.total_gb >= totalGb);
  if (fitting.length > 0) {
    return fitting.reduce((min, c) => (c.pkg.total_gb < min.pkg.total_gb ? c : min)).t;
  }
  return candidates.reduce((max, c) => (c.pkg.total_gb > max.pkg.total_gb ? c : max)).t;
}

export type RecommendResult = {
  persona: string;
  confidence: number;
  tier: "S" | "M" | "L";
  totalGbUsed: number;
  package: {
    totalGb: number;
    priceAzn: number;
    buckets: Record<string, number>;
    generalPoolGb: number;
  };
};

export function recommendPlan(usage: UsageProfile): RecommendResult | { error: string } {
  const { totalGb, byName } = engineerFeatures(usage);
  const { persona, confidence } = predictPersona(byName);
  const tier = assignTier(totalGb, persona);
  if (!tier) return { error: `no_package_for_persona:${persona}` };

  const pkg = model.packages[`${persona}::${tier}`];
  return {
    persona,
    confidence,
    tier,
    totalGbUsed: Math.round(totalGb * 100) / 100,
    package: {
      totalGb: pkg.total_gb,
      priceAzn: pkg.price_azn,
      buckets: pkg.buckets_gb,
      generalPoolGb: pkg.general_pool_gb,
    },
  };
}

export function cheapestExistingOffer(gb: number): { priceAzn: number; source: string } {
  const offers: [number, number, string][] = [
    [3, 9, "verified_28day"],
    [6, 12, "verified_28day"],
    [12, 19, "verified_28day"],
    [30, 29, "verified_28day"],
    [56, 39, "verified_28day"],
    [60, 60, "verified_premium_plus"],
    [100, 90, "verified_premium_plus"],
    [5, 12, "assumed_digimax"],
    [10, 18, "assumed_digimax"],
    [25, 30, "assumed_digimax"],
  ];
  const fitting = offers.filter(([cap]) => cap >= gb);
  if (fitting.length > 0) {
    const [, price, source] = fitting.reduce((min, o) => (o[1] < min[1] ? o : min));
    return { priceAzn: price, source };
  }
  return { priceAzn: Math.round(5.27 * Math.sqrt(gb) * 100) / 100, source: "fitted_formula_extrapolated" };
}
