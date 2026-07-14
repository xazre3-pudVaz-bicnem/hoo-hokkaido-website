import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Tag } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import FadeIn from "@/components/ui/FadeIn";
import FinalCta from "@/components/sections/FinalCta";
import { pageMetadata } from "@/lib/seo";
import { formatDate, getAllColumns } from "@/lib/column";

export const metadata = pageMetadata({
  title: "コラム｜富良野のアウトドア情報",
  description:
    "富良野・美瑛・旭川のアウトドア情報コラム。アクティビティの選び方、川の体験の服装・持ち物、旅行計画のポイントなど、北海道の自然体験に役立つ情報をお届けします。",
  path: "/column",
});

export default function ColumnListPage() {
  const posts = getAllColumns();

  return (
    <>
      <PageHeader
        eyebrow="Column"
        title="コラム"
        lead="富良野・美瑛・旭川の自然体験に役立つ情報を、現地のガイド目線でお届けします。"
      />
      <Breadcrumbs
        items={[
          { name: "ホーム", path: "/" },
          { name: "コラム", path: "/column" },
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        {posts.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-forest/40 bg-white px-6 py-12 text-center text-sm text-ink-soft">
            記事は準備中です。公開までしばらくお待ちください。
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <FadeIn key={post.slug} delay={(i % 3) * 0.06}>
                <article className="group h-full overflow-hidden rounded-3xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                  <Link href={`/column/${post.slug}`} className="flex h-full flex-col">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.imageAlt}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex flex-wrap items-center gap-3 text-xs text-ink-soft">
                        <span className="inline-flex items-center gap-1 rounded-full bg-forest-light px-2.5 py-1 font-bold text-forest-dark">
                          <Tag aria-hidden="true" className="h-3 w-3" />
                          {post.category}
                        </span>
                        <time
                          dateTime={post.publishedAt}
                          className="inline-flex items-center gap-1"
                        >
                          <CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />
                          {formatDate(post.publishedAt)}
                        </time>
                      </div>
                      <h2 className="mt-3 text-base font-bold leading-relaxed text-navy transition-colors group-hover:text-water-deep">
                        {post.title}
                      </h2>
                      <p className="mt-2.5 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-soft">
                        {post.description}
                      </p>
                    </div>
                  </Link>
                </article>
              </FadeIn>
            ))}
          </div>
        )}
      </section>

      <FinalCta />
    </>
  );
}
