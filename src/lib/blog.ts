import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { locales, type Locale } from "@/i18n/locales";

/**
 * 自動生成ブログ（Markdown）の読み込み。
 *
 * 配置: src/content/blog/<locale>/<slug>.md
 * 現在は日本語（ja）記事のみを生成しますが、将来英語などへ展開しやすいよう
 * 「blog/<locale>」構成にしています（既存コラムは content/<locale>/columns）。
 *
 * GitHub Actions が毎日1記事を content/blog/ja/ に追加し、main へ直接コミットします。
 * 記事の frontmatter は generate-daily-post スクリプトが決定的に組み立てます。
 *
 * 未翻訳の記事は 404 にせず、その言語のブログ一覧へ誘導します（UI 側で notAvailable を表示）。
 */

export type BlogPost = {
  slug: string;
  locale: Locale;
  title: string;
  description: string;
  /** 公開日（YYYY-MM-DD） */
  date: string;
  category: string;
  tags: string[];
  image: string;
  imageAlt: string;
  /** 下書き（true の場合は一覧・詳細に出さない） */
  draft: boolean;
  content: string;
};

/** 画像が未指定の記事に使う既定のアイキャッチ */
export const DEFAULT_BLOG_IMAGE = "/images/common/river-landscape.jpg";

const contentRoot = path.join(process.cwd(), "src", "content", "blog");

function blogDir(locale: Locale): string {
  return path.join(contentRoot, locale);
}

function parseFile(locale: Locale, filename: string): BlogPost {
  const slug = filename.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(blogDir(locale), filename), "utf-8");
  const { data, content } = matter(raw);
  return {
    slug: String(data.slug ?? slug),
    locale,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    date: String(data.date ?? ""),
    category: String(data.category ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    image: String(data.image ?? DEFAULT_BLOG_IMAGE),
    imageAlt: String(data.imageAlt ?? data.title ?? slug),
    draft: data.draft === true,
    content,
  };
}

export function getAllBlogPosts(locale: Locale): BlogPost[] {
  const dir = blogDir(locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => parseFile(locale, f))
    .filter((p) => !p.draft)
    // 新しい順（日付降順、同日はslug降順で安定化）
    .sort((a, b) => (a.date === b.date ? (a.slug < b.slug ? 1 : -1) : a.date < b.date ? 1 : -1));
}

export function getBlogPost(locale: Locale, slug: string): BlogPost | undefined {
  const file = path.join(blogDir(locale), `${slug}.md`);
  if (!fs.existsSync(file)) return undefined;
  const post = parseFile(locale, `${slug}.md`);
  return post.draft ? undefined : post;
}

/** 関連記事：同じタグを共有する記事を優先し、足りなければ新着で補う */
export function getRelatedBlogPosts(post: BlogPost, limit = 3): BlogPost[] {
  const all = getAllBlogPosts(post.locale).filter((p) => p.slug !== post.slug);
  const tagset = new Set(post.tags);
  const scored = all
    .map((p) => ({ p, score: p.tags.filter((t) => tagset.has(t)).length }))
    .sort((a, b) => b.score - a.score);
  const related = scored.filter((s) => s.score > 0).map((s) => s.p);
  const rest = scored.filter((s) => s.score === 0).map((s) => s.p);
  return [...related, ...rest].slice(0, limit);
}

/** 全言語・全記事のスラッグ（generateStaticParams 用） */
export function getAllBlogParams(): { locale: Locale; slug: string }[] {
  return locales.flatMap((locale) =>
    getAllBlogPosts(locale).map((p) => ({ locale, slug: p.slug }))
  );
}

/** 指定スラッグの記事が存在する言語を返す（hreflang を実在ぶんに絞るため） */
export function getBlogLocales(slug: string): Locale[] {
  return locales.filter((locale) =>
    fs.existsSync(path.join(blogDir(locale), `${slug}.md`))
  );
}
