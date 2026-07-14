/**
 * 安全への取り組み・体験当日の流れ・目的別の選び方・お客様の声のデータ。
 * トップページと下層ページで共通利用します。
 */

/** 安全への取り組み（確認できる事実のみ。装備名・保険内容などは記載しない） */
export const safetyCommitments = [
  {
    title: "参加前の説明",
    body: "体験の前に、当日の流れや注意点をガイドがご説明します。初めての方も、その場で疑問を解消してからスタートできます。",
  },
  {
    title: "装備と当日の流れのご案内",
    body: "体験に必要な装備や当日の流れは、ご予約時・当日にご案内します。ご不明な点は事前にお問い合わせください。",
  },
  {
    title: "ガイドによる案内",
    body: "河川での経験を積んだガイドが同行し、川の状況を見ながらご案内します。",
  },
  {
    title: "天候・河川状況を踏まえた判断",
    body: "当日の天候や河川の状況をもとに、開催可否や内容をガイドが判断します。無理に開催することはありません。",
  },
  {
    title: "参加者へのお願い",
    body: "安全に楽しんでいただくため、当日はガイドの案内・指示に従っていただくようお願いしています。",
  },
  {
    title: "体調に不安がある場合の事前相談",
    body: "持病や体調面に不安がある方は、お申し込み前にご相談ください。内容に応じてご案内します。",
  },
] as const;

/** 体験当日の一般的な流れ（断定的な時間・場所は記載しない） */
export const experienceFlow = [
  {
    step: "予約・問い合わせ",
    body: "フォームまたはお電話で、希望のアクティビティ・日程・人数をお知らせください。",
  },
  {
    step: "集合場所や持ち物のご案内",
    body: "ご予約の内容に合わせて、集合場所・服装・持ち物をご案内します。",
  },
  {
    step: "当日の受付",
    body: "ご案内した集合場所にお越しいただき、受付を行います。",
  },
  {
    step: "ガイドからの説明",
    body: "装備の使い方や当日の流れ、注意点をガイドがご説明します。",
  },
  {
    step: "アクティビティ開始",
    body: "ガイドと一緒に、北海道の川と自然を楽しみましょう。",
  },
  {
    step: "終了・解散",
    body: "体験終了後、解散となります。",
  },
] as const;

/** トップページ「目的別の選び方」 */
export const purposeCards = [
  {
    title: "富良野旅行で自然を楽しみたい",
    body: "富良野の川をゆったり下る、主力のリバーアクティビティへ。",
    href: "/activities/furano-relax-downriver",
    linkLabel: "富良野リラックスダウンリバー",
  },
  {
    title: "家族や友人と体験したい",
    body: "2名から参加OK。初めての方への案内も丁寧に行います。",
    href: "/activities",
    linkLabel: "アクティビティ一覧を見る",
  },
  {
    title: "北海道らしい思い出を作りたい",
    body: "美瑛・旭川エリアのダウンリバーもご用意しています。",
    href: "/furano-activity",
    linkLabel: "エリアから体験を探す",
  },
  {
    title: "団体向けのプログラムを相談したい",
    body: "研修・イベントなど、目的に合わせてオーダーメイドでご提案。",
    href: "/activities/organize-program",
    linkLabel: "オーガナイズプログラム",
  },
] as const;

/** 重要情報バー（確認できる事実のみ） */
export const highlights = [
  { icon: "map-pin", label: "富良野を拠点に開催" },
  { icon: "users", label: "2名から参加可能" },
  { icon: "compass", label: "経験豊富なガイドが案内" },
  { icon: "calendar-check", label: "事前予約制" },
  { icon: "leaf", label: "自然をゆっくり楽しめる体験" },
] as const;

/**
 * お客様の声。
 * 現時点で正式な口コミの提供がないため空配列です（架空の口コミは追加しないこと）。
 * 口コミが揃ったら以下の形式で追加してください：
 * { name: "〇〇様（東京都）", activitySlug: "furano-relax-downriver", body: "…", date: "2026-07" }
 */
export type Testimonial = {
  name: string;
  activitySlug: string;
  body: string;
  date: string;
};

export const testimonials: Testimonial[] = [];
