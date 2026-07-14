/**
 * サイト全体の基本情報を一元管理するファイル。
 * 名称・住所・電話番号・営業時間などを変更する場合はこのファイルのみ編集してください。
 */

export const site = {
  name: "Hokkaido Outdoor Organization",
  shortName: "HOO",
  nameJa: "Hokkaido Outdoor Organization（HOO）",
  representative: {
    name: "小瀬 祥太",
    nameRoman: "Shota Kose",
  },
  tel: {
    display: "090-5950-4006",
    link: "tel:09059504006",
  },
  email: "info@hoohokkaido.com",
  address: {
    postal: "",
    prefecture: "北海道",
    city: "富良野市",
    street: "北斗町2-8",
    full: "北海道富良野市北斗町2-8",
  },
  hours: {
    display: "9:00〜17:00",
    opens: "09:00",
    closes: "17:00",
  },
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.hoohokkaido.com",
  /**
   * Googleマップ埋め込みURL。
   * Googleマップ →「共有」→「地図を埋め込む」で取得したiframeのsrcを設定してください。
   * 未設定の場合は住所と外部マップリンクのみ表示されます（画面は崩れません）。
   */
  googleMapEmbedUrl: process.env.NEXT_PUBLIC_GOOGLE_MAP_EMBED_URL ?? "",
  googleMapSearchUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("北海道富良野市北斗町2-8"),
} as const;

export const navigation = [
  { label: "ホーム", href: "/" },
  { label: "アクティビティ", href: "/activities" },
  { label: "富良野で体験する", href: "/furano-activity" },
  { label: "HOOについて", href: "/about" },
  { label: "プロジェクト", href: "/projects" },
  { label: "よくある質問", href: "/faq" },
  { label: "アクセス", href: "/access" },
  { label: "お問い合わせ", href: "/contact" },
] as const;

export const footerLinks = [
  { label: "アクティビティ", href: "/activities" },
  { label: "富良野リラックスダウンリバー", href: "/activities/furano-relax-downriver" },
  { label: "富良野のアクティビティ", href: "/furano-activity" },
  { label: "富良野のラフティング・川体験", href: "/furano-rafting" },
  { label: "HOOについて", href: "/about" },
  { label: "プロジェクト", href: "/projects" },
  { label: "安全への取り組み", href: "/safety" },
  { label: "コラム", href: "/column" },
  { label: "よくある質問", href: "/faq" },
  { label: "アクセス", href: "/access" },
  { label: "予約", href: "/reservation" },
  { label: "お問い合わせ", href: "/contact" },
  { label: "プライバシーポリシー", href: "/privacy" },
  { label: "利用案内", href: "/terms" },
  { label: "サイトマップ", href: "/sitemap" },
] as const;
