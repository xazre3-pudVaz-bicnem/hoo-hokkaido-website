import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/data/site";

export const metadata = pageMetadata({
  title: "利用案内・注意事項",
  description:
    "HOOのアクティビティをご利用いただく際のご案内と注意事項。予約の流れ、開催判断、キャンセル、当日の参加にあたってのお願いをまとめています。",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Information"
        title="利用案内・注意事項"
        lead="アクティビティを安心して楽しんでいただくためのご案内です。ご予約前にご一読ください。"
      />
      <Breadcrumbs
        items={[
          { name: "ホーム", path: "/" },
          { name: "利用案内", path: "/terms" },
        ]}
      />

      <section className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-7 shadow-card md:p-9">
            <h2 className="text-lg font-bold text-navy">ご予約について</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-loose text-ink-soft">
              <li>すべてのアクティビティは事前予約制です。</li>
              <li>各アクティビティは2名からお申し込みいただけます。それ以外の人数はご相談ください。</li>
              <li>
                フォーム送信時点では予約確定ではありません。内容確認後、担当者からの連絡をもって予約確定となります。
              </li>
              <li>集合場所・持ち物・当日の流れは、ご予約時にご案内します。</li>
            </ul>
          </div>

          <div className="rounded-3xl bg-white p-7 shadow-card md:p-9">
            <h2 className="text-lg font-bold text-navy">開催の判断について</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-loose text-ink-soft">
              <li>
                天候・河川の状況により、開催の中止または内容の変更をガイドが判断する場合があります。
              </li>
              <li>中止・変更となる場合は、事前にご連絡します。</li>
            </ul>
          </div>

          <div className="rounded-3xl bg-white p-7 shadow-card md:p-9">
            <h2 className="text-lg font-bold text-navy">キャンセルについて</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-loose text-ink-soft">
              <li>キャンセルの条件・キャンセル料は、ご予約時にご案内します。</li>
              <li>ご予約後に予定が変わった場合は、できるだけ早めにご連絡ください。</li>
            </ul>
          </div>

          <div className="rounded-3xl bg-white p-7 shadow-card md:p-9">
            <h2 className="text-lg font-bold text-navy">ご参加にあたってのお願い</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-loose text-ink-soft">
              <li>当日は、安全のためガイドの案内・指示に従ってご参加ください。</li>
              <li>
                体調がすぐれない場合や、持病など健康面に不安がある場合は、お申し込み前にご相談ください。
              </li>
              <li>
                飲酒されている方のご参加はお断りする場合があります。
              </li>
              <li>
                対象年齢・参加条件はアクティビティや当日の状況により異なります。事前にお問い合わせください。
              </li>
            </ul>
          </div>

          <div className="rounded-3xl bg-forest-light/50 p-7 md:p-9">
            <h2 className="text-lg font-bold text-navy">お問い合わせ</h2>
            <p className="mt-3 text-sm leading-loose text-ink-soft">
              本案内に記載のない事項については、
              <Link
                href="/contact"
                className="mx-1 font-bold text-water-deep underline underline-offset-2 hover:text-navy"
              >
                お問い合わせフォーム
              </Link>
              またはお電話（
              <a href={site.tel.link} className="font-bold text-water-deep hover:text-navy">
                {site.tel.display}
              </a>
              ・{site.hours.display}）にてご確認ください。
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
