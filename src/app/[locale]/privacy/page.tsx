import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { pageMetadata } from "@/lib/seo";
import { phoneFor, site } from "@/data/site";
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
    title: dict.meta.privacy.title,
    description: dict.meta.privacy.description,
    path: "/privacy",
  });
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const phone = phoneFor(locale);

  return (
    <>
      <PageHeader eyebrow={dict.privacy.eyebrow} title={dict.privacy.title} />
      <Breadcrumbs
        locale={locale}
        label={dict.breadcrumb.label}
        items={[
          { name: dict.breadcrumb.home, path: "" },
          { name: dict.privacy.title, path: "/privacy" },
        ]}
      />
      <section className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
        <div className="rounded-3xl bg-white p-7 shadow-card md:p-10">
          {dict.privacy.sections.map((section) => (
            <section key={section.title} className="mb-8 last:mb-0">
              <h2 className="text-base font-bold text-navy md:text-lg">
                {section.title}
              </h2>
              {section.body.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-2.5 text-sm leading-loose text-ink-soft"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}

          {/* 連絡先（共通データから取得するため言語間で不一致が起きない） */}
          <address className="mt-8 space-y-1 rounded-2xl bg-forest-light/40 p-5 text-sm not-italic leading-loose text-ink">
            <p className="font-bold">{site.name}</p>
            <p>{dict.common.addressFull}</p>
            <p>
              {dict.common.phoneLabel}: {phone.display}（{dict.common.hoursNote}）
            </p>
            <p className="break-all">
              {dict.common.emailLabel}: {site.email}
            </p>
          </address>
        </div>
      </section>
    </>
  );
}
