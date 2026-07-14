/**
 * アクティビティの「言語に依存しない共通データ」。
 *
 * 料金・最少催行人数・画像パス・slug・掲載順のみをここで管理します。
 * アクティビティ名・説明文・特徴・FAQ などの文章は
 * src/i18n/messages/<locale>.json の activities.<slug> に置いてください。
 *
 * → 料金をここで変更すれば、全5言語へ自動的に反映されます。
 */

export type PriceUnit = "perPerson" | "perThreeHours";

/** 未確定情報の扱い（表示文言は辞書 activityDetail.infoValues が持つ） */
export type InfoValue = "tbd" | "onBooking" | "threeHours";

export type Activity = {
  /** URLスラッグ（/[locale]/activities/[slug]）— 全言語共通 */
  slug: string;
  /** エリアの英字表記（全言語共通のラベル） */
  areaCode: string;
  /** 料金（税込・日本円）。為替換算は行わない */
  price: {
    amount: number;
    unit: PriceUnit;
  };
  /** 最少催行人数 */
  minParticipants: number;
  /** 未確定情報のステータス */
  info: {
    duration: InfoValue;
    period: InfoValue;
    targetAge: InfoValue;
    meetingPlace: InfoValue;
    clothing: InfoValue;
  };
  /** 画像パス（alt は辞書側で管理） */
  image: string;
  /** 掲載順（小さいほど先。富良野を主軸にするため 1） */
  order: number;
};

export const activities: Activity[] = [
  {
    slug: "furano-relax-downriver",
    areaCode: "FURANO",
    price: { amount: 7700, unit: "perPerson" },
    minParticipants: 2,
    info: {
      duration: "tbd",
      period: "tbd",
      targetAge: "tbd",
      meetingPlace: "onBooking",
      clothing: "onBooking",
    },
    image: "/images/activities/furano-downriver.jpg",
    order: 1,
  },
  {
    slug: "biei-relax-downriver",
    areaCode: "BIEI",
    price: { amount: 7700, unit: "perPerson" },
    minParticipants: 2,
    info: {
      duration: "tbd",
      period: "tbd",
      targetAge: "tbd",
      meetingPlace: "onBooking",
      clothing: "onBooking",
    },
    image: "/images/activities/biei-downriver.jpg",
    order: 2,
  },
  {
    slug: "asahikawa-relax-downriver",
    areaCode: "ASAHIKAWA",
    price: { amount: 7700, unit: "perPerson" },
    minParticipants: 2,
    info: {
      duration: "tbd",
      period: "tbd",
      targetAge: "tbd",
      meetingPlace: "onBooking",
      clothing: "onBooking",
    },
    image: "/images/activities/asahikawa-downriver.jpg",
    order: 3,
  },
  {
    slug: "organize-program",
    areaCode: "CUSTOM",
    price: { amount: 50000, unit: "perThreeHours" },
    minParticipants: 2,
    info: {
      duration: "threeHours",
      period: "tbd",
      targetAge: "tbd",
      meetingPlace: "onBooking",
      clothing: "onBooking",
    },
    image: "/images/activities/organize-program.jpg",
    order: 4,
  },
];

export const activitySlugs = activities.map((a) => a.slug);

export type ActivitySlug = (typeof activitySlugs)[number];

/** 掲載順に並べたアクティビティ */
export const sortedActivities = [...activities].sort((a, b) => a.order - b.order);

export function getActivity(slug: string): Activity | undefined {
  return activities.find((a) => a.slug === slug);
}

export function getRelatedActivities(slug: string): Activity[] {
  return sortedActivities.filter((a) => a.slug !== slug);
}
