# Aydın — canlı səhnə təqdimatı (Day 2, 15:00 final)

Hədəf: 2:00–2:30 danışıq vaxtı, canlı demo daxil. Bütün rəqəmlər
`docs/testing-results.md`, `docs/submission.md` və `docs/pitch-deck-outline.md`
ilə üst-üstə düşür — fərqli rəqəm demək olmaz.

## Açılış qarmaq (~15-20 san)

> Salam. Azercell-in öz AI botu — AiCell — Azərbaycan dilini 96.6%
> dəqiqliklə başa düşür. Amma bu tip müraciətlərin cəmi 17%-ni başdan-başa
> HƏLL edir. Qalan 83% hələ də insana yönləndirilir. Problem dil deyil —
> bitirməkdir. Biz məhz bunu həll etdik.

## Canlı demo zamanı deyiləcək sözlər (~60-70 san, demo ilə sync)

- Zəng konsolu açılanda:
  > Diqqət edin — Aydın heç nə soruşulmadan özü hesabı yoxlayıb və
  > diqqət çəkən bir məqam tapıb. Bunu mən demədim, o tapdı.

- Ambiguity anı ("Bunu ləğv et" yazılanda):
  > İndi mən sadəcə "bunu ləğv et" deyirəm. İki abunəlik var, Aydın
  > təxmin etmir — hansını nəzərdə tutduğumu soruşur. Bu, əvvəlcədən
  > yazılmış ssenari ilə mümkün olmayan bir davranışdır.

- Həll anı (status "HƏLL EDİLDİ"yə keçəndə):
  > Təsdiq edirəm — və budur, zəng statusu dərhal "HƏLL EDİLDİ"yə keçir.
  > Bu real bir hərəkətdir: sistemimiz indicə bu abunəliyi həqiqətən
  > ləğv etdi, mən sadəcə izah etmədim. Və bir addım da var — Aydın həm
  > də son günlər üçün tutulan pulu geri qaytarmağı özü təklif edir.
  > AiCell gələcək tutumu dayandırır, Aydın keçmiş pulu da qaytarır.

## Rəqəmlər (~20-30 san)

> Bunu 10 real ssenari üzərində canlı Claude ilə sınaqdan keçirdik —
> skriptləşdirilməmiş. Hesabla bağlı bütün 8 hal insana ötürülmədən həll
> olundu, ya da təsdiq üçün bir sözlük addım təklif olundu. Hər həll
> edilmiş söhbətin dəyəri 2 qəpikdən azdır. Və Azercell-in Barama
> İnnovasiya Mərkəzi məhz belə layihələri biznes vahidinə çevirmək üçün
> yaradılıb — biz bu addımı atmağa hazırıq.

## Bağlanış (~15-20 san)

> NeuroBridge.SI bu gün Bakıda başlayan, 11 ölkəni əhatə edəcək bir
> şəbəkənin BİRİNCİ nəşridir — və noyabr 2027-də yenidən Bakıda, bütün
> şəhərlərin qalib komandaları ilə bir qlobal finalla bitəcək. Biz bu
> gün qalib olmaq istəyirik. Amma əsas məqsədimiz odur ki, bu layihə
> həmin qlobal finala gedən layihə olsun.

---

## Gözlənilən suallar

**"Azercell razı olmasa?"**
> Aydın konkret olaraq Azercell üçün tikilməyib — istənilən telekom və
> ya abunəlik-əsaslı xidmət provayderi üçün işləyir. Azercell sadəcə ən
> məntiqli ilk pilot tərəfdaşdır, çünki onlar artıq bu hackathon
> şəbəkəsinin tərəfdaşıdır və öz 17% rəqəmini özləri dərc edib. Onlarla
> razılaşma olmasa belə, məhsul öz dəyərini itirmir — başqa bir operatorla
> da işləyə bilər.

**"Bu sadəcə skript edilmiş bot deyilmi?"**
> Xeyr. Bunu sübut etmək üçün sıfır-kontekst test apardıq: istifadəçi heç
> nə demədən, birbaşa "abunəliyi ləğv et" dedikdə, Aydın təxmin etmədi —
> hansı abunəliyi nəzərdə tutduğumuzu soruşdu. Bu, əvvəlcədən yazılmış
> if-else məntiqi ilə mümkün olmayan bir davranışdır — real Claude
> alət-çağırışı (tool-calling) və hesab vəziyyəti üzərində əsl
> mühakimədir, təsadüfi deyil.

**"Hesab məlumatlarının təhləkəsizliyi necə olacaq?"**
> Real versiyada Aydın yalnız autentifikasiya olunmuş istifadəçinin öz
> hesabına, məhdud oxuma səlahiyyəti ilə baxacaq, və hər ləğvetmə
> əməliyyatı audit jurnalına yazılacaq ki, dəstək komandası istənilən
> hərəkəti yoxlaya və ya geri qaytara bilsin. Bu bu gün üçün fərziyyə
> deyil — bu, məhsulun bir növbəti addımıdır, və `docs/submission.md`-in
> Feasibility bölməsində yazılıb.
