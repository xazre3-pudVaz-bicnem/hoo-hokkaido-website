import { notFound } from "next/navigation";

/**
 * 言語配下の未定義パスをすべて受け止め、404 を返すキャッチオール。
 *
 * これがないと、Next.js は [locale] レイアウトの外側でグローバルな404を描画してしまい、
 * ヘッダー・フッター・<html lang> のない素の404ページになってしまいます。
 * ここで notFound() を呼ぶことで、[locale]/not-found.tsx が
 * レイアウト付き・HTTPステータス404で表示されます。
 */
export const dynamicParams = true;

export default function CatchAllNotFound(): never {
  notFound();
}
