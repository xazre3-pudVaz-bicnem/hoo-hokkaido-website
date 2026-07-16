import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import BlogCard from "@/components/ui/BlogCard";
import BlogPagination from "@/components/ui/BlogPagination";
import FinalCta from "@/components/sections/FinalCta";
import { pageMetadata } from "@/lib/seo";
import { getBlogPage, getBlogPageCount } from "@/lib/blog";
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
    title: dict.meta.blog.title,
    description: dict.meta.blog.description,
    path: "/blog",
  });
}

export default async function BlogListPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const posts = getBlogPage(locale, 1);
  const totalPages = getBlogPageCount(locale);

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
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        {posts.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-forest/40 bg-white px-6 py-12 text-center text-sm text-ink-soft">
            {dict.blog.empty}
          </p>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <BlogCard
                  key={post.slug}
                  locale={locale}
                  post={post}
                  index={i}
                  // 1ページ目の先頭3枚だけ先読みし、LCPを軽くする
                  priority={i < 3}
                />
              ))}
            </div>
            <BlogPagination
              locale={locale}
              current={1}
              total={totalPages}
              strings={{
                prev: dict.blog.prev,
                next: dict.blog.next,
                label: dict.blog.paginationLabel,
                pageOf: dict.blog.pageOf,
              }}
            />
          </>
        )}
      </section>

      <FinalCta locale={locale} dict={dict} />
    </>
  );
}
