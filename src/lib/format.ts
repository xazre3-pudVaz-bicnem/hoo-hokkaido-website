import type { Dictionary } from "@/i18n/dictionary";
import { format } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/locales";
import type { Activity } from "@/data/activities";

/**
 * 料金・人数の表示整形。
 * 金額は共通データ（src/data/activities.ts）から取得し、
 * 表示形式だけを言語ごとに切り替えます。為替換算は行いません（常に日本円）。
 */

/** 数値を各言語のロケールで桁区切りする（例: 7700 → "7,700"） */
export function formatNumber(amount: number, locale: Locale): string {
  const intlLocale =
    locale === "zh-tw"
      ? "zh-TW"
      : locale === "zh-cn"
        ? "zh-CN"
        : locale === "ko"
          ? "ko-KR"
          : locale === "en"
            ? "en-US"
            : "ja-JP";
  return new Intl.NumberFormat(intlLocale).format(amount);
}

/** 金額のみ（例: 日本語「7,700円」／英語「JPY 7,700」） */
export function formatAmount(
  amount: number,
  locale: Locale,
  dict: Dictionary
): string {
  return format(dict.price.amount, { amount: formatNumber(amount, locale) });
}

/** 単位ラベル（例: 日本語「1名あたり（税込）」） */
export function priceUnitLabel(activity: Activity, dict: Dictionary): string {
  return activity.price.unit === "perPerson"
    ? dict.price.perPerson
    : dict.price.perThreeHours;
}

/** 金額＋単位の一文（構造化データ・メール本文などで使用） */
export function formatPriceFull(
  activity: Activity,
  locale: Locale,
  dict: Dictionary
): string {
  const template =
    activity.price.unit === "perPerson"
      ? dict.price.full.perPerson
      : dict.price.full.perThreeHours;
  return format(template, {
    amount: formatNumber(activity.price.amount, locale),
  });
}

/** 料金に関する注記（オーガナイズプログラムのみ見積もり注記） */
export function priceNote(activity: Activity, dict: Dictionary): string {
  return activity.price.unit === "perThreeHours"
    ? dict.price.noteCustom
    : dict.price.note;
}

/** 最少催行人数（例: 「2名から」／「From 2 people」） */
export function formatMinParticipants(
  activity: Activity,
  dict: Dictionary
): string {
  return format(dict.common.minParticipants, {
    count: activity.minParticipants,
  });
}

export function formatMinParticipantsShort(
  activity: Activity,
  dict: Dictionary
): string {
  return format(dict.common.minParticipantsShort, {
    count: activity.minParticipants,
  });
}

/** 記事の公開日を各言語の形式で表示 */
export function formatDate(iso: string, locale: Locale): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const date = new Date(Date.UTC(y, m - 1, d));
  const intlLocale =
    locale === "zh-tw"
      ? "zh-TW"
      : locale === "zh-cn"
        ? "zh-CN"
        : locale === "ko"
          ? "ko-KR"
          : locale === "en"
            ? "en-US"
            : "ja-JP";
  return new Intl.DateTimeFormat(intlLocale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}
