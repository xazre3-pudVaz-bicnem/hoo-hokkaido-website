/**
 * 対応言語の定義。
 * 言語を追加する場合は locales 配列と localeConfig、
 * src/i18n/messages/<locale>.json を追加してください。
 */

export const locales = ["ja", "en", "zh-tw", "zh-cn", "ko"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ja";

export type LocaleConfig = {
  /** 言語切り替えUIに表示する名称（その言語自身の表記） */
  label: string;
  /** <html lang="..."> に設定する値 */
  htmlLang: string;
  /** hreflang に設定する値 */
  hreflang: string;
  /** OGP の og:locale */
  ogLocale: string;
};

export const localeConfig: Record<Locale, LocaleConfig> = {
  ja: { label: "日本語", htmlLang: "ja", hreflang: "ja", ogLocale: "ja_JP" },
  en: { label: "English", htmlLang: "en", hreflang: "en", ogLocale: "en_US" },
  "zh-tw": {
    label: "繁體中文",
    htmlLang: "zh-Hant",
    hreflang: "zh-Hant",
    ogLocale: "zh_TW",
  },
  "zh-cn": {
    label: "简体中文",
    htmlLang: "zh-Hans",
    hreflang: "zh-Hans",
    ogLocale: "zh_CN",
  },
  ko: { label: "한국어", htmlLang: "ko", hreflang: "ko", ogLocale: "ko_KR" },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Accept-Language ヘッダーやブラウザ言語から対応言語を推定する。
 * 判定できない場合は null（＝強制リダイレクトしない）。
 *
 * ja → ja / en → en / zh-TW・zh-HK → zh-tw / zh-CN・zh-SG → zh-cn / ko → ko
 */
export function detectLocale(acceptLanguage: string | null): Locale | null {
  if (!acceptLanguage) return null;

  const tags = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const qParam = params.find((p) => p.trim().startsWith("q="));
      const q = qParam ? Number.parseFloat(qParam.split("=")[1]) : 1;
      return { tag: tag.trim().toLowerCase(), q: Number.isNaN(q) ? 0 : q };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of tags) {
    if (tag.startsWith("ja")) return "ja";
    if (tag.startsWith("ko")) return "ko";
    if (tag.startsWith("zh")) {
      // 繁体字圏（台湾・香港・マカオ）と Hant 指定
      if (/(^|-)(tw|hk|mo|hant)(-|$)/.test(tag)) return "zh-tw";
      // 簡体字圏（中国本土・シンガポール）と Hans 指定
      if (/(^|-)(cn|sg|hans)(-|$)/.test(tag)) return "zh-cn";
      return "zh-cn";
    }
    if (tag.startsWith("en")) return "en";
  }
  return null;
}

/** 言語選択を保存する cookie 名 */
export const LOCALE_COOKIE = "hoo_locale";
