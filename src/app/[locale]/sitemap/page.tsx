import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { pageMetadata } from "@/lib/seo";
import { sortedActivities } from "@/data/activities";
import { getAllColumns } from "@/lib/column";
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
    title: dict.meta.sitemap.title,
    description: dict.meta.sitemap.description,
    path: "/sitemap",
  });
}

export default async function SitemapPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const s = dict.sitemap;

  const groups: { heading: string; links: { label: string; href: string }[] }[] = [
    {
      heading: s.groups.activities,
      links: [
        { label: s.links.activitiesIndex, href: "/activities" },
        ...sortedActivities.map((a) => ({
          label: dict.activities[a.slug as keyof typeof dict.activities].name,
          href: `/activities/${a.slug}`,
        })),
      ],
    },
    {
      heading: s.groups.furano,
      links: [
        { label: s.links.furanoActivity, href: "/furano-activity" },
        { label: s.links.furanoRafting, href: "/furano-rafting" },
      ],
    },
    {
      heading: s.groups.about,
      links: [
        { label: s.links.about, href: "/about" },
        { label: s.links.projects, href: "/projects" },
        { label: s.links.safety, href: "/safety" },
      ],
    },
    {
      heading: s.groups.column,
      links: [
        { label: s.links.columnIndex, href: "/column" },
        ...getAllColumns(locale).map((p) => ({
          label: p.title,
          href: `/column/${p.slug}`,
        })),
      ],
    },
    {
      heading: s.groups.info,
      links: [
        { label: s.links.faq, href: "/faq" },
        { label: s.links.access, href: "/access" },
        { label: s.links.reservation, href: "/reservation" },
        { label: s.links.contact, href: "/contact" },
        { label: s.links.terms, href: "/terms" },
        { label: s.links.privacy, href: "/privacy" },
      ],
    },
  ];

  return (
    <>
      <PageHeader eyebrow={s.eyebrow} title={s.title} />
      <Breadcrumbs
        locale={locale}
        label={dict.breadcrumb.label}
        items={[
          { name: dict.breadcrumb.home, path: "" },
          { name: s.title, path: "/sitemap" },
        ]}
      />
      <section className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14">
        <div className="grid gap-8 sm:grid-cols-2">
          {groups.map((group) => (
            <div key={group.heading} className="rounded-3xl bg-white p-7 shadow-card">
              <h2 className="border-b border-forest-light pb-3 font-display text-lg font-bold text-navy">
                {group.heading}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={localePath(locale, link.href)}
                      className="inline-flex items-start gap-1.5 text-sm text-ink transition-colors hover:text-water-deep"
                    >
                      <ChevronRight
                        aria-hidden="true"
                        className="mt-1 h-3.5 w-3.5 shrink-0 text-water-deep"
                      />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
