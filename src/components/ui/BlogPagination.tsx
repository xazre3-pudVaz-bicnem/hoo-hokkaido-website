import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Locale } from "@/i18n/locales";
import { localePath } from "@/i18n/routing";

/**
 * ブログ一覧のページ送り。
 * 1ページ目は /blog、2ページ目以降は /blog/page/[n] を指します
 * （検索エンジンが各ページを個別にたどれるよう、実リンクで出力します）。
 */
export default function BlogPagination({
  locale,
  current,
  total,
  strings,
}: {
  locale: Locale;
  current: number;
  total: number;
  strings: { prev: string; next: string; label: string; pageOf: string };
}) {
  if (total <= 1) return null;

  const hrefFor = (page: number) =>
    localePath(locale, page === 1 ? "/blog" : `/blog/page/${page}`);

  // 現在ページの前後2つ＋先頭・末尾を表示する
  const pages: number[] = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || Math.abs(i - current) <= 1) pages.push(i);
  }

  return (
    <nav aria-label={strings.label} className="mt-12 flex flex-col items-center gap-4">
      <ul className="flex flex-wrap items-center justify-center gap-2">
        <li>
          {current > 1 ? (
            <Link
              href={hrefFor(current - 1)}
              rel="prev"
              className="inline-flex min-h-11 items-center gap-1 rounded-full border border-forest-light bg-white px-4 text-sm font-bold text-water-deep transition-colors hover:border-water hover:text-navy"
            >
              <ChevronLeft aria-hidden="true" className="h-4 w-4 shrink-0" />
              {strings.prev}
            </Link>
          ) : (
            <span className="inline-flex min-h-11 items-center gap-1 rounded-full border border-forest-light/60 px-4 text-sm font-bold text-ink-soft/50">
              <ChevronLeft aria-hidden="true" className="h-4 w-4 shrink-0" />
              {strings.prev}
            </span>
          )}
        </li>

        {pages.map((page, i) => {
          const gap = i > 0 && page - pages[i - 1] > 1;
          return (
            <li key={page} className="flex items-center gap-2">
              {gap && <span className="px-1 text-sm text-ink-soft">…</span>}
              {page === current ? (
                <span
                  aria-current="page"
                  className="inline-flex h-11 min-w-11 items-center justify-center rounded-full bg-water-deep px-3 text-sm font-bold text-white"
                >
                  {page}
                </span>
              ) : (
                <Link
                  href={hrefFor(page)}
                  className="inline-flex h-11 min-w-11 items-center justify-center rounded-full border border-forest-light bg-white px-3 text-sm font-bold text-navy transition-colors hover:border-water hover:text-water-deep"
                >
                  {page}
                </Link>
              )}
            </li>
          );
        })}

        <li>
          {current < total ? (
            <Link
              href={hrefFor(current + 1)}
              rel="next"
              className="inline-flex min-h-11 items-center gap-1 rounded-full border border-forest-light bg-white px-4 text-sm font-bold text-water-deep transition-colors hover:border-water hover:text-navy"
            >
              {strings.next}
              <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0" />
            </Link>
          ) : (
            <span className="inline-flex min-h-11 items-center gap-1 rounded-full border border-forest-light/60 px-4 text-sm font-bold text-ink-soft/50">
              {strings.next}
              <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0" />
            </span>
          )}
        </li>
      </ul>
      <p className="text-xs text-ink-soft">
        {strings.pageOf.replace("{current}", String(current)).replace("{total}", String(total))}
      </p>
    </nav>
  );
}
