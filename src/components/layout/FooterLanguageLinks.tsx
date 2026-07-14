"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeConfig, locales, type Locale } from "@/i18n/locales";
import { stripLocale } from "@/i18n/routing";
import { rememberLocale } from "@/lib/locale-cookie";

/**
 * フッターの対応言語一覧。
 * クリックしても**トップページには戻さず**、いま見ているページの別言語版へ移動します。
 * SEOのため <a> のまま（hreflang付き）にしています。
 */
export default function FooterLanguageLinks({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const basePath = stripLocale(pathname ?? "/");

  return (
    <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/80">
      {locales.map((item) => (
        <li key={item} lang={localeConfig[item].htmlLang}>
          <Link
            href={`/${item}${basePath}`}
            hrefLang={localeConfig[item].hreflang}
            onClick={() => rememberLocale(item)}
            aria-current={item === locale ? "true" : undefined}
            className={`transition-colors hover:text-sky ${
              item === locale ? "font-bold text-white" : ""
            }`}
          >
            {localeConfig[item].label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
