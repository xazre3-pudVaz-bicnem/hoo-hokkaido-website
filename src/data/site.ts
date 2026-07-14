/**
 * サイト全体の「言語に依存しない共通情報」。
 *
 * 電話番号・メール・営業時間・住所の機械可読値のみをここで管理します。
 * 表示用の文言（住所の各言語表記・営業時間の注記など）は
 * src/i18n/messages/<locale>.json の common に置いてください。
 */

export const site = {
  /** 固有名詞：全言語で表記を統一する */
  name: "Hokkaido Outdoor Organization",
  shortName: "HOO",
  representative: {
    name: "小瀬 祥太",
    nameRoman: "Shota Kose",
  },
  tel: {
    /** 日本国内向け表記 */
    display: "090-5950-4006",
    /** 海外向け：国番号付き表記 */
    international: "+81 90-5950-4006",
    /** 日本国内向けの発信リンク */
    link: "tel:09059504006",
    /** 海外からの発信リンク */
    linkInternational: "tel:+819059504006",
    /** 構造化データ用 */
    schema: "+81-90-5950-4006",
  },
  email: "info@hoohokkaido.com",
  address: {
    /** 構造化データ用の分割表記 */
    country: "JP",
    prefecture: "北海道",
    city: "富良野市",
    street: "北斗町2-8",
  },
  hours: {
    /** 表示用（数値部分は全言語共通） */
    display: "9:00〜17:00",
    /** 構造化データ用 */
    opens: "09:00",
    closes: "17:00",
  },
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.hoohokkaido.com",
  /**
   * Googleマップ埋め込みURL。未設定でも画面は崩れません。
   */
  googleMapEmbedUrl: process.env.NEXT_PUBLIC_GOOGLE_MAP_EMBED_URL ?? "",
  googleMapSearchUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("北海道富良野市北斗町2-8"),
} as const;

/** 言語に応じた電話番号の表示・リンク */
export function phoneFor(locale: string) {
  const isJa = locale === "ja";
  return {
    display: isJa ? site.tel.display : site.tel.international,
    link: isJa ? site.tel.link : site.tel.linkInternational,
  };
}

/** ヘッダー・グローバルナビゲーション（ラベルは辞書 nav が持つ） */
export const navigation = [
  { key: "home", href: "" },
  { key: "activities", href: "/activities" },
  { key: "furanoActivity", href: "/furano-activity" },
  { key: "about", href: "/about" },
  { key: "projects", href: "/projects" },
  { key: "faq", href: "/faq" },
  { key: "access", href: "/access" },
  { key: "contact", href: "/contact" },
] as const;

export type NavKey = (typeof navigation)[number]["key"];

/** フッターリンク（ラベルは辞書 footer.links が持つ） */
export const footerLinks = [
  { key: "activities", href: "/activities" },
  { key: "furanoDownriver", href: "/activities/furano-relax-downriver" },
  { key: "furanoActivity", href: "/furano-activity" },
  { key: "furanoRafting", href: "/furano-rafting" },
  { key: "about", href: "/about" },
  { key: "projects", href: "/projects" },
  { key: "safety", href: "/safety" },
  { key: "column", href: "/column" },
  { key: "faq", href: "/faq" },
  { key: "access", href: "/access" },
  { key: "reservation", href: "/reservation" },
  { key: "contact", href: "/contact" },
  { key: "privacy", href: "/privacy" },
  { key: "terms", href: "/terms" },
  { key: "sitemap", href: "/sitemap" },
] as const;

export type FooterLinkKey = (typeof footerLinks)[number]["key"];
