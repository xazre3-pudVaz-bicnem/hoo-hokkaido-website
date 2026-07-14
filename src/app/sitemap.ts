import type { MetadataRoute } from "next";
import { activities } from "@/data/activities";
import { getAllColumns } from "@/lib/column";
import { locales } from "@/i18n/locales";
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
    { path: "/privacy", priority: 0.3 },
    { path: "/terms", priority: 0.3 },
    { path: "/sitemap", priority: 0.3 },
  ];

  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

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
      entries.push({
        url: localeUrl(locale, path),
        lastModified: new Date(post.updatedAt || post.publishedAt),
        priority: 0.6,
        alternates: { languages: alternateLanguages(path) },
      });
    }
  }

  return entries;
}
