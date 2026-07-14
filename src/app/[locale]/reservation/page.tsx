import type { Metadata } from "next";
import { Phone } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ReservationForm from "@/components/forms/ReservationForm";
import { pageMetadata } from "@/lib/seo";
import { sortedActivities } from "@/data/activities";
import { phoneFor } from "@/data/site";
import { formatPriceFull } from "@/lib/format";
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
    title: dict.meta.reservation.title,
    description: dict.meta.reservation.description,
    path: "/reservation",
  });
}

export default async function ReservationPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<{ activity?: string }>;
}) {
  const { locale } = await params;
  const { activity } = await searchParams;
  const dict = await getDictionary(locale);
  const r = dict.reservation;
  const phone = phoneFor(locale);

  // 選択肢のラベル：アクティビティ名＋料金（料金は共通データから取得）
  const activityOptions = sortedActivities.map((a) => ({
    slug: a.slug,
    label: `${dict.activities[a.slug as keyof typeof dict.activities].name}（${formatPriceFull(a, locale, dict)}）`,
  }));

  return (
    <>
      <PageHeader eyebrow={r.eyebrow} title={r.title} lead={r.lead} />
      <Breadcrumbs
        locale={locale}
        label={dict.breadcrumb.label}
        items={[
          { name: dict.breadcrumb.home, path: "" },
          { name: r.title, path: "/reservation" },
        ]}
      />

      <section className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
        <ReservationForm
          locale={locale}
          initialActivity={activity}
          activityOptions={activityOptions}
          phone={phone}
          strings={{
            fields: r.fields as unknown as Record<string, string>,
            notice: r.notice,
            submit: r.submit,
            submitting: r.submitting,
            successTitle: r.successTitle,
            successBody: r.successBody,
            successStrong: r.successStrong,
            successNote: r.successNote,
            required: dict.common.required,
            errorNetwork: r.errors.network,
            mailto: dict.mailto,
          }}
        />

        <div className="mt-8 rounded-3xl border border-forest-light bg-white p-6 text-center md:p-8">
          <h2 className="text-base font-bold text-navy">{r.phoneTitle}</h2>
          <a
            href={phone.link}
            className="mt-3 inline-flex items-center gap-2 font-display text-xl font-bold text-forest-dark transition-colors hover:text-water-deep md:text-2xl"
          >
            <Phone aria-hidden="true" className="h-5 w-5 shrink-0" />
            {phone.display}
          </a>
          <p className="mt-2 text-xs leading-relaxed text-ink-soft">
            {r.phoneNote}
          </p>
        </div>
      </section>
    </>
  );
}
