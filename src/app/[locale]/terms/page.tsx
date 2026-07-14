import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { pageMetadata } from "@/lib/seo";
import { phoneFor } from "@/data/site";
import { getDictionary } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/locales";
import { localePath } from "@/i18n/routing";

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
    title: dict.meta.terms.title,
    description: dict.meta.terms.description,
    path: "/terms",
  });
}

export default async function TermsPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const t = dict.terms;
  const phone = phoneFor(locale);

  return (
    <>
      <PageHeader eyebrow={t.eyebrow} title={t.title} lead={t.lead} />
      <Breadcrumbs
        locale={locale}
        label={dict.breadcrumb.label}
        items={[
          { name: dict.breadcrumb.home, path: "" },
          { name: t.title, path: "/terms" },
        ]}
      />

      <section className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
        <div className="space-y-6">
          {t.sections.map((section) => (
            <div
              key={section.title}
              className="rounded-3xl bg-white p-7 shadow-card md:p-9"
            >
              <h2 className="text-lg font-bold text-navy">{section.title}</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-loose text-ink-soft">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}

          <div className="rounded-3xl bg-forest-light/50 p-7 md:p-9">
            <h2 className="text-lg font-bold text-navy">{t.contactTitle}</h2>
            <p className="mt-3 text-sm leading-loose text-ink-soft">
              {t.contactBody}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
              <Link
                href={localePath(locale, "/contact")}
                className="font-bold text-water-deep underline underline-offset-2 hover:text-navy"
              >
                {t.contactLink}
              </Link>
              <a
                href={phone.link}
                className="whitespace-nowrap font-bold text-water-deep hover:text-navy"
              >
                {phone.display}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
