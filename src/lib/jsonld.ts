import { site } from "@/data/site";
import type { Activity } from "@/data/activities";
import type { Faq } from "@/data/faq";

/**
 * 構造化データ（JSON-LD）生成ヘルパー。
 * 画面上に存在しない口コミ評価・架空のレビューは含めないこと。
 */

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site.url}/#organization`,
    name: site.name,
    alternateName: site.shortName,
    url: site.url,
    email: site.email,
    telephone: "+81-90-5950-4006",
    address: {
      "@type": "PostalAddress",
      addressCountry: "JP",
      addressRegion: site.address.prefecture,
      addressLocality: site.address.city,
      streetAddress: site.address.street,
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
      name: "小瀬 祥太",
    },
    areaServed: ["富良野市", "美瑛町", "旭川市"],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    url: site.url,
    inLanguage: "ja",
    publisher: { "@id": `${site.url}/#organization` },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.path === "/" ? "" : item.path}`,
    })),
  };
}

export function faqJsonLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function serviceJsonLd(activity: Activity) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: activity.name,
    serviceType: "リバーアクティビティ・アウトドア体験",
    description: activity.summary,
    url: `${site.url}/activities/${activity.slug}`,
    areaServed: activity.area,
    provider: { "@id": `${site.url}/#organization` },
    offers: {
      "@type": "Offer",
      price: activity.price.amount,
      priceCurrency: "JPY",
      description: `${activity.price.display}（${activity.price.unit}）`,
      availability: "https://schema.org/InStock",
      url: `${site.url}/reservation?activity=${activity.slug}`,
    },
  };
}

export function articleJsonLd(args: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: args.title,
    description: args.description,
    url: `${site.url}/column/${args.slug}`,
    datePublished: args.publishedAt,
    dateModified: args.updatedAt,
    inLanguage: "ja",
    image: args.image ? `${site.url}${args.image}` : undefined,
    author: {
      "@type": "Person",
      name: "小瀬 祥太",
      jobTitle: "Hokkaido Outdoor Organization 代表",
    },
    publisher: { "@id": `${site.url}/#organization` },
  };
}
