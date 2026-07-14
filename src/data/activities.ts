/**
 * アクティビティ情報の一元管理ファイル。
 * 料金・最少催行人数・所要時間・画像パスなどはすべてここで管理します。
 * このファイルを変更すれば、サイト全体（一覧・詳細・トップ・予約フォーム・構造化データ）に反映されます。
 *
 * 未確定の情報は「お問い合わせください」等のままにしてあります。
 * 確定後に該当フィールドを書き換えてください。
 */

export type ActivityFaq = {
  question: string;
  answer: string;
};

export type Activity = {
  /** URLスラッグ（/activities/[slug]） */
  slug: string;
  name: string;
  nameEn: string;
  area: string;
  areaEn: string;
  catchcopy: string;
  /** 一覧カード用の短い紹介文 */
  summary: string;
  /** 詳細ページの体験概要 */
  description: string[];
  price: {
    amount: number;
    display: string;
    unit: string;
    note: string;
  };
  minParticipants: number;
  minParticipantsDisplay: string;
  /** 未確定情報は「お問い合わせください」のまま */
  duration: string;
  period: string;
  targetAge: string;
  meetingPlace: string;
  clothing: string;
  features: { title: string; body: string }[];
  recommendedFor: string[];
  flow: { step: string; body: string }[];
  notes: string[];
  faq: ActivityFaq[];
  image: {
    src: string;
    alt: string;
  };
  /** トップページ掲載順（小さいほど先） */
  order: number;
  /** トップページで大きく表示するか */
  featured: boolean;
};

export const activities: Activity[] = [
  {
    slug: "furano-relax-downriver",
    name: "富良野リラックスダウンリバー",
    nameEn: "Furano Relax Downriver",
    area: "富良野",
    areaEn: "FURANO",
    catchcopy: "富良野の川の上から、北海道の自然をゆっくり味わう。",
    summary:
      "富良野を流れる川をボートでゆったり下る、HOOの主力リバーアクティビティ。川面の高さから眺める富良野の景色を、経験豊富なガイドとともに楽しめます。",
    description: [
      "富良野リラックスダウンリバーは、富良野の川をボートで下りながら、北海道の自然を全身で感じるリバーアクティビティです。",
      "川面から見上げる空、岸辺の森、水の音。歩いて巡る観光では出会えない富良野の風景が、川の上には広がっています。",
      "経験豊富なガイドが当日の川の状況を見ながらご案内するので、リバーアクティビティが初めての方も、まずはお気軽にご相談ください。",
    ],
    price: {
      amount: 7700,
      display: "7,700円",
      unit: "1人あたり（税込）",
      note: "料金は変更になる場合があります。最新の料金はお問い合わせください。",
    },
    minParticipants: 2,
    minParticipantsDisplay: "2名から",
    duration: "お問い合わせください",
    period: "お問い合わせください",
    targetAge: "お問い合わせください",
    meetingPlace: "予約時にご案内します",
    clothing: "予約時にご案内します",
    features: [
      {
        title: "川の上から眺める富良野",
        body: "陸からは見えない角度で、富良野の空・森・水辺の景色を楽しめます。流れに身をまかせる時間そのものが、この体験の主役です。",
      },
      {
        title: "ガイドと一緒だから初めてでも相談しやすい",
        body: "アウトドアガイド歴20年以上の代表をはじめ、川を知るガイドがご案内します。不安な点は予約前・当日を問わずご相談ください。",
      },
      {
        title: "ゆっくり自然を感じるダウンリバー",
        body: "スピードやスリルを競うのではなく、川の流れと富良野の自然をゆったり味わうことを大切にしたプログラムです。",
      },
    ],
    recommendedFor: [
      "富良野旅行で自然を感じる体験を探している方",
      "家族・友人・カップルで思い出をつくりたい方",
      "川遊びやラフティングに興味があるが、激しいものは避けたい方",
      "写真では味わえない富良野を体験したい方",
    ],
    flow: [
      { step: "予約・お問い合わせ", body: "フォームまたはお電話でご希望日・人数をお知らせください。" },
      { step: "ご案内", body: "集合場所・持ち物・当日の流れを予約時にご案内します。" },
      { step: "当日受付", body: "ご案内した集合場所へお越しください。" },
      { step: "ガイドの説明", body: "装備の使い方や当日の流れをガイドがご説明します。" },
      { step: "ダウンリバー体験", body: "ガイドと一緒に富良野の川を下ります。" },
      { step: "終了・解散", body: "終了後、解散となります。" },
    ],
    notes: [
      "天候や河川の状況により、中止・内容変更となる場合があります。",
      "体調に不安のある方は、事前にご相談ください。",
      "フォーム送信時点では予約確定ではありません。担当者からの連絡をもって確定となります。",
    ],
    faq: [
      {
        question: "初めてでも参加できますか？",
        answer:
          "はい。ガイドが当日の流れや装備について説明しながらご案内します。不安な点は予約時にお気軽にご相談ください。",
      },
      {
        question: "何名から申し込めますか？",
        answer: "2名からお申し込みいただけます。それ以外の人数についてはご相談ください。",
      },
      {
        question: "子どもも参加できますか？",
        answer:
          "対象年齢は当日の河川状況などにより異なります。お子さま連れの場合は、年齢を添えて事前にお問い合わせください。",
      },
      {
        question: "服装や持ち物は何が必要ですか？",
        answer: "ご予約時に、当日の服装・持ち物をご案内します。",
      },
    ],
    image: {
      src: "/images/activities/furano-downriver.jpg",
      alt: "富良野の川を下るリラックスダウンリバー",
    },
    order: 1,
    featured: true,
  },
  {
    slug: "biei-relax-downriver",
    name: "美瑛リラックスダウンリバー",
    nameEn: "Biei Relax Downriver",
    area: "美瑛",
    areaEn: "BIEI",
    catchcopy: "丘のまち・美瑛を、川の目線で旅する。",
    summary:
      "美瑛エリアの川をボートでゆったり下るリバーアクティビティ。丘の風景で知られる美瑛の、もうひとつの表情に出会えます。",
    description: [
      "美瑛リラックスダウンリバーは、美瑛エリアの川をボートで下る自然体験プログラムです。",
      "丘や畑の風景で知られる美瑛ですが、川の上から見る景色はまた別もの。水と森が近い、北海道らしい時間が流れます。",
      "美瑛・富良野観光と組み合わせやすいアクティビティです。旅の予定に合わせてご相談ください。",
    ],
    price: {
      amount: 7700,
      display: "7,700円",
      unit: "1人あたり（税込）",
      note: "料金は変更になる場合があります。最新の料金はお問い合わせください。",
    },
    minParticipants: 2,
    minParticipantsDisplay: "2名から",
    duration: "お問い合わせください",
    period: "お問い合わせください",
    targetAge: "お問い合わせください",
    meetingPlace: "予約時にご案内します",
    clothing: "予約時にご案内します",
    features: [
      {
        title: "美瑛の自然を川から眺める",
        body: "観光地として人気の美瑛を、川の目線から静かに楽しめる体験です。",
      },
      {
        title: "経験豊富なガイドがご案内",
        body: "川の状況を見ながら、ガイドが安全面に配慮してご案内します。",
      },
      {
        title: "旅程に組み込みやすい",
        body: "美瑛・富良野・旭川エリアの観光とあわせて計画しやすいアクティビティです。",
      },
    ],
    recommendedFor: [
      "美瑛観光とあわせて自然体験をしたい方",
      "定番の観光だけでは物足りない方",
      "静かに自然を楽しみたい方",
    ],
    flow: [
      { step: "予約・お問い合わせ", body: "フォームまたはお電話でご希望日・人数をお知らせください。" },
      { step: "ご案内", body: "集合場所・持ち物・当日の流れを予約時にご案内します。" },
      { step: "当日受付", body: "ご案内した集合場所へお越しください。" },
      { step: "ガイドの説明", body: "装備の使い方や当日の流れをガイドがご説明します。" },
      { step: "ダウンリバー体験", body: "ガイドと一緒に美瑛の川を下ります。" },
      { step: "終了・解散", body: "終了後、解散となります。" },
    ],
    notes: [
      "天候や河川の状況により、中止・内容変更となる場合があります。",
      "体調に不安のある方は、事前にご相談ください。",
      "フォーム送信時点では予約確定ではありません。担当者からの連絡をもって確定となります。",
    ],
    faq: [
      {
        question: "美瑛観光と同じ日に参加できますか？",
        answer:
          "所要時間や集合場所は予約時にご案内しますので、旅程が決まっている場合はあわせてご相談ください。",
      },
      {
        question: "何名から申し込めますか？",
        answer: "2名からお申し込みいただけます。それ以外の人数についてはご相談ください。",
      },
    ],
    image: {
      src: "/images/activities/biei-downriver.jpg",
      alt: "美瑛の川を下るリラックスダウンリバー",
    },
    order: 2,
    featured: false,
  },
  {
    slug: "asahikawa-relax-downriver",
    name: "旭川リラックスダウンリバー",
    nameEn: "Asahikawa Relax Downriver",
    area: "旭川",
    areaEn: "ASAHIKAWA",
    catchcopy: "北の街・旭川で、川と過ごすひととき。",
    summary:
      "旭川エリアの川をボートでゆったり下るリバーアクティビティ。街の近くにありながら、豊かな自然を感じられる体験です。",
    description: [
      "旭川リラックスダウンリバーは、旭川エリアの川をボートで下る自然体験プログラムです。",
      "北海道第2の都市・旭川の近くにも、川と森の豊かな自然が残っています。街の観光とあわせて、水辺の時間を楽しんでください。",
      "旭川・美瑛・富良野を巡る旅の途中に組み込みやすいアクティビティです。",
    ],
    price: {
      amount: 7700,
      display: "7,700円",
      unit: "1人あたり（税込）",
      note: "料金は変更になる場合があります。最新の料金はお問い合わせください。",
    },
    minParticipants: 2,
    minParticipantsDisplay: "2名から",
    duration: "お問い合わせください",
    period: "お問い合わせください",
    targetAge: "お問い合わせください",
    meetingPlace: "予約時にご案内します",
    clothing: "予約時にご案内します",
    features: [
      {
        title: "旭川エリアの水辺を体験",
        body: "旭山動物園などの観光で知られる旭川周辺で、川の自然に触れられるプログラムです。",
      },
      {
        title: "経験豊富なガイドがご案内",
        body: "川の状況を見ながら、ガイドが安全面に配慮してご案内します。",
      },
      {
        title: "旅の拠点から参加しやすい",
        body: "旭川を拠点にした北海道旅行のアクティビティとして計画しやすい体験です。",
      },
    ],
    recommendedFor: [
      "旭川観光とあわせて自然体験をしたい方",
      "旭川を拠点に富良野・美瑛方面を旅する方",
      "川辺でのんびりした時間を過ごしたい方",
    ],
    flow: [
      { step: "予約・お問い合わせ", body: "フォームまたはお電話でご希望日・人数をお知らせください。" },
      { step: "ご案内", body: "集合場所・持ち物・当日の流れを予約時にご案内します。" },
      { step: "当日受付", body: "ご案内した集合場所へお越しください。" },
      { step: "ガイドの説明", body: "装備の使い方や当日の流れをガイドがご説明します。" },
      { step: "ダウンリバー体験", body: "ガイドと一緒に旭川の川を下ります。" },
      { step: "終了・解散", body: "終了後、解散となります。" },
    ],
    notes: [
      "天候や河川の状況により、中止・内容変更となる場合があります。",
      "体調に不安のある方は、事前にご相談ください。",
      "フォーム送信時点では予約確定ではありません。担当者からの連絡をもって確定となります。",
    ],
    faq: [
      {
        question: "旭川市内から近いですか？",
        answer: "集合場所は予約時にご案内します。旅程にあわせてご相談ください。",
      },
      {
        question: "何名から申し込めますか？",
        answer: "2名からお申し込みいただけます。それ以外の人数についてはご相談ください。",
      },
    ],
    image: {
      src: "/images/activities/asahikawa-downriver.jpg",
      alt: "旭川の川を下るリラックスダウンリバー",
    },
    order: 3,
    featured: false,
  },
  {
    slug: "organize-program",
    name: "オーガナイズプログラム",
    nameEn: "Organize Program",
    area: "富良野・美瑛・旭川ほか",
    areaEn: "CUSTOM",
    catchcopy: "グループのための、オーダーメイドの自然体験。",
    summary:
      "団体・グループ向けに、目的に合わせて内容を組み立てるオーダーメイド型プログラム。研修・イベント・特別な体験づくりなど、まずはご相談ください。",
    description: [
      "オーガナイズプログラムは、団体やグループのご要望に合わせて内容を組み立てる、オーダーメイド型のアウトドアプログラムです。",
      "会社の研修やチームビルディング、仲間内の特別なイベント、地域の集まりなど、目的や人数に応じてご提案します。",
      "「こんなことはできますか？」という段階のご相談も歓迎です。まずはお気軽にお問い合わせください。",
    ],
    price: {
      amount: 50000,
      display: "50,000円",
      unit: "3時間（税込）",
      note: "内容・人数により変動します。詳細はお見積もりいたします。",
    },
    minParticipants: 2,
    minParticipantsDisplay: "2名から",
    duration: "3時間（内容により応相談）",
    period: "お問い合わせください",
    targetAge: "お問い合わせください",
    meetingPlace: "予約時にご案内します",
    clothing: "予約時にご案内します",
    features: [
      {
        title: "目的に合わせたオーダーメイド",
        body: "人数・目的・時間に合わせて、プログラム内容をご提案します。",
      },
      {
        title: "経験豊富なガイドが企画から伴走",
        body: "アウトドアガイド歴20年以上の代表が、企画段階からご相談に乗ります。",
      },
      {
        title: "団体・グループでの利用に対応",
        body: "企業研修、チームビルディング、グループ旅行など、幅広い用途にご利用いただけます。",
      },
    ],
    recommendedFor: [
      "企業研修やチームビルディングを検討している方",
      "グループで特別な自然体験を企画したい方",
      "既存プログラムにない体験を相談したい方",
    ],
    flow: [
      { step: "お問い合わせ", body: "目的・人数・希望時期をお知らせください。" },
      { step: "ヒアリング・ご提案", body: "内容を伺い、プログラム案とお見積もりをご提案します。" },
      { step: "内容確定・ご予約", body: "内容を確定し、正式にご予約となります。" },
      { step: "当日", body: "ガイドの案内のもと、プログラムを実施します。" },
    ],
    notes: [
      "天候や河川の状況により、中止・内容変更となる場合があります。",
      "料金は内容・人数により変動します。まずはお問い合わせください。",
      "フォーム送信時点では予約確定ではありません。担当者からの連絡をもって確定となります。",
    ],
    faq: [
      {
        question: "何人まで対応できますか？",
        answer: "人数・内容によって異なります。ご希望の人数を添えてお問い合わせください。",
      },
      {
        question: "内容はどこまで相談できますか？",
        answer:
          "目的や時間に応じて柔軟にご提案します。「まだ具体的に決まっていない」段階でも構いません。",
      },
    ],
    image: {
      src: "/images/activities/organize-program.jpg",
      alt: "北海道の自然の中で行うオーガナイズプログラム",
    },
    order: 4,
    featured: false,
  },
];

/** トップページ表示順に並べたアクティビティ一覧 */
export const sortedActivities = [...activities].sort((a, b) => a.order - b.order);

export function getActivity(slug: string): Activity | undefined {
  return activities.find((a) => a.slug === slug);
}

/** 指定アクティビティ以外（関連アクティビティ表示用） */
export function getRelatedActivities(slug: string): Activity[] {
  return sortedActivities.filter((a) => a.slug !== slug);
}
