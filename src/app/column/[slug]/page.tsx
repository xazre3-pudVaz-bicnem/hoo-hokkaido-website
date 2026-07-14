import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowRight, CalendarDays, Tag, UserCheck } from "lucide-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import JsonLd from "@/components/ui/JsonLd";
import ActivityCard from "@/components/ui/ActivityCard";
import FinalCta from "@/components/sections/FinalCta";
import { pageMetadata } from "@/lib/seo";
import { articleJsonLd } from "@/lib/jsonld";
import { formatDate, getAllColumns, getColumn, getRelatedColumns } from "@/lib/column";
import { getActivity } from "@/data/activities";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getAllColumns().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getColumn(slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.description,
    path: `/column/${post.slug}`,
    ogImage: post.image,
  });
}

/** 記事本文のMarkdownレンダリング設定 */
const markdownComponents = {
  h2: (props: React.ComponentProps<"h2">) => (
    <h2
      className="mt-12 border-l-4 border-water-deep pl-4 font-display text-xl font-bold leading-relaxed text-navy md:text-2xl"
      {...props}
    />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3 className="mt-8 text-lg font-bold text-navy" {...props} />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <p className="mt-5 text-sm leading-loose text-ink md:text-[15px] md:leading-[2]" {...props} />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="mt-5 list-disc space-y-2 pl-6 text-sm leading-relaxed text-ink md:text-[15px]" {...props} />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol className="mt-5 list-decimal space-y-2 pl-6 text-sm leading-relaxed text-ink md:text-[15px]" {...props} />
  ),
  li: (props: React.ComponentProps<"li">) => <li className="pl-1" {...props} />,
  a: (props: React.ComponentProps<"a">) => (
    <a
      className="font-bold text-water-deep underline underline-offset-2 transition-colors hover:text-navy"
      {...props}
    />
  ),
  strong: (props: React.ComponentProps<"strong">) => (
    <strong className="font-bold text-forest-dark" {...props} />
  ),
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote
      className="mt-5 border-l-4 border-forest-light bg-forest-light/30 p-4 text-sm italic text-ink-soft"
      {...props}
    />
  ),
  table: (props: React.ComponentProps<"table">) => (
    <div className="mt-5 overflow-x-auto">
      <table className="w-full min-w-[480px] border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props: React.ComponentProps<"th">) => (
    <th className="border border-forest-light bg-forest-light/50 px-3 py-2 text-left font-bold text-navy" {...props} />
  ),
  td: (props: React.ComponentProps<"td">) => (
    <td className="border border-forest-light px-3 py-2 text-ink" {...props} />
  ),
};

export default async function ColumnDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getColumn(slug);
  if (!post) notFound();

  const relatedPosts = getRelatedColumns(post);
  const furano = getActivity("furano-relax-downriver")!;

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title: post.title,
          description: post.description,
          slug: post.slug,
          publishedAt: post.publishedAt,
          updatedAt: post.updatedAt,
          image: post.image,
        })}
      />

      <div className="bg-gradient-to-b from-forest-light/60 to-offwhite pt-16 md:pt-20">
        <Breadcrumbs
          items={[
            { name: "ホーム", path: "/" },
            { name: "コラム", path: "/column" },
            { name: post.title, path: `/column/${post.slug}` },
          ]}
        />
      </div>

      <article className="mx-auto max-w-3xl px-4 pb-16 md:px-6">
        <header>
          <div className="flex flex-wrap items-center gap-3 text-xs text-ink-soft">
            <span className="inline-flex items-center gap-1 rounded-full bg-forest-light px-2.5 py-1 font-bold text-forest-dark">
              <Tag aria-hidden="true" className="h-3 w-3" />
              {post.category}
            </span>
            <time dateTime={post.publishedAt} className="inline-flex items-center gap-1">
              <CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />
              公開日 {formatDate(post.publishedAt)}
            </time>
            {post.updatedAt !== post.publishedAt && (
              <time dateTime={post.updatedAt}>更新日 {formatDate(post.updatedAt)}</time>
            )}
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold leading-relaxed text-navy md:text-3xl md:leading-relaxed">
            {post.title}
          </h1>
          <div className="relative mt-7 aspect-[16/9] overflow-hidden rounded-3xl shadow-card">
            <Image
              src={post.image}
              alt={post.imageAlt}
              fill
              priority
              sizes="(min-width: 768px) 720px, 100vw"
              className="object-cover"
            />
          </div>
        </header>

        <div className="mt-2">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {post.content}
          </ReactMarkdown>
        </div>

        {/* 監修者 */}
        <div className="mt-12 flex items-start gap-3 rounded-3xl border border-forest-light bg-white p-6">
          <UserCheck aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-forest" />
          <div>
            <p className="text-xs font-bold text-ink-soft">この記事の監修</p>
            <p className="mt-1 text-sm font-bold text-navy">{post.supervisor}</p>
            <Link
              href="/about"
              className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-water-deep hover:text-navy"
            >
              プロフィールを見る
              <ArrowRight aria-hidden="true" className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* 体験への導線 */}
        <div className="mt-10">
          <h2 className="font-display text-xl font-bold text-navy">
            富良野で体験してみませんか？
          </h2>
          <div className="mt-5">
            <ActivityCard activity={furano} />
          </div>
        </div>

        {/* 関連記事 */}
        {relatedPosts.length > 0 && (
          <div className="mt-14">
            <h2 className="font-display text-xl font-bold text-navy">関連記事</h2>
            <ul className="mt-5 space-y-3">
              {relatedPosts.map((related) => (
                <li key={related.slug}>
                  <Link
                    href={`/column/${related.slug}`}
                    className="group flex items-center justify-between gap-4 rounded-2xl border border-forest-light bg-white px-5 py-4 transition-all hover:border-water hover:shadow-card"
                  >
                    <span>
                      <span className="block text-xs text-ink-soft">
                        {related.category} ／ {formatDate(related.publishedAt)}
                      </span>
                      <span className="mt-1 block text-sm font-bold text-navy transition-colors group-hover:text-water-deep">
                        {related.title}
                      </span>
                    </span>
                    <ArrowRight
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-water-deep transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>

      <FinalCta />
    </>
  );
}
