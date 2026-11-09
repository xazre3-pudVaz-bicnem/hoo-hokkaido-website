/**
 * アクティビティの「言語に依存しない共通データ」。
 *
 * 料金・開催期間・所要時間・開催時間・対象年齢・最少催行人数・集合場所・写真・掲載順を
 * ここで管理します（出典：施主提供「2026-27 ツアー情報.xlsx」）。
 * アクティビティ名・説明文・特徴・FAQ・写真の説明文などの文章は
 * src/i18n/messages/<locale>.json の activities.<slug> に置いてください。
 *
 * → 料金や期間をここで変更すれば、全5言語へ自動的に反映されます。
 */
import tourPhotos from "./tour-photos.generated.json";

/** シーズン（グリーン：4月末〜10月末／ウィンター：12月中旬〜3月中旬） */
export type Season = "green" | "winter";

/** 種別（ガイドツアー／オーガナイズ＝貸切／レンタル） */
export type Category = "tour" | "private" | "rental";

/** 開催期間の区切り（表示文言は辞書 activityDetail.periods が持つ） */
export type PeriodPoint = "endApr" | "endOct" | "midJun" | "midSep" | "midDec" | "midMar";

/** 集合場所（表示文言は辞書 activityDetail.meeting が持つ） */
export type MeetingPlace =
  | "hotelPickup"
  | "furanoDelivery"
  | "bieiFurusatoIchiba"
  | "asahikawaTouristCenter"
  | "kamuikotanParking"
  | "minamifuranoOchiai";

/** プランの種別（standard＝1種類のみ／半日／1日） */
export type PlanKind = "standard" | "halfDay" | "fullDay";

/** 料金（税込・日本円）。為替換算は行わない */
export type PlanPrice =
  /** 1名あたり。adult＝大人（12歳以上）、child＝小人（2〜11歳）、infant＝0〜1歳（0 は無料） */
  | { unit: "perPerson"; adult: number; child?: number; infant?: number }
  /** 1グループ貸切 */
  | { unit: "perGroup"; amount: number }
  /** レンタル：1艇・1日 */
  | { unit: "perBoard"; amount: number };

export type Plan = {
  kind: PlanKind;
  /** 所要時間（時間） */
  hours: number;
  /** 「約」を付けるか */
  approx: boolean;
  /** 開催時間（各回の開始-終了。例: "9:30-11:30"） */
  sessions: readonly string[];
  price: PlanPrice;
};

export type GalleryPhoto = { src: string; width: number; height: number };

export type Activity = {
  /** URLスラッグ（/[locale]/activities/[slug]）— 全言語共通 */
  slug: string;
  season: Season;
  category: Category;
  /** カードや料金欄に出す英字ラベル（全言語共通） */
  areaCode: string;
  period: { from: PeriodPoint; to: PeriodPoint };
  /** 参加できる最低年齢（0 = 年齢制限なし） */
  minAge: number;
  /** 最少催行人数（レンタルは艇数） */
  minParticipants: number;
  participantUnit: "person" | "board";
  meeting: { place: MeetingPlace; mapUrl?: string };
  plans: readonly Plan[];
  /** カード用（4:3）。alt は辞書 activities.<slug>.imageAlt */
  image: string;
  /** 詳細ページ上部（3:2） */
  hero: string;
  /** フォトギャラリー（alt は辞書 activities.<slug>.gallery に同じ順番で置く） */
  gallery: readonly GalleryPhoto[];
  /** 掲載順（施主のツアー情報の並び順） */
  order: number;
};

/** 大人料金になる年齢・小人料金が始まる年齢 */
export const ADULT_FROM_AGE = 12;
export const CHILD_FROM_AGE = 2;

/** 写真（scripts/place-photos.mjs が生成） */
const photos = tourPhotos as Record<
  string,
  { card: string; hero: string; gallery: GalleryPhoto[] }
>;
function photosOf(slug: string) {
  const p = photos[slug];
  if (!p) throw new Error(`写真がありません: ${slug}（npm run photos -- --only=tours を実行）`);
  return { image: p.card, hero: p.hero, gallery: p.gallery };
}

/** 1日2回（午前・午後）の約2時間ツアー */
const twoHourSessions = ["9:30-11:30", "13:30-15:30"] as const;
/** オーガナイズ（貸切）の半日・1日プラン */
const organizePlans = (): Plan[] => [
  { kind: "halfDay", hours: 2.5, approx: true, sessions: ["9:00-11:30", "13:45-16:15"], price: { unit: "perGroup", amount: 30000 } },
  { kind: "fullDay", hours: 7, approx: true, sessions: ["9:00-16:00"], price: { unit: "perGroup", amount: 50000 } },
];

export const activities: Activity[] = [
  // ── グリーンシーズン：ガイドツアー ──
  {
    slug: "furano-relax-downriver",
    season: "green",
    category: "tour",
    areaCode: "FURANO",
    period: { from: "endApr", to: "endOct" },
    minAge: 0,
    minParticipants: 3,
    participantUnit: "person",
    meeting: { place: "hotelPickup" },
    plans: [
      { kind: "standard", hours: 2, approx: true, sessions: twoHourSessions, price: { unit: "perPerson", adult: 8000, child: 8000, infant: 0 } },
    ],
    ...photosOf("furano-relax-downriver"),
    order: 1,
  },
  {
    slug: "biei-relax-downriver",
    season: "green",
    category: "tour",
    areaCode: "BIEI",
    period: { from: "endApr", to: "endOct" },
    minAge: 4,
    minParticipants: 3,
    participantUnit: "person",
    meeting: { place: "bieiFurusatoIchiba", mapUrl: "https://maps.app.goo.gl/3nzs81zuryBbh2mx9" },
    plans: [
      { kind: "standard", hours: 2, approx: true, sessions: twoHourSessions, price: { unit: "perPerson", adult: 8000, child: 8000 } },
    ],
    ...photosOf("biei-relax-downriver"),
    order: 2,
  },
  {
    slug: "asahikawa-relax-downriver",
    season: "green",
    category: "tour",
    areaCode: "ASAHIKAWA",
    period: { from: "endApr", to: "endOct" },
    minAge: 4,
    minParticipants: 3,
    participantUnit: "person",
    meeting: { place: "asahikawaTouristCenter", mapUrl: "https://maps.app.goo.gl/vrmeVPbF3pbpGjNd8" },
    plans: [
      { kind: "standard", hours: 2, approx: true, sessions: twoHourSessions, price: { unit: "perPerson", adult: 8000, child: 8000 } },
    ],
    ...photosOf("asahikawa-relax-downriver"),
    order: 3,
  },
  {
    slug: "kamuikotan-sup",
    season: "green",
    category: "tour",
    areaCode: "KAMUIKOTAN · ASAHIKAWA",
    period: { from: "midJun", to: "midSep" },
    minAge: 10,
    minParticipants: 2,
    participantUnit: "person",
    meeting: { place: "kamuikotanParking", mapUrl: "https://maps.app.goo.gl/JP1KoBRZwtt9KFjG9" },
    plans: [
      { kind: "standard", hours: 1.5, approx: true, sessions: ["9:30-11:00", "14:00-15:30"], price: { unit: "perPerson", adult: 8000, child: 8000 } },
    ],
    ...photosOf("kamuikotan-sup"),
    order: 4,
  },
  {
    slug: "kamuikotan-rafting",
    season: "green",
    category: "tour",
    areaCode: "KAMUIKOTAN · ASAHIKAWA",
    period: { from: "midJun", to: "endOct" },
    minAge: 12,
    minParticipants: 3,
    participantUnit: "person",
    meeting: { place: "kamuikotanParking", mapUrl: "https://maps.app.goo.gl/JP1KoBRZwtt9KFjG9" },
    plans: [
      { kind: "standard", hours: 2, approx: true, sessions: twoHourSessions, price: { unit: "perPerson", adult: 8000 } },
    ],
    ...photosOf("kamuikotan-rafting"),
    order: 5,
  },
  {
    slug: "furano-rafting",
    season: "green",
    category: "tour",
    areaCode: "MINAMIFURANO",
    period: { from: "endApr", to: "endOct" },
    minAge: 5,
    minParticipants: 2,
    participantUnit: "person",
    meeting: { place: "minamifuranoOchiai", mapUrl: "https://maps.app.goo.gl/wMG65x72cNVWr8817" },
    plans: [
      { kind: "standard", hours: 3, approx: true, sessions: ["9:30-12:30", "13:45-16:45"], price: { unit: "perPerson", adult: 6100, child: 5700 } },
    ],
    ...photosOf("furano-rafting"),
    order: 6,
  },

  // ── グリーンシーズン：オーガナイズ（貸切） ──
  {
    slug: "organize-river",
    season: "green",
    category: "private",
    areaCode: "PRIVATE · RIVER",
    period: { from: "endApr", to: "endOct" },
    minAge: 0,
    minParticipants: 1,
    participantUnit: "person",
    meeting: { place: "hotelPickup" },
    plans: organizePlans(),
    ...photosOf("organize-river"),
    order: 7,
  },
  {
    slug: "organize-lake",
    season: "green",
    category: "private",
    areaCode: "PRIVATE · LAKE",
    period: { from: "midJun", to: "midSep" },
    minAge: 0,
    minParticipants: 1,
    participantUnit: "person",
    meeting: { place: "hotelPickup" },
    plans: organizePlans(),
    ...photosOf("organize-lake"),
    order: 8,
  },
  {
    slug: "organize-tour",
    season: "green",
    category: "private",
    areaCode: "PRIVATE · TOUR",
    period: { from: "endApr", to: "endOct" },
    minAge: 0,
    minParticipants: 1,
    participantUnit: "person",
    meeting: { place: "hotelPickup" },
    // オーガナイズツアーは1日プランのみ
    plans: organizePlans().filter((p) => p.kind === "fullDay"),
    ...photosOf("organize-tour"),
    order: 9,
  },

  // ── グリーンシーズン：レンタル ──
  {
    slug: "sup-rental",
    season: "green",
    category: "rental",
    areaCode: "RENTAL · FURANO",
    period: { from: "endApr", to: "endOct" },
    minAge: 0,
    minParticipants: 3,
    participantUnit: "board",
    meeting: { place: "furanoDelivery" },
    plans: [
      { kind: "standard", hours: 7, approx: false, sessions: ["9:00-16:00"], price: { unit: "perBoard", amount: 3500 } },
    ],
    ...photosOf("sup-rental"),
    order: 10,
  },

  // ── ウィンターシーズン ──
  {
    slug: "snowshoe-tour",
    season: "winter",
    category: "tour",
    areaCode: "WINTER · FURANO",
    period: { from: "midDec", to: "midMar" },
    minAge: 10,
    minParticipants: 3,
    participantUnit: "person",
    meeting: { place: "hotelPickup" },
    plans: [
      // 施主の表では「1歳〜0歳」の欄が 0円 だが、対象年齢が10歳以上のため幼児料金は設けない
      { kind: "standard", hours: 2, approx: true, sessions: twoHourSessions, price: { unit: "perPerson", adult: 8000, child: 8000 } },
    ],
    ...photosOf("snowshoe-tour"),
    order: 11,
  },
  {
    slug: "organize-winter",
    season: "winter",
    category: "private",
    areaCode: "PRIVATE · WINTER",
    period: { from: "midDec", to: "midMar" },
    minAge: 0,
    minParticipants: 1,
    participantUnit: "person",
    meeting: { place: "hotelPickup" },
    plans: organizePlans(),
    ...photosOf("organize-winter"),
    order: 12,
  },
];

export const activitySlugs = activities.map((a) => a.slug);

export type ActivitySlug = (typeof activitySlugs)[number];

/** 掲載順に並べたアクティビティ */
export const sortedActivities = [...activities].sort((a, b) => a.order - b.order);

export const seasons: readonly Season[] = ["green", "winter"];
export const categories: readonly Category[] = ["tour", "private", "rental"];

/** シーズンの開催期間（シーズン見出しに使う） */
export const seasonPeriods: Record<Season, { from: PeriodPoint; to: PeriodPoint }> = {
  green: { from: "endApr", to: "endOct" },
  winter: { from: "midDec", to: "midMar" },
};

export function getActivity(slug: string): Activity | undefined {
  return activities.find((a) => a.slug === slug);
}

export function activitiesBySeason(season: Season): Activity[] {
  return sortedActivities.filter((a) => a.season === season);
}

/**
 * 今の時期に先に案内するシーズン（日本時間で 4〜10月はグリーン、11〜3月はウィンター）。
 * 11月〜12月中旬はウィンターの開催前だが、予約を受け付ける時期のため先に出す。
 * ページはビルド時に描画されるため、使うページでは revalidate で1日1回描き直す。
 */
export function currentSeason(date: Date = new Date()): Season {
  const month = Number(
    new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Tokyo", month: "numeric" }).format(date)
  );
  return month >= 4 && month <= 10 ? "green" : "winter";
}

/** 今のシーズンを先頭にしたシーズンの並び */
export function seasonOrder(date: Date = new Date()): Season[] {
  const now = currentSeason(date);
  return [now, ...seasons.filter((s) => s !== now)];
}

/**
 * アクティビティ一覧（/activities）のページ内リンクの飛び先。
 * 例: #green（グリーンシーズン）、#winter、#private（グリーンの貸切）、#winter-private
 */
export function sectionId(season: Season, category?: Category): string {
  if (!category) return season;
  if (category === "private") return season === "green" ? "private" : "winter-private";
  return `${season}-${category}`;
}

/** 関連アクティビティ：同じシーズン → 同じ種別 → 掲載順で最大 limit 件 */
export function getRelatedActivities(slug: string, limit = 3): Activity[] {
  const self = getActivity(slug);
  if (!self) return [];
  const score = (a: Activity) =>
    (a.season === self.season ? 0 : 2) + (a.category === self.category ? 0 : 1);
  return sortedActivities
    .filter((a) => a.slug !== slug)
    .sort((a, b) => score(a) - score(b) || a.order - b.order)
    .slice(0, limit);
}
