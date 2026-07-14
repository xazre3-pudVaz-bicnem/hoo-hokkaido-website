import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ActivityCard from "@/components/ui/ActivityCard";
import FadeIn from "@/components/ui/FadeIn";
import FinalCta from "@/components/sections/FinalCta";
import JsonLd from "@/components/ui/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { serviceJsonLd } from "@/lib/jsonld";
import { sortedActivities } from "@/data/activities";
import { getDictionary } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/locales";

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
    title: dict.meta.activities.title,
    description: dict.meta.activities.description,
    path: "/activities",
  });
}

export default async function ActivitiesPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const [featured, ...others] = sortedActivities;

  return (
    <>
      <JsonLd
        data={sortedActivities.map((a) => serviceJsonLd(locale, dict, a))}
      />
      <PageHeader
        eyebrow={dict.activitiesPage.eyebrow}
        title={dict.activitiesPage.title}
        lead={dict.activitiesPage.lead}
      />
      <Breadcrumbs
        locale={locale}
        label={dict.breadcrumb.label}
        items={[
          { name: dict.breadcrumb.home, path: "" },
          { name: dict.activitiesPage.title, path: "/activities" },
        ]}
      />

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-4 md:px-6">
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

        <FadeIn>
          <div className="mt-14 rounded-3xl bg-forest-light/50 p-7 md:p-10">
            <h2 className="font-display text-xl font-bold text-navy md:text-2xl">
              {dict.activitiesPage.helpTitle}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-loose text-ink-soft md:text-[15px]">
              {dict.activitiesPage.helpBody}
            </p>
          </div>
        </FadeIn>
      </section>

      <FinalCta locale={locale} dict={dict} />
    </>
  );
}
