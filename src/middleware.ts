import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE, defaultLocale, isLocale } from "@/i18n/locales";

/** not-found.tsx から表示言語を判定するためのヘッダー名 */
export const LOCALE_HEADER = "x-hoo-locale";

/**
 * 言語別URLへのルーティング。
 *
 * - すでに /ja /en /zh-tw /zh-cn /ko で始まるパスはそのまま通す
 *   （このとき表示言語をリクエストヘッダーに載せ、404ページが言語を判定できるようにする）
 * - 旧URL（例: /activities）は /ja/activities へ 308（恒久）リダイレクト
 *   → 既存の日本語ページの検索評価を引き継ぐため、言語判定は行わない
 * - ルート（/）だけは、ユーザーが選択済みの言語 cookie があればその言語へ、
 *   なければ日本語へ 307（一時）リダイレクト
 *   → 検索エンジンをブラウザ言語で強制リダイレクトしない
 *
 * ブラウザ言語による案内は、自動遷移ではなく画面上の控えめなバナー
 * （LanguageBanner）で行います。
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const firstSegment = pathname.split("/")[1] ?? "";
  if (isLocale(firstSegment)) {
    const headers = new Headers(request.headers);
    headers.set(LOCALE_HEADER, firstSegment);
    return NextResponse.next({ request: { headers } });
  }

  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const selected =
    cookieLocale && isLocale(cookieLocale) ? cookieLocale : defaultLocale;

  const url = request.nextUrl.clone();

  if (pathname === "/") {
    url.pathname = `/${selected}`;
    // 一時リダイレクト：cookie の変更が即座に反映されるようにする
    return NextResponse.redirect(url, 307);
  }

  // 旧URL → 日本語URL（恒久リダイレクト）
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(url, 308);
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
