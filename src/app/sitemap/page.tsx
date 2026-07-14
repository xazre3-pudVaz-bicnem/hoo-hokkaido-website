import Link from "next/link";
import { ChevronRight } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { pageMetadata } from "@/lib/seo";
import { sortedActivities } from "@/data/activities";
import { getAllColumns } from "@/lib/column";

export const metadata = pageMetadata({
  title: "サイトマップ",
  description:
    "Hokkaido Outdoor Organization（HOO）公式サイトのサイトマップ。アクティビティ、富良野の体験情報、HOOについて、予約・お問い合わせなど、全ページの一覧です。",
  path: "/sitemap",
});

export default function SitemapPage() {
  const groups: { heading: string; links: { label: string; href: string }[] }[] = [
    {
      heading: "アクティビティ",
      links: [
        { label: "アクティビティ一覧", href: "/activities" },
        ...sortedActivities.map((a) => ({
          label: a.name,
          href: `/activities/${a.slug}`,
        })),
      ],
    },
    {
      heading: "富良野で体験する",
      links: [
        { label: "富良野のアクティビティ・自然体験", href: "/furano-activity" },
        { label: "富良野のラフティング・川体験", href: "/furano-rafting" },
      ],
    },
    {
      heading: "HOOについて",
      links: [
        { label: "HOOについて（MISSION・VISION・代表紹介）", href: "/about" },
        { label: "プロジェクト", href: "/projects" },
        { label: "安全への取り組み", href: "/safety" },
      ],
    },
    {
      heading: "コラム",
      links: [
        { label: "コラム一覧", href: "/column" },
        ...getAllColumns().map((p) => ({
          label: p.title,
          href: `/column/${p.slug}`,
        })),
      ],
    },
    {
      heading: "ご利用案内",
      links: [
        { label: "よくある質問", href: "/faq" },
        { label: "アクセス・運営情報", href: "/access" },
        { label: "予約フォーム", href: "/reservation" },
        { label: "お問い合わせ", href: "/contact" },
        { label: "利用案内・注意事項", href: "/terms" },
        { label: "プライバシーポリシー", href: "/privacy" },
      ],
    },
  ];

  return (
    <>
      <PageHeader eyebrow="Sitemap" title="サイトマップ" />
      <Breadcrumbs
        items={[
          { name: "ホーム", path: "/" },
          { name: "サイトマップ", path: "/sitemap" },
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
                      href={link.href}
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
