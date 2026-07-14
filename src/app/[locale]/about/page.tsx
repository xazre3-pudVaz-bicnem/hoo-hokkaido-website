import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, Globe } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";
import FinalCta from "@/components/sections/FinalCta";
import { pageMetadata } from "@/lib/seo";
import { guide } from "@/data/guide";
import { phoneFor, site } from "@/data/site";
import { getDictionary } from "@/i18n/dictionary";
import { localeConfig, locales, type Locale } from "@/i18n/locales";
import { localePath } from "@/i18n/routing";

type Params = { locale: Locale };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  return pageMetadata({
    locale,
    title: dict.meta.about.title,
    description: dict.meta.about.description,
    path: "/about",
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const a = dict.about;
  const phone = phoneFor(locale);

  const companyRows = [
    { label: a.companyLabels.name, value: site.name },
    { label: a.companyLabels.shortName, value: site.shortName },
    {
      label: a.companyLabels.representative,
      value: `${guide.nameRoman}（${guide.name}）`,
    },
    { label: a.companyLabels.address, value: dict.common.addressFull },
    { label: a.companyLabels.hours, value: dict.common.hoursNote },
    { label: a.companyLabels.tel, value: phone.display },
    { label: a.companyLabels.email, value: site.email },
  ];

  return (
    <>
      <PageHeader eyebrow={a.eyebrow} title={a.title} lead={a.lead} />
      <Breadcrumbs
        locale={locale}
        label={dict.breadcrumb.label}
        items={[
          { name: dict.breadcrumb.home, path: "" },
          { name: a.title, path: "/about" },
        ]}
      />

      {/* MISSION */}
      <section className="mx-auto max-w-4xl px-4 py-14 text-center md:px-6 md:py-20">
        <FadeIn>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-water-deep">
            {a.missionEyebrow}
          </p>
          <h2 className="mt-5 whitespace-pre-line font-display text-2xl font-bold leading-relaxed text-navy md:text-4xl md:leading-relaxed">
            {a.missionTitle}
          </h2>
          <p className="mx-auto mt-7 max-w-2xl whitespace-pre-line text-sm leading-loose text-ink-soft md:text-base md:leading-[2.2]">
            {a.missionBody}
          </p>
        </FadeIn>
      </section>

      {/* VISION */}
      <section className="relative overflow-hidden bg-forest-dark py-16 md:py-24">
        <div
          aria-hidden="true"
          className="animate-drift absolute -right-24 top-1/4 h-96 w-96 rounded-full bg-water/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-4xl px-4 text-center md:px-6">
          <FadeIn>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-sky">
              {a.visionEyebrow}
            </p>
            <h2 className="mt-5 font-display text-2xl font-bold leading-relaxed text-white md:text-3xl md:leading-relaxed">
              {a.visionTitle}
            </h2>
            <div className="mx-auto mt-8 max-w-2xl space-y-6 text-sm leading-loose text-white/85 md:text-base md:leading-[2.2]">
              {a.visionParagraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 代表紹介 */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <FadeIn>
          <SectionHeading eyebrow={a.guideEyebrow} title={a.guideTitle} />
        </FadeIn>
        <div className="grid items-start gap-10 md:grid-cols-[2fr_3fr] md:gap-14">
          <FadeIn>
            <div className="relative mx-auto aspect-[9/11] w-full max-w-sm overflow-hidden rounded-3xl shadow-card">
              <Image
                src={guide.image}
                alt={dict.guide.imageAlt}
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h3 className="font-display text-2xl font-semibold text-navy md:text-3xl">
              {locale === "ja" ? guide.name : guide.nameRoman}
              <span className="ml-3 text-sm font-medium tracking-widest text-ink-soft">
                {locale === "ja" ? guide.nameRoman : guide.name}
              </span>
            </h3>
            <p className="mt-1.5 text-sm font-bold text-forest">{dict.guide.role}</p>
            <div className="mt-5 space-y-4 text-sm leading-loose text-ink-soft md:text-[15px] md:leading-[2]">
              {dict.guide.profile.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-7 rounded-3xl bg-forest-light/60 p-6 md:p-7">
              <h4 className="text-sm font-bold tracking-wider text-forest-dark">
                {dict.guide.qualificationsTitle}
              </h4>
              <ul className="mt-3 space-y-2 text-sm text-ink">
                {dict.guide.qualifications.map((q) => (
                  <li key={q} className="flex items-start gap-2.5">
                    <Award aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-forest" />
                    {q}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 rounded-3xl border border-forest-light bg-white p-6 md:p-7">
              <h4 className="text-sm font-bold tracking-wider text-forest-dark">
                {a.riversTitle}
              </h4>
              <p className="mt-3 text-sm leading-loose text-ink-soft">{a.riversBody}</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 多言語対応のご案内 */}
      <section className="bg-forest-light/40 py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <FadeIn>
            <div className="rounded-3xl bg-white p-7 shadow-card md:p-10">
              <h2 className="flex items-center gap-2.5 font-display text-xl font-bold text-navy md:text-2xl">
                <Globe aria-hidden="true" className="h-6 w-6 shrink-0 text-water-deep" />
                {dict.languagesSection.title}
              </h2>
              <p className="mt-4 text-sm leading-loose text-ink-soft md:text-[15px]">
                {dict.languagesSection.body}
              </p>
              <h3 className="mt-6 text-xs font-bold tracking-wider text-forest-dark">
                {dict.languagesSection.listLabel}
              </h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {locales.map((item) => (
                  <li key={item}>
                    <Link
                      href={`/${item}/about`}
                      hrefLang={localeConfig[item].hreflang}
                      lang={localeConfig[item].htmlLang}
                      aria-current={item === locale ? "true" : undefined}
                      className={`inline-flex min-h-10 items-center rounded-full border px-4 text-sm transition-colors ${
                        item === locale
                          ? "border-forest bg-forest-light font-bold text-forest-dark"
                          : "border-forest-light text-ink hover:border-water hover:text-water-deep"
                      }`}
                    >
                      {localeConfig[item].label}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-5 rounded-2xl bg-water-light/60 p-4 text-xs leading-relaxed text-ink">
                {dict.languagesSection.note}
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 団体概要 */}
      <section className="bg-water-light/50 py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <FadeIn>
            <SectionHeading eyebrow={a.companyEyebrow} title={a.companyTitle} />
            <dl className="overflow-hidden rounded-3xl bg-white shadow-card">
              {companyRows.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[110px_1fr] gap-4 border-b border-forest-light/60 px-5 py-4 text-sm last:border-b-0 md:grid-cols-[180px_1fr] md:px-8"
                >
                  <dt className="font-bold text-ink-soft">{row.label}</dt>
                  <dd className="break-words text-ink">{row.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 text-center">
              <Link
                href={localePath(locale, "/projects")}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-water-deep transition-colors hover:text-navy"
              >
                {a.projectsLink}
                <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <FinalCta locale={locale} dict={dict} />
    </>
  );
}
