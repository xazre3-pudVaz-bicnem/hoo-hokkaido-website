import Link from "next/link";

/**
 * 文中の「{link}」の位置にリンクを差し込む。
 * 言語によって語順が違うため、文の前後にリンクを足すのではなく、翻訳文の中に位置を書く。
 * （日本語で「、 リンク」のような不自然な空白も入らない）
 */
export default function TextWithLink({
  text,
  href,
  label,
  className = "font-bold text-water-deep underline underline-offset-2 hover:text-navy",
}: {
  text: string;
  href: string;
  label: string;
  className?: string;
}) {
  const [before, after = ""] = text.split("{link}");
  return (
    <>
      {before}
      <Link href={href} className={className}>
        {label}
      </Link>
      {after}
    </>
  );
}
