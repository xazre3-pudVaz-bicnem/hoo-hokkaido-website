import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, CloudRain, HelpCircle, Shirt } from "lucide-react";
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
import { guide } from "@/data/guide";
import { getDictionary } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/locales";
import { localePath } from "@/i18n/routing";

type Params = { locale: Locale };

const beforeIcons = [Shirt, CloudRain, HelpCircle];
const relatedLinks = [
  "/furano-activity",
  "/activities/furano-relax-downriver",
  "/faq",
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
    title: dict.meta.furanoRafting.title,
    description: dict.meta.furanoRafting.description,
    path: "/furano-rafting",
  });
}

export default async function FuranoRaftingPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const p = dict.furanoRafting;
  const furano = getActivity("furano-relax-downriver")!;

  return (
    <>
      <JsonLd data={faqJsonLd(locale, p.faq)} />
      <PageHeader eyebrow={p.eyebrow} title={p.title} lead={p.lead} />
      <Breadcrumbs
        locale={locale}
        label={dict.breadcrumb.label}
        items={[
          { name: dict.breadcrumb.home, path: "" },
          { name: dict.sitemap.links.furanoRafting, path: "/furano-rafting" },
        ]}
      />

      {/* 導入 */}
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

      {/* 選び方のポイント */}
      <section className="bg-water-light/50 py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <FadeIn>
            <SectionHeading eyebrow={p.compareEyebrow} title={p.compareTitle} />
          </FadeIn>
          <div className="grid gap-5 md:grid-cols-2">
            {p.comparePoints.map((point, i) => (
              <FadeIn key={point.title} delay={i * 0.06}>
                <div className="h-full rounded-3xl bg-white p-7 shadow-card">
                  <h3 className="flex items-start gap-3 text-base font-bold text-navy md:text-lg">
                    <span className="font-display text-xl leading-none text-water-deep">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {point.title}
                  </h3>
                  <p className="mt-3 text-sm leading-loose text-ink-soft">
                    {point.body}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* HOOの体験 */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <FadeIn>
          <SectionHeading
            eyebrow={p.programEyebrow}
            title={p.programTitle}
            lead={p.programLead}
          />
        </FadeIn>
        <FadeIn>
          <ActivityCard locale={locale} dict={dict} activity={furano} large />
        </FadeIn>
      </section>

      {/* 初参加前の確認事項 */}
      <section className="bg-forest-light/40 py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <FadeIn>
            <SectionHeading eyebrow={p.beforeEyebrow} title={p.beforeTitle} />
          </FadeIn>
          <div className="grid gap-5 md:grid-cols-3">
            {p.beforeCards.map((card, i) => {
              const Icon = beforeIcons[i % beforeIcons.length];
              return (
                <FadeIn key={card.title} delay={i * 0.07}>
                  <div className="h-full rounded-3xl bg-white p-7 shadow-card">
                    <Icon aria-hidden="true" className="h-7 w-7 text-water-deep" />
                    <h3 className="mt-4 text-base font-bold text-navy">{card.title}</h3>
                    <p className="mt-3 text-sm leading-loose text-ink-soft">
                      {card.body}
                    </p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ガイド経験 */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <FadeIn>
            <div className="relative aspect-[16/11] overflow-hidden rounded-3xl shadow-card">
              <Image
                src={guide.safetyImage}
                alt={p.guideImageAlt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="font-display text-2xl font-bold leading-relaxed text-navy md:text-3xl">
              {p.guideTitle}
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-loose text-ink-soft md:text-[15px]">
              {p.guideParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <Link
              href={localePath(locale, "/safety")}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-water-deep transition-colors hover:text-navy"
            >
              {p.guideLink}
              <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-water-light/50 py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <FadeIn>
            <SectionHeading eyebrow={p.faqEyebrow} title={p.faqTitle} />
            <FaqAccordion faqs={p.faq} />
            <ul className="mt-8 space-y-2 text-sm">
              {p.relatedLinks.map((label, i) => (
                <li key={label}>
                  <Link
                    href={localePath(locale, relatedLinks[i])}
                    className="inline-flex items-center gap-1.5 font-bold text-water-deep transition-colors hover:text-navy"
                  >
                    <CheckCircle2 aria-hidden="true" className="h-4 w-4 shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </section>

      <FinalCta locale={locale} dict={dict} title={p.ctaTitle} />
    </>
  );
}
