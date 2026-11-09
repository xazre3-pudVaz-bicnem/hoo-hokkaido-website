import type { Dictionary } from "@/i18n/dictionary";
import { format } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/locales";
import {
  ADULT_FROM_AGE,
  CHILD_FROM_AGE,
  type Activity,
  type Plan,
  type PeriodPoint,
} from "@/data/activities";

/**
 * 料金・人数・期間・時間の表示整形。
 * 数値は共通データ（src/data/activities.ts）から取得し、
 * 表示形式だけを言語ごとに切り替えます。為替換算は行いません（常に日本円）。
 */

function intlLocale(locale: Locale): string {
  return locale === "zh-tw"
    ? "zh-TW"
    : locale === "zh-cn"
      ? "zh-CN"
      : locale === "ko"
        ? "ko-KR"
        : locale === "en"
          ? "en-US"
          : "ja-JP";
}

/** 数値を各言語のロケールで桁区切りする（例: 8000 → "8,000"） */
export function formatNumber(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(intlLocale(locale)).format(amount);
}

/** 金額のみ（例: 日本語「8,000円」／英語「JPY 8,000」）。0 は「無料」 */
export function formatAmount(amount: number, locale: Locale, dict: Dictionary): string {
  if (amount === 0) return dict.price.free;
  return format(dict.price.amount, { amount: formatNumber(amount, locale) });
}

// ── 期間・時間・年齢・人数 ──────────────────────────────

export function formatPeriodRange(
  period: { from: PeriodPoint; to: PeriodPoint },
  dict: Dictionary
): string {
  const p = dict.activityDetail.periods;
  return format(dict.activityDetail.periodRange, { from: p[period.from], to: p[period.to] });
}

export function formatPeriod(activity: Activity, dict: Dictionary): string {
  return formatPeriodRange(activity.period, dict);
}

/** 所要時間（例:「約2時間」） */
export function formatDuration(plan: Plan, dict: Dictionary): string {
  const d = dict.activityDetail;
  return format(plan.approx ? d.durationApprox : d.durationExact, { hours: plan.hours });
}

/** 開催時間（例:「9:30〜11:30／13:30〜15:30」） */
export function formatSessions(plan: Plan, dict: Dictionary): string {
  const d = dict.activityDetail;
  return plan.sessions
    .map((s) => {
      const [start, end] = s.split("-");
      return format(d.timeRange, { start, end });
    })
    .join(d.listSeparator);
}

/** 対象年齢（例:「4歳以上」／「0歳から参加できます」） */
export function formatTargetAge(activity: Activity, dict: Dictionary): string {
  const d = dict.activityDetail;
  return activity.minAge === 0 ? d.ageAll : format(d.ageFrom, { age: activity.minAge });
}

/** 最少催行人数（例:「3名から」／レンタルは「3艇から」）。1名のときは単数形の表記（英語の person など） */
export function formatMinParticipants(activity: Activity, dict: Dictionary): string {
  const c = dict.common;
  const template =
    activity.participantUnit === "board"
      ? c.minBoards
      : activity.minParticipants === 1
        ? c.minParticipantsOne
        : c.minParticipants;
  return format(template, { count: activity.minParticipants });
}

export function formatMinParticipantsShort(activity: Activity, dict: Dictionary): string {
  const c = dict.common;
  const template =
    activity.participantUnit === "board"
      ? c.minBoardsShort
      : activity.minParticipants === 1
        ? c.minParticipantsShortOne
        : c.minParticipantsShort;
  return format(template, { count: activity.minParticipants });
}

// ── 料金 ──────────────────────────────────────────────

export type PriceRow = { label: string; value: string; amount: number };

/** プラン名（例:「半日（約2.5時間）」）。1種類のみのプランは空文字 */
export function planLabel(plan: Plan, dict: Dictionary, withDuration = true): string {
  if (plan.kind === "standard") return "";
  const name = dict.price.plans[plan.kind];
  return withDuration
    ? format(dict.price.planWithDuration, { plan: name, duration: formatDuration(plan, dict) })
    : name;
}

/**
 * 料金の行（詳細ページの料金欄・メール本文で使用）。
 * - 1名あたり：大人／小人／0〜1歳（対象年齢に合わせて小人の年齢を調整）
 * - 貸切：半日／1日
 * - レンタル：1艇・1日
 */
export function priceRows(
  activity: Activity,
  locale: Locale,
  dict: Dictionary,
  { short = false }: { short?: boolean } = {}
): PriceRow[] {
  const rows: PriceRow[] = [];
  const tiers = dict.price.tiers;
  for (const plan of activity.plans) {
    const p = plan.price;
    if (p.unit === "perPerson") {
      rows.push({
        label: format(tiers.adult, { from: ADULT_FROM_AGE }),
        value: formatAmount(p.adult, locale, dict),
        amount: p.adult,
      });
      if (p.child !== undefined) {
        rows.push({
          label: format(tiers.child, {
            from: Math.max(CHILD_FROM_AGE, activity.minAge),
            to: ADULT_FROM_AGE - 1,
          }),
          value: formatAmount(p.child, locale, dict),
          amount: p.child,
        });
      }
      if (p.infant !== undefined && activity.minAge < CHILD_FROM_AGE) {
        rows.push({
          label: tiers.infant,
          value: formatAmount(p.infant, locale, dict),
          amount: p.infant,
        });
      }
    } else {
      rows.push({
        // short（一覧表）は所要時間を別の列に出すため、プラン名だけにする
        label: planLabel(plan, dict, !short) || (short ? "" : priceUnitLabel(activity, dict)),
        value: formatAmount(p.amount, locale, dict),
        amount: p.amount,
      });
    }
  }
  return rows;
}

/** 料金の単位（例:「1名あたり（税込）」「1グループ貸切（税込）」） */
export function priceUnitLabel(activity: Activity, dict: Dictionary): string {
  const p = activity.plans[0].price;
  if (p.unit === "perGroup") return dict.price.perGroup;
  if (p.unit === "perBoard") return dict.price.perBoard;
  return p.child !== undefined && p.child !== p.adult ? dict.price.perAdult : dict.price.perPerson;
}

/**
 * カード・一覧用の代表料金。
 * - 1名あたり：大人料金（小人と異なる場合は「大人1名」と明記）
 * - 貸切：最も安いプラン（複数あれば「〜」を付ける）
 */
export function cardPrice(
  activity: Activity,
  locale: Locale,
  dict: Dictionary
): { amount: string; unit: string } {
  const amounts = activity.plans.map((plan) =>
    plan.price.unit === "perPerson" ? plan.price.adult : plan.price.amount
  );
  const min = Math.min(...amounts);
  const varies = new Set(amounts).size > 1;
  const amount = formatAmount(min, locale, dict);
  return {
    amount: varies ? format(dict.price.from, { amount }) : amount,
    unit: priceUnitLabel(activity, dict),
  };
}

/** 料金の単位の見出し（1名あたり／1グループ貸切／1艇・1日。いずれも税込） */
export function priceCaption(activity: Activity, dict: Dictionary): string {
  return activity.plans[0].price.unit === "perPerson"
    ? dict.price.perPerson
    : priceUnitLabel(activity, dict);
}

/** 料金の全区分を1行で（管理者宛メールなどで使用）例:「大人（12歳以上）8,000円／小人（2〜11歳）8,000円 1名あたり（税込）」 */
export function priceDetailText(activity: Activity, locale: Locale, dict: Dictionary): string {
  const rows = priceRows(activity, locale, dict)
    .map((r) => (r.label ? `${r.label} ${r.value}` : r.value))
    .join(dict.activityDetail.listSeparator);
  return `${rows} ${priceCaption(activity, dict)}`;
}

/** 1行の料金（予約フォームの選択肢・構造化データの説明などで使用） */
export function priceSummary(activity: Activity, locale: Locale, dict: Dictionary): string {
  const { amount, unit } = cardPrice(activity, locale, dict);
  return format(dict.price.optionLabel, { amount, unit });
}

/** 料金に関する注記 */
export function priceNote(activity: Activity, dict: Dictionary): string {
  const unit = activity.plans[0].price.unit;
  if (unit === "perGroup") return dict.price.noteGroup;
  if (unit === "perBoard") return dict.price.noteRental;
  return dict.price.note;
}

/** 記事の公開日を各言語の形式で表示 */
export function formatDate(iso: string, locale: Locale): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const date = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat(intlLocale(locale), {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}
