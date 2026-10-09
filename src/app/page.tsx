import Link from "next/link";

const ORB_CSS = `
.aydin-orb{position:relative;display:inline-block;isolation:isolate}
.aydin-halo,.aydin-core{position:absolute;border-radius:9999px;pointer-events:none}
.aydin-halo{inset:-70%;z-index:-1;
  background:radial-gradient(circle,rgba(92,45,145,.45) 0%,rgba(92,45,145,.16) 36%,rgba(92,45,145,0) 68%);
  animation:aydin-halo-idle 6.5s ease-in-out infinite}
.aydin-core{inset:0;
  background:radial-gradient(circle at 38% 32%,#F7F0FC 0%,#B38FE0 38%,#5C2D91 74%,#3D1D63 100%);
  box-shadow:0 0 16px 2px rgba(92,45,145,.4);
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
    <div className="min-h-screen bg-[#F4F0FB] text-[#241E33] [font-family:var(--font-geist-sans)]">
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
            <p className="mt-6 text-base sm:text-lg text-[#6E6680] leading-relaxed max-w-md">
              Clario, telekommunikasiya üzrə ödəniş ixtilaflarını sizin üçün həll edən süni
              intellekt assistentidir.
            </p>
            <div className="mt-8 flex flex-col gap-3 max-w-xs">
              <Link
                href="/console"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-base font-bold text-[#5C2D91] border-2 border-[#5C2D91] transition hover:bg-[#F0E8FB]"
              >
                Dərdini mənə danış <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/paketler"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D8CBEE] px-6 py-3.5 text-base font-bold text-[#241E33] transition hover:border-[#5C2D91]"
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

        <hr className="border-t border-[#E2D6F5]" />

        {/* Problem comparison */}
        <section className="py-14 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Problemin köhnə və yeni yolu
          </h2>
          <p className="mt-3 text-[#6E6680] max-w-xl">
            Ənənəvi dəstək sizi saatlarla gözlədir. Clario problemi sürətli və real şəkildə həll
            edir.
          </p>

          <div className="mt-10 grid sm:grid-cols-2 gap-10 sm:gap-0">
            <div className="sm:pr-10">
              <div className="flex items-center gap-2 text-[#6E6680]">
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M3 5a2 2 0 0 1 2-2h2.5a1 1 0 0 1 1 .8l1 4a1 1 0 0 1-.5 1.1L7 10.5a12 12 0 0 0 6.5 6.5L15 15a1 1 0 0 1 1.1-.5l4 1a1 1 0 0 1 .8 1V21a2 2 0 0 1-2 2C9.3 23 1 14.7 1 5a2 2 0 0 1 2-2Z" />
                </svg>
                <span className="font-semibold">Ənənəvi dəstək</span>
              </div>
              <div className="mt-3 text-5xl font-extrabold tracking-tight">{comparison.old.stat}</div>
              <p className="mt-2 text-[#6E6680]">{comparison.old.desc}</p>
              <ul className="mt-6 flex flex-col gap-2.5">
                {comparison.old.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-[#6E6680]">
                    <span className="mt-0.5 text-[#9C93AD]">✕</span> {p}
                  </li>
                ))}
              </ul>
            </div>

            <div className="sm:pl-10 sm:border-l sm:border-[#E2D6F5]">
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
                  <li key={p} className="flex items-start gap-2 text-sm text-[#241E33]">
                    <span className="mt-0.5 text-[#5C2D91]">✓</span> {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <hr className="border-t border-[#E2D6F5]" />

        {/* How it works */}
        <section className="py-14 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-10">Necə işləyir?</h2>
          <div className="grid sm:grid-cols-3 gap-8 sm:gap-6 relative">
            {steps.map((s, i) => (
              <div key={s.n} className="relative">
                <span className="grid size-9 place-items-center rounded-full bg-[#5C2D91] text-white font-extrabold text-sm">
                  {s.n}
                </span>
                <h3 className="mt-4 font-bold text-lg">{s.title}</h3>
                <p className="mt-1.5 text-sm text-[#6E6680] leading-relaxed">{s.body}</p>
                {i < steps.length - 1 && (
                  <span
                    className="hidden sm:block absolute top-4 -right-3 text-[#9C93AD] text-xl"
                    aria-hidden="true"
                  >
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        <hr className="border-t border-[#E2D6F5]" />

        {/* Stats */}
        <section className="py-14 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-10">
            Rəqəmlər öz sözünü deyir
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`${i > 0 ? "sm:pl-8 sm:border-l sm:border-[#E2D6F5]" : ""}`}
              >
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">{s.value}</div>
                <div className="mt-1.5 text-sm text-[#6E6680]">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-t border-[#E2D6F5]" />

        {/* Roadmap */}
        <section className="py-14 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight max-w-2xl">
            Bu, real məhsulun ilk ayıdır, həftəsonu demosu deyil.
          </h2>

          <div className="mt-12 relative">
            <div className="h-px bg-[#E2D6F5] w-full" />
            <div className="absolute left-0 -top-[3px] size-2 rounded-full bg-[#5C2D91]" />
            <div className="absolute right-0 -top-[3px] size-2 rounded-full bg-[#5C2D91]" />
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-8">
            <div>
              <div className="text-sm font-bold text-[#5C2D91]">Ay 1</div>
              <div className="mt-2 font-bold">İndiki vəziyyət</div>
              <p className="mt-1 text-sm text-[#6E6680] leading-relaxed">
                Ödəniş ixtilaflarının aşkarlanması, izahı və həlli.
              </p>
            </div>
            <div className="sm:text-right">
              <div className="text-sm font-bold text-[#5C2D91]">Ay 12</div>
              <div className="mt-2 font-bold">Tam vizyon</div>
              <p className="mt-1 text-sm text-[#6E6680] leading-relaxed">
                Real mühasibatlıq/billinq sistemlərinə bağlantı, daha geniş fırıldaqçılıq
                aşkarlığı, provayderlərlə danışıqlar.
              </p>
            </div>
          </div>
        </section>

        <hr className="border-t border-[#E2D6F5]" />

        {/* Footer */}
        <footer className="py-8 flex flex-wrap items-center justify-between gap-3 text-sm text-[#6E6680]">
          <div className="flex flex-wrap gap-5">
            <a href="https://github.com/h4midAslan/aydin-neurobridge-hackathon" className="hover:text-[#5C2D91]">
              GitHub
            </a>
            <a
              href="https://github.com/h4midAslan/aydin-neurobridge-hackathon/blob/master/docs/disclosure.md"
              className="hover:text-[#5C2D91]"
            >
              Disclosure
            </a>
            <Link href="/console" className="hover:text-[#5C2D91]">
              Canlı demo
            </Link>
          </div>
          <div className="text-xs text-[#9C93AD]">NeuroBridge.SI Baku 2026</div>
        </footer>
      </div>
    </div>
  );
}
