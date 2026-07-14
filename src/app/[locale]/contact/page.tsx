import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ContactForm from "@/components/forms/ContactForm";
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
    title: dict.meta.contact.title,
    description: dict.meta.contact.description,
    path: "/contact",
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const c = dict.contact;
  const phone = phoneFor(locale);

  return (
    <>
      <PageHeader eyebrow={c.eyebrow} title={c.title} lead={c.lead} />
      <Breadcrumbs
        locale={locale}
        label={dict.breadcrumb.label}
        items={[
          { name: dict.breadcrumb.home, path: "" },
          { name: c.title, path: "/contact" },
        ]}
      />

      <section className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
        <ContactForm
          locale={locale}
          phone={phone}
          strings={{
            fields: c.fields as unknown as Record<string, string>,
            agree: dict.reservation.fields.agree,
            agreeLink: dict.reservation.fields.agreeLink,
            submit: c.submit,
            submitting: c.submitting,
            successTitle: c.successTitle,
            successBody: c.successBody,
            required: dict.common.required,
            errorNetwork: dict.reservation.errors.network,
            mailto: dict.mailto,
          }}
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-forest-light bg-white p-6 text-center">
            <Phone aria-hidden="true" className="mx-auto h-6 w-6 text-water-deep" />
            <h2 className="mt-2 text-sm font-bold text-navy">{c.phoneTitle}</h2>
            <a
              href={phone.link}
              className="mt-1.5 block whitespace-nowrap font-display text-lg font-bold text-forest-dark transition-colors hover:text-water-deep"
            >
              {phone.display}
            </a>
            <p className="mt-1 text-xs leading-relaxed text-ink-soft">{c.phoneNote}</p>
          </div>
          <div className="rounded-3xl border border-forest-light bg-white p-6 text-center">
            <Mail aria-hidden="true" className="mx-auto h-6 w-6 text-water-deep" />
            <h2 className="mt-2 text-sm font-bold text-navy">{c.mailTitle}</h2>
            <a
              href={`mailto:${site.email}`}
              className="mt-1.5 block break-all text-sm font-bold text-forest-dark transition-colors hover:text-water-deep"
            >
              {site.email}
            </a>
            <p className="mt-1 text-xs text-ink-soft">{c.mailNote}</p>
          </div>
        </div>
      </section>
    </>
  );
}
