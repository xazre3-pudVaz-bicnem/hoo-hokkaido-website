import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ActivityCard from "@/components/ui/ActivityCard";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";
import FinalCta from "@/components/sections/FinalCta";
import JsonLd from "@/components/ui/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { serviceJsonLd } from "@/lib/jsonld";
import {
  activitiesBySeason,
  categories,
  sectionId,
  seasonOrder,
  seasonPeriods,
  sortedActivities,
  type Activity,
  type Category,
} from "@/data/activities";
import { getDictionary, type Dictionary } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/locales";
import { localePath } from "@/i18n/routing";
import {
  formatDuration,
  formatMinParticipants,
  formatPeriod,
  formatPeriodRange,
  formatTargetAge,
  priceCaption,
  priceRows,
} from "@/lib/format";

type Params = { locale: Locale };

/** 今のシーズンを先頭に並べるため、1日1回描き直す */
export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  return pageMetadata({
    locale,
    title: dict.meta.activities.title,
    description: dict.meta.activities.description,
    path: "/activities",
  });
}

/** 料金欄の短い表記（一覧表用） */
function tablePrice(activity: Activity, locale: Locale, dict: Dictionary) {
  return {
    rows: priceRows(activity, locale, dict, { short: true }),
    caption: priceCaption(activity, dict),
  };
}

function tableDuration(activity: Activity, dict: Dictionary): string {
  return activity.plans.map((plan) => formatDuration(plan, dict)).join(dict.activityDetail.listSeparator);
}

export default async function ActivitiesPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const p = dict.activitiesPage;
  const d = dict.activityDetail;
  const order = seasonOrder();

  return (
    <>
      <JsonLd data={sortedActivities.map((a) => serviceJsonLd(locale, dict, a))} />
      <PageHeader eyebrow={p.eyebrow} title={p.title} lead={p.lead} />
      <Breadcrumbs
        locale={locale}
        label={dict.breadcrumb.label}
        items={[
          { name: dict.breadcrumb.home, path: "" },
          { name: dict.activitiesPage.title, path: "/activities" },
        ]}
      />

      {/* シーズン・料金一覧へのページ内リンク */}
      <nav aria-label={p.jumpLabel} className="mx-auto max-w-7xl px-4 pt-2 md:px-6">
        <ul className="flex flex-wrap gap-2.5">
          {order.map((season) => (
            <li key={season}>
              <a
                href={`#${sectionId(season)}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-forest-light bg-white px-4 py-2 text-sm font-bold text-navy shadow-card transition-colors hover:border-water hover:text-water-deep"
              >
                {d.seasons[season]}
                <span className="text-xs font-medium text-ink-soft">
                  {formatPeriodRange(seasonPeriods[season], dict)}
                </span>
              </a>
            </li>
          ))}
          <li>
            <a
              href="#price-list"
              className="inline-flex min-h-11 items-center rounded-full border border-forest-light bg-white px-4 py-2 text-sm font-bold text-navy shadow-card transition-colors hover:border-water hover:text-water-deep"
            >
              {p.tableTitle}
            </a>
          </li>
        </ul>
      </nav>

      {order.map((season, si) => {
        const items = activitiesBySeason(season);
        // 件数が少ないシーズンは種別で分けずに並べる
        const groups: { category?: Category; items: Activity[] }[] =
          items.length <= 3
            ? [{ items }]
            : categories
                .map((category) => ({ category, items: items.filter((a) => a.category === category) }))
                .filter((g) => g.items.length > 0);
        return (
          <section
            key={season}
            id={sectionId(season)}
            aria-labelledby={`${season}-title`}
            className={`scroll-mt-24 py-14 md:py-20 ${si % 2 === 1 ? "bg-water-light/50" : ""}`}
          >
            <div className="mx-auto max-w-7xl px-4 md:px-6">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-water-deep">
                {season === "green" ? "Green Season" : "Winter Season"}
              </p>
              <h2
                id={`${season}-title`}
                className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1 font-display text-2xl font-bold text-navy md:text-4xl"
              >
                {d.seasons[season]}
                <span className="text-base font-medium text-ink-soft md:text-lg">
                  {formatPeriodRange(seasonPeriods[season], dict)}
                </span>
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-loose text-ink-soft md:text-[15px]">
                {p.seasonLead[season]}
              </p>

              {groups.map((group) => (
                <div
                  key={group.category ?? "all"}
                  id={group.category ? sectionId(season, group.category) : undefined}
                  className="mt-10 scroll-mt-24"
                >
                  {group.category && (
                    <div className="mb-6">
                      <h3 className="font-display text-lg font-bold text-navy md:text-xl">
                        {d.categories[group.category]}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                        {p.categoryLead[group.category]}
                      </p>
                    </div>
                  )}
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {group.items.map((activity, i) => (
                      <FadeIn key={activity.slug} delay={(i % 3) * 0.06}>
                        <ActivityCard
                          locale={locale}
                          dict={dict}
                          activity={activity}
                          headingLevel={group.category ? "h4" : "h3"}
                          priority={si === 0 && i === 0}
                        />
                      </FadeIn>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {/* 料金・開催期間の一覧（施主のツアー情報と同じ並び） */}
      <section id="price-list" className="scroll-mt-24 bg-offwhite py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <FadeIn>
            <SectionHeading eyebrow="Price List" title={p.tableTitle} lead={p.tableLead} />
          </FadeIn>
          <p className="mb-2 text-xs text-ink-soft md:hidden">{p.tableScrollHint}</p>
          <div className="overflow-x-auto rounded-3xl bg-white shadow-card">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm">
              <caption className="sr-only">{p.tableTitle}</caption>
              <thead>
                <tr className="border-b border-forest-light bg-forest-light/40 text-xs text-ink-soft">
                  {/* 横スクロール中も名前が見えるよう、左端の列は固定（背景は不透明に） */}
                  <th
                    scope="col"
                    className="sticky left-0 z-10 w-40 min-w-40 bg-[#f1f8f4] md:w-48 md:min-w-48 px-5 py-3 font-bold"
                  >
                    {p.tableHeaders.name}
                  </th>
                  <th scope="col" className="px-4 py-3 font-bold">{p.tableHeaders.period}</th>
                  <th scope="col" className="px-4 py-3 font-bold">{p.tableHeaders.duration}</th>
                  <th scope="col" className="px-4 py-3 font-bold">{p.tableHeaders.price}</th>
                  <th scope="col" className="px-4 py-3 font-bold">{p.tableHeaders.age}</th>
                  <th scope="col" className="px-4 py-3 font-bold">{p.tableHeaders.min}</th>
                </tr>
              </thead>
              <tbody>
                {order.map((season) => (
                  <Fragment key={season}>
                    <tr className="bg-water-light/50">
                      <th
                        scope="colgroup"
                        colSpan={6}
                        className="px-5 py-2.5 text-xs font-bold tracking-wider text-water-deep"
                      >
                        <span className="sticky left-5 inline-block">
                          {d.seasons[season]}（{formatPeriodRange(seasonPeriods[season], dict)}）
                        </span>
                      </th>
                    </tr>
                    {activitiesBySeason(season).map((activity) => {
                      const t = dict.activities[activity.slug as keyof Dictionary["activities"]];
                      const price = tablePrice(activity, locale, dict);
                      return (
                        <tr key={activity.slug} className="border-b border-forest-light/70 align-top">
                          <th
                            scope="row"
                            className="sticky left-0 z-10 w-40 min-w-40 bg-white md:w-48 md:min-w-48 px-5 py-3.5 font-bold text-navy"
                          >
                            <Link
                              href={localePath(locale, `/activities/${activity.slug}`)}
                              className="underline-offset-2 hover:text-water-deep hover:underline"
                            >
                              {t.name}
                            </Link>
                            <span className="mt-0.5 block text-xs font-medium text-ink-soft">
                              {t.area}
                            </span>
                          </th>
                          <td className="whitespace-nowrap px-4 py-3.5 text-ink">
                            {formatPeriod(activity, dict)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-ink">
                            {tableDuration(activity, dict)}
                          </td>
                          <td className="px-4 py-3.5 text-ink">
                            <ul className="space-y-0.5">
                              {price.rows.map((row) => (
                                <li key={row.label} className="whitespace-nowrap">
                                  <span className="text-ink-soft">{row.label}</span>{" "}
                                  <span className="font-bold text-forest-dark">{row.value}</span>
                                </li>
                              ))}
                            </ul>
                            <span className="mt-0.5 block text-[11px] text-ink-soft">
                              {price.caption}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-ink">
                            {activity.category === "rental" ? "—" : formatTargetAge(activity, dict)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-ink">
                            {formatMinParticipants(activity, dict)}
                          </td>
                        </tr>
                      );
                    })}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-ink-soft">{dict.price.note}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-4 md:px-6">
        <FadeIn>
          <div className="rounded-3xl bg-forest-light/50 p-7 md:p-10">
            <h2 className="font-display text-xl font-bold text-navy md:text-2xl">{p.helpTitle}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-loose text-ink-soft md:text-[15px]">
              {p.helpBody}
            </p>
            <Link
              href={localePath(locale, "/furano-activity")}
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-water-deep transition-colors hover:text-navy"
            >
              {p.helpLink}
              <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
            </Link>
          </div>
        </FadeIn>
      </section>

      <FinalCta locale={locale} dict={dict} />
    </>
  );
}
