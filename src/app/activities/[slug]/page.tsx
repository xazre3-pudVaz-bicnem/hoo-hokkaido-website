import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Shirt,
  Users,
} from "lucide-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/ui/FadeIn";
import FaqAccordion from "@/components/ui/FaqAccordion";
import JsonLd from "@/components/ui/JsonLd";
import SectionHeading from "@/components/ui/SectionHeading";
import ActivityCard from "@/components/ui/ActivityCard";
import FlowSteps from "@/components/sections/FlowSteps";
import AccessInfo from "@/components/sections/AccessInfo";
import { pageMetadata } from "@/lib/seo";
import { faqJsonLd, serviceJsonLd } from "@/lib/jsonld";
import {
  activities,
  getActivity,
  getRelatedActivities,
} from "@/data/activities";
import { site } from "@/data/site";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return activities.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const activity = getActivity(slug);
  if (!activity) return {};
  return pageMetadata({
    title: `${activity.name}｜${activity.area}のリバーアクティビティ`,
    description: `${activity.catchcopy} ${activity.price.display}（${activity.price.unit}）・${activity.minParticipantsDisplay}。${activity.summary}`,
    path: `/activities/${activity.slug}`,
    ogImage: activity.image.src,
  });
}

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const activity = getActivity(slug);
  if (!activity) notFound();

  const related = getRelatedActivities(slug);
  const isFurano = slug === "furano-relax-downriver";

  const infoRows = [
    { icon: Clock, label: "所要時間", value: activity.duration },
    { icon: Calendar, label: "開催期間", value: activity.period },
    { icon: Users, label: "対象年齢", value: activity.targetAge },
    { icon: MapPin, label: "集合場所", value: activity.meetingPlace },
    { icon: Shirt, label: "服装・持ち物", value: activity.clothing },
  ];

  return (
    <>
      <JsonLd data={[serviceJsonLd(activity), faqJsonLd(activity.faq)]} />

      {/* メインビジュアル */}
      <div className="relative h-[52svh] min-h-[380px] w-full overflow-hidden bg-navy pt-16 md:h-[62svh] md:pt-20">
        <Image
          src={activity.image.src}
          alt={activity.image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/25 to-navy/25" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-6xl px-4 pb-10 md:px-6 md:pb-14">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-water-deep/90 px-3.5 py-1.5 text-xs font-bold tracking-wider text-white">
              <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
              開催エリア：{activity.area}
            </p>
            <h1 className="mt-4 font-display text-3xl font-bold leading-snug text-white md:text-5xl">
              {activity.name}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/90 md:text-lg">
              {activity.catchcopy}
            </p>
          </div>
        </div>
      </div>

      <Breadcrumbs
        items={[
          { name: "ホーム", path: "/" },
          { name: "アクティビティ", path: "/activities" },
          { name: activity.name, path: `/activities/${activity.slug}` },
        ]}
      />

      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          {/* 本文 */}
          <div className="min-w-0">
            {/* 体験概要 */}
            <FadeIn>
              <section className="pt-4">
                <h2 className="font-display text-2xl font-bold text-navy">体験概要</h2>
                <div className="mt-5 space-y-4 text-sm leading-loose text-ink-soft md:text-[15px] md:leading-[2]">
                  {activity.description.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {isFurano && (
                  <p className="mt-5 rounded-2xl bg-water-light/70 p-5 text-sm leading-loose text-ink">
                    「富良野でラフティングや川遊びをしてみたい」という方にも選ばれているプログラムです。
                    激流を下るタイプの体験ではなく、富良野の川の自然をゆっくり楽しむダウンリバーです。
                    体験内容で迷ったら、
                    <Link href="/furano-rafting" className="font-bold text-water-deep underline underline-offset-2 hover:text-navy">
                      富良野のラフティング・川体験の選び方
                    </Link>
                    もご覧ください。
                  </p>
                )}
              </section>
            </FadeIn>

            {/* 特徴 */}
            <FadeIn>
              <section className="pt-14">
                <h2 className="font-display text-2xl font-bold text-navy">体験の特徴</h2>
                <div className="mt-6 space-y-4">
                  {activity.features.map((feature, i) => (
                    <div
                      key={feature.title}
                      className="rounded-3xl border border-forest-light bg-white p-6 shadow-card md:p-7"
                    >
                      <h3 className="flex items-start gap-3 text-base font-bold text-navy md:text-lg">
                        <span className="font-display text-xl leading-none text-water-deep">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {feature.title}
                      </h3>
                      <p className="mt-3 text-sm leading-loose text-ink-soft">
                        {feature.body}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </FadeIn>

            {/* おすすめの利用者 */}
            <FadeIn>
              <section className="pt-14">
                <h2 className="font-display text-2xl font-bold text-navy">
                  こんな方におすすめ
                </h2>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {activity.recommendedFor.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 rounded-2xl bg-forest-light/50 px-5 py-4 text-sm font-medium text-ink"
                    >
                      <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            </FadeIn>

            {/* 当日の流れ */}
            <FadeIn>
              <section className="pt-14">
                <h2 className="font-display text-2xl font-bold text-navy">当日の流れ</h2>
                <div className="mt-6 rounded-3xl bg-white p-7 shadow-card md:p-9">
                  <FlowSteps steps={activity.flow} />
                </div>
              </section>
            </FadeIn>

            {/* 注意事項 */}
            <FadeIn>
              <section className="pt-14">
                <h2 className="font-display text-2xl font-bold text-navy">注意事項</h2>
                <ul className="mt-6 space-y-3">
                  {activity.notes.map((note) => (
                    <li
                      key={note}
                      className="flex items-start gap-2.5 rounded-2xl border border-forest-light bg-white px-5 py-4 text-sm leading-relaxed text-ink-soft"
                    >
                      <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-water-deep" />
                      {note}
                    </li>
                  ))}
                </ul>
              </section>
            </FadeIn>

            {/* FAQ */}
            <FadeIn>
              <section className="pt-14">
                <h2 className="font-display text-2xl font-bold text-navy">
                  よくある質問
                </h2>
                <div className="mt-6">
                  <FaqAccordion faqs={activity.faq} />
                </div>
                <p className="mt-5 text-sm text-ink-soft">
                  そのほかのご質問は
                  <Link href="/faq" className="mx-1 font-bold text-water-deep underline underline-offset-2 hover:text-navy">
                    よくある質問
                  </Link>
                  もご覧ください。
                </p>
              </section>
            </FadeIn>
          </div>

          {/* サイド：料金・予約 */}
          <aside className="lg:pt-4">
            <div className="rounded-3xl border border-forest-light bg-white p-7 shadow-card lg:sticky lg:top-28">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-water-deep">
                {activity.areaEn}
              </p>
              <p className="mt-3 text-xs text-ink-soft">料金（税込）</p>
              <p className="mt-1">
                <span className="font-display text-4xl font-bold text-forest-dark">
                  {activity.price.display}
                </span>
                <span className="ml-2 text-sm text-ink-soft">{activity.price.unit}</span>
              </p>
              <p className="mt-2 text-xs leading-relaxed text-ink-soft">
                {activity.price.note}
              </p>

              <dl className="mt-6 space-y-3.5 border-t border-forest-light pt-6">
                <div className="flex items-start gap-3">
                  <Users aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                  <div>
                    <dt className="text-xs font-bold text-ink-soft">最少催行人数</dt>
                    <dd className="text-sm font-bold text-navy">
                      {activity.minParticipantsDisplay}
                    </dd>
                  </div>
                </div>
                {infoRows.map((row) => (
                  <div key={row.label} className="flex items-start gap-3">
                    <row.icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                    <div>
                      <dt className="text-xs font-bold text-ink-soft">{row.label}</dt>
                      <dd className="text-sm text-ink">{row.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>

              <div className="mt-7 space-y-3">
                <Button
                  href={`/reservation?activity=${activity.slug}`}
                  variant="water"
                  size="lg"
                  className="w-full"
                >
                  このアクティビティを予約する
                </Button>
                <Button href={site.tel.link} variant="outline" className="w-full">
                  <Phone aria-hidden="true" className="h-4 w-4" />
                  {site.tel.display}
                </Button>
              </div>
              <p className="mt-4 text-center text-[11px] leading-relaxed text-ink-soft">
                フォーム送信時点では予約確定ではありません。
                <br />
                担当者からの連絡をもって確定となります。
              </p>
            </div>
          </aside>
        </div>

        {/* アクセス・集合場所 */}
        <FadeIn>
          <section className="pt-20">
            <SectionHeading
              eyebrow="Access"
              title="アクセス・集合場所"
              lead="集合場所は開催エリアにより異なります。ご予約時に詳しくご案内します。"
            />
            <AccessInfo />
          </section>
        </FadeIn>

        {/* 関連アクティビティ */}
        <FadeIn>
          <section className="py-20">
            <SectionHeading
              eyebrow="Other Activities"
              title="その他のアクティビティ"
            />
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((a) => (
                <ActivityCard key={a.slug} activity={a} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/activities"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-water-deep transition-colors hover:text-navy"
              >
                アクティビティ一覧へ戻る
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </FadeIn>
      </div>
    </>
  );
}
