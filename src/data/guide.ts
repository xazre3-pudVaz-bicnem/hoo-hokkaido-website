/**
 * 代表・ガイドの「言語に依存しない共通データ」。
 * 氏名（固有名詞）・画像パスのみ。プロフィール文・資格名は辞書 guide が持ちます。
 */

export const guide = {
  /** 固有名詞：全言語で表記を統一する */
  name: "小瀬 祥太",
  nameRoman: "Shota Kose",
  image: "/images/guide/shota-kose.jpg",
  safetyImage: "/images/guide/safety-guide.jpg",
} as const;

/**
 * お客様の声。
 * 正式な口コミの提供がないため空配列です（架空の口コミは追加しないこと）。
 * 口コミが揃ったら、本文は言語ごとに辞書 home.voices.items へ追加してください。
 */
export const hasTestimonials = false;
