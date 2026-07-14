import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import FadeIn from "@/components/ui/FadeIn";
import FaqAccordion from "@/components/ui/FaqAccordion";
import JsonLd from "@/components/ui/JsonLd";
import FinalCta from "@/components/sections/FinalCta";
import { pageMetadata } from "@/lib/seo";
import { faqJsonLd } from "@/lib/jsonld";
import { generalFaq } from "@/data/faq";
import { site } from "@/data/site";

export const metadata = pageMetadata({
  title: "よくある質問",
  description:
    "HOOのアクティビティに関するよくある質問。初めての参加、申込人数、服装・持ち物、雨天時の対応、子どもの参加、集合場所、予約・キャンセルについてお答えします。",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqJsonLd([...generalFaq])} />
      <PageHeader
        eyebrow="FAQ"
        title="よくある質問"
        lead="アクティビティへの参加前に多くいただく質問をまとめました。ここにない質問は、お気軽にお問い合わせください。"
      />
      <Breadcrumbs
        items={[
          { name: "ホーム", path: "/" },
          { name: "よくある質問", path: "/faq" },
        ]}
      />

      <section className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
        <FadeIn>
          <FaqAccordion faqs={[...generalFaq]} />
        </FadeIn>

        <FadeIn>
          <div className="mt-12 rounded-3xl bg-forest-light/50 p-7 text-center md:p-9">
            <h2 className="font-display text-xl font-bold text-navy">
              解決しない質問がありますか？
            </h2>
            <p className="mt-3 text-sm leading-loose text-ink-soft">
              営業時間（{site.hours.display}）内はお電話でも受け付けています。
              <br />
              営業時間外は、フォームからいつでもお問い合わせください。
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-water-deep px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-navy"
              >
                お問い合わせフォーム
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <a
                href={site.tel.link}
                className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-forest px-7 py-3 text-sm font-bold text-forest-dark transition-colors hover:bg-forest hover:text-white"
              >
                {site.tel.display}
              </a>
            </div>
          </div>
        </FadeIn>
      </section>

      <FinalCta />
    </>
  );
}
