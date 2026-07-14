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
}: PageMeta): Metadata {
  const url = localeUrl(locale, path);
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: alternateLanguages(path),
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
