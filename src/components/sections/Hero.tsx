import { getImageProps } from "next/image";
import { Clock, Phone } from "lucide-react";
import WaveDivider from "@/components/ui/WaveDivider";
import { phoneFor } from "@/data/site";
import type { Dictionary } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/locales";

/**
 * トップページのヒーローセクション。
 * PCとスマートフォンで別画像を使うアートディレクション構成。
 */
export default function Hero({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const phone = phoneFor(locale);
  const common = { alt: "", quality: 80, priority: true, sizes: "100vw" };

  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({
    ...common,
    width: 1600,
    height: 740,
    src: "/images/hero/hero-rafting.jpg",
  });
  const {
    props: { srcSet: mobileSrcSet, ...imgProps },
  } = getImageProps({
    ...common,
    width: 1080,
    height: 1620,
    src: "/images/hero/hero-mobile.jpg",
  });

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-navy">
      <div className="absolute inset-0 bg-gradient-to-b from-navy via-forest-dark to-forest">
        <picture>
          <source media="(min-width: 768px)" srcSet={desktopSrcSet} />
          <source media="(max-width: 767px)" srcSet={mobileSrcSet} />
          <img
            {...imgProps}
            alt={dict.home.hero.imageAlt}
            fetchPriority="high"
            className="h-full w-full object-cover object-center md:object-[center_60%]"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/30 to-navy/20" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-28 pt-32 md:px-6 md:pb-36">
        <p className="mb-6 text-xs font-bold uppercase tracking-[0.3em] text-sky">
          {dict.home.hero.eyebrow}
        </p>
        <h1 className="whitespace-pre-line font-display text-[2rem] font-bold leading-[1.5] text-white sm:text-4xl md:text-6xl md:leading-[1.35]">
          {dict.home.hero.title}
        </h1>
        <p className="mt-6 max-w-2xl whitespace-pre-line text-sm leading-loose text-white/90 md:text-lg md:leading-loose">
          {dict.home.hero.subtitle}
        </p>
        <p className="mt-4 max-w-xl text-xs leading-loose text-white/70 md:text-sm">
          {dict.home.hero.lead}
        </p>

        {/* ヒーローのCTAボタンは非表示（ヘッダーとモバイル固定CTAで導線を確保） */}

        <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/80">
          <span className="inline-flex items-center gap-1.5">
            <Clock aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-sky" />
            {dict.common.hoursTimezoneNote}
          </span>
          <a
            href={phone.link}
            className="inline-flex items-center gap-1.5 transition-colors hover:text-sky"
          >
            <Phone aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-sky" />
            TEL {phone.display}
          </a>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0">
        <WaveDivider fill="var(--color-offwhite)" />
      </div>
    </section>
  );
}
