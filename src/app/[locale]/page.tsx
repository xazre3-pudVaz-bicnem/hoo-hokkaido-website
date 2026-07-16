import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  CalendarCheck,
  Compass,
  Leaf,
  LifeBuoy,
  MapPin,
  MessagesSquare,
  ShieldCheck,
  Trees,
  Users,
} from "lucide-react";
import Hero from "@/components/sections/Hero";
import FlowSteps from "@/components/sections/FlowSteps";
import FinalCta from "@/components/sections/FinalCta";
import AccessInfo from "@/components/sections/AccessInfo";
import ActivityCard from "@/components/ui/ActivityCard";
import BlogCard from "@/components/ui/BlogCard";
import FadeIn from "@/components/ui/FadeIn";
import FaqAccordion from "@/components/ui/FaqAccordion";
import SectionHeading from "@/components/ui/SectionHeading";
import WaveDivider from "@/components/ui/WaveDivider";
import JsonLd from "@/components/ui/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { faqJsonLd } from "@/lib/jsonld";
import { sortedActivities } from "@/data/activities";
import { getLatestBlogPosts } from "@/lib/blog";
import { guide, hasTestimonials } from "@/data/guide";
import { projects } from "@/data/projects";
import { getDictionary } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/locales";
import { localePath } from "@/i18n/routing";

type Params = { locale: Locale };

const highlightIcons = [MapPin, Users, Compass, CalendarCheck, Leaf];
const reasonIcons = [Award, ShieldCheck, LifeBuoy, Trees, MessagesSquare];
const purposeLinks = [
  "/activities/furano-relax-downriver",
  "/activities",
  "/furano-activity",
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
    title: dict.meta.home.title,
    description: dict.meta.home.description,
    path: "",
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  const [featured, ...others] = sortedActivities;
  const homeFaq = dict.faq.items.slice(0, 6);
  const latestPosts = getLatestBlogPosts(locale, 3);

  return (
    <>
      <JsonLd data={faqJsonLd(locale, homeFaq)} />

      {/* 1. ヒーロー */}
      <Hero locale={locale} dict={dict} />

      {/* 2. 重要情報バー */}
      <section aria-label={dict.home.highlights.label} className="bg-offwhite">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {dict.home.highlights.items.map((label, i) => {
              const Icon = highlightIcons[i % highlightIcons.length];
              return (
                <li
                  key={label}
                  className="flex items-center gap-2.5 rounded-2xl bg-white px-4 py-3.5 shadow-card"
                >
                  <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-water-deep" />
                  <span className="text-xs font-bold leading-snug text-navy md:text-[13px]">
                    {label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 3. 導入セクション */}
      <section className="bg-offwhite py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <FadeIn>
            <SectionHeading
              eyebrow={dict.home.intro.eyebrow}
              title={dict.home.intro.title}
            />
            <div className="space-y-6 text-sm leading-loose text-ink-soft md:text-base md:leading-[2.2]">
              {dict.home.intro.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 4. アクティビティ一覧 */}
      <section className="relative bg-water-light/60 py-16 md:py-24">
        <WaveDivider
          fill="var(--color-offwhite)"
          flip
          className="absolute inset-x-0 top-0 -translate-y-px"
        />
        <div className="mx-auto max-w-7xl px-4 pt-6 md:px-6">
          <FadeIn>
            <SectionHeading
              eyebrow={dict.home.activities.eyebrow}
              title={dict.home.activities.title}
              lead={dict.home.activities.lead}
            />
          </FadeIn>

          {/* 主力：富良野リラックスダウンリバーを最大サイズで表示 */}
          <FadeIn>
            <ActivityCard
              locale={locale}
              dict={dict}
              activity={featured}
              large
              priority
            />
          </FadeIn>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {others.map((activity, i) => (
              <FadeIn key={activity.slug} delay={i * 0.08}>
                <ActivityCard locale={locale} dict={dict} activity={activity} />
              </FadeIn>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href={localePath(locale, "/activities")}
              className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-forest px-8 py-3 text-sm font-bold text-forest transition-colors hover:bg-forest hover:text-white"
            >
              {dict.home.activities.seeAll}
              <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. 目的別の選び方 */}
      <section className="bg-offwhite py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <FadeIn>
            <SectionHeading
              eyebrow={dict.home.purpose.eyebrow}
              title={dict.home.purpose.title}
              lead={dict.home.purpose.lead}
            />
          </FadeIn>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {dict.home.purpose.cards.map((card, i) => (
              <FadeIn key={card.title} delay={i * 0.06}>
                <Link
                  href={localePath(locale, purposeLinks[i])}
                  className="group flex h-full flex-col rounded-3xl border border-forest-light bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-water hover:shadow-card-hover"
                >
                  <h3 className="text-base font-bold leading-snug text-navy">
                    {card.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
                    {card.body}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-water-deep">
                    {card.linkLabel}
                    <ArrowRight
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 6. HOOが選ばれる理由 */}
      <section className="relative overflow-hidden bg-forest-dark py-16 md:py-24">
        <div
          aria-hidden="true"
          className="animate-drift absolute -left-24 top-1/3 h-96 w-96 rounded-full bg-water/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <FadeIn>
            <SectionHeading
              eyebrow={dict.home.reasons.eyebrow}
              tone="light"
              title={dict.home.reasons.title}
            />
          </FadeIn>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dict.guide.reasons.map((reason, i) => {
              const Icon = reasonIcons[i % reasonIcons.length];
              return (
                <FadeIn key={reason.title} delay={i * 0.06}>
                  <div className="h-full rounded-3xl bg-white/[0.07] p-7 backdrop-blur-sm transition-colors hover:bg-white/[0.12]">
                    <Icon aria-hidden="true" className="h-7 w-7 text-sky" />
                    <h3 className="mt-4 text-base font-bold text-white">
                      {reason.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-white/75">
                      {reason.body}
                    </p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. 安全への取り組み */}
      <section className="bg-offwhite py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <FadeIn>
            <SectionHeading
              eyebrow={dict.home.safety.eyebrow}
              title={dict.home.safety.title}
              lead={dict.home.safety.lead}
            />
          </FadeIn>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dict.safety.commitments.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.05}>
                <div className="h-full rounded-3xl border border-forest-light bg-white p-6 shadow-card">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-forest-light">
                    <ShieldCheck aria-hidden="true" className="h-5 w-5 text-forest" />
                  </span>
                  <h3 className="mt-3.5 text-[15px] font-bold text-navy">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {item.body}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn>
            <div className="mt-10 text-center">
              <Link
                href={localePath(locale, "/safety")}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-water-deep transition-colors hover:text-navy"
              >
                {dict.home.safety.link}
                <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 8. 体験当日の流れ */}
      <section className="relative bg-forest-light/50 py-16 md:py-24">
        <WaveDivider
          fill="var(--color-offwhite)"
          flip
          className="absolute inset-x-0 top-0 -translate-y-px"
        />
        <div className="mx-auto max-w-3xl px-4 pt-6 md:px-6">
          <FadeIn>
            <SectionHeading
              eyebrow={dict.home.flow.eyebrow}
              title={dict.home.flow.title}
              lead={dict.home.flow.lead}
            />
          </FadeIn>
          <FadeIn>
            <div className="rounded-3xl bg-white p-7 shadow-card md:p-10">
              <FlowSteps steps={dict.safety.flowSteps} />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 9. 代表者・ガイド紹介 */}
      <section className="bg-offwhite py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid items-center gap-10 md:grid-cols-[2fr_3fr] md:gap-14">
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
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-water-deep">
                {dict.home.guide.eyebrow}
              </p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-navy md:text-3xl">
                {locale === "ja" ? guide.name : guide.nameRoman}
                <span className="ml-3 text-sm font-medium tracking-widest text-ink-soft">
                  {locale === "ja" ? guide.nameRoman : guide.name}
                </span>
              </h2>
              <p className="mt-1.5 text-sm font-bold text-forest">{dict.guide.role}</p>
              <div className="mt-5 space-y-4 text-sm leading-loose text-ink-soft md:text-[15px]">
                {dict.guide.profile.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-6 rounded-2xl bg-forest-light/60 p-5">
                <h3 className="text-xs font-bold tracking-wider text-forest-dark">
                  {dict.guide.qualificationsTitle}
                </h3>
                <ul className="mt-2.5 grid gap-1.5 text-sm text-ink sm:grid-cols-2">
                  {dict.guide.qualifications.map((q) => (
                    <li key={q} className="flex items-start gap-2">
                      <Award
                        aria-hidden="true"
                        className="mt-1 h-3.5 w-3.5 shrink-0 text-forest"
                      />
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href={localePath(locale, "/about")}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-water-deep transition-colors hover:text-navy"
              >
                {dict.home.guide.link}
                <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 10. プロジェクト紹介 */}
      <section className="bg-navy py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <FadeIn>
            <SectionHeading
              eyebrow={dict.home.projects.eyebrow}
              tone="light"
              title={dict.home.projects.title}
              lead={dict.home.projects.lead}
            />
          </FadeIn>
          <div className="grid gap-6 md:grid-cols-3">
            {projects.map((project, i) => {
              const t =
                dict.projects.items[
                  project.slug as keyof typeof dict.projects.items
                ];
              return (
                <FadeIn key={project.slug} delay={i * 0.08}>
                  <Link
                    href={localePath(locale, `/projects#${project.slug}`)}
                    className="group block h-full overflow-hidden rounded-3xl bg-white/[0.06] transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.12]"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={project.image}
                        alt={t.imageAlt}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sky">
                        {project.titleEn}
                      </p>
                      <h3 className="mt-2 text-lg font-bold text-white">{t.title}</h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-white/70">
                        {t.summary}
                      </p>
                    </div>
                  </Link>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* 11. お客様の声（正式な口コミが揃うまで準備中表示） */}
      <section className="bg-offwhite py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <FadeIn>
            <SectionHeading
              eyebrow={dict.home.voices.eyebrow}
              title={dict.home.voices.title}
            />
            {!hasTestimonials && (
              <p className="whitespace-pre-line rounded-3xl border border-dashed border-forest/40 bg-white px-6 py-10 text-sm leading-loose text-ink-soft">
                {dict.home.voices.preparing}
              </p>
            )}
          </FadeIn>
        </div>
      </section>

      {/* 12. よくある質問 */}
      <section className="bg-water-light/50 py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <FadeIn>
            <SectionHeading
              eyebrow={dict.home.faq.eyebrow}
              title={dict.home.faq.title}
              lead={dict.home.faq.lead}
            />
          </FadeIn>
          <FadeIn>
            <FaqAccordion faqs={homeFaq} />
            <div className="mt-8 text-center">
              <Link
                href={localePath(locale, "/faq")}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-water-deep transition-colors hover:text-navy"
              >
                {dict.home.faq.seeAll}
                <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 13. 最新のブログ（記事がある言語だけ表示） */}
      {latestPosts.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <FadeIn>
              <SectionHeading
                eyebrow={dict.home.blog.eyebrow}
                title={dict.home.blog.title}
                lead={dict.home.blog.lead}
              />
            </FadeIn>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post, i) => (
                <BlogCard key={post.slug} locale={locale} post={post} index={i} />
              ))}
            </div>
            <FadeIn>
              <div className="mt-8 text-center">
                <Link
                  href={localePath(locale, "/blog")}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-water-deep transition-colors hover:text-navy"
                >
                  {dict.home.blog.seeAll}
                  <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* 14. アクセス */}
      <section className="bg-offwhite py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <FadeIn>
            <SectionHeading
              eyebrow={dict.home.access.eyebrow}
              title={dict.home.access.title}
            />
          </FadeIn>
          <FadeIn>
            <AccessInfo locale={locale} dict={dict} />
          </FadeIn>
        </div>
      </section>

      {/* 15. 最終CTA */}
      <FinalCta locale={locale} dict={dict} />
    </>
  );
}
