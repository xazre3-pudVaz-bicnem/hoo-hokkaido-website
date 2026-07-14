import Image from "next/image";
import Link from "next/link";

/**
 * HOOロゴ。
 * public/images/logo/hoo-logo.png（通常）と hoo-logo-white.png（暗い背景用）を使用します。
 * ロゴを差し替える場合は photos-original/ の元ファイルを更新して `npm run photos` を実行してください。
 */
export default function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link
      href="/"
      className="group flex items-center gap-3"
      aria-label="Hokkaido Outdoor Organization ホームへ"
    >
      <Image
        src={inverted ? "/images/logo/hoo-logo-white.png" : "/images/logo/hoo-logo.png"}
        alt="Hokkaido Outdoor Organization ロゴ"
        width={363}
        height={193}
        priority
        className="h-9 w-auto md:h-11"
      />
      {/* ナビゲーションと競合しないよう、xl（ナビ表示幅）では隠す */}
      <span
        className={`hidden whitespace-nowrap text-[10px] font-medium leading-tight tracking-[0.1em] sm:block xl:hidden 2xl:block ${
          inverted ? "text-white/80" : "text-ink-soft"
        }`}
      >
        Hokkaido
        <br />
        Outdoor Organization
      </span>
    </Link>
  );
}
