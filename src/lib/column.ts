import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * コラム記事（Markdown）の読み込みユーティリティ。
 * 記事は src/content/column/*.md に置きます。
 * ファイル名（拡張子なし）がURLスラッグになります（/column/[slug]）。
 */

export type ColumnMeta = {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  image: string;
  imageAlt: string;
  /** 監修者名（既定は代表・小瀬祥太） */
  supervisor: string;
  /** 関連記事のスラッグ */
  related: string[];
};

export type ColumnPost = ColumnMeta & {
  content: string;
};

const columnDir = path.join(process.cwd(), "src", "content", "column");

function parseFile(filename: string): ColumnPost {
  const slug = filename.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(columnDir, filename), "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    category: String(data.category ?? "コラム"),
    publishedAt: String(data.publishedAt ?? ""),
    updatedAt: String(data.updatedAt ?? data.publishedAt ?? ""),
    image: String(data.image ?? "/images/common/river-landscape.jpg"),
    imageAlt: String(data.imageAlt ?? data.title ?? slug),
    supervisor: String(data.supervisor ?? "小瀬 祥太（HOO代表・アウトドアガイド歴20年以上）"),
    related: Array.isArray(data.related) ? data.related.map(String) : [],
    content,
  };
}

export function getAllColumns(): ColumnPost[] {
  if (!fs.existsSync(columnDir)) return [];
  return fs
    .readdirSync(columnDir)
    .filter((f) => f.endsWith(".md"))
    .map(parseFile)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getColumn(slug: string): ColumnPost | undefined {
  const file = path.join(columnDir, `${slug}.md`);
  if (!fs.existsSync(file)) return undefined;
  return parseFile(`${slug}.md`);
}

export function getRelatedColumns(post: ColumnPost): ColumnPost[] {
  const all = getAllColumns();
  const related = post.related
    .map((slug) => all.find((p) => p.slug === slug))
    .filter((p): p is ColumnPost => Boolean(p));
  if (related.length > 0) return related;
  // 関連記事の指定がない場合は同カテゴリ→新着順で補完
  return all.filter((p) => p.slug !== post.slug).slice(0, 3);
}

export function formatDate(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${y}年${Number(m)}月${Number(d)}日`;
}
