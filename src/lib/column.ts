import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { locales, type Locale } from "@/i18n/locales";

/**
 * コラム記事（Markdown）の読み込み。
 *
 * 配置: src/content/<locale>/columns/<slug>.md
 * 各記事は translationKey で言語間を関連付けます。
 * 記事のURLスラッグはファイル名（全言語で共通にすると言語切り替えが自然になります）。
 *
 * 未翻訳の記事は 404 にせず、その言語のコラム一覧へ誘導します
 * （UI 側で dict.column.notAvailable を表示）。
 */

export type ColumnPost = {
  slug: string;
  locale: Locale;
  /** 言語間で記事を紐づけるキー */
  translationKey: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  image: string;
  imageAlt: string;
  supervisor: string;
  related: string[];
  /** 下書き（true の場合は一覧・詳細に出さない） */
  draft: boolean;
  content: string;
};

const contentRoot = path.join(process.cwd(), "src", "content");

function columnDir(locale: Locale): string {
  return path.join(contentRoot, locale, "columns");
}

function parseFile(locale: Locale, filename: string): ColumnPost {
  const slug = filename.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(columnDir(locale), filename), "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    locale,
    translationKey: String(data.translationKey ?? slug),
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    category: String(data.category ?? ""),
    publishedAt: String(data.publishedAt ?? ""),
    updatedAt: String(data.updatedAt ?? data.publishedAt ?? ""),
    image: String(data.image ?? "/images/common/river-landscape.jpg"),
    imageAlt: String(data.imageAlt ?? data.title ?? slug),
    supervisor: String(data.supervisor ?? ""),
    related: Array.isArray(data.related) ? data.related.map(String) : [],
    draft: data.draft === true,
    content,
  };
}

export function getAllColumns(locale: Locale): ColumnPost[] {
  const dir = columnDir(locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => parseFile(locale, f))
    .filter((p) => !p.draft)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getColumn(locale: Locale, slug: string): ColumnPost | undefined {
  const file = path.join(columnDir(locale), `${slug}.md`);
  if (!fs.existsSync(file)) return undefined;
  const post = parseFile(locale, `${slug}.md`);
  return post.draft ? undefined : post;
}

export function getRelatedColumns(post: ColumnPost): ColumnPost[] {
  const all = getAllColumns(post.locale);
  const related = post.related
    .map((slug) => all.find((p) => p.slug === slug))
    .filter((p): p is ColumnPost => Boolean(p));
  if (related.length > 0) return related;
  return all.filter((p) => p.slug !== post.slug).slice(0, 3);
}

/** 全言語・全記事のスラッグ（generateStaticParams 用） */
export function getAllColumnParams(): { locale: Locale; slug: string }[] {
  return locales.flatMap((locale) =>
    getAllColumns(locale).map((p) => ({ locale, slug: p.slug }))
  );
}
