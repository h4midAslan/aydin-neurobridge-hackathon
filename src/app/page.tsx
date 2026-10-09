import Link from "next/link";

const steps = [
  {
    n: "01",
    title: "AŞKARLAYIR",
    body: "Hesabınıza baxılmasını gözləmir — tətbiq açılan kimi özü skan edir və şübhəli təkrarlanan tutumu tapır.",
  },
  {
    n: "02",
    title: "İZAH EDİR",
    body: "Hər tutumu sadə, danışıq dilində izah edir — hansı qanunidir, hansı şübhəlidir, niyə.",
  },
  {
    n: "03",
    title: "HƏLL EDİR",
    body: "Təsdiqdən sonra təkcə dayandırmır — keçmiş günlər üçün tutulan pulu da geri qaytarır. Söhbəti yox, problemi bitirir.",
  },
];

const roadmap = [
  { period: "1-2 AY", text: "Əsas dövrə: şübhəli tutumu aşkarla, izah et, ləğv et, geri qaytar." },
  { period: "3-4 AY", text: "Real mühasibat/billinq sistemlərinə qoşulma — mock data deyil, canlı hesablar." },
  { period: "5-7 AY", text: "Aşkarlamanı genişləndir: dublikat ödənişlər, qiymət dəyişiklikləri, vendor pattern analizi." },
  { period: "8-12 AY", text: "Vendorla birbaşa danışıq, proqnozlaşdırıcı siqnal, etibar skoru." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#07080A] text-neutral-200">
      {/* Nav */}
      <header className="flex items-center justify-between px-6 py-5 border-b border-neutral-800 [font-family:var(--font-geist-mono)]">
        <span className="font-bold tracking-wide text-white text-sm">AYDIN</span>
        <Link
          href="/console"
          className="rounded border border-[#22E6A6]/60 px-4 py-2 text-xs font-semibold text-[#22E6A6] hover:bg-[#22E6A6]/10 transition-colors"
        >
          CANLI DEMO →
        </Link>
      </header>

      {/* Hero */}
      <section className="px-6 pt-16 pb-12 text-center flex flex-col items-center gap-6 max-w-3xl mx-auto">
        <img
          src="/aydin-glow.png"
          alt="Aydın"
          className="w-full max-w-md opacity-90"
        />
        <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight -mt-8">
          Söhbəti yox,
          <br />
          <span className="text-[#F5B301]">problemi bitirir.</span>
        </h1>
        <p className="text-neutral-400 text-base sm:text-lg max-w-xl [font-family:var(--font-geist-mono)]">
          Hesabınızdan niyə pul çıxdığını izah edən köməkçilər çoxdur. Aydın
          yeganədir ki, təsdiqdən sonra məsələni özü, canlı, sona qədər həll
          edir.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Link
            href="/console"
            className="rounded bg-[#22E6A6] px-6 py-3 text-sm font-bold text-black [font-family:var(--font-geist-mono)]"
          >
            [ CANLI DEMONU SINA ]
          </Link>
          <a
            href="https://github.com/h4midAslan/aydin-neurobridge-hackathon"
            className="rounded border border-neutral-700 px-6 py-3 text-sm font-semibold text-neutral-300 [font-family:var(--font-geist-mono)] hover:border-neutral-500 transition-colors"
          >
            MƏNBƏ KODU
          </a>
        </div>
        <div className="text-xs text-neutral-600 [font-family:var(--font-geist-mono)]">
          NeuroBridge.SI Baku 2026 · AI Enterprise Solutions
        </div>
      </section>

      {/* Stat comparison */}
      <section className="px-6 py-10 border-y border-neutral-800 bg-[#0A0C0E]">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-4 [font-family:var(--font-geist-mono)]">
          <div className="flex-1 rounded border border-neutral-800 p-5 text-center">
            <div className="text-xs text-neutral-500 mb-2">ƏNƏNƏVİ DƏSTƏK BOTU</div>
            <div className="text-4xl font-bold text-neutral-400">17%</div>
            <div className="text-xs text-neutral-600 mt-2">hallarda sona qədər həll edir</div>
          </div>
          <div className="flex-1 rounded border border-[#22E6A6]/50 p-5 text-center">
            <div className="text-xs text-[#22E6A6] mb-2">AYDIN</div>
            <div className="text-4xl font-bold text-[#22E6A6]">CANLI HƏLL</div>
            <div className="text-xs text-neutral-500 mt-2">
              hər təsdiqlənmiş halı sona qədər aparır
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <h2 className="text-center text-xs tracking-widest text-neutral-500 [font-family:var(--font-geist-mono)] mb-10">
          NECƏ İŞLƏYİR
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div key={s.n} className="rounded border border-neutral-800 p-5">
              <div className="text-[#F5B301] text-xs [font-family:var(--font-geist-mono)] mb-2">
                {s.n}
              </div>
              <div className="text-white font-bold text-sm mb-2 [font-family:var(--font-geist-mono)]">
                {s.title}
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Proof */}
      <section className="px-6 py-10 border-y border-neutral-800 bg-[#0A0C0E]">
        <div className="max-w-3xl mx-auto flex flex-wrap justify-center gap-x-10 gap-y-4 text-center [font-family:var(--font-geist-mono)]">
          <div>
            <div className="text-2xl font-bold text-white">8/8</div>
            <div className="text-xs text-neutral-500">real test ssenarisi həll edildi</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">Claude Sonnet 5</div>
            <div className="text-xs text-neutral-500">canlı tool-calling ilə</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">~0.008 $</div>
            <div className="text-xs text-neutral-500">hər həll edilən söhbət üçün</div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="px-6 py-16 max-w-3xl mx-auto">
        <h2 className="text-center text-xs tracking-widest text-neutral-500 [font-family:var(--font-geist-mono)] mb-2">
          BU GÜN GÖRDÜYÜNÜZ — 12 AYLIQ MƏHSULUN BİRİNCİ AYI
        </h2>
        <p className="text-center text-neutral-600 text-xs mb-10">
          Həftə sonu triki deyil, məhsulun başlanğıcı.
        </p>
        <div className="flex flex-col gap-4 [font-family:var(--font-geist-mono)]">
          {roadmap.map((r) => (
            <div key={r.period} className="flex gap-4 items-start border-b border-neutral-900 pb-4">
              <div className="text-[#F5B301] text-xs font-bold w-20 shrink-0 pt-0.5">
                {r.period}
              </div>
              <div className="text-neutral-400 text-sm">{r.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-neutral-800 text-center [font-family:var(--font-geist-mono)] text-xs text-neutral-600">
        <div className="flex flex-wrap justify-center gap-4 mb-3">
          <a href="https://github.com/h4midAslan/aydin-neurobridge-hackathon" className="hover:text-neutral-400">
            GitHub
          </a>
          <a href="https://github.com/h4midAslan/aydin-neurobridge-hackathon/blob/master/docs/disclosure.md" className="hover:text-neutral-400">
            Disclosure
          </a>
          <Link href="/console" className="hover:text-neutral-400">
            Canlı demo
          </Link>
        </div>
        <div>Starnest Academy · OMNI AI Summit · Azercell — NeuroBridge.SI Baku 2026</div>
      </footer>
    </div>
  );
}
