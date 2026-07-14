"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Check, Globe } from "lucide-react";
import { localeConfig, locales, type Locale } from "@/i18n/locales";
import { stripLocale } from "@/i18n/routing";
import { rememberLocale } from "@/lib/locale-cookie";

type Props = {
  locale: Locale;
  labels: { switchLabel: string; menuLabel: string };
  /** ヒーロー上（透明ヘッダー）で使う白文字スタイル */
  inverted?: boolean;
  /** モバイルメニュー内で使う縦並びスタイル */
  variant?: "dropdown" | "list";
};

/**
 * 言語切り替え。
 *
 * - 現在見ているページに対応する別言語ページへ移動する（トップへは戻さない）
 * - 選択した言語は cookie に保存し、次回以降の初回訪問で優先される
 * - キーボード操作・Escで閉じる・メニュー外クリックで閉じる・aria対応
 * - 国旗は使わず、必ず言語名を表示する
 */
export default function LanguageSwitcher({
  locale,
  labels,
  inverted = false,
  variant = "dropdown",
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const basePath = stripLocale(pathname ?? "/");

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [open]);

  function selectLocale(next: Locale) {
    rememberLocale(next); // 選択した言語を1年間記憶する
    setOpen(false);
    // クエリも保持する（例: /ja/reservation?activity=xxx → /en/reservation?activity=xxx）
    // useSearchParams は静的生成を妨げるため、クリック時に読み取る
    const query = window.location.search;
    router.push(`/${next}${basePath}${query}`);
  }

  if (variant === "list") {
    return (
      <div>
        <p className="px-2 pb-2 pt-1 text-xs font-bold text-ink-soft">
          {labels.menuLabel}
        </p>
        <ul className="grid grid-cols-2 gap-2">
          {locales.map((item) => {
            const current = item === locale;
            return (
              <li key={item}>
                <button
                  type="button"
                  lang={localeConfig[item].htmlLang}
                  onClick={() => selectLocale(item)}
                  aria-current={current ? "true" : undefined}
                  className={`flex min-h-11 w-full items-center justify-center gap-1.5 rounded-full border px-3 text-sm font-medium transition-colors ${
                    current
                      ? "border-forest bg-forest-light font-bold text-forest-dark"
                      : "border-forest-light text-ink hover:border-water hover:text-water-deep"
                  }`}
                >
                  {current && (
                    <Check aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                  )}
                  {localeConfig[item].label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={labels.switchLabel}
        className={`inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-2 text-sm font-medium transition-colors sm:px-3 ${
          inverted
            ? "text-white hover:text-sky"
            : "text-ink hover:text-water-deep"
        }`}
      >
        <Globe aria-hidden="true" className="h-5 w-5 shrink-0 sm:h-4 sm:w-4" />
        {/* 狭い画面ではアイコンのみ（言語名はメニュー内に表示される） */}
        <span className="hidden lg:inline" lang={localeConfig[locale].htmlLang}>
          {localeConfig[locale].label}
        </span>
      </button>

      {open && (
        <ul
          role="menu"
          aria-label={labels.menuLabel}
          className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-2xl border border-forest-light bg-white py-1.5 shadow-card-hover"
        >
          {locales.map((item) => {
            const current = item === locale;
            return (
              <li key={item} role="none">
                <button
                  type="button"
                  role="menuitem"
                  lang={localeConfig[item].htmlLang}
                  onClick={() => selectLocale(item)}
                  aria-current={current ? "true" : undefined}
                  className={`flex min-h-11 w-full items-center gap-2 px-4 text-left text-sm transition-colors ${
                    current
                      ? "font-bold text-forest-dark"
                      : "text-ink hover:bg-forest-light/50 hover:text-water-deep"
                  }`}
                >
                  <Check
                    aria-hidden="true"
                    className={`h-4 w-4 shrink-0 ${current ? "opacity-100" : "opacity-0"}`}
                  />
                  {localeConfig[item].label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
