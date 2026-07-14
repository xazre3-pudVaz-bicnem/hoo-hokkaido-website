import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, CloudRain, HelpCircle, Shirt } from "lucide-react";
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
  title: "富良野でラフティング・川の体験を探すなら",
  description:
    "富良野でラフティングや川遊びを探している方へ。体験タイプの違いと選び方、初参加前の確認事項、服装のポイントを解説。HOOは川をゆったり下る「富良野リラックスダウンリバー」を開催しています。",
  path: "/furano-rafting",
});

const raftingFaq: Faq[] = [
  {
    question: "リラックスダウンリバーはラフティングとは違うのですか？",
    answer:
      "「ラフティング」は川をボートで下る体験の総称として使われることが多い言葉です。HOOの「リラックスダウンリバー」は、スリルを追求するのではなく、川の流れと景色をゆっくり味わうことを大切にしたダウンリバー体験です。ご希望のイメージと合うかどうか、遠慮なくお問い合わせください。",
  },
  {
    question: "泳げなくても参加できますか？",
    answer:
      "ご不安な点は事前にご相談ください。当日はガイドが装備や過ごし方についてご説明したうえでご案内します。",
  },
  {
    question: "濡れてもいい服装で行けばいいですか？",
    answer:
      "服装・持ち物は季節や当日の状況によって変わるため、ご予約時に詳しくご案内しています。事前に知りたい場合はお問い合わせください。",
  },
  {
    question: "当日の天気が悪そうな場合はどうなりますか？",
    answer:
      "天候・河川の状況をもとに、開催可否や内容をガイドが判断します。中止・変更となる場合は事前にご連絡します。",
  },
];

const comparePoints = [
  {
    title: "体験のタイプを確認する",
    body: "川下り系の体験には、流れの変化を楽しむものから、景色をゆったり味わうものまで幅があります。「どんな時間を過ごしたいか」を先に決めると選びやすくなります。",
  },
  {
    title: "開催エリアと集合場所を確認する",
    body: "同じ「富良野エリア」でも、集合場所や川は事業者によって異なります。旅程・移動手段と合わせて確認しましょう。",
  },
  {
    title: "参加条件を確認する",
    body: "年齢や人数の条件は体験ごとに異なります。子ども連れ・大人数の場合は、予約前に問い合わせて確認するのが確実です。",
  },
  {
    title: "ガイドの経験・資格を確認する",
    body: "自然が相手の体験だからこそ、案内するガイドの経験や資格、安全に対する考え方は大切な判断材料になります。",
  },
];

export default function FuranoRaftingPage() {
  const furano = getActivity("furano-relax-downriver")!;

  return (
    <>
      <JsonLd data={faqJsonLd(raftingFaq)} />
      <PageHeader
        eyebrow="Furano Rafting Guide"
        title={"富良野でラフティング・\n川の体験を探している方へ"}
        lead="「富良野 ラフティング」で検索してこのページに辿り着いた方へ。体験の選び方と、HOOが富良野で開催している川の体験を、正直にご紹介します。"
      />
      <Breadcrumbs
        items={[
          { name: "ホーム", path: "/" },
          { name: "富良野のラフティング・川体験", path: "/furano-rafting" },
        ]}
      />

      {/* 導入 */}
      <section className="mx-auto max-w-4xl px-4 pb-16 pt-6 md:px-6">
        <FadeIn>
          <h2 className="font-display text-2xl font-bold leading-relaxed text-navy md:text-3xl">
            富良野で「川を下る体験」を探すときに、知っておきたいこと
          </h2>
          <div className="mt-6 space-y-5 text-sm leading-loose text-ink-soft md:text-[15px] md:leading-[2]">
            <p>
              「ラフティング」という言葉は、ボートで川を下る体験の総称として広く使われています。ただ、その中身はさまざまです。白波の立つ流れを下ってスリルを楽しむものもあれば、穏やかな流れで景色と水辺の自然を味わうものもあります。
            </p>
            <p>
              HOOが富良野で開催しているのは、後者に近い
              <strong className="font-bold text-forest-dark">「リラックスダウンリバー」</strong>
              という体験です。激流下りではなく、川の流れに乗って富良野の自然をゆっくり楽しむプログラムなので、「川遊びは初めて」という方からご参加いただきやすい内容になっています。
            </p>
            <p>
              まずは、ご自身がどんな体験を求めているかを整理しながら読み進めてみてください。
            </p>
          </div>
        </FadeIn>
      </section>

      {/* 選び方のポイント */}
      <section className="bg-water-light/50 py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <FadeIn>
            <SectionHeading
              eyebrow="How to Compare"
              title="ラフティング・ダウンリバーを探すときのポイント"
            />
          </FadeIn>
          <div className="grid gap-5 md:grid-cols-2">
            {comparePoints.map((point, i) => (
              <FadeIn key={point.title} delay={i * 0.06}>
                <div className="h-full rounded-3xl bg-white p-7 shadow-card">
                  <h3 className="flex items-start gap-3 text-base font-bold text-navy md:text-lg">
                    <span className="font-display text-xl leading-none text-water-deep">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {point.title}
                  </h3>
                  <p className="mt-3 text-sm leading-loose text-ink-soft">{point.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* HOOの体験の特徴 */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <FadeIn>
          <SectionHeading
            eyebrow="Our Program"
            title="HOOの「富良野リラックスダウンリバー」"
            lead="富良野の川を、ガイドと一緒にゆっくり下るリバーアクティビティです。"
          />
        </FadeIn>
        <FadeIn>
          <ActivityCard activity={furano} large />
        </FadeIn>
      </section>

      {/* 初参加前の確認事項 */}
      <section className="bg-forest-light/40 py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <FadeIn>
            <SectionHeading
              eyebrow="Before You Go"
              title="初めて参加する前に確認しておくこと"
            />
          </FadeIn>
          <div className="grid gap-5 md:grid-cols-3">
            <FadeIn>
              <div className="h-full rounded-3xl bg-white p-7 shadow-card">
                <Shirt aria-hidden="true" className="h-7 w-7 text-water-deep" />
                <h3 className="mt-4 text-base font-bold text-navy">服装・持ち物</h3>
                <p className="mt-3 text-sm leading-loose text-ink-soft">
                  水に濡れる可能性のある体験のため、服装・持ち物は季節に応じた準備が必要です。HOOではご予約時に詳しくご案内していますので、案内に沿ってご準備ください。
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.07}>
              <div className="h-full rounded-3xl bg-white p-7 shadow-card">
                <CloudRain aria-hidden="true" className="h-7 w-7 text-water-deep" />
                <h3 className="mt-4 text-base font-bold text-navy">天候・河川状況</h3>
                <p className="mt-3 text-sm leading-loose text-ink-soft">
                  川の体験は、天候と河川の状況によって開催可否が変わります。HOOでは当日の状況をもとにガイドが判断し、中止・変更の場合は事前にご連絡します。
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.14}>
              <div className="h-full rounded-3xl bg-white p-7 shadow-card">
                <HelpCircle aria-hidden="true" className="h-7 w-7 text-water-deep" />
                <h3 className="mt-4 text-base font-bold text-navy">不安なことは事前相談</h3>
                <p className="mt-3 text-sm leading-loose text-ink-soft">
                  泳ぎが苦手、体力に自信がない、子どもを連れて行きたい——そんな不安や疑問は、申し込み前にご相談ください。内容に応じて正直にご案内します。
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ガイド経験 */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <FadeIn>
            <div className="relative aspect-[16/11] overflow-hidden rounded-3xl shadow-card">
              <Image
                src="/images/guide/safety-guide.jpg"
                alt="北海道の川を案内するHOOのガイド"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="font-display text-2xl font-bold leading-relaxed text-navy md:text-3xl">
              日本各地の川で経験を積んだガイドが案内します
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-loose text-ink-soft md:text-[15px]">
              <p>
                HOO代表の小瀬祥太は、四国・吉野川、群馬県・利根川、北海道・鵡川など、日本各地の河川でリバーガイドとして20年以上の経験を積んできました。
              </p>
              <p>
                北海道知事認定アウトドアガイド（ラフティング・カヌー）、Rescue3 SRT-1、上級救命の資格を保有し、川の状況を見極めながら無理のない運営を行っています。
              </p>
            </div>
            <Link
              href="/safety"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-water-deep transition-colors hover:text-navy"
            >
              安全への取り組みを詳しく見る
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-water-light/50 py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <FadeIn>
            <SectionHeading
              eyebrow="FAQ"
              title="富良野の川体験に関する質問"
            />
            <FaqAccordion faqs={raftingFaq} />
            <ul className="mt-8 space-y-2 text-sm">
              {[
                { href: "/furano-activity", label: "富良野のアクティビティ・自然体験の選び方" },
                { href: "/activities/furano-relax-downriver", label: "富良野リラックスダウンリバーの詳細" },
                { href: "/faq", label: "よくある質問一覧" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1.5 font-bold text-water-deep transition-colors hover:text-navy"
                  >
                    <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </section>

      <FinalCta title={"富良野の川で、\n最初のダウンリバー体験を。"} />
    </>
  );
}
