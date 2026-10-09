import Link from "next/link";

const ORB_CSS = `
.aydin-orb{position:relative;display:inline-block;isolation:isolate}
.aydin-halo,.aydin-core{position:absolute;border-radius:9999px;pointer-events:none}
.aydin-halo{inset:-70%;z-index:-1;
  background:radial-gradient(circle,rgba(245,183,58,.5) 0%,rgba(245,183,58,.18) 36%,rgba(245,183,58,0) 68%);
  animation:aydin-halo-idle 6.5s ease-in-out infinite}
.aydin-core{inset:0;
  background:radial-gradient(circle at 38% 32%,#fff6d9 0%,#ffd36b 38%,#f5b73a 74%,#e09a14 100%);
  box-shadow:0 0 16px 2px rgba(245,183,58,.5);
  animation:aydin-core-idle 6.5s ease-in-out infinite}
@keyframes aydin-halo-idle{0%,100%{transform:scale(.9);opacity:.6}50%{transform:scale(1.08);opacity:1}}
@keyframes aydin-core-idle{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}
@media (prefers-reduced-motion:reduce){.aydin-halo,.aydin-core{animation-duration:14s !important}}
`;

const comparison = {
  old: {
    label: "Ənənəvi dəstək",
    stat: "17%",
    desc: "hallarda problemi həll edir.",
    points: ["Uzun gözləmə müddəti", "Tez-tez eyni məlumatın təkrarı", "Çox vaxt yenə də həll olunmur"],
  },
  new: {
    label: "Clario",
    stat: "Canlı, görünən,\nani həll.",
    points: ["Süni intellekt avtomatik aşkar edir", "Problemi sadə dildə izah edir", "Təsdiqlənsə, ləğv edir və geri ödəyir"],
  },
};

const steps = [
  { n: "1", title: "Ödənişi özü aşkar edir", body: "Clario şübhəli, təkrarlanan ödənişi avtomatik olaraq fərq edir." },
  { n: "2", title: "Sadə dildə izah edir", body: "Hansı xidmətə aid olduğunu aydın şəkildə sizə başa salır." },
  { n: "3", title: "Təsdiqlənsə, həll edir", body: "İxtilafı ləğv edir və əvvəlki ödənişləri geri qaytarır." },
];

const stats = [
  { value: "8/8", label: "real test halı uğurla həll edildi" },
  { value: "Claude Sonnet 5", label: "onun arxasındakı AI modeli" },
  { value: "~$0.008", label: "hər həll olunmuş söhbət üçün" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white [font-family:var(--font-geist-sans)]">
      <style>{ORB_CSS}</style>

      <div className="max-w-5xl mx-auto px-6">
        {/* Hero */}
        <header className="pt-10 pb-2">
          <span className="text-xl font-extrabold tracking-tight">Clario</span>
        </header>

        <section className="py-10 sm:py-16 grid sm:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl sm:text-6xl font-extrabold leading-[1.05] tracking-tight">
              Söhbəti yox,
              <br />
              problemi bitirir
            </h1>
            <p className="mt-6 text-base sm:text-lg text-[#8a9096] leading-relaxed max-w-md">
              Clario, telekommunikasiya üzrə ödəniş ixtilaflarını sizin üçün həll edən süni
              intellekt assistentidir.
            </p>
            <div className="mt-8 flex flex-col gap-3 max-w-xs">
              <Link
                href="/console"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f5b73a] px-6 py-3.5 text-base font-bold text-black transition hover:bg-[#ffc757]"
              >
                Dərdini mənə danış <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/paketler"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#2f3336] px-6 py-3.5 text-base font-bold text-white transition hover:border-[#536471]"
              >
                Mənə uyğun tarif seç
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center py-8">
            <span className="aydin-orb size-48 sm:size-64" aria-hidden="true">
              <span className="aydin-halo" />
              <span className="aydin-core" />
            </span>
          </div>
        </section>

        <hr className="border-t border-[#2f3336]" />

        {/* Problem comparison */}
        <section className="py-14 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Problemin köhnə və yeni yolu
          </h2>
          <p className="mt-3 text-[#8a9096] max-w-xl">
            Ənənəvi dəstək sizi saatlarla gözlədir. Clario problemi sürətli və real şəkildə həll
            edir.
          </p>

          <div className="mt-10 grid sm:grid-cols-2 gap-10 sm:gap-0">
            <div className="sm:pr-10">
              <div className="flex items-center gap-2 text-[#8a9096]">
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M3 5a2 2 0 0 1 2-2h2.5a1 1 0 0 1 1 .8l1 4a1 1 0 0 1-.5 1.1L7 10.5a12 12 0 0 0 6.5 6.5L15 15a1 1 0 0 1 1.1-.5l4 1a1 1 0 0 1 .8 1V21a2 2 0 0 1-2 2C9.3 23 1 14.7 1 5a2 2 0 0 1 2-2Z" />
                </svg>
                <span className="font-semibold">Ənənəvi dəstək</span>
              </div>
              <div className="mt-3 text-5xl font-extrabold tracking-tight">{comparison.old.stat}</div>
              <p className="mt-2 text-[#8a9096]">{comparison.old.desc}</p>
              <ul className="mt-6 flex flex-col gap-2.5">
                {comparison.old.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-[#8a9096]">
                    <span className="mt-0.5 text-[#536471]">✕</span> {p}
                  </li>
                ))}
              </ul>
            </div>

            <div className="sm:pl-10 sm:border-l sm:border-[#2f3336]">
              <div className="flex items-center gap-2">
                <span className="aydin-orb size-5" aria-hidden="true">
                  <span className="aydin-halo" />
                  <span className="aydin-core" />
                </span>
                <span className="font-semibold">Clario</span>
              </div>
              <div className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight leading-[1.1] whitespace-pre-line">
                {comparison.new.stat}
              </div>
              <ul className="mt-6 flex flex-col gap-2.5">
                {comparison.new.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-[#e7e9ea]">
                    <span className="mt-0.5 text-[#f5b73a]">✓</span> {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <hr className="border-t border-[#2f3336]" />

        {/* How it works */}
        <section className="py-14 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-10">Necə işləyir?</h2>
          <div className="grid sm:grid-cols-3 gap-8 sm:gap-6 relative">
            {steps.map((s, i) => (
              <div key={s.n} className="relative">
                <span className="grid size-9 place-items-center rounded-full bg-[#f5b73a] text-black font-extrabold text-sm">
                  {s.n}
                </span>
                <h3 className="mt-4 font-bold text-lg">{s.title}</h3>
                <p className="mt-1.5 text-sm text-[#8a9096] leading-relaxed">{s.body}</p>
                {i < steps.length - 1 && (
                  <span
                    className="hidden sm:block absolute top-4 -right-3 text-[#536471] text-xl"
                    aria-hidden="true"
                  >
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        <hr className="border-t border-[#2f3336]" />

        {/* Stats */}
        <section className="py-14 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-10">
            Rəqəmlər öz sözünü deyir
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`${i > 0 ? "sm:pl-8 sm:border-l sm:border-[#2f3336]" : ""}`}
              >
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">{s.value}</div>
                <div className="mt-1.5 text-sm text-[#8a9096]">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-t border-[#2f3336]" />

        {/* Roadmap */}
        <section className="py-14 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight max-w-2xl">
            Bu, real məhsulun ilk ayıdır, həftəsonu demosu deyil.
          </h2>

          <div className="mt-12 relative">
            <div className="h-px bg-[#2f3336] w-full" />
            <div className="absolute left-0 -top-[3px] size-2 rounded-full bg-[#f5b73a]" />
            <div className="absolute right-0 -top-[3px] size-2 rounded-full bg-[#f5b73a]" />
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-8">
            <div>
              <div className="text-sm font-bold text-[#f5b73a]">Ay 1</div>
              <div className="mt-2 font-bold">İndiki vəziyyət</div>
              <p className="mt-1 text-sm text-[#8a9096] leading-relaxed">
                Ödəniş ixtilaflarının aşkarlanması, izahı və həlli.
              </p>
            </div>
            <div className="sm:text-right">
              <div className="text-sm font-bold text-[#f5b73a]">Ay 12</div>
              <div className="mt-2 font-bold">Tam vizyon</div>
              <p className="mt-1 text-sm text-[#8a9096] leading-relaxed">
                Real mühasibatlıq/billinq sistemlərinə bağlantı, daha geniş fırıldaqçılıq
                aşkarlığı, provayderlərlə danışıqlar.
              </p>
            </div>
          </div>
        </section>

        <hr className="border-t border-[#2f3336]" />

        {/* Footer */}
        <footer className="py-8 flex flex-wrap items-center justify-between gap-3 text-sm text-[#8a9096]">
          <div className="flex flex-wrap gap-5">
            <a href="https://github.com/h4midAslan/aydin-neurobridge-hackathon" className="hover:text-white">
              GitHub
            </a>
            <a
              href="https://github.com/h4midAslan/aydin-neurobridge-hackathon/blob/master/docs/disclosure.md"
              className="hover:text-white"
            >
              Disclosure
            </a>
            <Link href="/console" className="hover:text-white">
              Canlı demo
            </Link>
          </div>
          <div className="text-xs text-[#536471]">NeuroBridge.SI Baku 2026</div>
        </footer>
      </div>
    </div>
  );
}
