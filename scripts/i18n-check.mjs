/**
 * 翻訳漏れ検出スクリプト。
 *   npm run i18n:check
 *
 * 確認内容：
 *  1. 日本語（ja.json）に存在するキーが、他言語にも存在するか
 *  2. 他言語にしか存在しない未使用キーがないか
 *  3. 空文字の値がないか
 *  4. 配列の要素数が日本語と一致しているか
 *  5. 料金・電話番号などの共通データが翻訳ファイルへ重複記載されていないか
 *  6. 各ページのメタデータ（title / description）が全言語に存在し、重複がないか
 *  7. 各言語のFAQが存在するか
 *  8. コラム記事の frontmatter（locale / translationKey）が正しいか
 *
 * 問題があれば終了コード1で終了します（CIで検出可能）。
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const root = path.join(import.meta.dirname, "..");
const messagesDir = path.join(root, "src", "i18n", "messages");
const contentDir = path.join(root, "src", "content");

const BASE = "ja";
const LOCALES = ["ja", "en", "zh-tw", "zh-cn", "ko"];

/** 翻訳ファイルへ書いてはいけない共通データ（重複記載の検出用） */
const FORBIDDEN = [
  { label: "料金（7,700）", pattern: /7[,，]?700/ },
  { label: "料金（50,000）", pattern: /50[,，]?000/ },
  // HOOの実電話番号のみを検出（入力例の +81 90-1234-5678 などは許容）
  { label: "電話番号", pattern: /090[-\s]?5950[-\s]?4006|81[-\s]?90[-\s]?5950/ },
  { label: "メールアドレス", pattern: /info@hoohokkaido\.com/ },
];

const errors = [];
const warnings = [];

function readJson(locale) {
  const file = path.join(messagesDir, `${locale}.json`);
  if (!fs.existsSync(file)) {
    errors.push(`翻訳ファイルがありません: src/i18n/messages/${locale}.json`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch (e) {
    errors.push(`JSONの構文エラー: ${locale}.json — ${e.message}`);
    return null;
  }
}

/** オブジェクトをフラットなキー配列にする */
function flatten(obj, prefix = "", out = new Map()) {
  if (Array.isArray(obj)) {
    out.set(prefix, { type: "array", length: obj.length });
    obj.forEach((item, i) => flatten(item, `${prefix}[${i}]`, out));
    return out;
  }
  if (obj !== null && typeof obj === "object") {
    for (const [key, value] of Object.entries(obj)) {
      flatten(value, prefix ? `${prefix}.${key}` : key, out);
    }
    return out;
  }
  out.set(prefix, { type: typeof obj, value: obj });
  return out;
}

const base = readJson(BASE);
if (!base) {
  console.error("基準となる ja.json を読み込めませんでした。");
  process.exit(1);
}
const baseFlat = flatten(base);

for (const locale of LOCALES) {
  if (locale === BASE) continue;
  const dict = readJson(locale);
  if (!dict) continue;
  const flat = flatten(dict);

  // 1 & 4: 不足キー・配列長の不一致
  for (const [key, info] of baseFlat) {
    if (!flat.has(key)) {
      errors.push(`[${locale}] 翻訳キーが不足: ${key}`);
      continue;
    }
    const target = flat.get(key);
    if (info.type === "array" && target.length !== info.length) {
      errors.push(
        `[${locale}] 配列の要素数が一致しません: ${key}（ja: ${info.length} / ${locale}: ${target.length}）`
      );
    }
    // 3: 空文字
    if (target.type === "string" && String(target.value).trim() === "") {
      errors.push(`[${locale}] 値が空です: ${key}`);
    }
  }

  // 2: 未使用（日本語に存在しない）キー
  for (const key of flat.keys()) {
    if (!baseFlat.has(key)) {
      warnings.push(`[${locale}] 日本語に存在しないキー（未使用の可能性）: ${key}`);
    }
  }
}

// 5: 共通データの重複記載チェック（全言語）
for (const locale of LOCALES) {
  const dict = readJson(locale);
  if (!dict) continue;
  for (const [key, info] of flatten(dict)) {
    if (info.type !== "string") continue;
    for (const rule of FORBIDDEN) {
      if (rule.pattern.test(String(info.value))) {
        errors.push(
          `[${locale}] ${rule.label}が翻訳ファイルに直接記載されています（共通データから取得してください）: ${key}`
        );
      }
    }
  }
}

// 6 & 7: メタデータ・FAQの存在確認
for (const locale of LOCALES) {
  const dict = readJson(locale);
  if (!dict) continue;

  const metaPages = Object.keys(base.meta ?? {});
  const seen = new Map();
  for (const page of metaPages) {
    const meta = dict.meta?.[page];
    if (!meta?.title || !meta?.description) {
      errors.push(`[${locale}] メタデータが不足しています: meta.${page}`);
      continue;
    }
    if (seen.has(meta.title)) {
      errors.push(
        `[${locale}] meta.title が重複しています: meta.${page} と meta.${seen.get(meta.title)}`
      );
    }
    seen.set(meta.title, page);
  }

  if (!Array.isArray(dict.faq?.items) || dict.faq.items.length === 0) {
    errors.push(`[${locale}] FAQ（faq.items）が存在しません。`);
  }
  for (const slug of Object.keys(base.activities ?? {})) {
    const activity = dict.activities?.[slug];
    if (!activity?.meta?.title || !activity?.meta?.description) {
      errors.push(`[${locale}] アクティビティのメタデータが不足: activities.${slug}.meta`);
    }
    if (!Array.isArray(activity?.faq) || activity.faq.length === 0) {
      errors.push(`[${locale}] アクティビティのFAQが不足: activities.${slug}.faq`);
    }
  }
}

// 8: コラム記事の frontmatter
const jaColumns = new Set();
for (const locale of LOCALES) {
  const dir = path.join(contentDir, locale, "columns");
  if (!fs.existsSync(dir)) {
    warnings.push(`[${locale}] コラムのディレクトリがありません: src/content/${locale}/columns/`);
    continue;
  }
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
    const { data } = matter(fs.readFileSync(path.join(dir, file), "utf-8"));
    const slug = file.replace(/\.md$/, "");
    if (locale === BASE) jaColumns.add(slug);

    if (data.locale !== locale) {
      errors.push(
        `[${locale}] コラムの locale が不正です: ${file}（locale: ${data.locale ?? "未設定"}）`
      );
    }
    if (!data.translationKey) {
      errors.push(`[${locale}] コラムに translationKey がありません: ${file}`);
    }
    if (!data.title || !data.description) {
      errors.push(`[${locale}] コラムの title / description が不足: ${file}`);
    }
  }
}
// 日本語記事に対する未翻訳の記事を警告（エラーにはしない：一覧へフォールバックするため）
for (const locale of LOCALES) {
  if (locale === BASE) continue;
  const dir = path.join(contentDir, locale, "columns");
  if (!fs.existsSync(dir)) continue;
  const existing = new Set(
    fs.readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""))
  );
  for (const slug of jaColumns) {
    if (!existing.has(slug)) {
      warnings.push(`[${locale}] 未翻訳のコラム記事: ${slug}（一覧へフォールバックします）`);
    }
  }
}

// ── 結果表示 ──
if (warnings.length > 0) {
  console.log(`\n⚠ 警告 ${warnings.length}件:`);
  warnings.forEach((w) => console.log(`  - ${w}`));
}

if (errors.length > 0) {
  console.error(`\n✖ エラー ${errors.length}件:`);
  errors.forEach((e) => console.error(`  - ${e}`));
  console.error("\ni18n:check に失敗しました。上記を修正してください。\n");
  process.exit(1);
}

console.log(
  `\n✓ i18n:check 成功 — ${LOCALES.length}言語すべてで翻訳キー・メタデータ・FAQ・コラムの整合性を確認しました。\n`
);
