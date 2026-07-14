import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Heart, Mountain, Users } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import FadeIn from "@/components/ui/FadeIn";
import FaqAccordion from "@/components/ui/FaqAccordion";
import JsonLd from "@/components/ui/JsonLd";
import SectionHeading from "@/components/ui/SectionHeading";
import ActivityCard from "@/components/ui/ActivityCard";
import FinalCta from "@/components/sections/FinalCta";
import { pageMetadata } from "@/lib/seo";
import { faqJsonLd } from "@/lib/jsonld";
import { getActivity } from "@/data/activities";
import type { Faq } from "@/data/faq";

export const metadata = pageMetadata({
  title: "富良野のアクティビティ・自然体験",
  description:
    "富良野旅行でアクティビティを探している方へ。川をゆったり下るリバー体験など、富良野で北海道の自然を楽しむ方法を、地元ガイドの視点でご紹介します。家族・友人・カップル別の選び方も。",
  path: "/furano-activity",
});

const furanoFaq: Faq[] = [
  {
    question: "富良野のアクティビティは予約が必要ですか？",
    answer:
      "HOOのアクティビティはすべて事前予約制です。ご希望日が決まりましたら、フォームまたはお電話でお早めにご連絡ください。",
  },
  {
    question: "富良野観光のスケジュールにどう組み込めばいいですか？",
    answer:
      "所要時間や集合場所はご予約時にご案内していますので、旅程が決まっている場合は、その内容を添えてご相談ください。ご旅程に合わせた回のご提案も可能です。",
  },
  {
    question: "夏以外でも体験できますか？",
    answer:
      "開催期間は河川の状況などにより変わります。ご希望の時期が決まりましたら、お問い合わせフォームまたはお電話でご確認ください。",
  },
  {
    question: "子ども連れでも参加できるアクティビティはありますか？",
    answer:
      "対象年齢は当日の河川状況などにより異なります。お子さまの年齢を添えて事前にお問い合わせいただければ、参加可否をご案内します。",
  },
];

const styleGuide = [
  {
    icon: Users,
    title: "家族で楽しむなら",
    body: "ゆったり川を下るリラックスダウンリバーは、スピードを競う体験ではないため、家族での参加相談が多いプログラムです。お子さまの年齢によって参加可否が変わるため、事前にご相談ください。",
    href: "/activities/furano-relax-downriver",
    linkLabel: "富良野リラックスダウンリバー",
  },
  {
    icon: Heart,
    title: "友人・カップルで楽しむなら",
    body: "川面から眺める富良野の景色は、写真だけでは伝わらない思い出になります。2名から参加できるので、ふたり旅にも組み込みやすいのが特徴です。",
    href: "/activities/furano-relax-downriver",
    linkLabel: "富良野リラックスダウンリバー",
  },
  {
    icon: Mountain,
    title: "グループ・団体で楽しむなら",
    body: "研修やイベントなど、目的に合わせて内容を組み立てるオーガナイズプログラムをご用意しています。人数や目的をお知らせいただければ、内容をご提案します。",
    href: "/activities/organize-program",
    linkLabel: "オーガナイズプログラム",
  },
];

const checkPoints = [
  "開催の可否は天候・河川状況によって判断されます。旅行日程が近づいたら連絡が取れるようにしておくと安心です",
  "服装・持ち物は季節によって変わります。予約時の案内を確認しましょう",
  "集合場所は体験によって異なります。移動手段とあわせて事前に確認しましょう",
  "体調に不安がある場合は、申し込み前に相談しておきましょう",
];

export default function FuranoActivityPage() {
  const furano = getActivity("furano-relax-downriver")!;
  const biei = getActivity("biei-relax-downriver")!;
  const asahikawa = getActivity("asahikawa-relax-downriver")!;

  return (
    <>
      <JsonLd data={faqJsonLd(furanoFaq)} />
      <PageHeader
        eyebrow="Furano Activity"
        title={"富良野のアクティビティ・\n自然体験を探している方へ"}
        lead="ラベンダーや美しい丘だけじゃない。富良野には、川の上から自然を全身で感じる体験があります。富良野を拠点に活動するHOOが、自然体験の選び方をご案内します。"
      />
      <Breadcrumbs
        items={[
          { name: "ホーム", path: "/" },
          { name: "富良野のアクティビティ", path: "/furano-activity" },
        ]}
      />

      {/* 富良野で楽しめる自然体験 */}
      <section className="mx-auto max-w-4xl px-4 pb-16 pt-6 md:px-6">
        <FadeIn>
          <h2 className="font-display text-2xl font-bold leading-relaxed text-navy md:text-3xl">
            富良野で楽しめる自然体験
          </h2>
          <div className="mt-6 space-y-5 text-sm leading-loose text-ink-soft md:text-[15px] md:leading-[2]">
            <p>
              富良野といえばラベンダー畑やスキーのイメージが強いかもしれません。しかし、富良野の魅力はそれだけではありません。市街地から少し足を延ばせば、川と森が織りなす北海道らしい景色が広がっています。
            </p>
            <p>
              なかでも、川をボートでゆったり下る「ダウンリバー」は、歩く観光では出会えない富良野に触れられるアクティビティです。水の音、森の香り、川面を渡る風。移動しながら景色が変わっていく感覚は、川の上でしか味わえません。
            </p>
            <p>
              HOOでは、富良野を拠点に、美瑛・旭川エリアを含めたリバーアクティビティを開催しています。
            </p>
          </div>
        </FadeIn>
      </section>

      {/* スタイル別の選び方 */}
      <section className="bg-water-light/50 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <FadeIn>
            <SectionHeading
              eyebrow="How to Choose"
              title="一緒に行く人で選ぶ、富良野のアクティビティ"
            />
          </FadeIn>
          <div className="grid gap-5 md:grid-cols-3">
            {styleGuide.map((style, i) => (
              <FadeIn key={style.title} delay={i * 0.07}>
                <div className="flex h-full flex-col rounded-3xl bg-white p-7 shadow-card">
                  <style.icon aria-hidden="true" className="h-7 w-7 text-water-deep" />
                  <h3 className="mt-4 text-lg font-bold text-navy">{style.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-loose text-ink-soft">
                    {style.body}
                  </p>
                  <Link
                    href={style.href}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-water-deep transition-colors hover:text-navy"
                  >
                    {style.linkLabel}
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 川のアクティビティの魅力 */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <FadeIn>
            <div className="relative aspect-[16/11] overflow-hidden rounded-3xl shadow-card">
              <Image
                src="/images/common/river-landscape.jpg"
                alt="富良野で楽しむ川のアクティビティの風景"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="font-display text-2xl font-bold leading-relaxed text-navy md:text-3xl">
              なぜ今、川のアクティビティなのか
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-loose text-ink-soft md:text-[15px]">
              <p>
                車窓や展望台から見る風景が「眺める自然」だとすれば、川のアクティビティは「入っていく自然」です。流れに身をまかせ、ガイドと一緒に川を下る時間は、富良野の自然を五感で記憶に刻んでくれます。
              </p>
              <p>
                HOOのダウンリバーは、激しさを求めるものではなく、川と景色をゆっくり味わうことを大切にしたプログラム。アウトドアに慣れていない方が「初めての川遊び」として選ぶケースも少なくありません。
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 予約前に確認したいこと */}
      <section className="bg-forest-light/40 py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <FadeIn>
            <SectionHeading
              eyebrow="Check Points"
              title="予約前に確認しておきたいこと"
            />
            <ul className="space-y-3">
              {checkPoints.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 rounded-2xl bg-white px-5 py-4 text-sm leading-relaxed text-ink shadow-card"
                >
                  <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                  {point}
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </section>

      {/* 富良野リラックスダウンリバー紹介 */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <FadeIn>
          <SectionHeading
            eyebrow="Recommended"
            title="富良野で体験するなら、まずはこのプログラム"
            lead="HOOの主力プログラム「富良野リラックスダウンリバー」を中心に、美瑛・旭川エリアでも開催しています。"
          />
        </FadeIn>
        <FadeIn>
          <ActivityCard activity={furano} large />
        </FadeIn>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <FadeIn>
            <ActivityCard activity={biei} />
          </FadeIn>
          <FadeIn delay={0.08}>
            <ActivityCard activity={asahikawa} />
          </FadeIn>
        </div>
      </section>

      {/* ガイドと安全 */}
      <section className="bg-navy py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <FadeIn>
            <SectionHeading
              eyebrow="Guide & Safety"
              tone="light"
              title="HOOのガイドと、安全への考え方"
            />
            <p className="mx-auto max-w-2xl text-sm leading-loose text-white/85 md:text-[15px]">
              HOOの代表・小瀬祥太は、アウトドアガイド歴20年以上。北海道知事認定アウトドアガイド（ラフティング・カヌー）、Rescue3
              SRT-1、上級救命などの資格を持ち、日本各地の川でガイド経験を積んできました。当日の天候・河川状況を踏まえて開催を判断し、無理のない運営を大切にしています。
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/about"
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white/10 px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-white/20"
              >
                ガイド紹介を見る
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <Link
                href="/safety"
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white/10 px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-white/20"
              >
                安全への取り組み
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-20">
        <FadeIn>
          <SectionHeading eyebrow="FAQ" title="富良野のアクティビティに関する質問" />
          <FaqAccordion faqs={furanoFaq} />
        </FadeIn>
      </section>

      <FinalCta
        title={"富良野の自然を、\n川の上から体験しませんか。"}
      />
    </>
  );
}
