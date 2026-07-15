import { site } from "@/data/site";
import type { Activity } from "@/data/activities";
import type { Dictionary } from "@/i18n/dictionary";
import { localeConfig, type Locale } from "@/i18n/locales";
import { localeUrl } from "@/i18n/routing";
import { formatPriceFull } from "@/lib/format";

/**
 * 言語別の構造化データ（JSON-LD）。
 *
 * - inLanguage を言語ごとに設定
 * - 名称・説明・FAQ は表示言語に合わせる
 * - 電話番号・住所・料金などの共通情報は data 層から取得するため、言語間で不一致が起きない
 * - 架空の口コミ・評価・実績数は含めない
 */

type Faq = { question: string; answer: string };

/** hreflang 相当の言語コード（ja / en / zh-Hant / zh-Hans / ko） */
function langCode(locale: Locale): string {
  return localeConfig[locale].hreflang;
}

export function localBusinessJsonLd(locale: Locale, dict: Dictionary) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site.url}/#organization`,
    name: site.name,
    alternateName: site.shortName,
    url: localeUrl(locale),
    email: site.email,
    telephone: site.tel.schema,
    inLanguage: langCode(locale),
    description: dict.meta.home.description,
    address: {
      "@type": "PostalAddress",
      addressCountry: site.address.country,
      addressRegion: site.address.prefecture,
      addressLocality: site.address.city,
      // 番地（street）は非公開のため、設定されている場合のみ出力する
      ...(site.address.street ? { streetAddress: site.address.street } : {}),
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: site.hours.opens,
      closes: site.hours.closes,
    },
    founder: {
      "@type": "Person",
      name: site.representative.nameRoman,
      alternateName: site.representative.name,
    },
    areaServed: ["Furano", "Biei", "Asahikawa"],
  };
}

export function websiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website-${locale}`,
    name: site.name,
    url: localeUrl(locale),
    inLanguage: langCode(locale),
    publisher: { "@id": `${site.url}/#organization` },
  };
}

export function breadcrumbJsonLd(
  locale: Locale,
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: localeUrl(locale, item.path),
    })),
  };
}

export function faqJsonLd(locale: Locale, faqs: readonly Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: langCode(locale),
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function serviceJsonLd(
  locale: Locale,
  dict: Dictionary,
  activity: Activity
) {
  const t = dict.activities[activity.slug as keyof Dictionary["activities"]];
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: t.name,
    description: t.summary,
    url: localeUrl(locale, `/activities/${activity.slug}`),
    inLanguage: langCode(locale),
    areaServed: t.area,
    provider: { "@id": `${site.url}/#organization` },
    offers: {
      "@type": "Offer",
      price: activity.price.amount,
      priceCurrency: "JPY",
      description: formatPriceFull(activity, locale, dict),
      availability: "https://schema.org/InStock",
      url: localeUrl(locale, `/reservation?activity=${activity.slug}`),
    },
  };
}

export function articleJsonLd(
  locale: Locale,
  args: {
    title: string;
    description: string;
    slug: string;
    publishedAt: string;
    updatedAt: string;
    image?: string;
  }
) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: args.title,
    description: args.description,
    url: localeUrl(locale, `/column/${args.slug}`),
    datePublished: args.publishedAt,
    dateModified: args.updatedAt,
    inLanguage: langCode(locale),
    image: args.image ? `${site.url}${args.image}` : undefined,
    author: {
      "@type": "Person",
      name: site.representative.nameRoman,
      alternateName: site.representative.name,
    },
    publisher: { "@id": `${site.url}/#organization` },
  };
}
