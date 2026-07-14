import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import FadeIn from "@/components/ui/FadeIn";
import AccessInfo from "@/components/sections/AccessInfo";
import FinalCta from "@/components/sections/FinalCta";
import { pageMetadata } from "@/lib/seo";
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
    title: dict.meta.access.title,
    description: dict.meta.access.description,
    path: "/access",
  });
}

export default async function AccessPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <>
      <PageHeader
        eyebrow={dict.access.eyebrow}
        title={dict.access.title}
        lead={dict.access.lead}
      />
      <Breadcrumbs
        locale={locale}
        label={dict.breadcrumb.label}
        items={[
          { name: dict.breadcrumb.home, path: "" },
          { name: dict.access.title, path: "/access" },
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <FadeIn>
          <AccessInfo locale={locale} dict={dict} />
        </FadeIn>

        <FadeIn>
          <div className="mt-10 rounded-3xl border border-forest-light bg-white p-7 md:p-9">
            <h2 className="font-display text-xl font-bold text-navy">
              {dict.access.meetingTitle}
            </h2>
            <p className="mt-3 text-sm leading-loose text-ink-soft md:text-[15px]">
              {dict.access.meetingBody}
            </p>
          </div>
        </FadeIn>
      </section>

      <FinalCta locale={locale} dict={dict} />
    </>
  );
}
