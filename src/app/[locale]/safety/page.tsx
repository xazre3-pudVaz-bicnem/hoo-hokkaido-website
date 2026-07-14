import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, ShieldCheck } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";
import FlowSteps from "@/components/sections/FlowSteps";
import FinalCta from "@/components/sections/FinalCta";
import { pageMetadata } from "@/lib/seo";
import { guide } from "@/data/guide";
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
    title: dict.meta.safety.title,
    description: dict.meta.safety.description,
    path: "/safety",
  });
}

export default async function SafetyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const s = dict.safety;

  return (
    <>
      <PageHeader eyebrow={s.eyebrow} title={s.title} lead={s.lead} />
      <Breadcrumbs
        locale={locale}
        label={dict.breadcrumb.label}
        items={[
          { name: dict.breadcrumb.home, path: "" },
          { name: s.title, path: "/safety" },
        ]}
      />

      {/* 取り組み一覧 */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {s.commitments.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.05}>
              <div className="h-full rounded-3xl border border-forest-light bg-white p-7 shadow-card">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-forest-light">
                  <ShieldCheck aria-hidden="true" className="h-5 w-5 text-forest" />
                </span>
                <h2 className="mt-4 text-base font-bold text-navy">{item.title}</h2>
                <p className="mt-2.5 text-sm leading-loose text-ink-soft">{item.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
        <FadeIn>
          <p className="mt-8 rounded-2xl bg-water-light/60 p-5 text-sm leading-loose text-ink">
            {s.note}{" "}
            <Link
              href={localePath(locale, "/contact")}
              className="font-bold text-water-deep underline underline-offset-2 hover:text-navy"
            >
              {s.noteLink}
            </Link>
          </p>
        </FadeIn>
      </section>

      {/* ガイドの経験と資格 */}
      <section className="bg-forest-dark py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <FadeIn>
              <div className="relative aspect-[16/11] overflow-hidden rounded-3xl">
                <Image
                  src={guide.safetyImage}
                  alt={dict.guide.safetyImageAlt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-sky">
                {s.guideEyebrow}
              </p>
              <h2 className="mt-3 whitespace-pre-line font-display text-2xl font-bold leading-relaxed text-white md:text-3xl">
                {s.guideTitle}
              </h2>
              <p className="mt-5 text-sm leading-loose text-white/80 md:text-[15px]">
                {s.guideBody}
              </p>
              <div className="mt-6 rounded-3xl bg-white/[0.08] p-6">
                <h3 className="text-sm font-bold tracking-wider text-sky">
                  {dict.guide.qualificationsTitle}
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-white/90">
                  {dict.guide.qualifications.map((q) => (
                    <li key={q} className="flex items-start gap-2.5">
                      <Award aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-sky" />
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href={localePath(locale, "/about")}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-sky transition-colors hover:text-white"
              >
                {s.guideLink}
                <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 当日の流れ */}
      <section className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
        <FadeIn>
          <SectionHeading
            eyebrow={s.flowEyebrow}
            title={s.flowTitle}
            lead={s.flowLead}
          />
          <div className="rounded-3xl bg-white p-7 shadow-card md:p-10">
            <FlowSteps steps={s.flowSteps} />
          </div>
        </FadeIn>
      </section>

      <FinalCta
        locale={locale}
        dict={dict}
        title={s.ctaTitle}
        lead={s.ctaLead}
      />
    </>
  );
}
