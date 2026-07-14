import { Phone } from "lucide-react";
import Button from "@/components/ui/Button";
import WaveDivider from "@/components/ui/WaveDivider";
import { site } from "@/data/site";

type FinalCtaProps = {
  title?: string;
  lead?: string;
};

/** 最終CTAセクション（全ページ共通で利用可能） */
export default function FinalCta({
  title = "次の北海道旅行に、\n川で過ごす時間を。",
  lead = "予約・空き状況の確認・ご相談は、フォームまたはお電話でお気軽にどうぞ。",
}: FinalCtaProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-forest-dark via-forest to-water-deep">
      <WaveDivider fill="var(--color-offwhite)" flip />
      {/* 水面のゆらぎを思わせる装飾 */}
      <div
        aria-hidden="true"
        className="animate-drift absolute -right-24 -top-24 h-96 w-96 rounded-full bg-sky/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="animate-drift absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-water/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-4xl px-4 py-20 text-center md:px-6 md:py-28">
        <h2 className="whitespace-pre-line font-display text-3xl font-bold leading-relaxed text-white md:text-4xl md:leading-relaxed">
          {title}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-loose text-white/85 md:text-base">
          {lead}
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Button href="/reservation" variant="white" size="lg">
            アクティビティを予約する
          </Button>
          <Button href={site.tel.link} variant="water" size="lg" className="bg-navy/40 hover:bg-navy/60">
            <Phone aria-hidden="true" className="h-4 w-4" />
            電話で相談する
          </Button>
        </div>
        <p className="mt-6 text-xs text-white/70">
          営業時間 {site.hours.display} ／ 営業時間外はフォームからお問い合わせください
        </p>
      </div>
    </section>
  );
}
