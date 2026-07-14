import type { Metadata } from "next";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import FadeIn from "@/components/ui/FadeIn";
import FinalCta from "@/components/sections/FinalCta";
import { pageMetadata } from "@/lib/seo";
import { projects } from "@/data/projects";
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
    title: dict.meta.projects.title,
    description: dict.meta.projects.description,
    path: "/projects",
  });
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const p = dict.projects;

  return (
    <>
      <PageHeader eyebrow={p.eyebrow} title={p.title} lead={p.lead} />
      <Breadcrumbs
        locale={locale}
        label={dict.breadcrumb.label}
        items={[
          { name: dict.breadcrumb.home, path: "" },
          { name: p.title, path: "/projects" },
        ]}
      />

      <div className="mx-auto max-w-6xl space-y-20 px-4 py-12 md:px-6 md:py-16">
        {projects.map((project, index) => {
          const t = p.items[project.slug as keyof typeof p.items];
          return (
            <FadeIn key={project.slug}>
              <section
                id={project.slug}
                className="scroll-mt-28"
                aria-labelledby={`${project.slug}-title`}
              >
                <div
                  className={`grid items-center gap-8 md:grid-cols-2 md:gap-12 ${
                    index % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <div className="relative aspect-[16/11] overflow-hidden rounded-3xl shadow-card">
                    <Image
                      src={project.image}
                      alt={t.imageAlt}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-water-deep">
                      Project {String(index + 1).padStart(2, "0")} — {project.titleEn}
                    </p>
                    <h2
                      id={`${project.slug}-title`}
                      className="mt-3 font-display text-2xl font-bold leading-relaxed text-navy md:text-3xl"
                    >
                      {t.title}
                    </h2>
                    {t.description.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="mt-4 text-sm leading-loose text-ink-soft md:text-[15px]"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  {t.items.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-3xl border border-forest-light bg-white p-6 shadow-card"
                    >
                      <CheckCircle2 aria-hidden="true" className="h-6 w-6 text-forest" />
                      <h3 className="mt-3 text-[15px] font-bold text-navy">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                        {item.body}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </FadeIn>
          );
        })}
      </div>

      <FinalCta
        locale={locale}
        dict={dict}
        title={p.ctaTitle}
        lead={p.ctaLead}
      />
    </>
  );
}
