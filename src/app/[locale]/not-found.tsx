import { headers } from "next/headers";
import Link from "next/link";
import { Compass } from "lucide-react";
import Button from "@/components/ui/Button";
import SetHtmlLang from "@/components/layout/SetHtmlLang";
import { getDictionary } from "@/i18n/dictionary";
import {
  defaultLocale,
  isLocale,
  localeConfig,
  type Locale,
} from "@/i18n/locales";
import { localePath } from "@/i18n/routing";
import { LOCALE_HEADER } from "@/middleware";

/**
 * 言語別404ページ。
 *
 * not-found.tsx は params を受け取れないため、middleware がリクエストヘッダーへ
 * 載せた表示言語（x-hoo-locale）を読み取り、その言語の文言で表示します。
 * 判定できない場合のみ日本語へフォールバックします。
 */
export default async function NotFound() {
  const headerList = await headers();
  const raw = headerList.get(LOCALE_HEADER) ?? "";
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = await getDictionary(locale);

  return (
    <div className="flex min-h-[70svh] flex-col items-center justify-center bg-offwhite px-4 pt-20 text-center">
      {/* 404では Next.js が独自の <html> を使うため、lang をクライアント側で補う */}
      <SetHtmlLang lang={localeConfig[locale].htmlLang} />
      <Compass aria-hidden="true" className="h-14 w-14 text-water-deep" />
      <p className="mt-6 font-display text-5xl font-bold text-navy">404</p>
      <h1 className="mt-3 font-display text-xl font-bold text-navy md:text-2xl">
        {dict.notFound.heading}
      </h1>
      <p className="mt-4 max-w-md whitespace-pre-line text-sm leading-loose text-ink-soft">
        {dict.notFound.body}
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button href={localePath(locale)} variant="primary">
          {dict.notFound.home}
        </Button>
        <Button href={localePath(locale, "/activities")} variant="outline">
          {dict.notFound.activities}
        </Button>
      </div>
      <Link
        href={localePath(locale, "/sitemap")}
        className="mt-6 text-sm font-bold text-water-deep underline underline-offset-2 hover:text-navy"
      >
        {dict.notFound.sitemap}
      </Link>
    </div>
  );
}
