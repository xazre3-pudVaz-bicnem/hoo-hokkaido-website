import type { Metadata } from "next";
import { site } from "@/data/site";
import { localeConfig, type Locale } from "@/i18n/locales";
import { alternateLanguages, localeUrl } from "@/i18n/routing";

type PageMeta = {
  locale: Locale;
  title: string;
  description: string;
  /** ロケールを含まないパス（例: "/activities"）。トップは "" */
  path?: string;
  ogImage?: string;
  /** 対策キーワード（メインKW＋関連KW）。検索意図の明示に使う。 */
  keywords?: readonly string[];
  /**
   * hreflang に含める言語を限定する（省略時は全5言語）。
   * コラムのように一部言語しか翻訳がないページで、実在ぶんだけ指定するために使う。
   */
  availableLocales?: readonly Locale[];
};

/**
 * 言語別のページメタデータを生成する。
 *
 * - canonical は各言語ページ自身を指す（英語ページを日本語ページに向けない）
 * - hreflang は全5言語 ＋ x-default（日本語）を相互に指定
 * - OGP / X 用メタデータも言語別に生成
 */
export function pageMetadata({
  locale,
  title,
  description,
  path = "",
  ogImage = "/images/og/og-image.jpg",
  keywords,
  availableLocales,
}: PageMeta): Metadata {
  const url = localeUrl(locale, path);
  return {
    title,
    description,
    ...(keywords && keywords.length > 0 ? { keywords: [...keywords] } : {}),
    alternates: {
      canonical: url,
      languages: alternateLanguages(path, availableLocales),
    },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      locale: localeConfig[locale].ogLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
