type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  tone?: "default" | "light";
  as?: "h1" | "h2";
};

/** セクション見出し（英字ラベル＋日本語見出し＋リード文） */
export default function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "center",
  tone = "default",
  as: Tag = "h2",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center" : "text-left";
  const titleColor = tone === "light" ? "text-white" : "text-navy";
  const leadColor = tone === "light" ? "text-white/85" : "text-ink-soft";
  const eyebrowColor = tone === "light" ? "text-sky" : "text-water-deep";

  return (
    <div className={`${alignClass} mb-10 md:mb-14`}>
      {eyebrow && (
        <p
          className={`mb-3 text-xs font-bold uppercase tracking-[0.25em] ${eyebrowColor}`}
        >
          {eyebrow}
        </p>
      )}
      <Tag
        className={`font-display text-2xl font-semibold leading-relaxed md:text-4xl md:leading-relaxed ${titleColor} whitespace-pre-line`}
      >
        {title}
      </Tag>
      {lead && (
        <p
          className={`mx-auto mt-5 max-w-2xl text-sm leading-loose md:text-base ${leadColor} ${
            align === "left" ? "mx-0" : ""
          } whitespace-pre-line`}
        >
          {lead}
        </p>
      )}
    </div>
  );
}
