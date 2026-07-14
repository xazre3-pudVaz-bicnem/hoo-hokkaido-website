"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, X } from "lucide-react";
import Logo from "@/components/layout/Logo";
import { navigation, site } from "@/data/site";

/**
 * 追従ヘッダー。
 * トップページ最上部では透明、スクロール後は白背景に切り替わります。
 */
export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = pathname === "/";
  const transparent = isHome && !scrolled && !menuOpen;

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
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:h-20 md:px-6">
        <Logo inverted={transparent} />

        {/* PCナビゲーション */}
        <nav aria-label="メインナビゲーション" className="hidden xl:block">
          <ul className="flex items-center gap-5 2xl:gap-6">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`whitespace-nowrap text-[13px] font-medium tracking-wide transition-colors ${
                    transparent
                      ? "text-white/90 hover:text-sky"
                      : "text-ink hover:text-water-deep"
                  } ${pathname === item.href ? "font-bold" : ""}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <a
            href={site.tel.link}
            className={`hidden min-h-11 items-center gap-2 rounded-full px-4 text-sm font-bold transition-colors md:inline-flex ${
              transparent
                ? "text-white hover:text-sky"
                : "text-forest-dark hover:text-water-deep"
            }`}
            aria-label={`電話をかける ${site.tel.display}`}
          >
            <Phone aria-hidden="true" className="h-4 w-4" />
            <span className="hidden whitespace-nowrap lg:inline">
              {site.tel.display}
            </span>
          </a>
          <a
            href={site.tel.link}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full md:hidden ${
              transparent ? "text-white" : "text-forest-dark"
            }`}
            aria-label={`電話をかける ${site.tel.display}`}
          >
            <Phone aria-hidden="true" className="h-5 w-5" />
          </a>
          <Link
            href="/reservation"
            className="inline-flex min-h-11 items-center whitespace-nowrap rounded-full bg-water-deep px-4 py-2 text-sm font-bold text-white shadow-card transition-colors hover:bg-navy md:px-6"
          >
            予約する
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
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
          aria-label="モバイルナビゲーション"
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-forest-light bg-white xl:hidden"
        >
          <ul className="px-4 py-4">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={closeMenu}
                  className={`block border-b border-forest-light/60 px-2 py-3.5 text-sm font-medium text-ink transition-colors hover:text-water-deep ${
                    pathname === item.href ? "font-bold text-forest-dark" : ""
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="px-2 pb-2 pt-5">
              <Link
                href="/reservation"
                onClick={closeMenu}
                className="flex min-h-12 items-center justify-center rounded-full bg-water-deep text-sm font-bold text-white"
              >
                予約する
              </Link>
              <p className="mt-3 text-center text-xs text-ink-soft">
                営業時間 {site.hours.display} ／ 営業時間外はフォームからお問い合わせいただけます
              </p>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
