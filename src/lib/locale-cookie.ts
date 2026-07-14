import { LOCALE_COOKIE, type Locale } from "@/i18n/locales";

/**
 * 選択した言語を1年間 cookie に保存する。
 * 次回以降の初回訪問（`/` へのアクセス）で、この言語が優先されます。
 */
export function rememberLocale(locale: Locale): void {
  if (typeof document === "undefined") return;
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}
