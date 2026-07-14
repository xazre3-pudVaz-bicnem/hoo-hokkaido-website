import { Phone } from "lucide-react";
import Button from "@/components/ui/Button";
import WaveDivider from "@/components/ui/WaveDivider";
import { phoneFor } from "@/data/site";
import type { Dictionary } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/locales";
import { localePath } from "@/i18n/routing";

/** 最終CTAセクション（全ページ共通） */
export default function FinalCta({
  locale,
  dict,
  title,
  lead,
}: {
  locale: Locale;
  dict: Dictionary;
  title?: string;
  lead?: string;
}) {
  const phone = phoneFor(locale);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-forest-dark via-forest to-water-deep">
      <WaveDivider fill="var(--color-offwhite)" flip />
      <div
        aria-hidden="true"
        className="animate-drift absolute -right-24 -top-24 h-96 w-96 rounded-full bg-sky/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="animate-drift absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-water/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-4xl px-4 py-20 text-center md:px-6 md:py-28">
        <h2 className="whitespace-pre-line font-display text-2xl font-bold leading-relaxed text-white sm:text-3xl md:text-4xl md:leading-relaxed">
          {title ?? dict.finalCta.title}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-loose text-white/85 md:text-base">
          {lead ?? dict.finalCta.lead}
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Button href={localePath(locale, "/reservation")} variant="white" size="lg">
            {dict.finalCta.primary}
          </Button>
          <Button
            href={phone.link}
            variant="water"
            size="lg"
            className="bg-navy/40 hover:bg-navy/60"
          >
            <Phone aria-hidden="true" className="h-4 w-4 shrink-0" />
            {dict.finalCta.secondary}
          </Button>
        </div>
        <p className="mt-6 text-xs leading-relaxed text-white/70">
          {dict.finalCta.note}
        </p>
      </div>
    </section>
  );
}
