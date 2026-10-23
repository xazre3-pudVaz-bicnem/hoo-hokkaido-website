import { NextResponse, type NextRequest } from "next/server";
import {
  LOCALE_COOKIE,
  defaultLocale,
  isLocale,
  type Locale,
} from "@/i18n/locales";
import { localePath, stripLocale } from "@/i18n/routing";
import { resolveLegacyWixPath } from "@/lib/legacy-redirects";

/** not-found.tsx から表示言語を判定するためのヘッダー名 */
export const LOCALE_HEADER = "x-hoo-locale";

/**
 * 言語別URLへのルーティング。
 *
 * - 日本語（既定言語）はプレフィックスなしのURLで表示する（例: /about）
 *   → 内部では /ja/about を描画する（rewrite）。アドレス欄は /about のまま
 * - /ja で始まる旧URLは、プレフィックスなしのURLへ 308（恒久）リダイレクト
 *   → 旧URLの検索評価を引き継ぐ
 * - /en /zh-tw /zh-cn /ko で始まるパスはそのまま通す
 * - 旧Wixサイトのページ（例: /会社概要, /en/blank）は対応ページへ 308（恒久）リダイレクト
 * - サイトの外から（直接入力・ブックマーク・検索結果など）トップ（/）に来たときだけ、
 *   選択済みの言語 cookie が日本語以外ならその言語へ 307（一時）リダイレクト
 *   → サイト内でロゴなどから / に戻る操作では、日本語トップをそのまま表示する
 *   → cookie を持たない検索エンジンは常に日本語トップを見る
 *
 * 表示言語はリクエストヘッダーに載せ、404ページが言語を判定できるようにします。
 * ブラウザ言語による案内は、自動遷移ではなく画面上の控えめなバナー
 * （LanguageBanner）で行います。
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone();

  const legacyPath = resolveLegacyWixPath(pathname);
  if (legacyPath) {
    url.pathname = legacyPath;
    return NextResponse.redirect(url, 308);
  }

  const firstSegment = pathname.split("/")[1] ?? "";

  if (firstSegment === defaultLocale) {
    url.pathname = localePath(defaultLocale, stripLocale(pathname));
    return NextResponse.redirect(url, 308);
  }

  if (isLocale(firstSegment)) {
    return NextResponse.next({
      request: { headers: withLocaleHeader(request, firstSegment) },
    });
  }

  if (
    pathname === "/" &&
    request.headers.get("sec-fetch-site") !== "same-origin"
  ) {
    const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
    if (
      cookieLocale &&
      isLocale(cookieLocale) &&
      cookieLocale !== defaultLocale
    ) {
      url.pathname = localePath(cookieLocale);
      // 一時リダイレクト：cookie の変更が即座に反映されるようにする
      return NextResponse.redirect(url, 307);
    }
  }

  url.pathname = `/${defaultLocale}${stripLocale(pathname)}`;
  return NextResponse.rewrite(url, {
    request: { headers: withLocaleHeader(request, defaultLocale) },
  });
}

function withLocaleHeader(request: NextRequest, locale: Locale): Headers {
  const headers = new Headers(request.headers);
  headers.set(LOCALE_HEADER, locale);
  return headers;
}

export const config = {
  matcher: [
    /*
     * 以下を除くすべてのパスにマッチ:
     * - /api（APIルート）
     * - /_next（Next.js の内部アセット）
     * - /images（静的画像）
     * - 拡張子付きのファイル（sitemap.xml, robots.txt, icon.png など）
     */
    "/((?!api|_next|images|.*\\..*).*)",
  ],
};
