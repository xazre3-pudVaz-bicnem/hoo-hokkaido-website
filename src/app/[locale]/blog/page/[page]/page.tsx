import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/ui/PageHeader";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import BlogCard from "@/components/ui/BlogCard";
import BlogPagination from "@/components/ui/BlogPagination";
import FinalCta from "@/components/sections/FinalCta";
import { pageMetadata } from "@/lib/seo";
import { getBlogPage, getBlogPageCount, getBlogPageParams } from "@/lib/blog";
import { getDictionary } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/locales";

type Params = { locale: Locale; page: string };

/** 記事が増えるとページ数も増えるため、未生成のページ番号も配信できるようにする */
export const dynamicParams = true;

export function generateStaticParams() {
  return getBlogPageParams();
}

function parsePage(raw: string): number | null {
  if (!/^\d+$/.test(raw)) return null;
  const n = Number(raw);
  return n >= 2 ? n : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, page: raw } = await params;
  const dict = await getDictionary(locale);
  const page = parsePage(raw);
  if (page === null) return { robots: { index: false, follow: true } };

  const title = `${dict.meta.blog.title}（${page}）`;
  return pageMetadata({
    locale,
    title,
    description: dict.meta.blog.description,
    path: `/blog/page/${page}`,
  });
}

export default async function BlogPagedPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale, page: raw } = await params;
  const dict = await getDictionary(locale);
  const page = parsePage(raw);
  if (page === null) notFound();

  const totalPages = getBlogPageCount(locale);
  const posts = getBlogPage(locale, page);
  // 存在しないページ番号は404にする（空ページをインデックスさせない）
  if (posts.length === 0) notFound();

  return (
    <>
      <PageHeader
        eyebrow={dict.blog.eyebrow}
        title={dict.blog.title}
        lead={dict.blog.lead}
      />
      <Breadcrumbs
        locale={locale}
        label={dict.breadcrumb.label}
        items={[
          { name: dict.breadcrumb.home, path: "" },
          { name: dict.blog.title, path: "/blog" },
          {
            name: dict.blog.pageOf
              .replace("{current}", String(page))
              .replace("{total}", String(totalPages)),
            path: `/blog/page/${page}`,
          },
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <BlogCard key={post.slug} locale={locale} post={post} index={i} />
          ))}
        </div>
        <BlogPagination
          locale={locale}
          current={page}
          total={totalPages}
          strings={{
            prev: dict.blog.prev,
            next: dict.blog.next,
            label: dict.blog.paginationLabel,
            pageOf: dict.blog.pageOf,
          }}
        />
      </section>

      <FinalCta locale={locale} dict={dict} />
    </>
  );
}
