import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/locales";
import { localePath } from "@/i18n/routing";
import { site } from "@/data/site";

/**
 * HOOロゴ。
 *
 * - ヘッダー: ロゴマークのみ（withText なし）。ナビゲーションと干渉させないため。
 * - フッター: ロゴマーク＋団体名（withText）。横幅に余裕があるため併記する。
 *
 * 差し替えは photos-original/ロゴ.png を更新して `npm run photos` を実行してください
 * （白背景の透過処理と、暗い背景用の白抜き版が自動生成されます）。
 */
export default function Logo({
  locale,
  inverted = false,
  withText = false,
}: {
  locale: Locale;
  /** 暗い背景で使う白抜きロゴ */
  inverted?: boolean;
  /** ロゴの横に団体名を併記する */
  withText?: boolean;
}) {
  return (
    <Link
      href={localePath(locale)}
      className="flex shrink-0 items-center gap-3"
      aria-label={`${site.name} — Home`}
    >
      <Image
        src={
          inverted ? "/images/logo/hoo-logo-white.png" : "/images/logo/hoo-logo.png"
        }
        alt={`${site.name} ロゴ`}
        width={363}
        height={193}
        priority
        className="h-10 w-auto md:h-12"
      />
      {withText && (
        <span
          className={`whitespace-nowrap text-[11px] font-bold leading-tight tracking-[0.08em] ${
            inverted ? "text-white/85" : "text-ink-soft"
          }`}
        >
          Hokkaido
          <br />
          Outdoor Organization
        </span>
      )}
    </Link>
  );
}
