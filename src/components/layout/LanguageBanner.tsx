"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Globe, X } from "lucide-react";
import { LOCALE_COOKIE, detectLocale, type Locale } from "@/i18n/locales";
import { stripLocale } from "@/i18n/routing";
import { rememberLocale } from "@/lib/locale-cookie";

export type BannerStrings = Record<
  Locale,
  { message: string; switch: string; dismiss: string }
>;

const DISMISS_KEY = "hoo_locale_banner_dismissed";

/** ブラウザ言語を読み取る（サーバー側では null を返す） */
function subscribe() {
  return () => {};
}
function getServerSnapshot(): string | null {
  return null;
}
function getClientSnapshot(): string | null {
  if (document.cookie.includes(`${LOCALE_COOKIE}=`)) return null;
  if (window.localStorage.getItem(DISMISS_KEY) === "1") return null;
  return navigator.languages?.join(",") ?? navigator.language ?? null;
}

/**
 * 控えめな言語案内バナー。
 *
 * 初回訪問時にブラウザ言語で自動リダイレクトするのではなく、
 * 「この言語でも見られます」と案内するだけの方式にしています。
 * （検索エンジンを強制リダイレクトしない／ユーザーの選択を尊重するため）
 *
 * 表示条件：
 * - 言語を選択した cookie がまだない
 * - このバナーを閉じていない
 * - ブラウザ言語が、いま見ている言語と異なる対応言語である
 */
export default function LanguageBanner({
  locale,
  strings,
}: {
  locale: Locale;
  strings: BannerStrings;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);

  const acceptLanguage = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );

  const detected = detectLocale(acceptLanguage);
  const suggested = detected && detected !== locale ? detected : null;

  const accept = useCallback(
    (next: Locale) => {
      rememberLocale(next);
      window.localStorage.setItem(DISMISS_KEY, "1");
      router.push(`/${next}${stripLocale(pathname ?? "/")}`);
    },
    [pathname, router]
  );

  const dismiss = useCallback(() => {
    window.localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  }, []);

  if (!suggested || dismissed) return null;

  const text = strings[suggested];

  return (
    <div
      role="region"
      aria-label={text.message}
      className="fixed inset-x-0 bottom-24 z-40 px-3 md:bottom-6 md:left-auto md:right-6 md:w-auto md:px-0"
    >
      <div className="mx-auto flex max-w-md items-center gap-2.5 rounded-2xl border border-forest-light bg-white px-3.5 py-3 shadow-card-hover md:gap-3 md:px-4">
        <Globe aria-hidden="true" className="h-5 w-5 shrink-0 text-water-deep" />
        {/* CJKの語中改行を防ぐ */}
        <p
          className="min-w-0 flex-1 break-keep text-xs leading-snug text-ink"
          lang={suggested}
        >
          {text.message}
        </p>
        <button
          type="button"
          onClick={() => accept(suggested)}
          className="inline-flex min-h-9 shrink-0 items-center whitespace-nowrap rounded-full bg-water-deep px-4 text-xs font-bold text-white transition-colors hover:bg-navy"
        >
          {text.switch}
        </button>
        <button
          type="button"
          onClick={dismiss}
          aria-label={text.dismiss}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-forest-light/60"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
