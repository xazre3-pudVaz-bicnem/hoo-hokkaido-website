import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Heart, Mountain, Users } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import FadeIn from "@/components/ui/FadeIn";
import FaqAccordion from "@/components/ui/FaqAccordion";
import JsonLd from "@/components/ui/JsonLd";
import SectionHeading from "@/components/ui/SectionHeading";
import ActivityCard from "@/components/ui/ActivityCard";
import FinalCta from "@/components/sections/FinalCta";
import { pageMetadata } from "@/lib/seo";
import { faqJsonLd } from "@/lib/jsonld";
import { getActivity } from "@/data/activities";
import { getDictionary } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/locales";
import { localePath } from "@/i18n/routing";

type Params = { locale: Locale };

const styleIcons = [Users, Heart, Mountain];
const styleLinks = [
  "/activities/furano-relax-downriver",
  "/activities/furano-relax-downriver",
  "/activities/organize-program",
];

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  return pageMetadata({
    locale,
    title: dict.meta.furanoActivity.title,
    description: dict.meta.furanoActivity.description,
    path: "/furano-activity",
  });
}

export default async function FuranoActivityPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const p = dict.furanoActivity;

  const furano = getActivity("furano-relax-downriver")!;
  const biei = getActivity("biei-relax-downriver")!;
  const asahikawa = getActivity("asahikawa-relax-downriver")!;

  return (
    <>
      <JsonLd data={faqJsonLd(locale, p.faq)} />
      <PageHeader eyebrow={p.eyebrow} title={p.title} lead={p.lead} />
      <Breadcrumbs
        locale={locale}
        label={dict.breadcrumb.label}
        items={[
          { name: dict.breadcrumb.home, path: "" },
          { name: dict.sitemap.links.furanoActivity, path: "/furano-activity" },
        ]}
      />

      {/* 富良野で楽しめる自然体験 */}
      <section className="mx-auto max-w-4xl px-4 pb-16 pt-6 md:px-6">
        <FadeIn>
          <h2 className="font-display text-2xl font-bold leading-relaxed text-navy md:text-3xl">
            {p.introTitle}
          </h2>
          <div className="mt-6 space-y-5 text-sm leading-loose text-ink-soft md:text-[15px] md:leading-[2]">
            {p.introParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* スタイル別の選び方 */}
      <section className="bg-water-light/50 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <FadeIn>
            <SectionHeading eyebrow={p.styleEyebrow} title={p.styleTitle} />
          </FadeIn>
          <div className="grid gap-5 md:grid-cols-3">
            {p.styleCards.map((style, i) => {
              const Icon = styleIcons[i % styleIcons.length];
              return (
                <FadeIn key={style.title} delay={i * 0.07}>
                  <div className="flex h-full flex-col rounded-3xl bg-white p-7 shadow-card">
                    <Icon aria-hidden="true" className="h-7 w-7 text-water-deep" />
                    <h3 className="mt-4 text-lg font-bold text-navy">{style.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-loose text-ink-soft">
                      {style.body}
                    </p>
                    <Link
                      href={localePath(locale, styleLinks[i])}
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-water-deep transition-colors hover:text-navy"
                    >
                      {style.linkLabel}
                      <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
                    </Link>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* 川のアクティビティの魅力 */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <FadeIn>
            <div className="relative aspect-[16/11] overflow-hidden rounded-3xl shadow-card">
              <Image
                src="/images/common/river-landscape.jpg"
                alt={p.whyImageAlt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="font-display text-2xl font-bold leading-relaxed text-navy md:text-3xl">
              {p.whyTitle}
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-loose text-ink-soft md:text-[15px]">
              {p.whyParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 予約前に確認したいこと */}
      <section className="bg-forest-light/40 py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <FadeIn>
            <SectionHeading eyebrow={p.checkEyebrow} title={p.checkTitle} />
            <ul className="space-y-3">
              {p.checkPoints.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 rounded-2xl bg-white px-5 py-4 text-sm leading-relaxed text-ink shadow-card"
                >
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0 text-forest"
                  />
                  {point}
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </section>

      {/* 富良野リラックスダウンリバー紹介 */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <FadeIn>
          <SectionHeading
            eyebrow={p.recommendedEyebrow}
            title={p.recommendedTitle}
            lead={p.recommendedLead}
          />
        </FadeIn>
        <FadeIn>
          <ActivityCard locale={locale} dict={dict} activity={furano} large />
        </FadeIn>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <FadeIn>
            <ActivityCard locale={locale} dict={dict} activity={biei} />
          </FadeIn>
          <FadeIn delay={0.08}>
            <ActivityCard locale={locale} dict={dict} activity={asahikawa} />
          </FadeIn>
        </div>
      </section>

      {/* ガイドと安全 */}
      <section className="bg-navy py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <FadeIn>
            <SectionHeading
              eyebrow={p.guideEyebrow}
              tone="light"
              title={p.guideTitle}
            />
            <p className="mx-auto max-w-2xl text-sm leading-loose text-white/85 md:text-[15px]">
              {p.guideBody}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={localePath(locale, "/about")}
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white/10 px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-white/20"
              >
                {p.guideLinkProfile}
                <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
              </Link>
              <Link
                href={localePath(locale, "/safety")}
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white/10 px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-white/20"
              >
                {p.guideLinkSafety}
                <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-20">
        <FadeIn>
          <SectionHeading eyebrow={p.faqEyebrow} title={p.faqTitle} />
          <FaqAccordion faqs={p.faq} />
        </FadeIn>
      </section>

      <FinalCta locale={locale} dict={dict} title={p.ctaTitle} />
    </>
  );
}
