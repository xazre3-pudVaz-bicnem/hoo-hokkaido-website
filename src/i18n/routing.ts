import { locales, localeConfig, defaultLocale, type Locale } from "./locales";
import { site } from "@/data/site";

/**
 * 言語別ルーティングのヘルパー。
 * URL構造: /{locale}{path}   例: /en/activities/furano-relax-downriver
 */

/** ロケール付きの内部パスを生成する（Link の href に使用） */
export function localePath(locale: Locale, path = ""): string {
  const clean = path === "/" ? "" : path;
  return `/${locale}${clean}`;
}

/** 絶対URLを生成する（canonical / OGP / sitemap 用） */
export function localeUrl(locale: Locale, path = ""): string {
  return `${site.url}${localePath(locale, path)}`;
}

/**
 * hreflang 用の言語別URLマップ。
 * x-default は日本語ページを指す（サイトの原本言語）。
 *
 * onlyLocales を渡すと、その言語のぶんだけ出力します。
 * コラムのように一部言語しか翻訳が存在しないページで、
 * 実在しない翻訳URLを hreflang に含めないために使います。
 */
export function alternateLanguages(
  path = "",
  onlyLocales?: readonly Locale[]
): Record<string, string> {
  const target = onlyLocales ?? locales;
  const languages: Record<string, string> = {};
  for (const locale of target) {
    languages[localeConfig[locale].hreflang] = localeUrl(locale, path);
  }
  // x-default は日本語版があればそれを、なければ対象の先頭言語を指す
  const fallback = target.includes(defaultLocale) ? defaultLocale : target[0];
  if (fallback) languages["x-default"] = localeUrl(fallback, path);
  return languages;
}

/**
 * 現在のパス名から、ロケール部分を取り除いた「言語非依存のパス」を返す。
 * 言語切り替え時に同じページの別言語版へ移動するために使用します。
 * 例: "/en/activities/furano-relax-downriver" → "/activities/furano-relax-downriver"
 */
export function stripLocale(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return "";
  const [first, ...rest] = segments;
  if ((locales as readonly string[]).includes(first)) {
    return rest.length > 0 ? `/${rest.join("/")}` : "";
  }
  return pathname === "/" ? "" : pathname;
}
