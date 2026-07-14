import WaveDivider from "@/components/ui/WaveDivider";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  lead?: string;
};

/** 下層ページ共通のページヘッダー */
export default function PageHeader({ eyebrow, title, lead }: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-navy via-forest-dark to-forest pt-16 md:pt-20">
      <div
        aria-hidden="true"
        className="animate-drift absolute -right-32 top-0 h-80 w-80 rounded-full bg-water/15 blur-3xl"
      />
      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-12 md:px-6 md:pb-20 md:pt-16">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-sky">
          {eyebrow}
        </p>
        <h1 className="mt-4 whitespace-pre-line font-display text-3xl font-bold leading-relaxed text-white md:text-5xl md:leading-snug">
          {title}
        </h1>
        {lead && (
          <p className="mt-5 max-w-2xl whitespace-pre-line text-sm leading-loose text-white/85 md:text-base">
            {lead}
          </p>
        )}
      </div>
      <WaveDivider fill="var(--color-offwhite)" />
    </div>
  );
}
