import Link from "next/link";
import modelData from "@/lib/tariff/model_export.json";
import { recommendPlan, cheapestExistingOffer } from "@/lib/tariff/recommend";
import { demoUsageProfile } from "@/lib/usageProfile";

type Pkg = {
  persona: string;
  tier: "S" | "M" | "L";
  total_gb: number;
  buckets_gb: Record<string, number>;
  general_pool_gb: number;
  price_azn: number;
};

const PERSONA_AZ: Record<string, string> = {
  "Light user": "Minimal istifadəçi",
  "Heavy Video streamer (YouTube)": "Video həvəskarı (YouTube)",
  "Video streamer (Netflix)": "Video həvəskarı (Netflix)",
  "Everyday all-rounder": "Hər şeydən bir az",
  "Remote worker (Teams/Zoom)": "Uzaqdan işləyən",
  "Social scroller (TikTok)": "Sosial media (TikTok)",
  "Social scroller (Instagram)": "Sosial media (Instagram)",
  Gamer: "Gamer",
  "Messaging-first (WhatsApp)": "Mesajlaşma (WhatsApp)",
  "AI power user": "AI istifadəçisi",
};

const BUCKET_AZ: Record<string, string> = {
  social_media_gb: "Sosial media",
  video_streaming_gb: "Video",
  communication_gb: "Rabitə",
  collaboration_gb: "İş alətləri",
  ai_apps_gb: "AI tətbiqləri",
  gaming_gb: "Oyun",
};

const TIER_LABEL: Record<string, string> = { S: "Yüngül", M: "Orta", L: "Geniş" };

function groupByPersona(packages: Record<string, Pkg>) {
  const groups: Record<string, Pkg[]> = {};
  for (const pkg of Object.values(packages)) {
    groups[pkg.persona] ??= [];
    groups[pkg.persona].push(pkg);
  }
  for (const list of Object.values(groups)) {
    list.sort((a, b) => ["S", "M", "L"].indexOf(a.tier) - ["S", "M", "L"].indexOf(b.tier));
  }
  return groups;
}

export default function PaketlerPage() {
  const packages = (modelData as { packages: Record<string, Pkg> }).packages;
  const groups = groupByPersona(packages);

  const usage = demoUsageProfile();
  const rec = recommendPlan(usage);
  const recommended = "error" in rec ? null : rec;
  const existing = recommended ? cheapestExistingOffer(recommended.totalGbUsed) : null;
  const savings = recommended && existing ? Math.round(existing.priceAzn - recommended.package.priceAzn) : 0;

  const dominantBucket = recommended
    ? Object.entries(recommended.package.buckets).sort((a, b) => b[1] - a[1])[0]
    : null;

  return (
    <div className="min-h-screen bg-[#F4F0FB] text-[#241E33] [font-family:var(--font-geist-sans)]">
      <header className="border-b border-[#E2D6F5] px-6 py-5 flex items-center justify-between flex-wrap gap-3">
        <Link href="/" className="text-xl font-extrabold tracking-tight">
          Clario
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#6E6680] hidden sm:inline">Başqa probleminiz var?</span>
          <Link
            href="/console"
            className="rounded-full bg-white border-2 border-[#5C2D91] px-5 py-2.5 text-sm font-bold text-[#5C2D91] transition hover:bg-[#F0E8FB]"
          >
            Canlı söhbətə qoşulun →
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {recommended && existing && (
          <section className="mb-16">
            <div className="rounded-2xl border border-[#5C2D91]/40 bg-white p-6 sm:p-8">
              <div className="text-xs font-bold tracking-wide text-[#5C2D91] mb-2">
                SİZƏ TÖVSİYƏ
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {PERSONA_AZ[recommended.persona] ?? recommended.persona} — {TIER_LABEL[recommended.tier]}
              </h2>
              <div className="mt-4 flex items-baseline gap-4">
                <span className="text-4xl font-extrabold tracking-tight">
                  {recommended.package.totalGb} GB
                </span>
                <span className="text-2xl font-bold text-[#5C2D91]">
                  {recommended.package.priceAzn} AZN
                </span>
              </div>

              <ul className="mt-6 flex flex-col gap-2.5 text-sm text-[#241E33]">
                {dominantBucket && (
                  <li className="flex items-start gap-2">
                    <span className="text-[#5C2D91] mt-0.5">✓</span>
                    {dominantBucket[1]} GB xüsusi olaraq {(BUCKET_AZ[dominantBucket[0]] ?? dominantBucket[0]).toLowerCase()}{" "}
                    üçün ayrılıb.
                  </li>
                )}
                <li className="flex items-start gap-2">
                  <span className="text-[#5C2D91] mt-0.5">✓</span>
                  Mövcud ən ucuz oxşar tarif {existing.priceAzn} AZN-dir
                  {savings > 0 ? (
                    <> — bu paketlə {savings} AZN qənaət edirsiniz.</>
                  ) : (
                    <>.</>
                  )}
                </li>
              </ul>

              <Link
                href="/console"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white border-2 border-[#5C2D91] px-5 py-2.5 text-sm font-bold text-[#5C2D91] transition hover:bg-[#F0E8FB]"
              >
                Bu tarifə keçmək istəyirəm →
              </Link>
            </div>
          </section>
        )}

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Bütün tariflər</h1>
        <p className="mt-3 text-[#6E6680] max-w-xl">
          30 fərdiləşdirilmiş paket, 10 istifadə profilinə görə qruplaşdırılıb. Hər profil üçün 3
          səviyyə: yüngül, orta, geniş istifadə.
        </p>

        <div className="mt-12 flex flex-col gap-10">
          {Object.entries(groups).map(([persona, tiers]) => (
            <section key={persona}>
              <h2 className="text-lg font-bold mb-4">{PERSONA_AZ[persona] ?? persona}</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {tiers.map((pkg) => (
                  <div
                    key={pkg.tier}
                    className="rounded-xl border border-[#E2D6F5] bg-white p-5 flex flex-col gap-3 hover:border-[#5C2D91] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold tracking-wide text-[#6E6680]">
                        {TIER_LABEL[pkg.tier]}
                      </span>
                      <span className="text-xs text-[#9C93AD]">{pkg.tier}</span>
                    </div>
                    <div className="text-2xl font-extrabold tracking-tight">
                      {Math.round(pkg.total_gb)} GB
                    </div>
                    <div className="text-lg font-bold text-[#5C2D91]">
                      {Math.round(pkg.price_azn)} AZN
                    </div>
                    {Object.keys(pkg.buckets_gb).length > 0 && (
                      <ul className="mt-1 flex flex-col gap-1 text-xs text-[#6E6680]">
                        {Object.entries(pkg.buckets_gb).map(([k, v]) => (
                          <li key={k}>
                            {BUCKET_AZ[k] ?? k}: {Math.round(v)} GB
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
