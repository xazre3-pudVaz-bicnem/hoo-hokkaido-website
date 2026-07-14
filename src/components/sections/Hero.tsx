import { getImageProps } from "next/image";
import { Clock, Phone } from "lucide-react";
import Button from "@/components/ui/Button";
import WaveDivider from "@/components/ui/WaveDivider";
import { site } from "@/data/site";

/**
 * トップページのヒーローセクション。
 * PCとスマートフォンで別画像を使うアートディレクション構成。
 * 画像パス: public/images/hero/hero-rafting.jpg（PC）/ hero-mobile.jpg（SP）
 */
export default function Hero() {
  const common = {
    alt: "",
    quality: 80,
    priority: true,
    sizes: "100vw",
  };
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({
    ...common,
    width: 2000,
    height: 1200,
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
      {/* 背景画像（グラデーションのフォールバック付き） */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy via-forest-dark to-forest">
        <picture>
          <source media="(min-width: 768px)" srcSet={desktopSrcSet} />
          <source media="(max-width: 767px)" srcSet={mobileSrcSet} />
          <img
            {...imgProps}
            alt="富良野の川を下るリラックスダウンリバーの風景"
            fetchPriority="high"
            className="h-full w-full object-cover object-center md:object-[center_60%]"
          />
        </picture>
        {/* 文字の視認性を確保するオーバーレイ */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/30 to-navy/20" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-28 pt-32 md:px-6 md:pb-36">
        <p className="mb-6 text-xs font-bold uppercase tracking-[0.3em] text-sky">
          Hokkaido Outdoor Organization
        </p>
        <h1 className="font-display text-[2rem] font-bold leading-[1.5] text-white sm:text-4xl md:text-6xl md:leading-[1.4]">
          北海道の川と、
          <br />
          忘れられない時間へ。
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-loose text-white/90 md:text-lg md:leading-loose">
          富良野・美瑛・旭川で楽しむ、
          <br className="md:hidden" />
          自然とつながるリバーアクティビティ。
        </p>
        <p className="mt-4 max-w-xl text-xs leading-loose text-white/70 md:text-sm">
          Hokkaido Outdoor Organizationは、北海道の自然と人を結び、
          心揺さぶる体験を届けます。
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Button href="/activities" variant="water" size="lg">
            アクティビティを探す
          </Button>
          <Button href="/reservation" variant="white" size="lg">
            予約する
          </Button>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/80">
          <span className="inline-flex items-center gap-1.5">
            <Clock aria-hidden="true" className="h-3.5 w-3.5 text-sky" />
            営業時間 {site.hours.display}
          </span>
          <a
            href={site.tel.link}
            className="inline-flex items-center gap-1.5 transition-colors hover:text-sky"
          >
            <Phone aria-hidden="true" className="h-3.5 w-3.5 text-sky" />
            TEL {site.tel.display}
          </a>
        </div>
      </div>

      {/* 川の流れをイメージした波形 */}
      <div className="absolute inset-x-0 bottom-0">
        <WaveDivider fill="var(--color-offwhite)" />
      </div>
    </section>
  );
}
