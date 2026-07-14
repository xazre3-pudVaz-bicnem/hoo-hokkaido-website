import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, ShieldCheck } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";
import FlowSteps from "@/components/sections/FlowSteps";
import FinalCta from "@/components/sections/FinalCta";
import { pageMetadata } from "@/lib/seo";
import { experienceFlow, safetyCommitments } from "@/data/safety";
import { guide } from "@/data/guide";

export const metadata = pageMetadata({
  title: "安全への取り組み",
  description:
    "HOOの安全への取り組み。参加前の説明、天候・河川状況を踏まえた開催判断、体調面の事前相談など、北海道の川で無理のない運営を大切にしています。ガイドの経験・資格もご紹介。",
  path: "/safety",
});

export default function SafetyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Safety"
        title="安全への取り組み"
        lead={
          "自然が相手のアクティビティに「絶対」はありません。\nだからこそHOOは、状況を見極め、無理をしない運営を大切にしています。"
        }
      />
      <Breadcrumbs
        items={[
          { name: "ホーム", path: "/" },
          { name: "安全への取り組み", path: "/safety" },
        ]}
      />

      {/* 取り組み一覧 */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {safetyCommitments.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.05}>
              <div className="h-full rounded-3xl border border-forest-light bg-white p-7 shadow-card">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-forest-light">
                  <ShieldCheck aria-hidden="true" className="h-5 w-5 text-forest" />
                </span>
                <h2 className="mt-4 text-base font-bold text-navy">{item.title}</h2>
                <p className="mt-2.5 text-sm leading-loose text-ink-soft">{item.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
        <FadeIn>
          <p className="mt-8 rounded-2xl bg-water-light/60 p-5 text-sm leading-loose text-ink">
            装備の詳細や開催条件など、ここに記載のない事項については、ご予約時にご案内するか、
            <Link href="/contact" className="mx-1 font-bold text-water-deep underline underline-offset-2 hover:text-navy">
              お問い合わせ
            </Link>
            にてご確認ください。
          </p>
        </FadeIn>
      </section>

      {/* ガイドの経験と資格 */}
      <section className="bg-forest-dark py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <FadeIn>
              <div className="relative aspect-[16/11] overflow-hidden rounded-3xl">
                <Image
                  src="/images/guide/safety-guide.jpg"
                  alt="安全に配慮して川を案内するHOOのガイド"
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-sky">
                Guide Experience
              </p>
              <h2 className="mt-3 font-display text-2xl font-bold leading-relaxed text-white md:text-3xl">
                川を知るガイドが、
                <br />
                その日の川と向き合います。
              </h2>
              <p className="mt-5 text-sm leading-loose text-white/80 md:text-[15px]">
                同じ川でも、水量や天候によって表情は毎日変わります。{guide.careerYears}
                の経験を持つ代表・{guide.name}
                が、当日の状況を見極めながらプログラムを運営します。
              </p>
              <div className="mt-6 rounded-3xl bg-white/[0.08] p-6">
                <h3 className="text-sm font-bold tracking-wider text-sky">保有資格</h3>
                <ul className="mt-3 space-y-2 text-sm text-white/90">
                  {guide.qualifications.map((q) => (
                    <li key={q} className="flex items-start gap-2.5">
                      <Award aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-sky" />
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/about"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-sky transition-colors hover:text-white"
              >
                代表プロフィールを見る
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 当日の流れ */}
      <section className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
        <FadeIn>
          <SectionHeading
            eyebrow="Flow"
            title="体験当日までの流れ"
            lead="集合場所・持ち物・所要時間などの詳細は、ご予約時にご案内します。"
          />
          <div className="rounded-3xl bg-white p-7 shadow-card md:p-10">
            <FlowSteps steps={experienceFlow} />
          </div>
        </FadeIn>
      </section>

      <FinalCta
        title={"不安なことは、\n予約の前に聞いてください。"}
        lead="体調・年齢・泳ぎへの不安など、どんなことでも事前にご相談いただけます。"
      />
    </>
  );
}
