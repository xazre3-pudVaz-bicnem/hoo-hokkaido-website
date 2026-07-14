"use client";

import { useEffect } from "react";

/**
 * <html lang="..."> を設定する。
 *
 * 404ページでは Next.js が独自の <html id="__next_error__"> を使うため、
 * レイアウトで指定した lang 属性が失われます。
 * スクリーンリーダーが正しい言語で読み上げられるよう、ここで補います。
 * （通常のページではレイアウト側の lang がそのまま使われます）
 */
export default function SetHtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    if (document.documentElement.lang !== lang) {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  return null;
}
