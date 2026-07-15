import type { MetadataRoute } from "next";
import { activities } from "@/data/activities";
import { getAllColumns } from "@/lib/column";
import { getAllBlogPosts } from "@/lib/blog";
import { locales, type Locale } from "@/i18n/locales";
import { alternateLanguages, localeUrl } from "@/i18n/routing";

/**
 * 言語別XMLサイトマップ。
 * 各URLに alternates.languages（hreflang）を付与し、
 * 検索エンジンへ言語間の対応関係を伝えます。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths: { path: string; priority: number }[] = [
    { path: "", priority: 1.0 },
    { path: "/activities", priority: 0.9 },
    { path: "/furano-activity", priority: 0.9 },
    { path: "/furano-rafting", priority: 0.9 },
    { path: "/reservation", priority: 0.9 },
    { path: "/about", priority: 0.7 },
    { path: "/projects", priority: 0.6 },
    { path: "/safety", priority: 0.7 },
    { path: "/faq", priority: 0.7 },
    { path: "/access", priority: 0.6 },
    { path: "/contact", priority: 0.7 },
    { path: "/column", priority: 0.7 },
    { path: "/blog", priority: 0.7 },
    { path: "/privacy", priority: 0.3 },
    { path: "/terms", priority: 0.3 },
    { path: "/sitemap", priority: 0.3 },
  ];

  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // 記事スラッグごとに、翻訳が存在する言語を集める（hreflangを実在ぶんに絞るため）
  const columnLocales = new Map<string, Locale[]>();
  for (const locale of locales) {
    for (const post of getAllColumns(locale)) {
      const list = columnLocales.get(post.slug) ?? [];
      list.push(locale);
      columnLocales.set(post.slug, list);
    }
  }

  // ブログ記事も同様に、実在する言語を集める
  const blogLocales = new Map<string, Locale[]>();
  for (const locale of locales) {
    for (const post of getAllBlogPosts(locale)) {
      const list = blogLocales.get(post.slug) ?? [];
      list.push(locale);
      blogLocales.set(post.slug, list);
    }
  }

  for (const locale of locales) {
    for (const entry of staticPaths) {
      entries.push({
        url: localeUrl(locale, entry.path),
        lastModified: now,
        priority: entry.priority,
        alternates: { languages: alternateLanguages(entry.path) },
      });
    }

    for (const activity of activities) {
      const path = `/activities/${activity.slug}`;
      entries.push({
        url: localeUrl(locale, path),
        lastModified: now,
        priority: activity.slug === "furano-relax-downriver" ? 0.95 : 0.8,
        alternates: { languages: alternateLanguages(path) },
      });
    }

    for (const post of getAllColumns(locale)) {
      const path = `/column/${post.slug}`;
      // この記事が実際に翻訳されている言語だけを hreflang に含める
      const availableLocales = columnLocales.get(post.slug) ?? [locale];
      entries.push({
        url: localeUrl(locale, path),
        lastModified: new Date(post.updatedAt || post.publishedAt),
        priority: 0.6,
        alternates: { languages: alternateLanguages(path, availableLocales) },
      });
    }

    for (const post of getAllBlogPosts(locale)) {
      const path = `/blog/${post.slug}`;
      const availableLocales = blogLocales.get(post.slug) ?? [locale];
      entries.push({
        url: localeUrl(locale, path),
        lastModified: post.date ? new Date(post.date) : now,
        priority: 0.5,
        alternates: { languages: alternateLanguages(path, availableLocales) },
      });
    }
  }

  return entries;
}
