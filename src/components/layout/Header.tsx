"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, X } from "lucide-react";
import Logo from "@/components/layout/Logo";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import { navigation, phoneFor } from "@/data/site";
import type { Locale } from "@/i18n/locales";
import { localePath } from "@/i18n/routing";

export type HeaderStrings = {
  nav: Record<string, string>;
  reserve: string;
  menuOpen: string;
  menuClose: string;
  mainNav: string;
  mobileNav: string;
  hoursHint: string;
  languageSwitch: string;
  languageMenu: string;
};

/**
 * 追従ヘッダー。
 * トップページ最上部では透明、スクロール後は白背景に切り替わります。
 * 文言は表示中の言語のものだけをサーバーから受け取ります（全言語は送りません）。
 */
export default function Header({
  locale,
  strings,
}: {
  locale: Locale;
  strings: HeaderStrings;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const home = localePath(locale);
  const isHome = pathname === home;
  const transparent = isHome && !scrolled && !menuOpen;
  const phone = phoneFor(locale);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        transparent
          ? "bg-transparent"
          : "bg-white/95 shadow-[0_1px_0_rgba(23,54,74,0.08)] backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 md:h-20 md:px-6">
        <Logo locale={locale} inverted={transparent} />

        {/* PCナビゲーション */}
        <nav aria-label={strings.mainNav} className="hidden xl:block">
          <ul className="flex items-center gap-4 2xl:gap-5">
            {navigation.map((item) => {
              const href = localePath(locale, item.href);
              return (
                <li key={item.key}>
                  <Link
                    href={href}
                    className={`whitespace-nowrap text-[13px] font-medium tracking-wide transition-colors ${
                      transparent
                        ? "text-white/90 hover:text-sky"
                        : "text-ink hover:text-water-deep"
                    } ${pathname === href ? "font-bold" : ""}`}
                  >
                    {strings.nav[item.key]}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1 md:gap-2">
          {/* 言語切り替え（スマートフォンでもヘッダーから切り替え可能） */}
          <LanguageSwitcher
            locale={locale}
            inverted={transparent}
            labels={{
              switchLabel: strings.languageSwitch,
              menuLabel: strings.languageMenu,
            }}
          />

          <a
            href={phone.link}
            className={`hidden min-h-11 items-center gap-2 whitespace-nowrap rounded-full px-2 text-sm font-bold transition-colors lg:inline-flex ${
              transparent
                ? "text-white hover:text-sky"
                : "text-forest-dark hover:text-water-deep"
            }`}
            aria-label={`${strings.nav.contact}: ${phone.display}`}
          >
            <Phone aria-hidden="true" className="h-4 w-4" />
            <span className="hidden 2xl:inline">{phone.display}</span>
          </a>
          <a
            href={phone.link}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full lg:hidden ${
              transparent ? "text-white" : "text-forest-dark"
            }`}
            aria-label={`${strings.nav.contact}: ${phone.display}`}
          >
            <Phone aria-hidden="true" className="h-5 w-5" />
          </a>

          <Link
            href={localePath(locale, "/reservation")}
            className="inline-flex min-h-11 items-center whitespace-nowrap rounded-full bg-water-deep px-4 py-2 text-sm font-bold text-white shadow-card transition-colors hover:bg-navy md:px-5"
          >
            {strings.reserve}
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? strings.menuClose : strings.menuOpen}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full xl:hidden ${
              transparent ? "text-white" : "text-navy"
            }`}
          >
            {menuOpen ? (
              <X aria-hidden="true" className="h-6 w-6" />
            ) : (
              <Menu aria-hidden="true" className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* モバイルメニュー */}
      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label={strings.mobileNav}
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-forest-light bg-white xl:hidden"
        >
          <ul className="px-4 py-4">
            {navigation.map((item) => {
              const href = localePath(locale, item.href);
              return (
                <li key={item.key}>
                  <Link
                    href={href}
                    onClick={closeMenu}
                    className={`block border-b border-forest-light/60 px-2 py-3.5 text-sm font-medium text-ink transition-colors hover:text-water-deep ${
                      pathname === href ? "font-bold text-forest-dark" : ""
                    }`}
                  >
                    {strings.nav[item.key]}
                  </Link>
                </li>
              );
            })}
            <li className="px-2 pt-5">
              {/* モバイルメニュー内の言語切り替え */}
              <LanguageSwitcher
                locale={locale}
                variant="list"
                labels={{
                  switchLabel: strings.languageSwitch,
                  menuLabel: strings.languageMenu,
                }}
              />
            </li>
            <li className="px-2 pb-2 pt-5">
              <Link
                href={localePath(locale, "/reservation")}
                onClick={closeMenu}
                className="flex min-h-12 items-center justify-center rounded-full bg-water-deep text-sm font-bold text-white"
              >
                {strings.reserve}
              </Link>
              <p className="mt-3 text-center text-xs leading-relaxed text-ink-soft">
                {strings.hoursHint}
              </p>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
