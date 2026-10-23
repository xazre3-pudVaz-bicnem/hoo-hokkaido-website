import { defaultLocale, isLocale } from "@/i18n/locales";
import { localePath } from "@/i18n/routing";

/**
 * 旧Wixサイト（www.hoohokkaido.com）のURL → 新サイトのページ。
 *
 * ドメインを Wix から Vercel へ切り替えると、Wix 時代のURLは存在しなくなります。
 * 検索結果やブックマークから来た人を 404 にしないよう、対応するページへ恒久リダイレクトします。
 * キーは言語プレフィックスを除いたパス（デコード済み・先頭の「/」なし）。
 * 値の "" はトップページ（該当ページがないもの）。
 */
const wixPaths = new Map<string, string>([
  ["会社概要", "/about"],
  ["プロジェクト", "/projects"],
  ["お問い合わせ", "/contact"],
  ["services-4", "/activities"],
  ["blank", "/privacy"], // Privacy Policy
  ["blank-1", ""], // Accessibility Statement
  ["blank-2", "/terms"], // Terms & Conditions
  ["blank-3", "/terms"], // Refund Policy（キャンセル規定は利用案内に記載）
  ["donation-thank-you-page", ""],
]);

/** Wixのイベント詳細ページ（/event-details-registration/<slug> など） */
const WIX_EVENT_PATH = /^event-details(-registration)?(\/|$)/;

/**
 * 旧WixのURLなら転送先のパスを返し、該当しなければ null を返す。
 * Wix の英語ページ（/en/...）は英語版へ、言語なしのパスは日本語版へ振り分けます。
 */
export function resolveLegacyWixPath(pathname: string): string | null {
  let decoded: string;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }

  const segments = decoded.split("/").filter(Boolean);
  const [first, ...others] = segments;
  const hasLocale = first !== undefined && isLocale(first);
  const locale = hasLocale ? first : defaultLocale;
  const rest = (hasLocale ? others : segments).join("/");

  const target = wixPaths.get(rest);
  if (target !== undefined) return localePath(locale, target);
  if (WIX_EVENT_PATH.test(rest)) return localePath(locale, "/activities");
  return null;
}
