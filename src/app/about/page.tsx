import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";
import FinalCta from "@/components/sections/FinalCta";
import { pageMetadata } from "@/lib/seo";
import { guide } from "@/data/guide";
import { site } from "@/data/site";

export const metadata = pageMetadata({
  title: "HOOについて｜MISSION・VISION・代表紹介",
  description:
    "Hokkaido Outdoor Organization（HOO）は、北海道の自然と人を結び、心揺さぶる感動を届けるアウトドア団体です。MISSION・VISION、代表・小瀬祥太の経歴と保有資格をご紹介します。",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About HOO"
        title="HOOについて"
        lead="Hokkaido Outdoor Organization（HOO）は、富良野を拠点に、北海道の自然体験を届けるアウトドア団体です。"
      />
      <Breadcrumbs
        items={[
          { name: "ホーム", path: "/" },
          { name: "HOOについて", path: "/about" },
        ]}
      />

      {/* MISSION */}
      <section className="mx-auto max-w-4xl px-4 py-14 text-center md:px-6 md:py-20">
        <FadeIn>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-water-deep">
            Mission
          </p>
          <h2 className="mt-5 font-display text-2xl font-bold leading-relaxed text-navy md:text-4xl md:leading-relaxed">
            北海道の自然と人を結び、
            <br />
            心揺さぶる感動を届ける。
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-sm leading-loose text-ink-soft md:text-base md:leading-[2.2]">
            私たちは、ただの観光ではない、
            <br className="hidden md:block" />
            「自然とつながる体験」を創り出します。
          </p>
        </FadeIn>
      </section>

      {/* VISION */}
      <section className="relative overflow-hidden bg-forest-dark py-16 md:py-24">
        <div
          aria-hidden="true"
          className="animate-drift absolute -right-24 top-1/4 h-96 w-96 rounded-full bg-water/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-4xl px-4 text-center md:px-6">
          <FadeIn>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-sky">
              Vision
            </p>
            <h2 className="mt-5 font-display text-2xl font-bold leading-relaxed text-white md:text-3xl md:leading-relaxed">
              自然の中に、&ldquo;自分&rdquo;を見つける体験を。
            </h2>
            <div className="mx-auto mt-8 max-w-2xl space-y-6 text-sm leading-loose text-white/85 md:text-base md:leading-[2.2]">
              <p>
                私たちが目指すのは、
                <br className="hidden md:block" />
                北海道の自然と人を結びつけること。
              </p>
              <p>
                ただ風景を見るのではなく、
                <br className="hidden md:block" />
                大地の息吹を感じ、流れる水にふれ、
                <br className="hidden md:block" />
                自然の中に&ldquo;自分&rdquo;を見つける体験を届けたい。
              </p>
              <p>その瞬間、きっと心が揺さぶられる感動が生まれる。</p>
              <p>
                私たちは、その出会いをつくる案内人であり、
                <br className="hidden md:block" />
                感動と自然をつなぐ橋渡しでありたいと願っています。
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 代表紹介 */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <FadeIn>
          <SectionHeading eyebrow="Representative" title="代表・ガイド紹介" />
        </FadeIn>
        <div className="grid items-start gap-10 md:grid-cols-[2fr_3fr] md:gap-14">
          <FadeIn>
            <div className="relative mx-auto aspect-[9/11] w-full max-w-sm overflow-hidden rounded-3xl shadow-card">
              <Image
                src={guide.image.src}
                alt={guide.image.alt}
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h3 className="font-display text-2xl font-semibold text-navy md:text-3xl">
              {guide.name}
              <span className="ml-3 text-sm font-medium tracking-widest text-ink-soft">
                {guide.nameRoman}
              </span>
            </h3>
            <p className="mt-1.5 text-sm font-bold text-forest">{guide.role}</p>
            <div className="mt-5 space-y-4 text-sm leading-loose text-ink-soft md:text-[15px] md:leading-[2]">
              {guide.profile.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-7 rounded-3xl bg-forest-light/60 p-6 md:p-7">
              <h4 className="text-sm font-bold tracking-wider text-forest-dark">保有資格</h4>
              <ul className="mt-3 space-y-2 text-sm text-ink">
                {guide.qualifications.map((q) => (
                  <li key={q} className="flex items-start gap-2.5">
                    <Award aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-forest" />
                    {q}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 rounded-3xl border border-forest-light bg-white p-6 md:p-7">
              <h4 className="text-sm font-bold tracking-wider text-forest-dark">
                ガイドとして歩んできた川
              </h4>
              <p className="mt-3 text-sm leading-loose text-ink-soft">
                {guide.rivers.join("、")}をはじめ、日本各地の河川でリバーガイドとして経験を重ねてきました。
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 団体概要 */}
      <section className="bg-water-light/50 py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <FadeIn>
            <SectionHeading eyebrow="Company" title="団体概要" />
            <dl className="overflow-hidden rounded-3xl bg-white shadow-card">
              {[
                { label: "名称", value: site.name },
                { label: "略称", value: site.shortName },
                { label: "代表", value: `${guide.name}（${guide.nameRoman}）` },
                { label: "所在地", value: site.address.full },
                { label: "営業時間", value: site.hours.display },
                { label: "電話番号", value: site.tel.display },
                { label: "メール", value: site.email },
              ].map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[100px_1fr] gap-4 border-b border-forest-light/60 px-6 py-4 text-sm last:border-b-0 md:grid-cols-[160px_1fr] md:px-8"
                >
                  <dt className="font-bold text-ink-soft">{row.label}</dt>
                  <dd className="text-ink">{row.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 text-center">
              <Link
                href="/projects"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-water-deep transition-colors hover:text-navy"
              >
                HOOのプロジェクト（河川管理・地域活性化）を見る
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
