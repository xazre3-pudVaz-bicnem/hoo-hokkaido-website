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
import FadeIn from "@/components/ui/FadeIn";
import FaqAccordion from "@/components/ui/FaqAccordion";
import SectionHeading from "@/components/ui/SectionHeading";
import WaveDivider from "@/components/ui/WaveDivider";
import JsonLd from "@/components/ui/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { faqJsonLd } from "@/lib/jsonld";
import { sortedActivities } from "@/data/activities";
import { generalFaq } from "@/data/faq";
import { guide, reasons } from "@/data/guide";
import { projects } from "@/data/projects";
import {
  experienceFlow,
  purposeCards,
  safetyCommitments,
  testimonials,
} from "@/data/safety";
import { site } from "@/data/site";

export const metadata = pageMetadata({
  title: `富良野のアクティビティ・リバー体験｜${site.name}`,
  description:
    "富良野・美瑛・旭川で北海道の自然を楽しむリバーアクティビティ。Hokkaido Outdoor Organizationでは、経験豊富なガイドがリラックスダウンリバーなどの自然体験をご案内します。",
  path: "/",
});

const highlightItems = [
  { icon: MapPin, label: "富良野を拠点に開催" },
  { icon: Users, label: "2名から参加可能" },
  { icon: Compass, label: "経験豊富なガイドが案内" },
  { icon: CalendarCheck, label: "事前予約制" },
  { icon: Leaf, label: "自然をゆっくり楽しめる体験" },
];

const reasonIcons = [Award, ShieldCheck, LifeBuoy, Trees, MessagesSquare];

const homeFaq = generalFaq.slice(0, 6);

export default function HomePage() {
  const [featured, ...others] = sortedActivities;

  return (
    <>
      <JsonLd data={faqJsonLd(homeFaq)} />

      {/* 1. ヒーロー */}
      <Hero />

      {/* 2. 重要情報バー */}
      <section aria-label="HOOの体験の特徴" className="bg-offwhite">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {highlightItems.map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-2.5 rounded-2xl bg-white px-4 py-3.5 shadow-card"
              >
                <item.icon aria-hidden="true" className="h-5 w-5 shrink-0 text-water-deep" />
                <span className="text-xs font-bold leading-snug text-navy md:text-[13px]">
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. 導入セクション */}
      <section className="bg-offwhite py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <FadeIn>
            <SectionHeading
              eyebrow="Into the Nature"
              title={"ただ見るだけではない、\n北海道の自然の中へ。"}
            />
            <div className="space-y-6 text-sm leading-loose text-ink-soft md:text-base md:leading-[2.2]">
              <p>
                Hokkaido Outdoor Organizationが届けるのは、
                <br className="hidden md:block" />
                観光地を眺めるだけでは得られない体験です。
              </p>
              <p>
                流れる水に触れ、森の音を聞き、
                <br className="hidden md:block" />
                北海道の大地を全身で感じる。
              </p>
              <p>
                富良野、美瑛、旭川の自然を、
                <br className="hidden md:block" />
                経験豊富なガイドと一緒に楽しんでください。
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 4. アクティビティ一覧 */}
      <section className="relative bg-water-light/60 py-16 md:py-24">
        <WaveDivider fill="var(--color-offwhite)" flip className="absolute inset-x-0 top-0 -translate-y-px" />
        <div className="mx-auto max-w-7xl px-4 pt-6 md:px-6">
          <FadeIn>
            <SectionHeading
              eyebrow="Activities"
              title="アクティビティ"
              lead="富良野を中心に、美瑛・旭川エリアでもリバーアクティビティを開催しています。すべて事前予約制・2名から参加できます。"
            />
          </FadeIn>

          {/* 主力：富良野リラックスダウンリバーを最大サイズで表示 */}
          <FadeIn>
            <ActivityCard activity={featured} large priority />
          </FadeIn>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {others.map((activity, i) => (
              <FadeIn key={activity.slug} delay={i * 0.08}>
                <ActivityCard activity={activity} />
              </FadeIn>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/activities"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-forest px-8 py-3 text-sm font-bold text-forest transition-colors hover:bg-forest hover:text-white"
            >
              アクティビティ一覧を見る
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. 目的別の選び方 */}
      <section className="bg-offwhite py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <FadeIn>
            <SectionHeading
              eyebrow="Find Your Experience"
              title="目的から体験を選ぶ"
              lead="どのアクティビティにするか迷ったら、目的に近いものからお選びください。"
            />
          </FadeIn>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {purposeCards.map((card, i) => (
              <FadeIn key={card.title} delay={i * 0.06}>
                <Link
                  href={card.href}
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
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
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
              eyebrow="Why HOO"
              tone="light"
              title={"自然を知るガイドと、\n北海道の川を楽しむ。"}
            />
          </FadeIn>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reasons.map((reason, i) => {
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
              eyebrow="Safety"
              title="安全への取り組み"
              lead="自然が相手のアクティビティだからこそ、無理をしない運営を大切にしています。"
            />
          </FadeIn>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {safetyCommitments.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.05}>
                <div className="h-full rounded-3xl border border-forest-light bg-white p-6 shadow-card">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-forest-light">
                    <ShieldCheck aria-hidden="true" className="h-5 w-5 text-forest" />
                  </span>
                  <h3 className="mt-3.5 text-[15px] font-bold text-navy">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn>
            <div className="mt-10 text-center">
              <Link
                href="/safety"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-water-deep transition-colors hover:text-navy"
              >
                安全への取り組みを詳しく見る
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 8. 体験当日の流れ */}
      <section className="relative bg-forest-light/50 py-16 md:py-24">
        <WaveDivider fill="var(--color-offwhite)" flip className="absolute inset-x-0 top-0 -translate-y-px" />
        <div className="mx-auto max-w-3xl px-4 pt-6 md:px-6">
          <FadeIn>
            <SectionHeading
              eyebrow="Flow"
              title="体験当日までの流れ"
              lead="集合場所・持ち物などの詳細は、ご予約時にご案内します。"
            />
          </FadeIn>
          <FadeIn>
            <div className="rounded-3xl bg-white p-7 shadow-card md:p-10">
              <FlowSteps steps={experienceFlow} />
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
                  src={guide.image.src}
                  alt={guide.image.alt}
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-water-deep">
                Guide
              </p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-navy md:text-3xl">
                {guide.name}
                <span className="ml-3 text-sm font-medium tracking-widest text-ink-soft">
                  {guide.nameRoman}
                </span>
              </h2>
              <p className="mt-1.5 text-sm font-bold text-forest">{guide.role}</p>
              <div className="mt-5 space-y-4 text-sm leading-loose text-ink-soft md:text-[15px]">
                {guide.profile.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-6 rounded-2xl bg-forest-light/60 p-5">
                <h3 className="text-xs font-bold tracking-wider text-forest-dark">保有資格</h3>
                <ul className="mt-2.5 grid gap-1.5 text-sm text-ink sm:grid-cols-2">
                  {guide.qualifications.map((q) => (
                    <li key={q} className="flex items-start gap-2">
                      <Award aria-hidden="true" className="mt-1 h-3.5 w-3.5 shrink-0 text-forest" />
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/about"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-water-deep transition-colors hover:text-navy"
              >
                HOOについて詳しく見る
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
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
              eyebrow="Projects"
              tone="light"
              title="体験のその先へ。HOOの取り組み"
              lead="アクティビティの提供だけでなく、北海道の川と地域の未来を育てる活動を続けています。"
            />
          </FadeIn>
          <div className="grid gap-6 md:grid-cols-3">
            {projects.map((project, i) => (
              <FadeIn key={project.slug} delay={i * 0.08}>
                <Link
                  href={`/projects#${project.slug}`}
                  className="group block h-full overflow-hidden rounded-3xl bg-white/[0.06] transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.12]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={project.image.src}
                      alt={project.image.alt}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sky">
                      {project.titleEn}
                    </p>
                    <h3 className="mt-2 text-lg font-bold text-white">{project.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-white/70">
                      {project.summary}
                    </p>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 11. お客様の声（正式な口コミが揃うまで準備中表示） */}
      <section className="bg-offwhite py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <FadeIn>
            <SectionHeading eyebrow="Voices" title="体験者の声" />
            {testimonials.length === 0 ? (
              <p className="rounded-3xl border border-dashed border-forest/40 bg-white px-6 py-10 text-sm text-ink-soft">
                体験者の声は現在準備中です。
                <br />
                体験のご感想は、今後こちらでご紹介していきます。
              </p>
            ) : (
              <div className="grid gap-4 text-left sm:grid-cols-2">
                {testimonials.map((t) => (
                  <figure key={t.name + t.date} className="rounded-3xl bg-white p-6 shadow-card">
                    <blockquote className="text-sm leading-loose text-ink-soft">
                      {t.body}
                    </blockquote>
                    <figcaption className="mt-4 text-xs font-bold text-navy">
                      {t.name}
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}
          </FadeIn>
        </div>
      </section>

      {/* 12. よくある質問 */}
      <section className="bg-water-light/50 py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <FadeIn>
            <SectionHeading
              eyebrow="FAQ"
              title="よくある質問"
              lead="そのほかのご質問は、お気軽にお問い合わせください。"
            />
          </FadeIn>
          <FadeIn>
            <FaqAccordion faqs={homeFaq} />
            <div className="mt-8 text-center">
              <Link
                href="/faq"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-water-deep transition-colors hover:text-navy"
              >
                すべての質問を見る
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 13. アクセス */}
      <section className="bg-offwhite py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <FadeIn>
            <SectionHeading eyebrow="Access" title="アクセス" />
          </FadeIn>
          <FadeIn>
            <AccessInfo />
          </FadeIn>
        </div>
      </section>

      {/* 14. 最終CTA */}
      <FinalCta />
    </>
  );
}
