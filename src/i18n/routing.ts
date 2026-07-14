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
 */
export function alternateLanguages(path = ""): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[localeConfig[locale].hreflang] = localeUrl(locale, path);
  }
  languages["x-default"] = localeUrl(defaultLocale, path);
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
