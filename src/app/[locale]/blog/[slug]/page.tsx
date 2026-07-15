import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowRight, CalendarDays, Info, Tag } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import JsonLd from "@/components/ui/JsonLd";
import ActivityCard from "@/components/ui/ActivityCard";
import FinalCta from "@/components/sections/FinalCta";
import { pageMetadata } from "@/lib/seo";
import { articleJsonLd } from "@/lib/jsonld";
import {
  getAllBlogParams,
  getBlogPost,
  getBlogLocales,
  getRelatedBlogPosts,
} from "@/lib/blog";
import { formatDate } from "@/lib/format";
import { getActivity } from "@/data/activities";
import { getDictionary } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/locales";
import { localePath } from "@/i18n/routing";

type Params = { locale: Locale; slug: string };

/**
 * 未翻訳の記事へアクセスされた場合でも 404 にせず、ブログ一覧へ誘導します。
 * 親レイアウトが dynamicParams = false のため、ここで true に戻します。
 */
export const dynamicParams = true;

export function generateStaticParams() {
  return getAllBlogParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const dict = await getDictionary(locale);
  const post = getBlogPost(locale, slug);

  if (!post) {
    return {
      ...pageMetadata({
        locale,
        title: dict.meta.blog.title,
        description: dict.meta.blog.description,
        path: "/blog",
      }),
      robots: { index: false, follow: true },
    };
  }

  return pageMetadata({
    locale,
    title: post.title,
    description: post.description,
    path: `/blog/${slug}`,
    ogImage: post.image,
    // この記事が実際に存在する言語だけを hreflang に含める
    availableLocales: getBlogLocales(slug),
  });
}

/** Markdown内の内部リンクへ、表示中の言語のプレフィックスを付与する */
function markdownComponents(locale: Locale) {
  return {
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
      <p
        className="mt-5 text-sm leading-loose text-ink md:text-[15px] md:leading-[2]"
        {...props}
      />
    ),
    ul: (props: React.ComponentProps<"ul">) => (
      <ul
        className="mt-5 list-disc space-y-2 pl-6 text-sm leading-relaxed text-ink md:text-[15px]"
        {...props}
      />
    ),
    ol: (props: React.ComponentProps<"ol">) => (
      <ol
        className="mt-5 list-decimal space-y-2 pl-6 text-sm leading-relaxed text-ink md:text-[15px]"
        {...props}
      />
    ),
    li: (props: React.ComponentProps<"li">) => <li className="pl-1" {...props} />,
    a: ({ href, ...props }: React.ComponentProps<"a">) => {
      // "/activities/..." のような内部リンクに /{locale} を付ける
      const localized =
        href && href.startsWith("/") ? `/${locale}${href}` : href;
      const external = href ? /^https?:\/\//.test(href) : false;
      return (
        <a
          href={localized}
          className="font-bold text-water-deep underline underline-offset-2 transition-colors hover:text-navy"
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          {...props}
        />
      );
    },
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
      <th
        className="border border-forest-light bg-forest-light/50 px-3 py-2 text-left font-bold text-navy"
        {...props}
      />
    ),
    td: (props: React.ComponentProps<"td">) => (
      <td className="border border-forest-light px-3 py-2 text-ink" {...props} />
    ),
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale, slug } = await params;
  const dict = await getDictionary(locale);
  const post = getBlogPost(locale, slug);

  // 未翻訳：404 にせず、その言語のブログ一覧へ誘導する
  if (!post) {
    return (
      <>
        <PageHeader
          eyebrow={dict.blog.eyebrow}
          title={dict.blog.title}
          lead={dict.blog.lead}
        />
        <section className="mx-auto max-w-3xl px-4 py-16 text-center md:px-6 md:py-20">
          <div className="rounded-3xl border border-dashed border-forest/40 bg-white px-6 py-12">
            <Info aria-hidden="true" className="mx-auto h-8 w-8 text-water-deep" />
            <p className="mt-4 text-sm leading-loose text-ink-soft">
              {dict.blog.notAvailable}
            </p>
            <Link
              href={localePath(locale, "/blog")}
              className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-water-deep px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-navy"
            >
              {dict.blog.notAvailableCta}
              <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
            </Link>
          </div>
        </section>
        <FinalCta locale={locale} dict={dict} />
      </>
    );
  }

  const relatedPosts = getRelatedBlogPosts(post);
  const furano = getActivity("furano-relax-downriver")!;

  return (
    <>
      <JsonLd
        data={articleJsonLd(locale, {
          title: post.title,
          description: post.description,
          slug: post.slug,
          section: "blog",
          publishedAt: post.date,
          updatedAt: post.date,
          image: post.image,
        })}
      />

      <div className="bg-gradient-to-b from-forest-light/60 to-offwhite pt-16 md:pt-20">
        <Breadcrumbs
          locale={locale}
          label={dict.breadcrumb.label}
          items={[
            { name: dict.breadcrumb.home, path: "" },
            { name: dict.blog.title, path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]}
        />
      </div>

      <article className="mx-auto max-w-3xl px-4 pb-16 md:px-6">
        <header>
          <div className="flex flex-wrap items-center gap-3 text-xs text-ink-soft">
            <span className="inline-flex items-center gap-1 rounded-full bg-forest-light px-2.5 py-1 font-bold text-forest-dark">
              <Tag aria-hidden="true" className="h-3 w-3 shrink-0" />
              {post.category}
            </span>
            <time dateTime={post.date} className="inline-flex items-center gap-1">
              <CalendarDays aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
              {dict.blog.published} {formatDate(post.date, locale)}
            </time>
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
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents(locale)}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* タグ */}
        {post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-forest-light/60 px-3 py-1 text-xs font-bold text-forest-dark"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 体験への導線 */}
        <div className="mt-12">
          <h2 className="font-display text-xl font-bold text-navy">
            {dict.blog.ctaTitle}
          </h2>
          <div className="mt-5">
            <ActivityCard locale={locale} dict={dict} activity={furano} />
          </div>
        </div>

        {/* 関連記事 */}
        {relatedPosts.length > 0 && (
          <div className="mt-14">
            <h2 className="font-display text-xl font-bold text-navy">
              {dict.blog.relatedTitle}
            </h2>
            <ul className="mt-5 space-y-3">
              {relatedPosts.map((related) => (
                <li key={related.slug}>
                  <Link
                    href={localePath(locale, `/blog/${related.slug}`)}
                    className="group flex items-center justify-between gap-4 rounded-2xl border border-forest-light bg-white px-5 py-4 transition-all hover:border-water hover:shadow-card"
                  >
                    <span>
                      <span className="block text-xs text-ink-soft">
                        {related.category} ／ {formatDate(related.date, locale)}
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

      <FinalCta locale={locale} dict={dict} />
    </>
  );
}
