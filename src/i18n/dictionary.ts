import "server-only";
import ja from "./messages/ja.json";
import { defaultLocale, type Locale } from "./locales";

/**
 * 翻訳辞書の読み込み。
 *
 * - 日本語（ja.json）を基準の型とし、各言語の辞書をディープマージして返します。
 * - 未翻訳キーは自動的に日本語へフォールバックするため、
 *   画面に翻訳キー（例: home.hero.title）がそのまま表示されることはありません。
 * - 開発環境では不足キーをコンソールに警告します（本番では警告しません）。
 * - server-only のため、全言語の辞書がクライアントへ送られることはありません。
 */

export type Dictionary = typeof ja;

const loaders: Record<Locale, () => Promise<{ default: unknown }>> = {
  ja: () => import("./messages/ja.json"),
  en: () => import("./messages/en.json"),
  "zh-tw": () => import("./messages/zh-tw.json"),
  "zh-cn": () => import("./messages/zh-cn.json"),
  ko: () => import("./messages/ko.json"),
};

const cache = new Map<Locale, Dictionary>();

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** base（日本語）に override（対象言語）を重ねる。配列は丸ごと置き換える。 */
function deepMerge<T>(base: T, override: unknown, path: string, missing: string[]): T {
  if (isPlainObject(base)) {
    const result: Record<string, unknown> = {};
    const source = isPlainObject(override) ? override : {};
    for (const key of Object.keys(base)) {
      const nextPath = path ? `${path}.${key}` : key;
      if (!(key in source)) {
        missing.push(nextPath);
        result[key] = (base as Record<string, unknown>)[key];
        continue;
      }
      result[key] = deepMerge(
        (base as Record<string, unknown>)[key],
        source[key],
        nextPath,
        missing
      );
    }
    return result as T;
  }

  if (Array.isArray(base)) {
    if (Array.isArray(override) && override.length > 0) return override as T;
    if (override !== undefined && !Array.isArray(override)) missing.push(path);
    return base;
  }

  // 文字列・数値など。空文字は未翻訳とみなし日本語へフォールバック
  if (typeof override === "string" && override.trim() === "") {
    missing.push(path);
    return base;
  }
  if (override === undefined || override === null) {
    missing.push(path);
    return base;
  }
  return override as T;
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const cached = cache.get(locale);
  if (cached) return cached;

  if (locale === defaultLocale) {
    cache.set(locale, ja);
    return ja;
  }

  const mod = await loaders[locale]();
  const missing: string[] = [];
  const merged = deepMerge(ja, mod.default, "", missing);

  if (process.env.NODE_ENV !== "production" && missing.length > 0) {
    console.warn(
      `[i18n] ${locale}: ${missing.length}件の翻訳キーが不足しています（日本語へフォールバック）:\n` +
        missing.slice(0, 20).map((k) => `  - ${k}`).join("\n") +
        (missing.length > 20 ? `\n  ...ほか${missing.length - 20}件` : "")
    );
  }

  cache.set(locale, merged);
  return merged;
}

/** 文字列テンプレートの置換ヘルパー。例: format("{amount}円", { amount: "7,700" }) */
export function format(
  template: string,
  vars: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match
  );
}
