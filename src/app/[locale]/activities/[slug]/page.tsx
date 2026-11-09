import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  Baby,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  Phone,
  Shirt,
  Timer,
  Users,
} from "lucide-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/ui/FadeIn";
import FaqAccordion from "@/components/ui/FaqAccordion";
import JsonLd from "@/components/ui/JsonLd";
import PhotoGallery from "@/components/ui/PhotoGallery";
import SectionHeading from "@/components/ui/SectionHeading";
import TextWithLink from "@/components/ui/TextWithLink";
import ActivityCard from "@/components/ui/ActivityCard";
import FlowSteps from "@/components/sections/FlowSteps";
import { pageMetadata } from "@/lib/seo";
import { faqJsonLd, serviceJsonLd } from "@/lib/jsonld";
import { activities, getActivity, getRelatedActivities } from "@/data/activities";
import { phoneFor } from "@/data/site";
import { format, getDictionary, type Dictionary } from "@/i18n/dictionary";
import { locales, type Locale } from "@/i18n/locales";
import { localePath } from "@/i18n/routing";
import {
  formatDuration,
  formatMinParticipants,
  formatPeriod,
  formatSessions,
  formatTargetAge,
  planLabel,
  priceCaption,
  priceNote,
  priceRows,
} from "@/lib/format";

type Params = { locale: Locale; slug: string };

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => activities.map((a) => ({ locale, slug: a.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const activity = getActivity(slug);
  if (!activity) return {};
  const dict = await getDictionary(locale);
  const t = dict.activities[slug as keyof Dictionary["activities"]];
  return pageMetadata({
    locale,
    title: t.meta.title,
    description: t.meta.description,
    path: `/activities/${slug}`,
    ogImage: activity.image,
  });
}

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale, slug } = await params;
  const activity = getActivity(slug);
  if (!activity) notFound();

  const dict = await getDictionary(locale);
  const t = dict.activities[slug as keyof Dictionary["activities"]];
  const d = dict.activityDetail;
  const related = getRelatedActivities(slug);
  const phone = phoneFor(locale);

  const multiPlan = activity.plans.length > 1;
  const firstPlan = activity.plans[0];
  const rows = priceRows(activity, locale, dict);
  const caption = priceCaption(activity, dict);
  const meetingName = d.meeting[activity.meeting.place];
  const meetingNote =
    activity.meeting.place === "hotelPickup"
      ? d.meetingNote.hotelPickup
      : activity.meeting.place === "furanoDelivery"
        ? d.meetingNote.furanoDelivery
        : d.meetingNote.place;

  // 体験の違いを案内する注記（富良野の2つの川の体験 → 選び方ページへ）
  const guideNote =
    slug === "furano-relax-downriver"
      ? d.furanoNote
      : slug === "furano-rafting"
        ? d.raftingNote
        : null;

  const sessions = multiPlan
    ? activity.plans.map((plan) =>
        format(d.planSessions, {
          plan: planLabel(plan, dict, false),
          sessions: formatSessions(plan, dict),
        })
      )
    : [formatSessions(firstPlan, dict)];

  const infoRows: {
    icon: typeof Clock;
    label: string;
    values: string[];
    strong?: boolean;
  }[] = [
    { icon: Users, label: dict.common.minParticipantsLabel, values: [formatMinParticipants(activity, dict)], strong: true },
    ...(multiPlan
      ? []
      : [{ icon: Timer, label: d.labels.duration, values: [formatDuration(firstPlan, dict)] }]),
    { icon: Clock, label: d.labels.sessions, values: sessions },
    { icon: Calendar, label: d.labels.period, values: [formatPeriod(activity, dict)] },
    ...(activity.category === "rental"
      ? []
      : [{ icon: Baby, label: d.labels.targetAge, values: [formatTargetAge(activity, dict)] }]),
  ];

  return (
    <>
      <JsonLd data={[serviceJsonLd(locale, dict, activity), faqJsonLd(locale, t.faq)]} />

      {/* メインビジュアル */}
      <div className="relative h-[52svh] min-h-[380px] w-full overflow-hidden bg-navy pt-16 md:h-[62svh] md:pt-20">
        <Image
          src={activity.hero}
          alt={t.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/25 to-navy/25" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-6xl px-4 pb-10 md:px-6 md:pb-14">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-water-deep/90 px-3.5 py-1.5 text-xs font-bold tracking-wider text-white">
              <MapPin aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
              {dict.common.areaLabel}: {t.area}
            </p>
            <h1 className="mt-4 font-display text-2xl font-bold leading-snug text-white sm:text-3xl md:text-5xl">
              {t.name}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/90 md:text-lg">
              {t.catchcopy}
            </p>
          </div>
        </div>
      </div>

      <Breadcrumbs
        locale={locale}
        label={dict.breadcrumb.label}
        items={[
          { name: dict.breadcrumb.home, path: "" },
          { name: dict.activitiesPage.title, path: "/activities" },
          { name: t.name, path: `/activities/${slug}` },
        ]}
      />

      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="min-w-0">
            {/* 体験概要 */}
            <FadeIn>
              <section className="pt-4">
                <p className="text-xs font-bold tracking-wider text-forest">
                  {d.seasons[activity.season]}・{d.categories[activity.category]}
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold text-navy">{d.overview}</h2>
                <div className="mt-5 space-y-4 text-sm leading-loose text-ink-soft md:text-[15px] md:leading-[2]">
                  {t.description.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {guideNote && (
                  <p className="mt-5 rounded-2xl bg-water-light/70 p-5 text-sm leading-loose text-ink">
                    <TextWithLink
                      text={guideNote}
                      href={localePath(locale, "/furano-rafting")}
                      label={d.furanoNoteLink}
                    />
                  </p>
                )}
              </section>
            </FadeIn>

            {/* 特徴 */}
            <FadeIn>
              <section className="pt-14">
                <h2 className="font-display text-2xl font-bold text-navy">{d.features}</h2>
                <div className="mt-6 space-y-4">
                  {t.features.map((feature, i) => (
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
                      <p className="mt-3 text-sm leading-loose text-ink-soft">{feature.body}</p>
                    </div>
                  ))}
                </div>
              </section>
            </FadeIn>

            {/* フォトギャラリー（写真が2枚以上あるとき） */}
            {activity.gallery.length > 1 && (
              <FadeIn>
                <section className="pt-14" aria-labelledby="gallery-title">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-water-deep">
                    {d.galleryEyebrow}
                  </p>
                  <h2 id="gallery-title" className="mt-2 font-display text-2xl font-bold text-navy">
                    {d.galleryTitle}
                  </h2>
                  <div className="mt-6">
                    <PhotoGallery photos={activity.gallery} alts={t.gallery} fallbackAlt={t.name} />
                  </div>
                </section>
              </FadeIn>
            )}

            {/* おすすめの利用者 */}
            <FadeIn>
              <section className="pt-14">
                <h2 className="font-display text-2xl font-bold text-navy">{d.recommendedFor}</h2>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {t.recommendedFor.map((item) => (
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
                <h2 className="font-display text-2xl font-bold text-navy">{d.flow}</h2>
                <div className="mt-6 rounded-3xl bg-white p-7 shadow-card md:p-9">
                  <FlowSteps steps={t.flow} />
                </div>
              </section>
            </FadeIn>

            {/* 注意事項 */}
            <FadeIn>
              <section className="pt-14">
                <h2 className="font-display text-2xl font-bold text-navy">{d.notes}</h2>
                <ul className="mt-6 space-y-3">
                  {t.notes.map((note) => (
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
                <h2 className="font-display text-2xl font-bold text-navy">{d.faq}</h2>
                <div className="mt-6">
                  <FaqAccordion faqs={t.faq} />
                </div>
                <p className="mt-5 text-sm text-ink-soft">
                  <Link
                    href={localePath(locale, "/faq")}
                    className="font-bold text-water-deep underline underline-offset-2 hover:text-navy"
                  >
                    {d.faqLink}
                  </Link>
                </p>
              </section>
            </FadeIn>
          </div>

          {/* サイド：料金・開催情報・予約 */}
          {/* スマホでは料金・開催情報を本文より先に（PCは右側に固定） */}
          <aside className="order-first pt-2 lg:order-none lg:pt-4">
            <div className="rounded-3xl border border-forest-light bg-white p-7 shadow-card lg:sticky lg:top-28">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-water-deep">
                {activity.areaCode}
              </p>

              <h2 className="mt-3 text-xs font-bold text-ink-soft">
                {multiPlan ? d.labels.plans : dict.common.priceLabel}
                <span className="ml-1.5 font-normal">{caption}</span>
              </h2>
              <dl className="mt-2 divide-y divide-forest-light/70">
                {rows.map((row) => (
                  <div key={row.label} className="flex items-baseline justify-between gap-3 py-2">
                    <dt className="text-sm text-ink">{row.label}</dt>
                    <dd className="shrink-0 font-display text-xl font-bold text-forest-dark">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-2 text-xs leading-relaxed text-ink-soft">{priceNote(activity, dict)}</p>

              {/* dl の中は dt/dd だけにする（アイコンは dt の中へ） */}
              <dl className="mt-6 space-y-3.5 border-t border-forest-light pt-6">
                {infoRows.map((row) => (
                  <div key={row.label}>
                    <dt className="flex items-center gap-2 text-xs font-bold text-ink-soft">
                      <row.icon aria-hidden="true" className="h-4 w-4 shrink-0 text-forest" />
                      {row.label}
                    </dt>
                    {row.values.map((value) => (
                      <dd
                        key={value}
                        className={`mt-0.5 pl-6 text-sm ${row.strong ? "font-bold text-navy" : "text-ink"}`}
                      >
                        {value}
                      </dd>
                    ))}
                  </div>
                ))}
                <div>
                  <dt className="flex items-center gap-2 text-xs font-bold text-ink-soft">
                    <MapPin aria-hidden="true" className="h-4 w-4 shrink-0 text-forest" />
                    {d.labels.meetingPlace}
                  </dt>
                  <dd className="mt-0.5 pl-6 text-sm text-ink">
                    {meetingName}
                    {activity.meeting.mapUrl && (
                      <a
                        href={activity.meeting.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 inline-flex items-center gap-1 text-xs font-bold text-water-deep underline underline-offset-2 hover:text-navy"
                      >
                        {d.mapLinkShort}
                        <ExternalLink aria-hidden="true" className="h-3 w-3 shrink-0" />
                      </a>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center gap-2 text-xs font-bold text-ink-soft">
                    <Shirt aria-hidden="true" className="h-4 w-4 shrink-0 text-forest" />
                    {d.labels.clothing}
                  </dt>
                  <dd className="mt-0.5 pl-6 text-sm text-ink">{d.infoValues.onBooking}</dd>
                </div>
              </dl>

              <div className="mt-7 space-y-3">
                <Button
                  href={localePath(locale, `/reservation?activity=${slug}`)}
                  variant="water"
                  size="lg"
                  className="w-full"
                >
                  {dict.common.reserveThis}
                </Button>
                <Button href={phone.link} variant="outline" className="w-full">
                  <Phone aria-hidden="true" className="h-4 w-4 shrink-0" />
                  {phone.display}
                </Button>
              </div>
              <p className="mt-4 whitespace-pre-line text-center text-[11px] leading-relaxed text-ink-soft">
                {d.reserveNote}
              </p>
            </div>
          </aside>
        </div>

        {/* 集合・解散場所 */}
        <FadeIn>
          <section className="pt-20" aria-labelledby="meeting-title">
            <SectionHeading eyebrow={d.meetingEyebrow} title={d.meetingTitle} id="meeting-title" />
            <div className="mx-auto max-w-3xl rounded-3xl bg-white p-7 shadow-card md:p-9">
              <p className="flex items-start gap-3 text-lg font-bold text-navy">
                <MapPin aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-water-deep" />
                {meetingName}
              </p>
              <p className="mt-3 text-sm leading-loose text-ink-soft">{meetingNote}</p>
              {activity.meeting.mapUrl && (
                <a
                  href={activity.meeting.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-forest px-6 py-2 text-sm font-bold text-forest transition-colors hover:bg-forest hover:text-white"
                >
                  {d.mapLink}
                  <ExternalLink aria-hidden="true" className="h-4 w-4 shrink-0" />
                </a>
              )}
              <p className="mt-6 border-t border-forest-light pt-4 text-xs leading-relaxed text-ink-soft">
                {d.meetingContact}{" "}
                <a href={phone.link} className="font-bold text-water-deep hover:text-navy">
                  {phone.display}
                </a>
              </p>
            </div>
          </section>
        </FadeIn>

        {/* 関連アクティビティ */}
        <FadeIn>
          <section className="py-20">
            <SectionHeading eyebrow={d.otherActivitiesEyebrow} title={d.otherActivities} />
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((a) => (
                <ActivityCard key={a.slug} locale={locale} dict={dict} activity={a} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                href={localePath(locale, "/activities")}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-water-deep transition-colors hover:text-navy"
              >
                {dict.common.backToActivities}
                <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
              </Link>
            </div>
          </section>
        </FadeIn>
      </div>
    </>
  );
}
