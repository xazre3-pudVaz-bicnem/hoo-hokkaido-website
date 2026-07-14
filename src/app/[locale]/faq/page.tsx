import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import FadeIn from "@/components/ui/FadeIn";
import FaqAccordion from "@/components/ui/FaqAccordion";
import JsonLd from "@/components/ui/JsonLd";
import FinalCta from "@/components/sections/FinalCta";
import { pageMetadata } from "@/lib/seo";
import { faqJsonLd } from "@/lib/jsonld";
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
    title: dict.meta.faq.title,
    description: dict.meta.faq.description,
    path: "/faq",
  });
}

export default async function FaqPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const f = dict.faq;
  const phone = phoneFor(locale);

  return (
    <>
      <JsonLd data={faqJsonLd(locale, f.items)} />
      <PageHeader eyebrow={f.eyebrow} title={f.title} lead={f.lead} />
      <Breadcrumbs
        locale={locale}
        label={dict.breadcrumb.label}
        items={[
          { name: dict.breadcrumb.home, path: "" },
          { name: f.title, path: "/faq" },
        ]}
      />

      <section className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
        <FadeIn>
          <FaqAccordion faqs={f.items} />
        </FadeIn>

        <FadeIn>
          <div className="mt-12 rounded-3xl bg-forest-light/50 p-7 text-center md:p-9">
            <h2 className="font-display text-xl font-bold text-navy">
              {f.helpTitle}
            </h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-loose text-ink-soft">
              {f.helpBody}
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={localePath(locale, "/contact")}
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-water-deep px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-navy"
              >
                {f.helpCta}
                <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
              </Link>
              <a
                href={phone.link}
                className="inline-flex min-h-12 items-center gap-2 whitespace-nowrap rounded-full border-2 border-forest px-7 py-3 text-sm font-bold text-forest-dark transition-colors hover:bg-forest hover:text-white"
              >
                {phone.display}
              </a>
            </div>
          </div>
        </FadeIn>
      </section>

      <FinalCta locale={locale} dict={dict} />
    </>
  );
}
