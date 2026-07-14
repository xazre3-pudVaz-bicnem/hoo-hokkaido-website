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
import { phoneFor } from "@/data/site";
import { getDictionary, type Dictionary } from "@/i18n/dictionary";
import { locales, type Locale } from "@/i18n/locales";
import { localePath } from "@/i18n/routing";
import {
  formatAmount,
  formatMinParticipants,
  priceNote,
  priceUnitLabel,
} from "@/lib/format";

type Params = { locale: Locale; slug: string };

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    activities.map((a) => ({ locale, slug: a.slug }))
  );
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
  const isFurano = slug === "furano-relax-downriver";

  const infoRows = [
    { icon: Clock, label: d.labels.duration, key: activity.info.duration },
    { icon: Calendar, label: d.labels.period, key: activity.info.period },
    { icon: Users, label: d.labels.targetAge, key: activity.info.targetAge },
    { icon: MapPin, label: d.labels.meetingPlace, key: activity.info.meetingPlace },
    { icon: Shirt, label: d.labels.clothing, key: activity.info.clothing },
  ];

  return (
    <>
      <JsonLd
        data={[serviceJsonLd(locale, dict, activity), faqJsonLd(locale, t.faq)]}
      />

      {/* メインビジュアル */}
      <div className="relative h-[52svh] min-h-[380px] w-full overflow-hidden bg-navy pt-16 md:h-[62svh] md:pt-20">
        <Image
          src={activity.image}
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
                <h2 className="font-display text-2xl font-bold text-navy">
                  {d.overview}
                </h2>
                <div className="mt-5 space-y-4 text-sm leading-loose text-ink-soft md:text-[15px] md:leading-[2]">
                  {t.description.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {isFurano && (
                  <p className="mt-5 rounded-2xl bg-water-light/70 p-5 text-sm leading-loose text-ink">
                    {d.furanoNote}{" "}
                    <Link
                      href={localePath(locale, "/furano-rafting")}
                      className="font-bold text-water-deep underline underline-offset-2 hover:text-navy"
                    >
                      {d.furanoNoteLink}
                    </Link>
                  </p>
                )}
              </section>
            </FadeIn>

            {/* 特徴 */}
            <FadeIn>
              <section className="pt-14">
                <h2 className="font-display text-2xl font-bold text-navy">
                  {d.features}
                </h2>
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
                  {d.recommendedFor}
                </h2>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {t.recommendedFor.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 rounded-2xl bg-forest-light/50 px-5 py-4 text-sm font-medium text-ink"
                    >
                      <CheckCircle2
                        aria-hidden="true"
                        className="mt-0.5 h-4 w-4 shrink-0 text-forest"
                      />
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
                      <AlertCircle
                        aria-hidden="true"
                        className="mt-0.5 h-4 w-4 shrink-0 text-water-deep"
                      />
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

          {/* サイド：料金・予約 */}
          <aside className="lg:pt-4">
            <div className="rounded-3xl border border-forest-light bg-white p-7 shadow-card lg:sticky lg:top-28">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-water-deep">
                {activity.areaCode}
              </p>
              <p className="mt-3 text-xs text-ink-soft">{dict.common.priceLabel}</p>
              <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
                <span className="font-display text-3xl font-bold text-forest-dark">
                  {formatAmount(activity.price.amount, locale, dict)}
                </span>
                <span className="text-sm text-ink-soft">
                  {priceUnitLabel(activity, dict)}
                </span>
              </p>
              <p className="mt-2 text-xs leading-relaxed text-ink-soft">
                {priceNote(activity, dict)}
              </p>

              <dl className="mt-6 space-y-3.5 border-t border-forest-light pt-6">
                <div className="flex items-start gap-3">
                  <Users aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                  <div>
                    <dt className="text-xs font-bold text-ink-soft">
                      {dict.common.minParticipantsLabel}
                    </dt>
                    <dd className="text-sm font-bold text-navy">
                      {formatMinParticipants(activity, dict)}
                    </dd>
                  </div>
                </div>
                {infoRows.map((row) => (
                  <div key={row.label} className="flex items-start gap-3">
                    <row.icon
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-forest"
                    />
                    <div>
                      <dt className="text-xs font-bold text-ink-soft">{row.label}</dt>
                      <dd className="text-sm text-ink">{d.infoValues[row.key]}</dd>
                    </div>
                  </div>
                ))}
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

        {/* アクセス・集合場所 */}
        <FadeIn>
          <section className="pt-20">
            <SectionHeading
              eyebrow={d.accessEyebrow}
              title={d.accessTitle}
              lead={d.accessLead}
            />
            <AccessInfo locale={locale} dict={dict} />
          </section>
        </FadeIn>

        {/* 関連アクティビティ */}
        <FadeIn>
          <section className="py-20">
            <SectionHeading
              eyebrow={d.otherActivitiesEyebrow}
              title={d.otherActivities}
            />
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
